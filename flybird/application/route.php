<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

use think\Route;

Route::group('bird', function () {
    Route::group('game', function () {
        Route::rule('start', 'index/game/play');
    });
});


return [
    '__pattern__' => [
        'name' => '\w+',
    ],
    /*    '[hello]'     => [
            ':id'   => ['index/hello', ['method' => 'get'], ['id' => '\d+']],
            ':name' => ['index/hello', ['method' => 'post']],
        ],*/


    '[bird]' => [
        'index' => ['index/index/hello'],  // fly bird 首页
        'wc' => ['weixin/weixin/test'],  //微信测试
    ],

    '/' => '/index/index/hello',   //首页
];
