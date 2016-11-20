<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/20
 * Time: 下午1:21
 */
namespace app\weixin;

use app\addon\Applog;

class Weixinautologin extends Weixincore
{
    private $_code = null;
    private $_openid = null;
    private $_unionid = null;
    public function login()
    {
        $this->_code = $_GET['code'];
        $this->_getWxOpenid();
        $this->_getWxHeadImage();

    }//end auto login

    /*
      * 先获取用户OPENID
      */
    private function _getWxOpenid()
    { // 获取用户OPENID 和 UNIONID
        $url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' .
            WX_APP_ID . '&secret=' . WX_APP_SECRET . '&code=' .
            $this->_code . '&grant_type=authorization_code';
        //$ret = file_get_contents($url);
        // 如果使用file_get_contents 获取失败 就改用 curl
        $ret = $this->_http($url);
        $this->_error = $ret;
        $this->_err_url = $url;
        $ret = json_decode($ret);

        /*
         * {
         * "access_token":"ACCESS_TOKEN",
         * "expires_in":7200,
         * "refresh_token":"REFRESH_TOKEN",
         * "openid":"OPENID",
         * "scope":"SCOPE",
         * "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
         * }
         */

        Applog::appLog('wx_autologin', $ret);

        if ($ret->openid) { // 获取openid 就可以确定是 从通过微信菜单点进来的
            session('wx_openapi_login', true); // 加个标记
        }
        $this->_openid = $ret->openid ? $ret->openid : null; // 获取 OPENID
        $this->_unionid = $ret->unionid ? $ret->unionid : ''; // 获取 unionid
        $this->_loginaccess_token = $ret->access_token;

    }

    // 获取用户微信头像
    public function _getWxHeadImage($openid)
    {
        if (!$openid) {
            return;
        }

        $accessToken = $this->getAccessToken();
        $url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$accessToken&openid=$openid&lang=zh_CN";
        //  $info = file_get_contents($url);
        $info = $this->_http($url);
        $head = json_decode($info);
        Applog::appLog('wx_autologin', $head);
        if ($head->headimgurl) {
            session('head_url', $head->headimgurl); // 保存用户头像

        } // end if wx imgurl


    }
}