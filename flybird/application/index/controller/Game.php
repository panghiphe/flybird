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
use app\addon\Mooncurl;

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
            //在这里加个向商城加积分的接口
            $this->_addGameScoreToWoaap($score);
            return ['error' => '0', 'msg' => '游戏分数保存成功！'];
        }else{

            return ['error' => '10', 'msg' => '游戏分数保存失败鸟！'];
        }

    }
    /**
     * 调用商城积分接口
     * 增加游戏积分
     * @return array
     */
    private function _addGameScoreToWoaap($score){
        $apiurl = 'http://dslrweishop.woaap.com';   //正式环境
        $uri = '/Activity/postUserIntegByActivity';

        $activity_name = 'dslr_bra_city';
        $activity_no = 'c6489851300d951760f52800481cb0f5';
        $now_time = time();

        $activity_str = md5($activity_no) + md5($activity_name) + md5($now_time);
        $activity_str = sha1($activity_str);

        $data['openid'] = session('openid');
        $data['integ'] = $score;
        $data['avtivity_name'] = $activity_name;
        $data['cur_date'] = $now_time;
        $data['avtivity_str'] = $activity_str;

        $ret = Mooncurl::curlPost($apiurl.$uri,$data);
        BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs',['info' => '调用商城积分接口','result' => $ret,
            'file' => __FILE__, 'line' => __LINE__, 'send_data' => $data
        ]);
    }

    //游戏排名
    public function rank(){
        $pdo = Dbmysql::getInstance();
        if($pdo->pdo === null){
            return [];
        }

        $sql = "select g.score,g.spend_time,u.nick_name,u.user_portrait
                from bird_games_record g
                inner join (select DISTINCT openid,nick_name,user_portrait from bird_user_login) u
                on u.openid=g.openid
                order by g.score desc limit 20";
        $presql = $pdo->pdo->prepare($sql);
        $do = $presql->execute();
        if($do){
            $result = $presql->fetchAll();
            if(empty($result)){
                return ['error' => 1,'msg' => '还没有人玩游戏哦，去玩第一个吧！'];
            }else{
                return ['error' => 0, 'msg' => '排名在此，谁与争锋！','rank' => $result];
            }
        }else{
            return ['error' => 2,'msg' => '哎呀，获取排行信息超时了，稍候再点点呗！'];
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