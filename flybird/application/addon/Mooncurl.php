<?php
/**
 * Created by PhpStorm.
 * User: moon
 * Date: 2016/12/5
 * Time: 下午3:40
 * @author ly-chengminbin
 */

namespace app\addon;
use app\addon\Applog;

class Mooncurl
{

    private static $opt = [
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_CONNECTTIMEOUT => API_CONNECT_TIMEOUT, // timeout on connect
        CURLOPT_TIMEOUT => API_RETURN_TIMEOUT
    ]; // timeout on response


    private static $curl = null;

    private static function init()
    {
        if (self::$curl == null)
            self::$curl = curl_init();
    }

    static private function exec()
    {
        BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['info' => '你大爷到1',
            'file' => __FILE__, 'line' => __LINE__
        ]);
        $ch = curl_init();
        curl_setopt_array($ch, self::$opt);
        $data = curl_exec($ch);
        $curl_err = [
            'error' => curl_errno($ch),
            'err_msg' => curl_error($ch),
            'file' => __FILE__,
            'line' => __LINE__,
            'url' => self::$opt[CURLOPT_URL]
        ];
        curl_close($ch);
        if ($data === false) { // 执行错误
            Applog::appLog('curl-error', $curl_err);
            return ['error' => '33', 'errormessage' => '请求失败，请稍候重试哦！'];
        } else {
            if (BIRD_APP_DEBUG) {
                $log_curl = [
                    'url' => self::$opt[CURLOPT_URL],
                    'post-data' => self::$opt[CURLOPT_POSTFIELDS],
                    'return_data' => $data,
                    'return_type' => gettype($data)
                ];
                Applog::appLog('curl-log', $log_curl);
            }
            if (empty($data) || $data == false) {
                $data = [
                    'error' => '1008110',
                    'errormessage' => '请求失败，请稍候重试！'
                ];
            } else
                if (is_string($data) && json_decode($data, true)) {
                    return json_decode($data, true);
                }
            return $data;
        }
    }

    /**
     * post 方法
     *
     * @param string $url
     * @param string $data
     * @param string $config
     * @return multitype:string mixed
     */
    public  function curlPost($url = '', $data = '', $config = '')
    {

        if (is_string($url) && (stripos($url, 'http') === false)) {
            BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['curl-url' => $url]);
            return;
            //$url = APP_SERV_ROUTE . $url;
        }
        BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['info' => '艹1212', 'data' => $data,
            'file' => __FILE__, 'line' => __LINE__
        ]);
        self::$opt[CURLOPT_POST] = 1;
        self::$opt[CURLOPT_URL] = $url;
        if (is_array($data) && !empty($data)) {
            try{
                self::$opt[CURLOPT_POSTFIELDS] = http_build_query($data);

            }catch (\Exception $e){
                BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['info' => '艹出错', 'data' => $data,
                    'file' => __FILE__, 'line' => __LINE__,'err' => $e->getMessage()
                ]);
                self::$opt[CURLOPT_POSTFIELDS] = $data;
            }

        } else {
            self::$opt[CURLOPT_POSTFIELDS] = $data;
        }
        //log 3
        BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['info' => '艹1212', 'data' => $data,
            'file' => __FILE__, 'line' => __LINE__
        ]);
        if (is_string($data) && !empty($data)) {
            self::$opt[CURLOPT_HTTPHEADER] = [
                'Content-Type: application/json; charset=utf-8',
                'Content-Length: ' . strlen($data)
            ];
        }
        // log 4
        BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['info' => '艹1212', 'data' => $data,
            'file' => __FILE__, 'line' => __LINE__
        ]);
        if (is_array($config)) {
            array_merge(self::$opt, $config);
        }
        // log 5
        BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['info' => '艹1212', 'data' => $data,
            'file' => __FILE__, 'line' => __LINE__
        ]);

        BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['info' => '艹艹', 'data' => $data,
            'file' => __FILE__, 'line' => __LINE__
        ]);
        try {
            return self::exec();

        } catch (\Exception $e) {
            BIRD_APP_DEBUG && \app\addon\Applog::appLog('logs', ['info' => '你大爷出错了', 'data' => $data,
                'file' => __FILE__, 'line' => __LINE__,
                'error' => $e->getMessage()
            ]);

        }
    }
    // end function

    /**
     * get 方法
     *
     * @param string $url
     * @param string $data
     * @param string $config
     */
    public function curlGet($url = '', $data = '', $config = '')
    {
        if (is_string($url) && (stripos($url, 'http') === false)) {
            $url = APP_SERV_ROUTE . $url;
        }
        if (is_array($data)) {
            $url = $url . '?' . http_build_query($data);
        }
        self::$opt[CURLOPT_URL] = $url;
        if (is_array($config)) {
            array_merge(self::$opt, $config);
        }
        if (BIRD_APP_DEBUG) {
            $log['curl_url'] = $url;
            $log['curl_opts'] = self::$opt;
            Applog::appLog('curl-log', $log);
        }
        return $this->exec();
    } // end function
}//end class