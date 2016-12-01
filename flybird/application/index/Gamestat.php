<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/29
 * Time: 下午4:33
 * 游戏统计类
 */
namespace app\index;
class Gamestat extends \app\initcore\Birdcore{
    private  $_rewardUser = 20;  //奖励的玩家数量 默认为 20个

    public function stat(){

    }
    //单次游戏积分排名 大->小
    private function _singleGameScoreRank(){
        $sql = "select * from bird_game_record order by score desc limit 0,$this->_rewardUser";
    }

    //按用户总获取的游戏积分排名
    private function _userScoreRank(){
        $sql = "select u.openid,u.nick_name,u.user_portrait,
                sum(t.score) as score
                from bird_user_login u 
                left join bird_game_record t on 
                u.openid=t.openid
                group by u.openid
                order by t.score desc limit 0,$this->_rewardUser";
    }

    //按用户玩的游戏次数排名
    private function _userGameTimeRank(){
        $sql = "select * from (select u.openid,u.nick_name,u.user_portrait,
                (select count(*) from bird_game_record where openid=u.openid) as game_num
                from bird_user_login u) h
                order by game_num desc limit 0,$this->_rewardUser";
    }

    //统计游戏所有用户总的游戏时间  总的游戏次数  总的获取积分
    private function _gameStatistics(){
        $sql = "select sum(score) as score, sum(spend_time) as total_time,
                (select count(*) from bird_game_record) as total_num
                from bird_game_record";

    }

}