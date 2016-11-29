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
        session('game_start_time',date("Y-m-d H:i:s"));
        return ['error' => '0', 'msg' => '游戏时间开始〜开搞!'];
    }

    //游戏结束 记录用户分数
    public function end(){
        $score = input('post.score',0,'int');  //获取游戏分数
        $openid = session('openid');
        $portrait = session('user_portrait');
        $nickname = session('nick_name');
        $beginTime = session('game_start_time');  //游戏开始时间
        $endTime = Date("Y-m-d H:i:s"); //结束时间
        $spendTime = strtotime($endTime) - strtotime($beginTime);

        if($score ==0 || empty($openid) || empty($portrait) || empty($nickname)){
            exit('886');
        }

        $pdo = Dbmysql::getInstance();
        if($pdo->pdo == null){
            return [];
        }


        $sql = "insert into bird_games_record(openid,score,play_begin_time,play_end_time,spend_time)
                values(:openid,:score,:beginTime,:endTime,:spendTime)";
        $presql = $pdo->pdo->prepare($sql);
        $presql->bindValue(":openid",$openid);
        $presql->bindValue(":score",$score);
        $presql->bindValue(":beginTime",$beginTime);
        $presql->bindValue(":endTime",$endTime);
        $presql->bindValue(":spendTime",$spendTime);
        $do = $presql->execute();
        if($do){
            return ['error' => '0', 'msg' => '游戏分数保存成功！'];
        }else{

            return ['error' => '10', 'msg' => '游戏分数保存失败鸟！'];
        }

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