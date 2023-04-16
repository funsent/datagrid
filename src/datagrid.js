/**
 * 一款原生javascript实现的datagrid数据表格插件
 * 
 * @package  funsent
 * @link     http://www.funsent.com/
 * @license  https://opensource.org/licenses/MIT/
 * @author   yanggf <2018708@qq.com>
 * @version  v0.1.4
 */

 ; (function (global, factory) {
    "use strict";
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ? factory(global, true) : function (w) {
            if (!w.document) {
                throw new Error('jQuery requires a window with a document');
            }
            return factory(w);
        };
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {

    /**
     * Restful API请求方式：
     * 
     * 1. 获取资源列表: GET     /resources
     * 2. 获取单个资源: GET     /resource/{id}
     * 3. 创建单个资源: POST    /resource
     * 4. 修改单个资源: PUT     /resource/{id}
     * 5. 删除单个资源: DELETE  /resource/{id}
     * 
     * 6. 创建多个资源: POST    /resources
     * 7. 修改多个资源: PUT     /resources/{ids}
     * 8. 删除多个资源: DELETE  /resources/{ids}
     */
    let $ = jQuery;
    let doc = window.document;

    // 默认参数
    let defaults = {

        // 标题
        title: '',

        // 请求地址（资源）
        url: '',

        // 标识字段（主键字段）
        primary_field: 'id',

        // 远程请求携带的额外参数
        query_params: {},

        // 默认请求数据的方法
        method: 'post',

        // 双击行查看数据
        dblclick_look: false,

        // 是否显示分页
        pagination: false,

        // 当前页码
        page: 1,

        // 每页显示记录数
        pagesize: 10,

        // 是否显示行号
        show_rownumber: true,

        // 翻页时保持连续行号，show_rownumber参数为true时有效
        keep_rownumber: true,

        // 是否单选行
        single_select: false,

        // 选择行时是否选中checkbox
        check_onselect: true,

        // 选中checkbox时是否选择行
        select_oncheck: true,

        //TODO 翻页时保持primary的checkbox选中状态
        // keep_checked: false,

        // 隔行显示背景色
        striped: false,

        // 从远程加载数据时的提示信息
        loading_msg: 'loading, please wait...',

        // 行样式函数
        row_styler: function (record, index) { },

        // 需注册到实例的方法
        methods: {},

        // 数据列
        columns: [
            // { field: '', title: '', width: 'auto', halign: 'center', align: 'center', checkbox: false, hidden: false, styler: function(field, record, rowIndex, columnIndex){}, formatter: function(field, record, rowIndex, columnIndex){}, hstyler: function(title, column, columnIndex){}, formatter: function(title, column, columnIndex){} },
        ],

        // 工具栏，内置4个常用操作：查看、新增、编辑、删除
        toolbar: [
            // { form: '', text: '查看', icon_cls: '', handler: 'look', url: '', method: '', params: { title: '', width: '', height: '', before_callback: function (record) { }, success_callback: function (record, data) { }, error_callback: function (record, data) { }, opened_callback: function (form, record) { } } },
            // { form: '', text: '添加', icon_cls: '', handler: 'add', url: '', method: '', params: { title: '', width: '', height: '', message: '', before_callback: function (form) { }, success_callback: function (form, data) { }, error_callback: function (form, data) { }, opened_callback: function (form) { } } },
            // { form: '', text: '编辑', icon_cls: '', handler: 'edit', url: '', method: '', params: { title: '', width: '', height: '', message: '', before_callback: function (record) { }, success_callback: function (form, record, formData, data) { }, error_callback: function (form, record, formData, data) { }, opened_callback: function (form, record) { } } },
            // { form: '', text: '删除', icon_cls: '', handler: 'delete', url: '', method: '', params: { message: '', before_callback: function (record) { }, success_callback: function (record, data) { }, error_callback: function (record, data) { } } }
        ],

        // 搜索栏
        searchbar: [
            // { type: 'text', field: '', value: '', readonly:false, placeholder: '', autocomplete: false }, // 文本搜索框
            // { type: 'select', field: '', value: '', readonly:false, placeholder: '', autocomplete: false, values: {} }, // 下拉搜索框
            // { type: 'button', text: '', icon_cls: '', params: {} } // 搜索按钮
        ]
    };

    // 语言包
    const langs = {
        'instance not found': '实例不存在',
        'method not found': '方法不存在：{0}',
        'create on hidden element is invalid': '隐藏元素上创建 {0} 是无意义的',
        'invalid element name': '{0} 参数必须是有效的块元素样式字符串或者其DOM对象',
        'invalid class name': '无效的操作类名：{0}',
        'invalid callback': '无效的回调参数',
        'invalid request url': '取消的请求地址：{0}',
        'invalid request method': '无效的请求方法：{0}',
        'loading, please wait...': '加载中...',
        'please select one record': '请选择一条数据',
        'form template not found': '{0} 表单不存在',

        'info': '信息',
        'search': '搜索',
        'look': '查看',
        'add': '添加',
        'edit': '编辑',
        'delete': '删除',
        'ok': '确定',
        'save': '保存',
        'cancel': '取消',
        'close': '关闭'
    };

    // 返回类型
    const getType = function (v) {
        return Object.prototype.toString.call(v).toLowerCase();
    };

    // 生成的表格相关参数配置
    let _tableConfig = {
        col_border_width: 1,
        col_horizontal_padding: 12
    };

    // 内部方法
    let _this = {

        /**
         * 实例集合，每行代表一个datagrid实例，支持在一个页面下设置多个datagrid实例
         * 参数说明：
         * 1. key 实例键名
         * 2. tag 实例的唯一标签
         * 3. element 实例的原始元素
         * 4. target 实例的DOM对象
         * 5. configs 实例配置参数
         */
        instances: [
            // { key: '', tag: '', element: null, 'target': null, 'configs': {} },
            // { key: '', tag: '', element: null, 'target': null, 'configs': {} },
            // { key: '', tag: '', element: null, 'target': null, 'configs': {} },
        ],

        // 获取实例
        // element参数可以为：
        // 1. 元素样式字符串
        // 2. 元素的DOM对象
        // 3. 字符串标签，必须以json对象形式给出，如：{tag:'tag_name'}
        // 4. 整数索引，实例化顺序
        instance: function (element) {

            if (this.isNumber(element)) {
                // 根据实例化顺序索引获取对应实例
                if (element < 0) {
                    return undefined;
                }
                let index = Math.floor(element);
                let instance = this.instances[index];
                if (!instance) {
                    this.consoleError(this.lang('instance not found'));
                    return undefined;
                }
                return instance;
            }

            if (this.isJsonObject(element)) {
                // 根据标签获取对应实例
                let tag = element['tag'];
                if (tag) {
                    for (let key in this.instances) {
                        let instance = this.instances[key];
                        if (instance.tag === tag) {
                            return instance;
                        }
                    }
                    element = element['element'];
                }
            }

            if (!this.isString(element) && !this.isLikeHTMLElement(element)) {
                this.consoleError(this.lang('invalid element name', 'element'));
                return undefined;
            }

            for (let key in this.instances) {
                let instance = this.instances[key];
                if (instance.element === element) {
                    return instance;
                }
            }

            this.consoleError(this.lang('instance not found'));
            return undefined;
        },

        // 创建实例
        // element参数可以为：
        // 1. 元素样式字符串
        // 2. 元素的DOM对象
        create: function (element, opts) {
            let target, msg = this.lang('invalid element name', 'element');
            if (this.isString(element)) {
                target = doc.querySelector(element);
            } else if (this.isLikeHTMLElement(element)) {
                target = element;
            } else {
                this.consoleError(msg);
                return false;
            }

            if (target.style.display === 'hidden') {
                this.consoleError(this.lang('create on hidden element is invalid', 'datagrid'));
                return false;
            }

            if (!this.isJsonObject(opts)) {
                opts = {};
            }

            let tag = opts['tag'];
            if (!this.isString(tag)) {
                opts['tag'] = tag = '';
            }

            // 清理原先相同的实例, 注意下标变化
            for (let i = 0; i < this.instances.length; i++) {
                let oldInstance = this.instances[i];
                if (oldInstance.element === element || oldInstance.target === target) {
                    this.instances.splice(i--, 1);
                } else if (tag.length && oldInstance.tag === tag) {
                    this.instances.splice(i--, 1);
                }
            }

            let configs = Object.assign({}, defaults, opts);

            let instance = {
                key: '',
                tag: tag,
                element: element,
                target: target,
                configs: configs
            };
            this.instances.push(instance);

            // 重新计算key
            let keyPrefix = 'funsent_datagrid';
            for (let i = 0, length = this.instances.length; i < length; i++) {
                this.instances[i].key = keyPrefix + i;
            }

            // 注册实例的扩展方法
            this.registerMethod(instance, configs.methods);

            // 初始化结构
            this.createStructure(instance);

            // 渲染工具栏
            this.renderToolbar(instance);

            // 渲染搜索栏
            this.renderSearchbar(instance);

            // 渲染数据表格
            this.renderDataTable(instance);
        },

        // 注册实例的扩展方法
        registerMethod: function (instance, methods) {
            instance.configs.methods = {};
            if (!this.isJsonObject(methods)) {
                return;
            }
            for (let name in methods) {
                if (this[name]) {
                    continue;
                }
                let method = methods[name];
                instance.configs.methods[name] = method;
                this[name] = method;
            }
        },

        // 初始化结构
        createStructure: function (instance) {
            let target = instance.target,
                title = instance.configs.title;
            target.classList.add('datagrid');

            // 标题
            if (this.isNonEmptyString(title)) {
                let titleDiv = this.createElement('div', ['datagrid-title']),
                    h2 = this.createElement('h2');
                h2.innerText = title;
                titleDiv.appendChild(h2);
                target.appendChild(titleDiv);
            }

            // 结构
            target.appendChild(this.createElement('div', ['datagrid-head']));
            target.appendChild(this.createElement('div', ['datagrid-body']));
            target.appendChild(this.createElement('div', ['datagrid-foot']));
        },

        // 渲染工具栏
        renderToolbar: function (instance) {
            let tools = instance.configs.toolbar;
            let length = this.isNonEmptyArray(tools);
            if (!length) {
                return;
            }

            let that = this;
            let toolbar = this.createElement('div', ['datagrid-toolbar']);
            for (let i = 0; i < length; i++) {
                let tool = tools[i];
                if (!this.isJsonObject(tool)) {
                    continue;
                }
                let text = tool['text'],
                    iconCls = tool['icon_cls'],
                    handler = tool['handler'],
                    params = tool['params'];
                if (!this.isJsonObject(params)) {
                    params = {};
                }
                params.url = tool['url'];
                params.method = tool['method'];
                params.form = tool['form'];
                params.title = params.title || text;
                // params.width
                // params.height

                let button = this.createElement('button', ['datagrid-toolbar-btn']);
                if (this.isNonEmptyString(iconCls)) {
                    let cls = iconCls.split(' ');
                    let icon = this.createElement('i', cls);
                    button.appendChild(icon);
                }
                if (this.isNonEmptyString(text)) {
                    let textNode = doc.createTextNode(text);
                    button.appendChild(textNode);
                }

                // 绑定点击事件
                if (this.isString(handler)) {
                    let methodName = handler;
                    button.dataset.rel = methodName;
                    handler = this[methodName];
                    // 外部扩展方法（非内置方法）需要检查方法是否存在
                    if (!this.inArray(methodName, ['look', 'add', 'edit', 'delete'])) {
                        if (!handler) {
                            this.consoleError(this.lang('method not found', handler));
                        }
                    }
                }
                if (this.isFunction(handler)) {
                    button.addEventListener('click', function () {
                        handler.call(that, instance, params);
                    });
                }

                toolbar.appendChild(button);
            }

            instance.target.querySelector('div.datagrid-head').appendChild(toolbar);
        },

        // 渲染搜索栏
        renderSearchbar: function (instance) {
            let inputs = instance.configs.searchbar;
            let length = this.isNonEmptyArray(inputs);
            if (!length) {
                return;
            }

            let searchbar = this.createElement('div', ['datagrid-searchbar']);
            let form = this.createElement('form');

            let buttonText = '', buttonIconCls = '', buttonParams = {};

            // 表单元素
            for (let i = 0; i < length; i++) {
                let input = inputs[i];
                if (!this.isJsonObject(input)) {
                    continue;
                }

                let type = input['type'],
                    text = input['text'],
                    width = input['width'] || 'auto',
                    iconCls = input['icon_cls'],
                    field = input['field'],
                    value = input['value'],
                    values = input['values'],
                    readOnly = input['readonly'],
                    placeholder = input['placeholder'],
                    autocomplete = input['autocomplete'],
                    params = input['params'];
                if (!this.isNonEmptyString(field) && type !== 'button') {
                    continue;
                }
                if (!this.isString(value) && !this.isNumber(value)) {
                    value = '';
                }
                if (!this.isBoolean(readOnly)) {
                    readOnly = false;
                }
                if (!this.isString(placeholder)) {
                    placeholder = '';
                }
                if (!this.isBoolean(autocomplete)) {
                    autocomplete = false;
                }

                width = parseInt(width, 10);
                if (!isNaN(width)) {
                    width = Math.abs(width) + 'px';
                }

                if (type === 'text') {
                    let span = this.createElement('span');
                    let textInput = this.createElement('input');
                    textInput.type = type;
                    textInput.name = field;
                    textInput.style.width = width;
                    textInput.readOnly = readOnly;
                    textInput.placeholder = placeholder;
                    textInput.autocomplete = autocomplete;
                    textInput.value = value;
                    span.appendChild(textInput);
                    form.appendChild(span);
                } else if (type === 'select') {
                    if (!this.isJsonObject(values)) {
                        values = {};
                    }
                    let span = this.createElement('span');
                    let selectInput = this.createElement('select');
                    selectInput.name = field;
                    selectInput.style.width = width;
                    selectInput.readOnly = readOnly;
                    selectInput.placeholder = placeholder;
                    selectInput.autocomplete = autocomplete;
                    for (let v in values) {
                        let t = values[v];
                        let option = this.createElement('option');
                        option.value = v;
                        option.text = t;
                        if (value === v) {
                            option.selected = true;
                        }
                        selectInput.appendChild(option);
                    }
                    span.appendChild(selectInput);
                    form.appendChild(span);
                } else if (type === 'button') {
                    // 搜索按钮留到循环外再创建
                    if (!buttonText.length) {
                        buttonText = text || this.lang('search');
                        buttonIconCls = iconCls || '';
                        buttonParams = params || {};
                    }
                }
            }

            // 搜索按钮
            let that = this;
            let span = this.createElement('span');
            let button = this.createElement('button');
            if (this.isNonEmptyString(buttonIconCls)) {
                let cls = buttonIconCls.split(' ');
                let icon = this.createElement('i', cls);
                button.appendChild(icon);
            }
            if (!this.isNonEmptyString(buttonText)) {
                buttonText = this.lang('search');
            }
            let textNode = doc.createTextNode(buttonText);
            button.addEventListener('click', function (e) {
                e.preventDefault();
                that.search.call(that, instance, buttonParams);
            })
            button.appendChild(textNode);
            span.appendChild(button);

            form.appendChild(span);
            searchbar.appendChild(form);

            instance.target.querySelector('div.datagrid-head').appendChild(searchbar);
        },

        // 渲染数据表格
        renderDataTable: function (instance) {
            // 渲染列
            this.renderColumns(instance);

            // 渲染行
            this.renderRows(instance);
        },

        // 渲染数据表格的列头
        renderColumns: function (instance) {
            let configs = instance.configs;
            let columns = configs.columns;
            let length = this.isNonEmptyArray(columns);
            if (!length) {
                return false;
            }

            let datatable = this.createElement('div', ['datagrid-datatable']);
            let wrapper = this.createElement('div', ['datagrid-datatable-wrapper']);
            let table = this.createElement('table', ['datagrid-datatable-table']);
            let thead = this.createElement('thead');
            let tbody = this.createElement('tbody');
            let tr = this.createElement('tr');

            let primaryField = configs.primary_field,
                showRowNumber = configs.show_rownumber,
                singleSelect = configs.single_select;

            let borderWidth = _tableConfig.col_border_width;
            let horizontalPadding = _tableConfig.col_horizontal_padding;
            let thsWidth = 0;

            // 开启行号
            if (showRowNumber) {
                columns = JSON.parse(JSON.stringify(columns));
                columns.unshift({});
                length++;
            }

            for (let i = 0; i < length; i++) {
                let column = columns[i],
                    field = column['field'] || '',
                    title = column['title'] || '',
                    width = column['width'] || 'auto',
                    halign = column['halign'] || 'left',
                    align = column['align'] || 'left',
                    checkbox = column['checkbox'] || false,
                    hidden = column['hidden'] || false,
                    styler = column['styler'],
                    formatter = column['formatter'],
                    hstyler = column['hstyler'],
                    hformatter = column['hformatter'];

                let text = title;

                // 列格式化
                if (this.isFunction(hformatter)) {
                    let result = hformatter(title, column, i);
                    if (this.isString(result)) {
                        text = result;
                    }
                }

                // 复选框列
                if (checkbox) {
                    if (primaryField === field && !singleSelect) {
                        text = '<div class="checkbox"><input type="checkbox" rel="datagrid-primary-all-checkbox" /><label></label></div>';
                        halign = 'center';
                    }
                    width = '21px';
                }

                // 行号列
                if (showRowNumber && i === 0) {
                    field = 'datagrid-rownumber';
                    text = '';
                    halign = 'center';
                    width = '21px';
                }

                let th = this.createElement('th');
                th.dataset.field = field;
                th.innerHTML = text;
                // th.align = halign;
                // th.width = width;

                let thStyle = 'border-width:' + borderWidth + 'px;padding-left:' + horizontalPadding + 'px;padding-right:' + horizontalPadding + 'px';


                if (this.isString(halign) && this.inArray(halign, ['left', 'center', 'right'])) {
                    thStyle += ';text-align:' + halign;
                }

                width = parseInt(width, 10);
                if (!isNaN(width)) {
                    width = Math.abs(width);
                    thsWidth += width;
                    thStyle += ';width:' + width + 'px';
                }

                // 隐藏列
                if (hidden) {
                    thStyle += ';display:none';
                }

                // 列样式
                if (this.isFunction(hstyler)) {
                    let result = hstyler(title, column, i);
                    if (this.isNonEmptyString(result)) {
                        thStyle += ';' + result;
                    }
                }

                th.style = thStyle;
                tr.appendChild(th);
            }

            thead.appendChild(tr);
            table.appendChild(thead);
            table.appendChild(tbody);
            wrapper.appendChild(table);
            datatable.appendChild(wrapper);

            instance.target.querySelector('div.datagrid-body').appendChild(datatable);

            // 设置table的宽度
            let tableWidth = thsWidth + (length * (horizontalPadding * 2)) + ((length + 1) * borderWidth) + 2;
            table.style.width = tableWidth + 'px';
        },

        // 渲染数据表格的行和数据
        renderRows: function (instance) {
            this.loadData(instance, {}, {});
        },

        // 加载数据
        loadData: function (instance, fetchParams, paginationParams) {
            let that = this;
            this.fetchData(instance, fetchParams, function (res) {
                if (res.code) {
                    layer.msg(res.msg);
                    return;
                }
                let records = res.data.rows,
                    total = res.data.total;
                that.parseData(instance, records);
                that.renderPagination(instance, total, paginationParams);
            });
        },

        // 重新加载数据，带搜索条件
        loadDataWithSearch: function (instance) {
            let fetchParams = paginationParams = {};
            let searchbar = instance.target.querySelector('div.datagrid-searchbar');
            if (searchbar) {
                let form = searchbar.querySelector('form');
                fetchParams = paginationParams = this.serializeObject(form);
            }
            this.loadData(instance, fetchParams, paginationParams);
        },

        // 获取数据
        fetchData: function (instance, fetchParams, callback) {
            let configs = instance.configs,
                url = configs.url,
                method = configs.method || 'post';
            if (!this.isNonEmptyString(url) || !this.isValidUrl(url)) {
                this.consoleError(this.lang('invalid request url', url));
                return;
            }
            if (!this.inArray(method.toLowerCase(), ['post', 'get'])) {
                this.consoleError(this.lang('invalid request method', method));
                return;
            }

            if (!this.isJsonObject(fetchParams)) {
                fetchParams = {};
            }

            let defaults = {
                page: configs.page,
                pagesize: configs.pagesize
            };

            let params = Object.assign({}, defaults, fetchParams);

            //TODO 下一步换成原生js实现
            let that = this;
            let layerIndex = layer.msg(this.lang(configs.loading_msg));
            $[method](url, params, function (res) {
                if (that.isFunction(callback)) {
                    callback.call(that, res);
                }
                layer.close(layerIndex);
            });
        },

        // 解析数据
        parseData: function (instance, records) {
            if (!this.isArray(records)) {
                return;
            }

            let datatable = instance.target.querySelector('.datagrid-body').querySelector('.datagrid-datatable');
            if (!datatable) {
                return;
            }

            let table = datatable.querySelector('.datagrid-datatable-wrapper').querySelector('.datagrid-datatable-table');
            let tbody = table.querySelector('tbody');
            tbody.innerHTML = ''; // 清除原先的所有子节点

            // 空数据
            if (!records.length) {
                return;
            }

            let that = this,
                configs = instance.configs,
                columns = configs.columns,
                recordCnt = records.length,
                columnCnt = columns.length,
                primaryField = configs.primary_field,
                showRowNumber = configs.show_rownumber,
                striped = configs.striped,
                page = configs.page,
                pagesize = configs.pagesize,
                keepRowNumber = configs.keep_rownumber,
                rowStyler = configs.row_styler,
                dblClickLook = configs.dblclick_look;

            // 开启行号
            if (showRowNumber) {
                columns = JSON.parse(JSON.stringify(columns));
                columns.unshift({});
                columnCnt++;
            }

            let borderWidth = _tableConfig.col_border_width;
            let horizontalPadding = _tableConfig.col_horizontal_padding;

            for (let i = 0; i < recordCnt; i++) {
                let record = records[i];
                if (!that.isJsonObject(record)) {
                    continue;
                }

                let tr = this.createElement('tr');
                for (let j = 0; j < columnCnt; j++) {
                    let column = columns[j],
                        field = column['field'] || '',
                        title = column['title'] || '',
                        width = column['width'] || 'auto',
                        halign = column['halign'] || 'left',
                        align = column['align'] || 'left',
                        checkbox = column['checkbox'] || false,
                        hidden = column['hidden'] || false,
                        styler = column['styler'],
                        formatter = column['formatter'],
                        hstyler = column['hstyler'],
                        hformatter = column['hformatter'];

                    let text = record[field];

                    // 列格式化
                    if (this.isFunction(formatter)) {
                        let result = formatter(record[field], record, i, j);
                        if (this.isString(result)) {
                            text = result;
                        }
                    }

                    // checkbox列
                    if (checkbox) {
                        let rel = primaryField === field ? ' rel="datagrid-primary-checkbox"' : '';
                        text = '<div class="checkbox"><input type="checkbox"' + rel + ' name="' + field + '" value="' + text + '" /><label></label></div>';
                    }

                    // 行号计算，支持翻页后保持连续行号的功能
                    if (showRowNumber && j == 0) {
                        text = keepRowNumber ? (page - 1) * pagesize + i + 1 : i + 1;
                        align = 'center';
                    }

                    let td = this.createElement('td');
                    td.dataset.field = field;
                    td.innerHTML = text;
                    // td.align = align;

                    let tdStyle = 'border-width:' + borderWidth + 'px;padding-left:' + horizontalPadding + 'px;padding-right:' + horizontalPadding + 'px';

                    if (this.isString(align) && this.inArray(align, ['left', 'center', 'right'])) {
                        tdStyle += ';text-align:' + align;
                    }

                    // 隐藏列
                    if (hidden) {
                        tdStyle += ';display:none';
                    }

                    // 列样式
                    if (this.isFunction(styler)) {
                        let result = styler(record[field], record, i, j);
                        if (this.isNonEmptyString(result)) {
                            tdStyle += ';' + result;
                        }
                    }

                    td.style = tdStyle;
                    tr.appendChild(td);
                }

                // 隔行颜色显示
                if (striped && (i % 2 === 1)) {
                    tr.classList.add('datagrid-row-even');
                }

                // 行样式
                if (this.isFunction(rowStyler)) {
                    let result = rowStyler(record, i);
                    if (this.isNonEmptyString(result)) {
                        tr.style = result;
                    }
                }

                // 双击行查看数据
                if (dblClickLook && primaryField) {
                    tr.addEventListener('dblclick', function (e) {
                        let trs = this.parentNode.querySelectorAll('tr');
                        if (!trs.length) {
                            return;
                        }

                        // 查看按钮
                        let lookBtn = instance.target.querySelector('div.datagrid-head').querySelector('div.datagrid-toolbar').querySelector('button[data-rel="look"].datagrid-toolbar-btn');
                        if (!lookBtn) {
                            return;
                        }

                        // 取消所有行选中状态
                        trs.forEach(function (v) {
                            v.classList.remove('datagrid-row-selected');
                            let checkbox = v.querySelector('td input[type="checkbox"][rel="datagrid-primary-checkbox"]:checked');
                            if (checkbox) {
                                checkbox.checked = false;
                            }
                        });

                        // 选中当前行
                        tr.classList.add('datagrid-row-selected');
                        tr.querySelector('td input[type="checkbox"][rel="datagrid-primary-checkbox"]').checked = true;

                        // 触发点击事件
                        lookBtn.click();
                    })
                }

                tbody.appendChild(tr);
            }

            // 绑定选择行和选中checkbox相关事件
            that.bindSelectAndCheck(table, instance.configs);
        },

        // 渲染分页栏
        renderPagination: function (instance, total, paginationParams) {
            let configs = instance.configs;
            if (!configs.pagination) {
                return;
            }
            if (!this.isNumber(total)) {
                return;
            }
            if (!this.isJsonObject(paginationParams)) {
                paginationParams = {};
            }

            let that = this,
                pagesize = configs.pagesize;
            let opts = {
                pagesize: pagesize,
                total: total,
                change: function (pageIndex) {
                    // 重设当前页码
                    instance.configs.page = pageIndex;

                    let params = Object.assign({}, { page: pageIndex }, paginationParams);
                    that.fetchData(instance, params, function (res) {
                        if (res.code) {
                            layer.msg(res.msg);
                            return;
                        }
                        let records = res.data.rows;
                        that.parseData(instance, records);
                    });
                }
            };

            let foot = instance.target.querySelector('div.datagrid-foot');
            let paginationbar = foot.querySelector('.pagination');
            if (paginationbar) {
                paginationbar.innerHTML = '';
            } else {
                paginationbar = this.createElement('div', ['pagination']);
                foot.appendChild(paginationbar);
            }

            funsent.pagination.init(paginationbar, opts);
        },

        // 绑定选择行和选中checkbox相关事件
        bindSelectAndCheck: function (table, configs) {
            let trs = table.querySelectorAll('tbody tr'),
                primaryAllCheckbox = table.querySelector('thead tr th input[type="checkbox"][rel="datagrid-primary-all-checkbox"]'),
                primaryCheckboxs = table.querySelectorAll('tbody tr td input[type="checkbox"][rel="datagrid-primary-checkbox"]');

            let singleSelect = configs.single_select,
                checkOnSelect = configs.check_onselect,
                selectOnCheck = configs.select_oncheck;

            // 选择行相关事件
            if (trs.length) {
                trs.forEach(function (tr) {
                    tr.addEventListener('click', function (e) {
                        let checked = this.classList.contains('datagrid-row-selected') ? false : true;
                        let mode = checked ? 'add' : 'remove';
                        this.classList[mode]('datagrid-row-selected');

                        // 选择行时选中checkbox
                        if (checkOnSelect) {
                            let primaryCheckbox = this.querySelector('td input[type="checkbox"][rel="datagrid-primary-checkbox"]');
                            if (primaryCheckbox) {
                                primaryCheckbox.checked = checked;
                            }
                        }

                        // 单选行时取消选择其他行
                        if (singleSelect) {
                            let that = this;
                            let _trs = this.parentNode.children;
                            for (let i = 0, length = _trs.length; i < length; i++) {
                                let _tr = _trs[i];
                                if (_tr === this) {
                                    continue;
                                }
                                _tr.classList.remove('datagrid-row-selected');
                                let primaryCheckbox = _tr.querySelector('td input[type="checkbox"][rel="datagrid-primary-checkbox"]');
                                if (primaryCheckbox) {
                                    primaryCheckbox.checked = false;
                                }
                            }
                        }

                        // 全选checkbox元素的选择状态
                        if (primaryAllCheckbox) {
                            let primaryAllChecked = true;
                            if (checked) { // 直接判断提高性能
                                let _trs = this.parentNode.children;
                                for (let i = 0, length = _trs.length; i < length; i++) {
                                    let _tr = _trs[i];
                                    let primaryCheckbox = _tr.querySelector('td input[type="checkbox"][rel="datagrid-primary-checkbox"]');
                                    if (!primaryCheckbox || !primaryCheckbox.checked) {
                                        primaryAllChecked = false;
                                    }
                                }
                            } else {
                                primaryAllChecked = false;
                            }
                            primaryAllCheckbox.checked = primaryAllChecked;
                        }
                    });
                });
            }

            // 全选checkbox相关事件，非单选行模式有效
            if (primaryAllCheckbox && !singleSelect) {
                primaryAllCheckbox.addEventListener('click', function (e) {
                    let checked = this.checked = this.checked;

                    trs.forEach(function (tr) {
                        let primaryCheckbox = tr.querySelector('td input[type="checkbox"][rel="datagrid-primary-checkbox"]');
                        primaryCheckbox.checked = checked;

                        // 选中checkbox时是否选择行
                        if (selectOnCheck) {
                            let mode = checked ? 'add' : 'remove';
                            tr.classList[mode]('datagrid-row-selected');
                        }
                    });
                });
            }

            // 选中checkbox相关事件
            if (primaryCheckboxs.length) {
                primaryCheckboxs.forEach(function (checkbox) {
                    checkbox.addEventListener('click', function (e) {
                        let checked = this.checked;

                        // 选中checkbox时是否选择行
                        if (selectOnCheck) {
                            let tr = this.parentNode.parentNode.parentNode;
                            let mode = checked ? 'add' : 'remove';
                            tr.classList[mode]('datagrid-row-selected');
                        }

                        // 单选行时取消选择其他行
                        if (singleSelect) {
                            let tr = this.parentNode.parentNode.parentNode;
                            let _trs = tr.parentNode.children;
                            for (let i = 0, length = _trs.length; i < length; i++) {
                                let _tr = _trs[i];
                                if (_tr === tr) {
                                    continue;
                                }
                                _tr.classList.remove('datagrid-row-selected');
                                let primaryCheckbox = _tr.querySelector('td input[type="checkbox"][rel="datagrid-primary-checkbox"]');
                                if (primaryCheckbox) {
                                    primaryCheckbox.checked = false;
                                }
                            }
                        }

                        // 全选checkbox元素的选择状态
                        if (primaryAllCheckbox) {
                            let primaryAllChecked = true;
                            if (checked) { // 直接判断提高性能
                                let _trs = this.parentNode.parentNode.parentNode.parentNode.children;
                                for (let i = 0, length = _trs.length; i < length; i++) {
                                    let _tr = _trs[i];
                                    let primaryCheckbox = _tr.querySelector('td input[type="checkbox"][rel="datagrid-primary-checkbox"]');
                                    if (!primaryCheckbox || !primaryCheckbox.checked) {
                                        primaryAllChecked = false;
                                    }
                                }
                            } else {
                                primaryAllChecked = false;
                            }
                            primaryAllCheckbox.checked = primaryAllChecked;
                        }

                        // 阻止事件冒泡，防止触发tr的click事件
                        e.stopPropagation();
                    });
                });
            }
        },

        // 搜索
        search: function (instance, params) {
            let searchbar = instance.target.querySelector('div.datagrid-searchbar');
            if (!searchbar) {
                return;
            }

            if (!this.isJsonObject(params)) {
                params = {};
            }

            let that = this,
                callback = params.callback,
                form = searchbar.querySelector('form'),
                formData = this.serializeObject(form);

            this.fetchData(instance, formData, function (res) {
                if (res.code) {
                    layer.msg(res.msg);
                    return;
                }

                let records = res.data.rows,
                    total = res.data.total;

                that.parseData(instance, records);
                that.renderPagination(instance, total, formData);

                if (that.isFunction(callback)) {
                    callback.call(that, form, records, params);
                }
            });
        },

        // 查看
        look: function (instance, params) {
            let table = instance.target.querySelector('table.datagrid-datatable-table');
            if (!table) {
                return;
            }
            let checkedCheckboxs = table.querySelectorAll('tbody tr td input[type="checkbox"][rel="datagrid-primary-checkbox"]:checked');
            if (checkedCheckboxs.length !== 1) {
                layer.msg(this.lang('please select one record'));
                return;
            }

            let checkbox = checkedCheckboxs[0];
            let checkboxField = checkbox.name;
            let checkboxValue = checkbox.value;

            let record = {};
            record[checkboxField] = checkboxValue;
            let tds = checkbox.parentNode.parentNode.parentNode.querySelectorAll('td');
            tds.forEach(function (td) {
                let field = td.dataset.field;
                if (field === checkboxField) {
                    return;
                }
                record[field] = td.innerText;
            });

            let that = this,
                url = params.url,
                template = doc.querySelector(params.form),
                title = params.title,
                width = params.width,
                height = params.height,
                beforeCallback = params.before_callback,
                successCallback = params.success_callback,
                errorCallback = params.error_callback,
                openedCallback = params.opened_callback,
                area = 'auto';
            if (!this.isLikeHTMLElement(template)) {
                this.consoleError(this.lang('form template not found', 'look'));
                return;
            }
            if (!this.isNonEmptyString(url)) {
                url = instance.configs.url;
            }
            if (width && height) {
                area = [width, height];
            } else if (width) {
                area = width;
            }

            let data = { use: 'look', id: checkboxValue };

            // 请求前的回调
            if (this.isFunction(beforeCallback)) {
                let result = beforeCallback(record);
                if (this.isJsonObject(result)) {
                    data = Object.assign({}, data, result);
                } else if (false === result) {
                    return;
                }
            }

            $.get(url, data, function (res) {
                if (res.code) {
                    // 请求失败后的回调
                    if (that.isFunction(errorCallback)) {
                        let result = errorCallback(record, res.data);
                        if (that.isNonEmptyString(result)) {
                            layer.msg(result);
                            return;
                        } else if (false == result) {
                            return;
                        }
                    }
                    layer.msg(res.msg);
                    return;
                }

                // 请求成功后的回调
                if (that.isFunction(successCallback)) {
                    let result = successCallback(record, res.data);
                    if (that.isNonEmptyString(result)) {
                        layer.msg(result);
                    } else if (false === result) {
                        return;
                    }
                }

                let form = template.cloneNode(true);
                form.style.display = 'block';

                layer.open({
                    type: 1,
                    resize: false,
                    title: title,
                    area: area,
                    content: form.outerHTML,
                    success: function (layero, index) {
                        let record = res.data.row;
                        let dialogForm = layero.get(0);

                        for (let key in record) {
                            let input = dialogForm.querySelector('[name="' + key + '"]');
                            if (input) {
                                if (input.tagName.toLowerCase() === 'textarea') {
                                    input.value = record[key];
                                } else {
                                    input.setAttribute('value', record[key]);
                                }
                                input.disabled = true;
                                input.classList.add('disabled');
                            }
                        }

                        // 对话框打开后的回调，如果返回false，则关闭对话框
                        if (that.isFunction(openedCallback)) {
                            if (false === openedCallback(dialogForm, record)) {
                                layer.close(index);
                            }
                        }
                    },
                    btn: [that.lang('ok')],
                    btn1: function (index, layero) {
                        layer.close(index);
                    }
                });
            });
        },

        // 新增
        add: function (instance, params) {
            let table = instance.target.querySelector('table.datagrid-datatable-table');
            if (!table) {
                return;
            }

            let that = this,
                url = params.url,
                template = doc.querySelector(params.form),
                title = params.title,
                width = params.width,
                height = params.height,
                message = params.message,
                beforeCallback = params.before_callback,
                successCallback = params.success_callback,
                errorCallback = params.error_callback,
                openedCallback = params.opened_callback,
                area = 'auto';
            if (!this.isLikeHTMLElement(template)) {
                this.consoleError(this.lang('form template not found', 'add'));
                return;
            }
            if (!this.isNonEmptyString(url)) {
                url = instance.configs.url;
            }
            if (width && height) {
                area = [width, height];
            } else if (width) {
                area = width;
            }

            let form = template.cloneNode(true);
            form.style.display = 'block';

            layer.open({
                type: 1,
                resize: false,
                title: title,
                area: area,
                content: form.outerHTML,
                success: function (layero, index) {
                    let dialogForm = layero.get(0);
                    // 对话框打开后的回调，如果返回false，则关闭对话框
                    if (that.isFunction(openedCallback)) {
                        let result = openedCallback(dialogForm);
                        if (false === result) {
                            layer.close(index);
                        }
                    }
                },
                btn: [
                    this.lang('save'),
                    this.lang('cancel')
                ],
                btn1: function (index, layero) {
                    const _add = function () {
                        let dialogForm = layero.get(0);
                        let data = that.serializeObject(dialogForm);

                        // 请求前的回调
                        if (that.isFunction(beforeCallback)) {
                            let result = beforeCallback(dialogForm);
                            if (that.isJsonObject(result)) {
                                data = Object.assign({}, data, result);
                            } else if (false === result) {
                                return false;
                            }
                        }

                        $.post(url, data, function (res) {
                            if (res.code) {
                                // 请求失败后的回调
                                if (that.isFunction(errorCallback)) {
                                    let result = errorCallback(dialogForm, res.data);
                                    if (that.isNonEmptyString(result)) {
                                        layer.msg(result);
                                        return;
                                    } else if (false == result) {
                                        return;
                                    }
                                }
                                layer.msg(res.msg);
                                return;
                            }

                            // 重新加载数据
                            that.loadDataWithSearch(instance);

                            // 请求成功后的回调
                            if (that.isFunction(successCallback)) {
                                let result = successCallback(dialogForm, res.data);
                                if (that.isNonEmptyString(result)) {
                                    layer.msg(result);
                                }
                            }
                        });
                    };

                    if (that.isNonEmptyString(message)) {
                        layer.confirm(message, function (index) {
                            _add();
                            layer.close(index);
                        });
                    } else {
                        _add();
                    }
                },
                btn2: function (index, layero) {
                    layer.close(index);
                }
            });
        },

        // 编辑
        edit: function (instance, params) {
            let table = instance.target.querySelector('table.datagrid-datatable-table');
            if (!table) {
                return;
            }
            let checkedCheckboxs = table.querySelectorAll('tbody tr td input[type="checkbox"][rel="datagrid-primary-checkbox"]:checked');
            if (checkedCheckboxs.length !== 1) {
                layer.msg(this.lang('please select one record'));
                return;
            }

            let record = {};
            let checkbox = checkedCheckboxs[0];
            let checkboxField = checkbox.name;
            let checkboxValue = checkbox.value;
            record[checkboxField] = checkboxValue;

            let tds = checkbox.parentNode.parentNode.parentNode.querySelectorAll('td');
            tds.forEach(function (td) {
                let field = td.dataset.field;
                if (field === checkboxField) {
                    return;
                }
                record[field] = td.innerText;
            });

            let that = this,
                url = params.url,
                template = doc.querySelector(params.form),
                title = params.title,
                width = params.width,
                height = params.height,
                message = params.message,
                prevCallback = params.prev_callback,
                prevErrorCallback = params.prev_error_callback,
                beforeCallback = params.before_callback,
                successCallback = params.success_callback,
                errorCallback = params.error_callback,
                openedCallback = params.opened_callback;
            if (!this.isLikeHTMLElement(template)) {
                this.consoleError(this.lang('form template not found', 'edit'));
                return;
            }
            if (!this.isNonEmptyString(url)) {
                url = instance.configs.url;
            }
            if (width && height) {
                area = [width, height];
            } else if (width) {
                area = width;
            }

            let data = { use: 'edit', id: checkboxValue };

            // 拉取记录前的回调
            if (this.isFunction(prevCallback)) {
                let result = prevCallback(record);
                if (this.isJsonObject(result)) {
                    data = Object.assign({}, data, result);
                } else if (false === result) {
                    return;
                }
            }

            $.get(instance.configs.url, data, function (res) {
                if (res.code) {
                    // 拉取记录失败后的回调
                    if (that.isFunction(prevErrorCallback)) {
                        let result = prevErrorCallback(record, res.data);
                        if (that.isNonEmptyString(result)) {
                            layer.msg(result);
                            return;
                        } else if (false == result) {
                            return;
                        }
                    }
                    layer.msg(res.msg)
                    return;
                }

                let row = res.data.row;
                let form = template.cloneNode(true);
                form.style.display = 'block';

                layer.open({
                    type: 1,
                    resize: false,
                    title: title,
                    area: area,
                    content: form.outerHTML,
                    success: function (layero, index) {
                        let dialogForm = layero.get(0);

                        // 回填数据
                        that.fill(dialogForm, row);

                        // 对话框打开后的回调，如果返回false，则关闭对话框
                        if (that.isFunction(openedCallback)) {
                            let result = openedCallback(dialogForm, row);
                            if (false === result) {
                                layer.close(index);
                            }
                        }
                    },
                    btn: [
                        that.lang('save'),
                        that.lang('cancel')
                    ],
                    btn1: function (index, layero) {
                        const _edit = function () {
                            let dialogForm = layero.get(0);
                            let data = that.serializeObject(dialogForm);

                            // 请求前的回调
                            if (that.isFunction(beforeCallback)) {
                                let result = beforeCallback(dialogForm, row, data);
                                if (that.isJsonObject(result)) {
                                    data = Object.assign({}, data, result);
                                } else if (false === result) {
                                    return false;
                                }
                            }

                            data = Object.assign({}, data, { _method: 'put', id: checkboxValue });
                            $.post(url, data, function (res) {
                                if (res.code) {
                                    // 请求失败后的回调
                                    if (that.isFunction(errorCallback)) {
                                        let result = errorCallback(dialogForm, row, data, res.data);
                                        if (that.isNonEmptyString(result)) {
                                            layer.msg(result);
                                            return;
                                        } else if (false == result) {
                                            return;
                                        }
                                    }
                                    layer.msg(res.msg);
                                    return;
                                }

                                // 重新加载数据
                                that.loadDataWithSearch(instance);

                                // 请求成功后的回调
                                if (that.isFunction(successCallback)) {
                                    let result = successCallback(dialogForm, row, data, res.data);
                                    if (that.isNonEmptyString(result)) {
                                        layer.msg(result);
                                    }
                                }
                            });
                        };

                        if (that.isNonEmptyString(message)) {
                            layer.confirm(message, function (index) {
                                _edit();
                                layer.close(index);
                            });
                        } else {
                            _edit();
                        }
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    }
                });
            });
        },

        // 删除（单条）
        delete: function (instance, params) {
            let table = instance.target.querySelector('table.datagrid-datatable-table');
            if (!table) {
                return;
            }
            let checkedCheckboxs = table.querySelectorAll('tbody tr td input[type="checkbox"][rel="datagrid-primary-checkbox"]:checked');
            if (checkedCheckboxs.length !== 1) {
                layer.msg(this.lang('please select one record'));
                return;
            }

            let record = {};
            let checkbox = checkedCheckboxs[0];
            let checkboxField = checkbox.name;
            let checkboxValue = checkbox.value;
            record[checkboxField] = checkboxValue;

            let tds = checkbox.parentNode.parentNode.parentNode.querySelectorAll('td');
            tds.forEach(function (td) {
                let field = td.dataset.field;
                if (field === checkboxField) {
                    return;
                }
                record[field] = td.innerText;
            });

            let that = this,
                url = params.url,
                message = params.message,
                beforeCallback = params.before_callback,
                successCallback = params.success_callback,
                errorCallback = params.error_callback;
            if (!this.isNonEmptyString(url)) {
                url = instance.configs.url;
            }

            let data = { _method: 'delete', id: checkboxValue };

            // 请求前的回调
            if (this.isFunction(beforeCallback)) {
                let result = beforeCallback(record);
                if (this.isJsonObject(result)) {
                    data = Object.assign({}, data, result);
                } else if (false === result) {
                    return;
                }
            }

            const _delete = function () {
                $.post(url, data, function (res) {
                    if (res.code) {
                        // 请求失败后的回调
                        if (that.isFunction(errorCallback)) {
                            let result = errorCallback(record, res.data);
                            if (that.isNonEmptyString(result)) {
                                layer.msg(result);
                                return;
                            } else if (false == result) {
                                return;
                            }
                        }
                        layer.msg(res.msg)
                        return;
                    }

                    // 重新加载数据
                    that.loadDataWithSearch(instance);

                    // 请求成功后的回调
                    if (that.isFunction(successCallback)) {
                        let result = successCallback(record, res.data);
                        if (that.isNonEmptyString(result)) {
                            layer.msg(result);
                        }
                    }
                });
            };

            if (that.isNonEmptyString(message)) {
                layer.confirm(message, function (index) {
                    _delete();
                    layer.close(index);
                });
            } else {
                _delete();
            }
        },

        // 回填单条数据到表单
        fill: function (form, record) {
            if (this.isNonEmptyString(record)) {
                try {
                    record = JSON.parse(record);
                } catch (e) {
                    return;
                }
            }
            if (!this.isJsonObject(record)) {
                return;
            }

            let inputs = form.querySelectorAll('input,select,textarea');
            inputs.forEach(function (input) {
                let name = input.name,
                    tagName = input.tagName.toLowerCase(),
                    type = input.type.toLowerCase(),
                    value = record[name] || '';

                if (type === 'radio') {
                    input.checked = (input.value == value);
                } else if (type === 'checkbox') {
                    let values = value.split(','),
                        length = values.length;
                    for (let i = 0; i < length; i++) {
                        if (input.value == values[i]) {
                            input.checked = true;
                        }
                    }
                } else if (tagName === 'select') {
                    let options = input.querySelectorAll('option');
                    options.forEach(function (option) {
                        option.selected = (option.value == value);
                    });
                } else {
                    input.value = value;
                }
            });
        },

        // 序列化表单数据，返回json对象格式数据
        serializeObject: function (form) {
            let that = this,
                data = {},
                inputs = form.querySelectorAll('input,select,textarea');
            inputs.forEach(function (input) {
                let name = input.name,
                    value = input.value || '';
                if (!name) {
                    return;
                }

                if (!data[name]) {
                    data[name] = value;
                    return;
                }

                if (!that.isArray(data[name])) {
                    data[name] = [data[name]];
                }
                data[name].push(value);
            });
            return data;
        },

        // 创建HTML元素
        createElement: function (tag, cls) {
            let element = doc.createElement(tag);
            if (this.isArray(cls)) {
                cls.forEach(function (v) {
                    element.classList.add(v);
                });
            } else if (this.isString(cls)) {
                element.classList.add(cls);
            }
            return element;
        },

        // 是否有效的url
        isValidUrl: function (url) {
            return /^(http|https):\/\/(\S+?)$/.test(url);
        },

        // 是否为函数或函数元素组成的数组
        isFunctionArray: function (value) {
            if (this.isFunction(value)) {
                return true;
            }
            if (this.isArray(value)) {
                let that = this, result = true;
                value.forEach(function (v) {
                    result = that.isFunctionArray(v);
                });
                return result;
            }
            return false;
        },

        // 是否为null
        isNull: function (value) {
            return getType(value) === '[object null]';
        },

        // 是否为null
        isUndefined: function (value) {
            return getType(value) === '[object undefined]';
        },

        // 是否是字符串
        isString: function (value) {
            return getType(value) === '[object string]';
        },

        // 是否为非空字符串
        isNonEmptyString: function (value) {
            return this.isString(value) && (this.strip(value).length > 0);
        },

        // 是否为布尔值
        isBoolean: function (value) {
            return getType(value) === '[object boolean]';
        },

        // 是否为数字
        isNumber: function (value) {
            return getType(value) === '[object number]';
        },

        // 是否为数组
        isArray: function (value) {
            return getType(value) === '[object array]';
        },

        // 是否为非空数组
        isNonEmptyArray: function (value) {
            if (!this.isArray(value)) {
                return false;
            }
            return value.length;
        },

        // 是否在数组中
        inArray: function (value, arr) {
            if (!this.isArray(arr)) {
                return false;
            }
            return arr.indexOf(value) !== -1;
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

        // 是否为Table元素对象
        isTableElement: function (value) {
            return getType(value) === '[object htmltableelement]';
        },

        // 去除所有空格后的字符串
        strip: function (str) {
            return str.replace(/[\s]/ig, '');
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
    let datagrid = {

        // 初始化
        init: function (element, opts) {
            _this.create(element, opts);
            return this;
        }

    };

    // 暴露插件
    !('funsent' in window) && (window.funsent = {});
    !('datagrid' in window.funsent) && (window.funsent.datagrid = datagrid);

    if (!noGlobal) {
        window.jQuery = window.$ = jQuery;
    }
    return jQuery;
});
