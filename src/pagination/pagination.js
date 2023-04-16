
/**
 * 一款纯Javascript实现的前端分页插件
 * 
 * @package  funsent
 * @link     http://www.funsent.com/
 * @license  https://opensource.org/licenses/MIT/
 * @author   yanggf <2018708@qq.com>
 * @version  v0.1.1
 */

; (function (global, factory) {
    "use strict";
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ? factory(global) : function (w) {
            if (!w.document) {
                throw new Error('pagination requires a window with a document');
            }
            return factory(w);
        };
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function (window) {

    // 默认参数
    let defaults = {
        page: 1, // 当前页码
        pagesize: 10, // 每页显示记录数
        total: 0, // 总记录数
        goto: true, // 是否显示跳转框
        info: true, // 是否显示总页数总记录数
        disabled: true, // 相关分页链接是否标记禁用状态
        hide_single_page: false, // 总页数只有1页时是否隐藏分页条
        btns: 8, // 按钮数量

        first_btn_text: '', // 第一页按钮文字
        prev_btn_text: '', // 上一页按钮文字
        next_btn_text: '', // 下一页按钮文字
        last_btn_text: '', // 最后页按钮文字

        change: function (page) { }, // 点击切换事件，其中的this指向当前的instance
    };

    // 语言包
    let langs = {
        'invalid element name': '无效的参数：{0}',
        'create on hidden element is invalid': '隐藏元素上创建 {0} 是无意义的',
        'total pages and records': '共 {0} 页 {1} 条数据',
        'goto prefix message': '转至第',
        'goto suffix message': '页'
    };

    // 返回类型
    const getType = function (v) {
        return Object.prototype.toString.call(v).toLowerCase();
    };

    // 合并多个数组参数，并递归转化成一维数组
    const _flat = function () {
        let arr = [], length = arguments.length;
        for (let i = 0; i < length; i++) {
            let arg = arguments[i], type = getType(arg);
            if (type === '[object string]') {
                arr.push(arg);
            } else if (type === '[object array]') {
                arg.forEach(function(v){
                    arr = arr.concat(_flat(v));
                });
            }
        }
        return arr;
    };

    // 内部方法
    let _this = {

        // 创建实例
        create: function (element, opts) {
            let target, msg = this.lang('invalid element name', 'element');
            if (this.isString(element)) {
                target = document.querySelector(element);
                if (!this.isLikeHTMLElement(target)) {
                    this.consoleError(msg);
                    return false;
                }
            } else if (this.isLikeHTMLElement(element)) {
                target = element;
            } else {
                this.consoleError(msg);
                return false;
            }

            if (target.style.display === 'none') {
                this.consoleError(this.lang('create on hidden element is invalid', 'pagination'));
                return false;
            }

            if (!this.isJsonObject(opts)) {
                opts = {};
            }

            let tag = opts['tag'];
            if (!this.isString(tag)) {
                opts['tag'] = tag = '';
            }

            let configs = Object.assign({}, defaults, opts);

            // 修正页码相关参数
            configs.page = Math.abs(~~configs.page);
            configs.pagesize = Math.abs(~~configs.pagesize);
            configs.total = Math.abs(~~configs.total);
            if (configs.pagesize == 0) {
                configs.pagesize = defaults.pagesize;
            }
            let pages = Math.ceil(configs.total / configs.pagesize);
            if (configs.page > pages) {
                configs.page = pages;
            }
            if (configs.page <= 0) {
                configs.page = 1;
            }

            // 实例
            let instance = {
                element: element,
                target: target,
                configs: configs,
                pages: pages,
                btns: {
                    first: null, // 第一页按钮
                    prev: null, // 上一页按钮
                    next: null, // 下一页按钮
                    last: null, // 最终页按钮
                    goto: null, // 跳转文本框
                    nums: [] // 数字页码列表
                }
            };

            this.render(instance);
        },

        // 渲染分页
        render: function (instance) {

            // 分页容器
            let container = instance.target;
            container.innerHTML = '';

            // 单页隐藏
            let pages = instance.pages;
            if (pages === 1 && instance.configs.hide_single_page) {
                return;
            }

            // 当前页码、禁用状态
            let page = instance.configs.page;
            let disabled = instance.configs.disabled;
            let that = this;

            ////////////////////// 分页链接 //////////////////////

            // 页码容器
            let btnsElement = this.createElement('div', 'pagination-btns');

            // 是否禁用第一页和上一页按钮
            let prevBtnClassArr = page <= 1 ? ['disabled'] : [];
            if (page <= 1 && disabled) {
                if (prevBtnClassArr.indexOf('disabled') < 0) {
                    prevBtnClassArr.push('disabled');
                }
            }

            // 第一页按钮
            let firstBtnElement = this.createElement('a', _flat(['first'], prevBtnClassArr));
            firstBtnElement.innerText = instance.configs.first_btn_text || '\u00AB';
            firstBtnElement.addEventListener('click', function () {
                let page = instance.configs.page;
                if (page > 1) {
                    that.goto(instance, 1);
                }
            });
            instance.btns.first = firstBtnElement;
            btnsElement.appendChild(firstBtnElement);

            // 上一页按钮
            let prevBtnElement = this.createElement('a', _flat(['prev'], prevBtnClassArr));
            prevBtnElement.innerText = instance.configs.prev_btn_text || '\u2039';
            prevBtnElement.addEventListener('click', function () {
                let page = instance.configs.page;
                if (page > 1) {
                    that.goto(instance, page - 1);
                }
            });
            instance.btns.prev = prevBtnElement;
            btnsElement.appendChild(prevBtnElement);

            // 数字按钮列表
            let range = this.visiblePageRange(instance), min = range.min, max = range.max;
            let numBtns = instance.btns.nums = [];
            for (let i = 1; i <= pages; i++) {
                if (i >= min && i <= max) {

                    let activeBtnClassArr = (i === page ? ['activated'] : []);
                    if (i === page && disabled) {
                        if (activeBtnClassArr.indexOf('activated') < 0) {
                            activeBtnClassArr.push('disabled');
                        }
                    }

                    let numBtnElement = this.createElement('a', _flat(activeBtnClassArr));
                    numBtnElement.innerText = i.toString();
                    numBtnElement.setAttribute('data-index', i.toString());
                    numBtnElement.addEventListener('click', function () {
                        let pageIndex = this.dataset.index;
                        if (pageIndex != instance.configs.page) {
                            that.goto(instance, ~~pageIndex);
                        }
                    });

                    if (this.isArray(numBtns)) {
                        numBtns.push(numBtnElement);
                    }
                    btnsElement.appendChild(numBtnElement);
                }
            }

            // 是否禁用下一页和最后一页按钮
            let nextBtnClassArr = page >= pages ? ['disabled'] : [];
            if (page >= pages && disabled) {
                nextBtnClassArr.push('disabled');
            }

            // 下一页按钮
            let nextBtnElement = this.createElement('a', _flat(['next'], nextBtnClassArr));
            nextBtnElement.innerText = instance.configs.next_btn_text || '\u203A';
            nextBtnElement.addEventListener('click', function () {
                let page = instance.configs.page, pages = instance.pages;
                if (page < pages) {
                    that.goto(instance, page + 1);
                }
            });
            instance.btns.next = nextBtnElement;
            btnsElement.appendChild(nextBtnElement);

            // 最后一页按钮
            let lastBtnElement = this.createElement('a', _flat(['last'], nextBtnClassArr));
            lastBtnElement.innerText = instance.configs.last_btn_text || '\u00BB';
            lastBtnElement.addEventListener('click', function () {
                let page = instance.configs.page, pages = instance.pages;
                if (page < pages) {
                    that.goto(instance, pages);
                }
            });
            instance.btns.last = lastBtnElement;
            btnsElement.appendChild(lastBtnElement);

            container.appendChild(btnsElement);

            ////////////////////// 分页跳转 //////////////////////

            if (instance.configs.goto) {

                let gotoElement = this.createElement('div', 'pagination-goto');

                let prefixLabelElement = this.createElement('label');
                prefixLabelElement.innerText = this.lang('goto prefix message');
                gotoElement.appendChild(prefixLabelElement);

                let inputElement = this.createElement('input');
                inputElement.type = 'text';
                inputElement.value = page.toString();
                inputElement.setAttribute('min', '1');
                inputElement.setAttribute('max', pages.toString());
                ['blur', 'keydown'].forEach(function (v) {
                    inputElement.addEventListener(v, function (e) {
                        if (e.type === 'keydown' && e.keyCode !== 13) {
                            return;
                        }

                        let pageVlaue = Math.abs(~~this.value); // ~~值转为正整数
                        if (pageVlaue < 1) {
                            pageVlaue = 1;
                        }
                        let pages = instance.pages;
                        if (pageVlaue > pages) {
                            pageVlaue = pages;
                        }
                        this.value = pageVlaue;

                        if (pageVlaue !== instance.configs.page) {
                            that.goto(instance, pageVlaue);
                        }
                    });
                });
                instance.btns.goto = inputElement;
                gotoElement.appendChild(inputElement);

                let suffixLabelElement = this.createElement('label');
                suffixLabelElement.innerText = this.lang('goto suffix message');
                gotoElement.appendChild(suffixLabelElement);

                container.appendChild(gotoElement);
            }

            ////////////////////// 分页信息 //////////////////////

            if (instance.configs.info) {
                let infoElement = this.createElement('div', 'pagination-info');

                let labelElement = this.createElement('label', 'pagination-tips-count');
                labelElement.innerText = this.lang('total pages and records', pages, instance.configs.total);
                infoElement.appendChild(labelElement);
    
                container.appendChild(infoElement);
            }

            // 重置到第一页
            this.switch(instance, 1);
        },

        // 页面切换
        switch: function (instance, page) {

            // 切换时需要改变当前页码
            instance.configs.page = page;

            let pages = instance.pages,
                disabled = instance.configs.disabled,
                btns = instance.btns;

            let mode;

            // 切换方向按钮样式
            ['first', 'prev', 'next', 'last'].forEach(function (v) {
                if (v === 'first' || v === 'prev') {
                    mode = page <= 1 ? 'add' : 'remove';
                }
                if (v === 'next' || v === 'last') {
                    mode = page >= pages ? 'add' : 'remove';
                }
                if (btns[v]) {
                    disabled && btns[v].classList[mode]('disabled');
                }
            });

            let range = this.visiblePageRange(instance);
            let pageRange = this.range(range.min, range.max);

            // 切换数字按钮样式
            let numBtns = instance.btns.nums;
            for (let i = 0, length = numBtns.length; i < length; i++) {
                let pageVlaue = pageRange[i];
                mode = pageVlaue === page ? 'add' : 'remove';
                numBtns[i].classList[mode]('activated');
                numBtns[i].innerText = pageVlaue.toString();
                numBtns[i].setAttribute('data-index', pageVlaue);
            }

            if (instance.configs.goto) {
                instance.btns.goto.value = page;
            }
        },

        // 页面切换，并出发切换事件
        goto: function (instance, page) {
            this.switch(instance, page);

            if (this.isFunction(instance.configs.change)) {
                instance.configs.change.call(instance, page);
            }
        },

        // 获取当前页面可视的页码列表
        visiblePageRange: function (instance) {
            let page = instance.configs.page,
                btnCnt = instance.configs.btns,
                pages = instance.pages;

            let min = page - Math.floor(btnCnt / 2);
            if (min > pages - btnCnt) {
                min = pages - btnCnt + 1;
            }
            if (min <= 1) {
                min = 1;
            }

            let max = page + Math.floor(btnCnt / 2);
            if (max < btnCnt) {
                max = btnCnt;
            }
            if (max > pages) {
                max = pages;
            }

            return { min: min, max: max };
        },

        // 获取指定范围的连续数组
        range: function (begin, end) {
            let range = [];
            for (let i = begin; i <= end; i++) {
                range.push(i);
            }
            return range;
        },

        // 创建HTML元素
        createElement: function (tag, cls) {
            let element = window.document.createElement(tag);
            if (this.isArray(cls)) {
                cls.forEach(function (v) {
                    element.classList.add(v);
                });
            } else if (this.isString(cls)) {
                element.classList.add(cls);
            }
            return element;
        },

        // 是否是字符串
        isString: function (value) {
            return getType(value) === '[object string]';
        },

        // 是否为数组
        isArray: function (value) {
            return getType(value) === '[object array]';
        },

        // 是否为function
        isFunction: function (value) {
            return getType(value) === '[object function]';
        },

        // 是否为object
        isObject: function (value) {
            return typeof value === 'object' && getType(value) === '[object object]';
        },

        // 是否为json object，json对象没有length属性
        isJsonObject: function (value) {
            if (!this.isObject(value)) {
                return false;
            }
            return typeof (value.length) === 'undefined';
        },

        // 是否为HTML元素对象，或其子元素
        isLikeHTMLElement: function (value) {
            return getType(value) === '[object htmlelement]' || value instanceof HTMLElement;
        },

        // 获取语言
        lang: function () {
            let name = arguments[0];
            if (!this.isString(name)) {
                name = '';
            }
            if (!name.length) {
                return '';
            }

            let langStr = langs[name];
            if (!this.isString(langStr)) {
                return name;
            }

            let args = Array.apply(null, arguments); // arguments转数组
            args.splice(0, 1, langStr);
            for (let i = 1, length = args.length; i < length; i++) {
                let pattern = "\\{" + (i - 1) + "\\}";
                let regx = new RegExp(pattern, 'g');
                langStr = langStr.replace(regx, args[i]);
            }
            return langStr;
        },

        // 输出错误信息
        consoleError: function (str) {
            console.log('%c' + str, 'color:red;');
        }
    };

    // 插件主体
    let pagination = {

        init: function (element, opts) {
            _this.create(element, opts);
        }

    };

    // 暴露插件
    !('funsent' in window) && (window.funsent = {});
    !('pagination' in window.funsent) && (window.funsent.pagination = pagination);
});
