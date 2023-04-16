<?php

// 这是个数据模拟输出的demo

header('Access-Control-Allow-Origin:*');
header("Content-type:application/json");

$page = intval($_GET['page']);
$pagesize = intval($_GET['pagesize']);

// 数据源模拟
$rows = [
    ['id' => 1, 'type_id' => '财务会计', 'realname' => '江**（第一页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 2, 'type_id' => '财务会计', 'realname' => '蒋**（第一页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 3, 'type_id' => '财务会计', 'realname' => '成**（第一页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 4, 'type_id' => '计算机技术', 'realname' => '许**（第一页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 5, 'type_id' => '财务会计', 'realname' => '许**（第一页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 6, 'type_id' => '财务会计', 'realname' => '江**（第一页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 7, 'type_id' => '财务会计', 'realname' => '蒋**（第一页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 8, 'type_id' => '财务会计', 'realname' => '成**（第一页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 9, 'type_id' => '计算机技术', 'realname' => '许**（第一页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 10, 'type_id' => '财务会计', 'realname' => '许**（第一页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 11, 'type_id' => '财务会计', 'realname' => '江**（第一页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 12, 'type_id' => '财务会计', 'realname' => '蒋**（第一页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 13, 'type_id' => '财务会计', 'realname' => '成**（第一页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 14, 'type_id' => '计算机技术', 'realname' => '许**（第一页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 15, 'type_id' => '财务会计', 'realname' => '许**（第一页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 16, 'type_id' => '财务会计', 'realname' => '江**（第一页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 17, 'type_id' => '财务会计', 'realname' => '蒋**（第一页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 18, 'type_id' => '财务会计', 'realname' => '成**（第一页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 19, 'type_id' => '计算机技术', 'realname' => '许**（第一页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 20, 'type_id' => '财务会计', 'realname' => '许**（第一页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 21, 'type_id' => '财务会计', 'realname' => '蒋**（第二页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 22, 'type_id' => '财务会计', 'realname' => '成**（第二页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 23, 'type_id' => '计算机技术', 'realname' => '许**（第二页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 24, 'type_id' => '财务会计', 'realname' => '许**（第二页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 25, 'type_id' => '财务会计', 'realname' => '江**（第二页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 26, 'type_id' => '财务会计', 'realname' => '蒋**（第二页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 27, 'type_id' => '财务会计', 'realname' => '成**（第二页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 28, 'type_id' => '计算机技术', 'realname' => '许**（第二页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 29, 'type_id' => '财务会计', 'realname' => '许**（第二页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 30, 'type_id' => '财务会计', 'realname' => '江**（第二页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 31, 'type_id' => '财务会计', 'realname' => '蒋**（第二页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 32, 'type_id' => '财务会计', 'realname' => '成**（第二页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 33, 'type_id' => '计算机技术', 'realname' => '许**（第二页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 34, 'type_id' => '财务会计', 'realname' => '许**（第二页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 35, 'type_id' => '财务会计', 'realname' => '江**（第二页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 36, 'type_id' => '财务会计', 'realname' => '蒋**（第二页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 37, 'type_id' => '财务会计', 'realname' => '成**（第二页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 38, 'type_id' => '计算机技术', 'realname' => '许**（第二页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 39, 'type_id' => '财务会计', 'realname' => '许**（第二页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 40, 'type_id' => '财务会计', 'realname' => '江**（第二页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 41, 'type_id' => '财务会计', 'realname' => '蒋**（第三页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 42, 'type_id' => '财务会计', 'realname' => '成**（第三页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 43, 'type_id' => '计算机技术', 'realname' => '许**（第三页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 44, 'type_id' => '财务会计', 'realname' => '许**（第三页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 45, 'type_id' => '财务会计', 'realname' => '江**（第三页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 46, 'type_id' => '财务会计', 'realname' => '蒋**（第三页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 47, 'type_id' => '财务会计', 'realname' => '成**（第三页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 48, 'type_id' => '计算机技术', 'realname' => '许**（第三页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 49, 'type_id' => '财务会计', 'realname' => '许**（第三页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 50, 'type_id' => '财务会计', 'realname' => '江**（第三页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 51, 'type_id' => '财务会计', 'realname' => '蒋**（第三页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 52, 'type_id' => '财务会计', 'realname' => '成**（第三页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 53, 'type_id' => '计算机技术', 'realname' => '许**（第三页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 54, 'type_id' => '财务会计', 'realname' => '许**（第三页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 55, 'type_id' => '财务会计', 'realname' => '江**（第三页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 56, 'type_id' => '财务会计', 'realname' => '蒋**（第三页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 57, 'type_id' => '财务会计', 'realname' => '成**（第三页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 58, 'type_id' => '计算机技术', 'realname' => '许**（第三页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 59, 'type_id' => '财务会计', 'realname' => '许**（第三页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 60, 'type_id' => '财务会计', 'realname' => '江**（第三页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 61, 'type_id' => '财务会计', 'realname' => '蒋**（第四页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 62, 'type_id' => '财务会计', 'realname' => '成**（第四页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 63, 'type_id' => '计算机技术', 'realname' => '许**（第四页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 64, 'type_id' => '财务会计', 'realname' => '许**（第四页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 65, 'type_id' => '财务会计', 'realname' => '江**（第四页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 66, 'type_id' => '财务会计', 'realname' => '蒋**（第四页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 67, 'type_id' => '财务会计', 'realname' => '成**（第四页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 68, 'type_id' => '计算机技术', 'realname' => '许**（第四页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 69, 'type_id' => '财务会计', 'realname' => '许**（第四页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 70, 'type_id' => '财务会计', 'realname' => '江**（第四页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 71, 'type_id' => '财务会计', 'realname' => '蒋**（第四页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 72, 'type_id' => '财务会计', 'realname' => '成**（第四页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 73, 'type_id' => '计算机技术', 'realname' => '许**（第四页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 74, 'type_id' => '财务会计', 'realname' => '许**（第四页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 75, 'type_id' => '财务会计', 'realname' => '江**（第四页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 76, 'type_id' => '财务会计', 'realname' => '蒋**（第四页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 77, 'type_id' => '财务会计', 'realname' => '成**（第四页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 78, 'type_id' => '计算机技术', 'realname' => '许**（第四页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 79, 'type_id' => '财务会计', 'realname' => '许**（第四页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 80, 'type_id' => '财务会计', 'realname' => '江**（第四页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 81, 'type_id' => '财务会计', 'realname' => '蒋**（第五页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 82, 'type_id' => '财务会计', 'realname' => '成**（第五页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 83, 'type_id' => '计算机技术', 'realname' => '许**（第五页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 84, 'type_id' => '财务会计', 'realname' => '许**（第五页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 85, 'type_id' => '财务会计', 'realname' => '江**（第五页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 86, 'type_id' => '财务会计', 'realname' => '蒋**（第五页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 87, 'type_id' => '财务会计', 'realname' => '成**（第五页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 88, 'type_id' => '计算机技术', 'realname' => '许**（第五页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 89, 'type_id' => '财务会计', 'realname' => '许**（第五页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 90, 'type_id' => '财务会计', 'realname' => '江**（第五页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 91, 'type_id' => '财务会计', 'realname' => '蒋**（第五页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 92, 'type_id' => '财务会计', 'realname' => '成**（第五页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 93, 'type_id' => '计算机技术', 'realname' => '许**（第五页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 94, 'type_id' => '财务会计', 'realname' => '许**（第五页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 95, 'type_id' => '财务会计', 'realname' => '江**（第五页）', 'mobile' => '1355668****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:00:04', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 96, 'type_id' => '财务会计', 'realname' => '蒋**（第五页）', 'mobile' => '1995741****', 'education_id' => '大学/本科', 'major' => '财务会计', 'update_time' => '2021-06-01 10:42:00', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 97, 'type_id' => '财务会计', 'realname' => '成**（第五页）', 'mobile' => '1355050****', 'education_id' => '大专', 'major' => '财务会计', 'update_time' => '2021-06-01 10:44:55', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
    ['id' => 98, 'type_id' => '计算机技术', 'realname' => '许**（第五页）', 'mobile' => '1553931****', 'education_id' => '大专', 'major' => '计算机技术', 'update_time' => '2021-06-01 10:23:45', 'gender' => '男', 'age' => 31, 'birth' => '1990-03-07'],
    ['id' => 99, 'type_id' => '财务会计', 'realname' => '许**（第五页）', 'mobile' => '1553931****', 'education_id' => '研究生', 'major' => '财务会计', 'update_time' => '2021-07-22 10:07:53', 'gender' => '男', 'age' => 21, 'birth' => '2000-06-01'],
];

// 搜索条件
if ($realname = trim($_GET['realname'] ?? '')) {
    $arr = [];
    for ($i = 0, $cnt = count($rows); $i < $cnt; $i++) {
        $row = $rows[$i];
        if (false !== mb_strpos($row['realname'], $realname)) {
            $arr[] = $row;
        }
    }
    if ($arr) {
        $rows = $arr;
    }
}
if ($mobile = trim($_GET['mobile'] ?? '')) {
    $arr = [];
    for ($i = 0, $cnt = count($rows); $i < $cnt; $i++) {
        $row = $rows[$i];
        if (false !== mb_strpos($row['mobile'], $mobile)) {
            $arr[] = $row;
        }
    }
    if ($arr) {
        $rows = $arr;
    }
}

$wrapper = [
    'code' => 0,
    'msg' => 'success', 
    'data' => [
        'total' => count($rows),
        'rows' => array_slice($rows, ($page - 1) * $pagesize, $pagesize)
    ]
];

echo json_encode($wrapper, JSON_UNESCAPED_UNICODE);