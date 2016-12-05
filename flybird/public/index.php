<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// [ 应用入口文件 ]
ini_set('mem_memory','128M');    //加大内存  脚本运行的
ini_set('session.name', 'helloseemybrafly');

define('APP_BIRD_ROOT',dirname(__DIR__));  //站点根目录  index.php 文件的上级目录
define('APP_HTML_ROOT',APP_BIRD_ROOT.'/html/');  // html 文件夹

define('BIRD_APP_DEBUG',true);  //调试模式

//公众号  app_id
define('WX_APP_ID','wx33c182aa7e4ad93c');
//公众号  app_secret_key
//define('WX_APP_SECRET','60e8afbf3c40b459076118a997bdcae2');
define('WOA_APP_KEY','60625d1a7c03885ea28dc5f4fb430965');
define('WX_AUTH_TOKEN','gzyzlapp');
define('WX_ACCESS_TOKEN_TIME',7100);

/**
 * @Moonevil    APPID:wx33c182aa7e4ad93c    APPKEY：60625d1a7c03885ea28dc5f4fb430965    请查收
 */
//数据库配置
define('MYSQL_DB_HOST','localhost');
define('MYSQL_DB_NAME','drsoft');
define('MYSQL_DB_USER','drs');
define('MYSQL_DB_PASS','drs');
define('MYSQL_DB_PORT',3306);

define('LY_LOG_PATH',APP_BIRD_ROOT.'/log/');
// 定义应用目录
define('APP_PATH', __DIR__ . '/../application/');
// 加载框架引导文件
require __DIR__ . '/../thinkphp/start.php';
