<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/19
 * Time: 下午3:03
 */
namespace app\weixin;


class WeixinResponse extends Weixincore{

    /**
     * 根据公众号用户发送的信息 进行自动回复
     *
     */
    public function responseMsg(){
        echo 'hello world';
    }

}