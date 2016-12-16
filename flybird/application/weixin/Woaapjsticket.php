<?php
namespace app\weinxin;
use app\weixin\Woaap;

/**
 * 微信JS API 专用类
 * @author ly-chengminbin
 *
 */
class Woaapjsticket extends Woaap
{


    public function getSignPackage()
    {

        $jsapiTicket = $this->getWoaapJsApiTicket();

        // 注意 URL 一定要动态获取，不能 hardcode.
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ||
            $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        //   $url = LYCAR_URL."$_SERVER[REQUEST_URI]";
        $timestamp = time();
        $nonceStr = $this->createNonceStr();

        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

        $signature = sha1($string);

        $signPackage = array(
            "appId" => WX_APP_ID,
            "nonceStr" => $nonceStr,
            "timestamp" => $timestamp,
            "url" => $url,
            "signature" => $signature,
            "rawString" => $string
        );
        return $signPackage;
    }

    private function createNonceStr($length = 16)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }

    /**
     * 获取WOAAP 系统 JS TICKET
     * @return mixed
     */
    private function getWoaapJsApiTicket()
    {
        // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
        // $data = json_decode(file_get_contents("jsapi_ticket.json"));
        $uri = $this->woaapUrl.'/api/jsticket?ackey=';

        $ackey = $this->getWoaAcKey();   //获取ACKEY

        $url = $uri . $ackey;
        $result = json_decode($this->_http($uri), true);
        \app\addon\Applog::appLog('logs', ['获取JS_TICKET' => $result, 'apiurl' => $url, 'file' => __FILE__, 'line' => __LINE__]);

        if ($result['errcode'] == 0) {
            return $result['js_ticket'];
        }
        return 'null';
    }//end func


}

