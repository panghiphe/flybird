<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
/**
 * 获取客户端ip
 */
function getClientIP() {
    $ip = "unknown";
    /*
     * 访问时用localhost访问的，读出来的是“::1”是正常情况。
     * ：：1说明开启了ipv6支持,这是ipv6下的本地回环地址的表示。
     * 使用ip地址访问或者关闭ipv6支持都可以不显示这个。
     */
    if (isset ( $_SERVER )) {
        if (isset ( $_SERVER ["HTTP_X_FORWARDED_FOR"] )) {
            $ip = $_SERVER ["HTTP_X_FORWARDED_FOR"];
        } elseif (isset ( $_SERVER ["HTTP_CLIENT_ip"] )) {
            $ip = $_SERVER ["HTTP_CLIENT_ip"];
        } else {
            $ip = $_SERVER ["REMOTE_ADDR"];
        }
    } else {
        if (getenv ( 'HTTP_X_FORWARDED_FOR' )) {
            $ip = getenv ( 'HTTP_X_FORWARDED_FOR' );
        } elseif (getenv ( 'HTTP_CLIENT_ip' )) {
            $ip = getenv ( 'HTTP_CLIENT_ip' );
        } else {
            $ip = getenv ( 'REMOTE_ADDR' );
        }
    }
    if (trim ( $ip ) == "::1") {
        $ip = "127.0.0.1";
    }
    return $ip;
}