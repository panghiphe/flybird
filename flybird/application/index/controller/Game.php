<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/29
 * Time: 上午8:15
 * 鸟游戏类
 */
namespace app\index\controller;


use app\initcore\Birdcore;

class Game extends Birdcore{

    public function play(){
        echo 'hello world~ game begin!';
    }

}