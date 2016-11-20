<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/17
 * Time: 下午5:50
 * 核心类
 */
namespace app\initcore;


use think\Controller;

class Birdcore extends Controller{

    public function _initialize()
    {
        $this->wxautologin();
    }

    /*判断是否满足微信自动登录*/
    protected function wxautologin(){
        if(isset($_GET['code'])){
            $wx = new \app\weixin\Weixinautologin();
            $wx->login();
        }
    }

}