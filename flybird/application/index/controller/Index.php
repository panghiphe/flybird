<?php
namespace app\index\controller;

use app\initcore\Birdcore;

class Index extends Birdcore
{


    /**
     * fly bird 首页
     */
    public function hello(){

        return $this->fetch('hello');
    }



    public function world(){
        return 'hello little bird! welcome!';
    }
}
