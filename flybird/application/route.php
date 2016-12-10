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
        Route::rule('start', 'index/game/play');  // 开始游戏
        Route::rule('end','index/game/end','POST');   //游戏玩完
        Route::rule('rank','index/game/rank');  // 游戏排名
        Route::rule('share','index/game/share');   //游戏分享链接
    });
});

Route::miss('index/index/world');    //空路由
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
    '__miss__'  =>   'index/index/world',   //其它路由
];
