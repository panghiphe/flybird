<?php
namespace app\index\controller;

use app\initcore\Birdcore;
use app\weinxin\Woaapjsticket;

class Index extends Birdcore
{


    /**
     * fly bird 首页
     */
    public function hello(){

      //  $wxkey = new Woaapjsticket();
       // $this->assign('wxkey',$wxkey);
        return $this->fetch('hello');
    }




}
