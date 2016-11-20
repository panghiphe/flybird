<?php
namespace Weixin\Controller;


use Weixin\Weixin;

/**
 * 微信相关主类
 * @author ly-chengminbin
 *
 */
class WeixinController extends Weixin{
    
    public function __construct(){
        if(!isset($_GET['echostr'])){
            parent::__construct();
        }
        
    }
    private function _validWxAPI(){
            $response = new \Weixin\WeixinValid();
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
        $msg = new \Weixin\WeixinResponse();
        $msg->responseMsg();
    }    
    
    
    /**
     * 设置公众号菜单 
     */
    public function createMenu(){
        $m = new \Weixin\WeixinMenu();
        
    }//end create menu
    
    
}//end