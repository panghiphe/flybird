<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/19
 * Time: 下午2:49
 * woaap 系统开发 接口 转发 微信登录接口
 * 第一步： 获取 woa ackey
 * 第二步： 获取woa access_token
 * 第三步： 获取用户openid
 * 第四步： 获取用户详情 昵称 头像
 *
 */
namespace app\weixin;


use app\initcore\Birdcore;

class Woaap extends Birdcore
{
    // 获取 ACCESS_TOKE URL
    protected $P_accessToken_URL = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential';
    protected $error  = null;
    private $_AppID = WX_APP_ID;
    private $_AppSecret = WOA_APP_KEY;

    protected $woaapUrl = 'http://www.woaap.com';
    protected $woaapApiUrl = "http://api.woaap.com";   //这个url 是在都市丽人 公众号绑定的  调用网页援权需要
    protected $woaackeyApi = '/api/ackey?';    //WX中控系统获取ackey url
    protected $woapAccessTokenApi = '/api/accesstoken?';    //获取 access token api



    /**
     * 自动登录
     */
    public function autologin(){
        $this->getUserOpenid();
    }
    /**
     * 获取 ackey
     */
    public function getWoaAcKey(){
        $uri = $this->woaapUrl.$this->woaackeyApi.'appid='.$this->_AppID.'&appkey='.$this->_AppSecret;
        $memKey = 'woa_ackey';
        $memValue = cache($memKey);
        // 如果 缓存 access_token 未过期 就直接返回值
        if ($memValue !== false) {
            return $memValue;
            exit();
        }
        $result = $this->_http($uri);
        $ret = json_decode($result,true);
        \app\addon\Applog::appLog('logs',['getackey' => $ret]);

        if($ret['errcode'] == '0') {
            cache($memKey, $ret['ackey'], 7000);  //缓存 7000 秒
            return $ret['ackey'];
        }else{

            return null;
        }
    }//end func

    /**
     * 获取用户 openid
     */
    public function getUserOpenid(){
       // $birdUrl = urlencode("http://www.dr-s.cn/bird/index");
        $ackey = $this->getWoaAcKey();
        $code = session('woaap_code');
        $uri = $this->woaapUrl."/api/oauth2-accesstoken?ackey=$ackey&code=$code";
        $result = $this->_http($uri);
        $ret = json_decode($result);
        \app\addon\Applog::appLog('logs',['get_openid' => $ret]);
        if($ret['errcode'] == '0'){
            session('openid',$ret['openid']);
            $this->getUserInfo($ret['openid']);
           // return $ret['openid'];
        }else{
           // return null;
        }
    }//end

    /**
     * 获取 access_token
     *
     * @return {"access_token":"ACCESS_TOKEN","expires_in":7200}
     */
    public function getWoaapAccessToken()
    {
        $memKey = 'woa_access_token';
        $memValue = cache($memKey);

        // 如果 缓存 access_token 未过期 就直接返回值
        if ($memValue !== false) {
            return $memValue;
            exit();
        }
        $ackey = $this->getWoaAcKey();
        if($ackey == null) return null;
        // session 过期了 就重新 获取 access_token
        $url = $this->woaapUrl."/api/accesstoken?ackey=$ackey";

        $ret = $this->_http($url);


        $ret = json_decode($ret,true); // 解释JSON数据
        \app\addon\Applog::appLog('logs',['getwoa_access_token' => $ret]);
        if($ret['errcode'] == '0') {
            cache($memKey, $ret['access_token'], WX_ACCESS_TOKEN_TIME);
            return $ret['access_token'];
        }else{
            return null;
        }
    }//end

    /**
     * 获取用户详情
     * 昵称 头像
     */
    public function getUserInfo($openid){
        $ackey = $this->getWoaAcKey();
        $accessToken = $this->getWoaapAccessToken();
        $uri = $this->woaapUrl."/api/userinfo?ackey=$ackey&openid=$openid&lang=zh_CN&access_token=$accessToken";
        $result = $this->_http($uri);
        $ret = json_decode($result,true);
        \app\addon\Applog::appLog('logs',['getuserinfo' => $ret]);
        if($ret['errcode'] == '0'){
            session('nick_name',$ret['nickname']);   //昵称
            session('user_portrait',$ret['headimgurl']);   //头像
        }else{

        }
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