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
        $this->_checkOpenid();
    }

    /*判断是否满足微信自动登录*/
    protected function wxautologin(){
        if(isset($_GET['code'])){
            $wx = new \app\weixin\Weixinautologin();
            $wx->login();
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

    private function _loginRecord(){
        $openid = trim($_GET['openid']);
        if(isset($_GET['nick_name']) && !empty($_GET['nick_name']) && is_string($_GET['nick_name'])){   //用户昵称
            $nick_name = trim($_GET['nick_name']);
        }else{
            $nick_name = '';
        }
        if(isset($_GET['portrait']) && !empty($_GET['portrait']) && is_string($_GET['portrait'])){  //用户头像
            $portrait = $_GET['portrait'];
        }else{
            $portrait = '/bird/image/bird_portrait.jpg';
        }
        $pdo = Dbmysql::getInstance();
        if($pdo->pdo === null) return false;

        $sql  = "insert into bird_user_login (nick_name,openid,user_portrait)
                 values(:nick_name,:openid,:user_portrait)";
        $presql = $pdo->pdo->prepare($sql);
        $presql->bindValue(":nick_name",$nick_name);
        $presql->bindValue(":openid",$openid);
        $presql->bindValue(":user_portrait",$portrait);
        $do = $presql->execute();
        if($do){  //保存成功
            session('login',true);
            session('nick_name',$nick_name);
            session('user_portrait',$portrait);
            session('openid',$openid);
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