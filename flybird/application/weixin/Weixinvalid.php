<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/19
 * Time: 下午2:51
 * 微信认证类
 * 接入认证服务号时认证
 */
namespace app\weixin;

class Weixinvalid extends Weixincore{

    public function valid(){
        $echoStr = $_GET ["echostr"];

        // valid signature , option
        if ($this->_checkSignature ()) {
            echo $echoStr;
            exit ();
        }

        exit('what thing?');
    }

    /**
     * 验证URL有效性第二个方法
     *
     * @throws Exception
     * @return boolean
     */
    private function _checkSignature() {
        // you must define TOKEN by yourself

        $signature = $_GET ["signature"];
        $timestamp = $_GET ["timestamp"];
        $nonce = $_GET ["nonce"];

        $token = WX_AUTH_TOKEN;
        $tmpArr = array (
            $token,
            $timestamp,
            $nonce
        );
        // use SORT_STRING rule
        sort ( $tmpArr, SORT_STRING ); // 按大到小排序，按字符串
        $tmpStr = implode ( $tmpArr );
        $tmpStr = sha1 ( $tmpStr );

        if ($tmpStr == $signature) {
            return true;
        } else {
            return false;
        }
    }


}