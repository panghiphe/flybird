<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/19
 * Time: 下午2:49
 * 微信核心类  用于认证服务号开发
 *
 */
namespace app\weixin;


use app\initcore\Birdcore;

class Weixincore extends Birdcore
{
    // 获取 ACCESS_TOKE URL
    protected $P_accessToken_URL = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential';
    protected $error  = null;

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 获取 access_token
     *
     * @return {"access_token":"ACCESS_TOKEN","expires_in":7200}
     */
    public function getAccessToken()
    {
        $memKey = 'wx_access_token';
        $memValue = cache($memKey);

        // 如果 缓存 access_token 未过期 就直接返回值
        if ($memValue !== false) {
            return $memValue;
            exit();
        }
        // session 过期了 就重新 获取 access_token
        $url = "$this->P_accessToken_URL&appid=$this->_AppID&secret=$this->_AppSecret";
        $ret = $this->_http($url);


        $ret = json_decode($ret); // 解释JSON数据
        cache($memKey, $ret->access_token, WX_ACCESS_TOKEN_TIME);
        return $ret->access_token;
    }
    /**
     * 发送HTTP请求方法，目前只支持CURL发送请求
     *
     * @param string $url
     *            请求URL
     * @param array $params
     *            请求参数
     * @param string $method
     *            请求方法GET/POST
     * @param boolean $ssl
     *            是否进行SSL双向认证
     * @return json $data 响应数据
     * @author
     *
     */
    protected function _http ($url, $params = '', $method = 'GET')
    {
        $opts = array(
            CURLOPT_TIMEOUT => 30,
            CURLOPT_RETURNTRANSFER => 1, // 配置信息 取回结果
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        );
        /* 根据请求类型设置特定参数 */
        switch (strtoupper($method)) {
            case 'GET':
                if(!empty($params)){
                    $url .= http_build_query($params);
                }
                $opts[CURLOPT_URL] = $url;
                break;
            case 'POST':
                $opts[CURLOPT_URL] = $url;
                $opts[CURLOPT_POST] = 1;
                $opts[CURLOPT_POSTFIELDS] = $params;
                break;
        }

        /* 初始化并执行curl请求 */
        $ch = curl_init();
        curl_setopt_array($ch, $opts);
        $data = curl_exec($ch);
        $err = curl_errno($ch); // 错误编码
        $errmsg = curl_error($ch); // 错误信息
        curl_close($ch);
        if ($err > 0) {
            $this->error = $errmsg;
            return false;
        } else {
            return $data;
        }
    }

}