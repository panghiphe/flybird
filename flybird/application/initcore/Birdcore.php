<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/17
 * Time: 下午5:50
 * 核心类
 */
namespace app\initcore;


use app\addon\Dbmysql;
use think\Controller;
header("Content-type: text/html; charset=utf-8");
class Birdcore extends Controller{

    public function _initialize()
    {
        $this->woaapAutologin();
        $this->_loginFromPc();
    }

    /*判断是否满足微信自动登录*/
    protected function wxautologin(){
        if(isset($_GET['code'])){
            $wx = new \app\weixin\Weixinautologin();
            $wx->login();
        }
    }

    /*使用woaap 系统提供的自动登录接口*/
    protected function woaapAutologin(){
        if(isset($_GET['code'])){
            if((session('woaap_code') && (session('woaap_code') != $_GET['code'])) || !session('woaap_code')) {
                session('woaap_code', $_GET['code']);
                $logs['info'] = '调到woa自动登录接口！';
                $logs['code'] = $_GET['code'];
                $logs['file'] = __FILE__;
                $logs['line'] = __LINE__;
                $logs['session_code'] = session('woaap_code');
                \app\addon\Applog::appLog('logs', $logs);
                $woap = new \app\weixin\Woaap();
                $woap->autologin();
                $this->_loginRecord();
            }
        }
    }

    /*判断是否有openid 传输过来*/
    private function _checkOpenid(){
        if(isset($_GET['openid']) && is_string($_GET['openid'])){
            $openid = $_GET['openid'];
            $p = '/[a-zA-Z0-9\/\-]{12,}$/';
            if(preg_match($p,$openid)){
                $this->_loginRecord();
            }else{
                exit('wocao');
            }
        }else{
           // exit('886');
        }
    }//end func
    /**
     * 使用pc 测试时使用
     * 使用参数调用
     */
    private function _loginFromPc(){
        if(isset($_GET['ooo']) && isset($_GET['name'])){
            $openid = trim($_GET['ooo']);
            $nick_name = trim($_GET['name']);
            $p = '/^[a-zA-Z0-9]{5,}$/';    //数字字母组成
            if(!preg_match($p,$nick_name) || !preg_match($p,$openid)){
                exit('wocao');
            }

            session('login',true);
            session('nick_name',$nick_name);
            session('openid',$openid);
            session('user_portrait','/bird/image/bird_portrait.jpg');
            $this->_loginRecord();
        }
    }

    /**
     * 保存用户登录记录
     * 所需三个参数
     * session的, openid ,nick_name, user_portrait
     * @return bool|void
     */
    private function _loginRecord(){
        $openid = session('openid') ? session('openid') : '';


        //用户昵称
        $nick_name = session('nick_name') ? session('nick_name') : '';
        if(empty($openid) || empty($nick_name)){
            return ;
        }
        //用户头像
        $portrait = session('user_portrait') ? session('user_portrait') : '/bird/image/bird_portrait.jpg';
        $ip = getClientIP();
        $pdo = Dbmysql::getInstance();
        if($pdo->pdo === null) return false;

        $sql  = "insert into bird_user_login (nick_name,openid,user_portrait,login_ip)
                 values(:nick_name,:openid,:user_portrait,:ip)";
        $presql = $pdo->pdo->prepare($sql);
        $presql->bindValue(":nick_name",$nick_name);
        $presql->bindValue(":openid",$openid);
        $presql->bindValue(":user_portrait",$portrait);
        $presql->bindValue(":ip",$ip);
        $do = $presql->execute();
        if($do){  //保存成功
            session('login',true);
        }else{
            // 数据库错误
            $err['info'] = '保存用户登录出错!';
            $err['file'] = __FILE__;
            $err['line'] = __LINE__;
            $err['pdo_e'] = $presql->errorInfo();
            \app\addon\Applog::appLog('error',$err);
        }

    }//end


}//end class