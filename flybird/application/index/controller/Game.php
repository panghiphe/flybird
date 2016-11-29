<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/29
 * Time: 上午8:15
 * 鸟游戏类
 */
namespace app\index\controller;


use app\addon\Dbmysql;
use app\index\Gamestat;
use app\initcore\Birdcore;

class Game extends Birdcore{

    public function play(){
        echo 'hello world~ game begin!';
    }

    //游戏结束 记录用户分数
    public function end(){
        $score = input('post.score',0,'int');  //获取游戏分数
        $openid = session('openid');
        $portrait = session('portrait');
        $nickname = session('nick_name');

        $sql = "insert into bird_games_record()
                values()";

    }
    //游戏排名
    public function rank(){
        $pdo = Dbmysql::getInstance();
        if($pdo->pdo === null){
            return [];
        }

        $sql = "select g.score,g.spend_time,u.nick_name,u.user_portrait
                from bird_games_record g
                left join bird_user_login u
                on u.openid=g.openid
                order by g.score desc limit 20";
        $presql = $pdo->pdo->prepare($sql);
        $do = $presql->execute();
        if($do){
            $result = $presql->fetchAll();
            if(empty($result)){
                return json_encode(['error' => 1,'msg' => '还没有人玩游戏哦，去玩第一个吧！']);
            }else{
                return json_encode(['error' => 0, 'msg' => '排名在此，谁与争锋！','rank' => $result]);
            }
        }else{
            return json_encode(['error' => 2,'msg' => '哎呀，获取排行信息超时了，稍候再点点呗！']);
        }

    }//end func

    //游戏统计数据 -- 管理员才可以用
    public function gameStat(){
        if(session('nick_name') != 'admin'){
            exit('886');
        }
        $game = new Gamestat();
        $game->stat();

    }//end func

}//end class