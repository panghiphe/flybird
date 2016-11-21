<?php
namespace app\weixin\controller;


use app\weixin\Weixincore;
use app\weixin\Weixinvalid;

/**
 * 微信相关主类
 * @author ly-chengminbin
 *
 */
class Weixin extends Weixincore{
    
    public function __construct(){
        if(!isset($_GET['echostr'])){
            parent::__construct();
        }
        
    }
    public function test(){
        session('hello','worldddddd');
        print_r($_SESSION);

        echo 'nothing';
    }
    private function _validWxAPI(){
            $response = new Weixinvalid();
            $response->valid();
            exit();
    }//end func
    /**
     * 根据需求回复WX 内容
     */
    public function response(){
        if(isset($_GET['echostr'])){
            $this->_validWxAPI();
        }
        $this->_responseMsg();
        
    }//end
    
    /**
     * 根据用户交互回复 相关信息
     */
    private function _responseMsg ()
    {
        $msg = new \app\weixin\WeixinResponse();
        $msg->responseMsg();
    }    
    
    
    /**
     * 设置公众号菜单 
     */
    public function createMenu(){
        
    }//end create menu
    
    
}//end