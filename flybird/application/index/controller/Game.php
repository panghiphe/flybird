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
use app\addon\Applog;

class Game extends Birdcore{

    public function play(){
        session('game_start_time',date("Y-m-d H:i:s"));
        return ['error' => '0', 'msg' => '游戏时间开始〜开搞!'];
    }

    //游戏结束 记录用户分数
    public function end(){
        if(!IS_AJAX){
            exit('how bored you are!');
        }
        $score = input('post.score',0,'int');  //获取游戏分数
        (!is_numeric($score) || $score <0 )&& $score  = 0;
        $openid = session('openid');
        $portrait = session('user_portrait');
        $nickname = session('nick_name');
        $beginTime = session('game_start_time');  //游戏开始时间
        $endTime = Date("Y-m-d H:i:s"); //结束时间
        $spendTime = strtotime($endTime) - strtotime($beginTime);
        $braNum = input('post.bra_num',0,'int');  //游戏获得bra 数量
        (!is_numeric($braNum) || $braNum < 0 )&& $braNum = 0;

        if( empty($openid) || empty($portrait) || empty($nickname)){
            exit('886');
        }

        //返回历史最高分
        $maxscore = $this->_getUserMaxScore();

        if($score ==0){
            return ['error' => '0', 'max' => $maxscore, 'msg' => '历史最高分！OH YEAH!',];
        }



        $pdo = Dbmysql::getInstance();
        if($pdo->pdo == null){
            return [];
        }

        //增加游戏记录
        $sql = "insert into bird_games_record(openid,score,play_begin_time,play_end_time,spend_time,bra_num)
                values(:openid,:score,:beginTime,:endTime,:spendTime,:braNum)";
        $presql = $pdo->pdo->prepare($sql);
        $presql->bindValue(":openid",$openid);
        $presql->bindValue(":score",$score);
        $presql->bindValue(":beginTime",$beginTime);
        $presql->bindValue(":endTime",$endTime);
        $presql->bindValue(":spendTime",$spendTime);
        $presql->bindValue(":braNum",$braNum);

        //增加分享链接
        $shareSql = "insert into bird_games_share(openid,score,max_score,bra_num)
                      values(:openid,:score,:max_score,:braNum);";
        $preShareSql = $pdo->pdo->prepare($shareSql);
        $preShareSql->bindValue(":openid",$openid);
        $preShareSql->bindValue(":score",$score);
        $preShareSql->bindValue(":max_score",$maxscore);
        $preShareSql->bindValue(":braNum",$braNum);
        $do = $presql->execute();
        $doShare = $preShareSql->execute();

        if($do && $doShare){
            //在这里加个向商城加积分的接口
            $this->_addGameScoreToWoaap($score);

            $shareid = $pdo->pdo->lastInsertId();
            $url = 'http://www.dr-s.cn/bird/game/share?id='.$shareid;
            return ['error' => '0', 'max' => $maxscore, 'msg' => '游戏分数保存成功！','shareUrl' => $url];
        }else{

            return ['error' => '10', 'max' => '0', 'msg' => '游戏分数保存失败鸟！'];
        }

    }

    /**
     * 获取用户历史最高积分
     * @return mixed $score  分数
     */
    private function _getUserMaxScore(){
        $pdo = Dbmysql::getInstance();
        if($pdo->pdo == null){
            return '0';
        }
        $sql = "select score from bird_games_record where openid=:openid order by score desc limit 1";
        $presql = $pdo->pdo->prepare($sql);
        $presql->bindValue(":openid",session('openid'));
        try{
            $do = $presql->execute();   //执行
            if($do){
                $result = $presql->fetchAll();
                return isset($result[0]['SCORE'])?$result[0]['SCORE']: '0';

            }else{
                Applog::appLog('error',['info' => '查询用户历史最高分出错,sql 执行失败',
                    'file' => __FILE__, 'line' => __LINE__,
                    'sql' => $sql,
                    'presql' => $presql,
                    'err' => $presql->errorInfo()]);
                return '0';
            }
        }catch (\Exception $e){
            Applog::appLog('error',['info' => '查询用户历史最高分出错',
                'file' => __FILE__, 'line' => __LINE__,
                'err' => $e->getMessage()]);
            return '0';
        }
    }
    /**
     * 调用商城积分接口
     * 增加游戏积分
     * @return array
     */
    private function _addGameScoreToWoaap($score){
        $apiurl = 'http://dslrweishop.woaap.com';   //正式环境
        $uri = '/api/Activity/postUserIntegByActivity';

        $activity_name = 'dslr_bra_city';
        $activity_no = 'c6489851300d951760f52800481cb0f5';
        $now_time = time();

        $activity_str = md5($activity_no) + md5($activity_name) + md5($now_time);
        $activity_str = sha1($activity_str);

        $data['openid'] = session('openid');
        $data['integ'] = (int)$score;
        $data['avtivity_name'] = $activity_name;
        $data['cur_date'] = $now_time;
        $data['avtivity_str'] = $activity_str;

        $ret = Mooncurl::curlPost($apiurl.$uri,$data);
        BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs',['info' => '调用商城积分接口','result' => $ret,
            'file' => __FILE__, 'line' => __LINE__, 'send_data' => $data,'api' => $apiurl.$uri
        ]);
    }

    //游戏排名
    public function rank(){
        $pdo = Dbmysql::getInstance();
        if($pdo->pdo === null){
            return [];
        }
        $page = input('get.page',1,'int');
        $page = (int)$page;
        $pagesize = 10;
       // $startRow = ($page-1)*$pagesize;
        $startRow = 0;
        $sql = "select g.score,g.spend_time,u.nick_name,u.user_portrait
                from bird_games_record g
                inner join (select DISTINCT openid,nick_name,user_portrait from bird_user_login) u
                on u.openid=g.openid
                order by g.score desc limit $startRow,$pagesize";
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

    //游戏分享链接
    public function share(){
        $id = input('get.id',0,'int');
        if($id == 0){
            exit();
        }
        $pdo = Dbmysql::getInstance();
        if($pdo->pdo === null){
            $data = ['score' => '0', 'max_score' => '0', 'openid' => '','bra_num' => 0];
        }else{
            $sql = "select * from bird_games_share where share_id=:id";
            $presql = $pdo->pdo->prepare($sql);
            $presql->bindValue(":id",$id);
            $do = $presql->execute();
            if($do){
                $result = $presql->fetchAll();
                if(empty($result)){
                    $data = ['score' => '0', 'max_score' => '0', 'openid' => '','bra_num' => 0];
                }else{
                    $data = ['score' => $result[0]['SCORE'], 'max_score' => $result[0]['MAX_SCORE'],
                        'openid' => $result[0]['OPENID'],'bra_num' => $result[0]['BRA_NUM']];
                }
            }else{
                $data = ['score' => '0', 'max_score' => '0', 'openid' => '','bra_num' => 0];
            }
        }//end if

        $this->assign('score',$data['score']);
        $this->assign('max_score',$data['max_score']);

        return $this->fetch('share');
    }
}//end class