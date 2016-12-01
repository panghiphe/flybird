<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/11/20
 * Time: 下午8:20
 * mysql  数据库类
 */
namespace app\addon;

use app\addon\Applog;

class Dbmysql
{

    public $pdo = null;
    private static $_instance = null;
    public $table;       //要操作的表

    private function __construct()
    {
        $host = MYSQL_DB_HOST;
        $dbname = MYSQL_DB_NAME;
        $user = MYSQL_DB_USER;
        $pas = MYSQL_DB_PASS;
        $port = MYSQL_DB_PORT;
        try {
            $this->pdo = new \PDO("mysql:host=$host;dbname=$dbname;port=$port", $user, $pas);
            $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            $this->pdo->setAttribute(\PDO::ATTR_CASE, \PDO::CASE_UPPER);   //大写
            $this->pdo->query("set names utf8");
        } catch (\PDOException $e) {
            $log_dir = 'pdo_err';
            $data['pdo_err'] = $e->getMessage();
            $data['pdo_e'] = $e->__toString();
            $data['get_wrong'] = '初始化 MYSQL 出错了';
            Applog::appLog($log_dir, $data);
            $this->pdo = null;
        }

    }

    public static function getInstance()
    {
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * 新增数据
     *     * @param array $data 新增的数据字段
     */
    public function add($data = array())
    {
        $i = 0;
        foreach ($data as $k => $v) {
            $str .= $k . '=:' . $k . ',';
            $param[$i]['k'] = ':' . $k;
            $param[$i]['v'] = $v;
            $i++;
        }

        $str = rtrim($str, ',');
        $pre_sql = "insert into $table set " . $str;
        $action_prepare = $this->pdo->prepare($pre_sql);

        //绑定变量
        $i = 0;
        while ($param[$i]) {
            $action_prepare->bindParam($param[$i]['k'], $param[$i]['v']);
            $i++;
        }

        $trans = $this->pdo->beginTransaction();  //事务开始
        $action = $action_prepare->execute();
        $lastId = $this->pdo->lastInsertId();   //获取最后一个ID
        $commit = $this->pdo->commit();     // 提交事务
        if ($trans && $commit) {
            $return['error'] = '20010000';
            $return['id'] = $lastId;
        } else {
            $this->pdo->rollBack();
            $return['error'] = '111';
            $return['errormessage'] = $action_prepare->errorInfo();
        }

        return $return;
    }

    /**
     * PDO prepare
     */
    public function prepareSql($sql)
    {
        return $this->pdo->prepare($sql);
    }
}//end class