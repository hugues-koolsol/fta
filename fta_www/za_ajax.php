<?php
error_reporting(0);
ini_set('display_errors',0);
set_error_handler('errorHandler');
register_shutdown_function('shutdownHandler');
/*
  =====================================================================================================================
  Fonction retourne le nom du type d'erreur
  =====================================================================================================================
*/
function recupTypeErreur($ty){

    $er='UNKNOWN_ERROR';
    $listeDesTypes=array(
        E_STRICT => 'E_STRICT',
        E_USER_NOTICE => 'E_USER_NOTICE',
        E_NOTICE => 'E_NOTICE',
        E_USER_WARNING => 'E_USER_WARNING',
        E_WARNING => 'E_WARNING',
        E_ERROR => 'E_ERROR',
        E_CORE_ERROR => 'E_CORE_ERROR',
        E_COMPILE_ERROR => 'E_COMPILE_ERROR',
        E_USER_ERROR => 'E_USER_ERROR',
        E_RECOVERABLE_ERROR => 'E_RECOVERABLE_ERROR',
        E_CORE_WARNING => 'E_CORE_WARNING',
        E_COMPILE_WARNING => 'E_COMPILE_WARNING',
        E_PARSE => 'E_PARSE'
    );
    
    if(isset($listeDesTypes[$ty])){

        $er=$listeDesTypes[$ty];

    }

    return $er;

}
/*
  =====================================================================================================================
  Fonction appelée quand il y a un problème de traitement, par exemple une division par zéro
  =====================================================================================================================
*/
function errorHandler($error_level,$error_message,$error_file,$error_line,$error_context=array()){

    $error='error : ' . recupTypeErreur($error_level) . " | problème de traitement :" . $error_message . " | line:" . $error_line . " | file:" . basename($error_file) . " (" . $error_file . ")";
    /* , error_context:".str_replace("\r",'',str_replace("\n",'',var_export($error_context,true))); */
    ma_trace($error);

}
/*
  =====================================================================================================================
  Fonction appelée quand il y a un problème dans le source php, par exemple un appel à une fonction que n'existe pas
  ou bien une erreur dans l'écriture du programme
  =====================================================================================================================
*/
function shutdownHandler(){

    $lasterror=error_get_last();
    $nomErreur='UNKNOWN_ERROR';
    
    if(isset($lasterror['type'])){

        $dernier_fichier=str_replace(RACINE_DU_PROJET,'',$lasterror['file']);
        $dernierMessage=str_replace('#','<br />#',str_replace(RACINE_DU_PROJET,'',$lasterror['message']));
        $error='<b>erreur dans un source du serveur</b> : ' . recupTypeErreur($lasterror['type']) . ' problème dans le source <b>"' . $dernier_fichier . '"</b> en ligne <b>"' . $lasterror['line'] . '"</b> <br />';
        $error .= ' message : ' . '<span style="text-wrap:wrap;">' . $dernierMessage . '</span> ';
        /* $error.= '<br />ligne:' . $lasterror['line'] . ' <br /> fichier:' . basename($lasterror['file']) . ' (' . $lasterror['file'] . ')'; */
        ma_trace($error);

    }


}
/* ================================================================================================ */
function ma_trace($error){

    $ret=array( __xst => __xer, __xms => array( $error), __entree => isset($GLOBALS['__entree']) ? $GLOBALS['__entree'] : null);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($ret,JSON_FORCE_OBJECT) ;
    /* on a capturé une erreur de type 500, on force la réponse en 200 */
    http_response_code(200);
    exit(0);

}
/*
  =====================================================================================================================
  ====================== un temps de traitement supérieur à 5 secondes est suspect ====================================
  =====================================================================================================================
*/
set_time_limit(5);
/*#
// simulation d'un traitement supérieur à deux secondes pour mes tests: la fonction password_verify prend du temps
for($i=0;$i<50;$i++){
    password_verify('admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK');
}
*/
/* ================================================================================================ */
require_once('aa_include.php');
initialiser_les_services(false,true);
/*
  if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,PHP_EOL.'========================'.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ .PHP_EOL.'$_POST='.var_export($_POST,true).PHP_EOL.'$_FILES='.var_export($_FILES,true)."\r\n"); fclose($fdtoto);}
  sleep(1);
*/

if(isset($_POST) && sizeof($_POST) > 0 && isset($_POST['ajax_param'])){

    $ret=array(
        /*statut, à priori faux*/
        __xst => __xer,
        /*erreurs*/
        __xms => array(),
        __xsu => array(),
        /*informations*/
        __xif => array(),
        /*alarmes*/
        __xav => array(),
        'signaux' => array()
    );
    /* les messages sont mis en tableau */
    $ret[__entree]=json_decode($_POST['ajax_param'],true);
    $GLOBALS[__entree]=$ret[__entree];
    /*if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,PHP_EOL.'========================'.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ .PHP_EOL.'$ret='.var_export($ret,true).PHP_EOL); fclose($fdtoto);}*/
    
    if(isset($ret[__entree]['call']['funct'])
       && $ret[__entree]['call']['lib'] !== ''
       && $ret[__entree]['call']['file'] !== ''
       && $ret[__entree]['call']['funct'] !== ''
    ){

        define('BNF','/ajax/' . $ret[__entree]['call']['lib'] . '/' . $ret[__entree]['call']['file'] . '.php');
        
        if(!is_file(INCLUDE_PATH . '/ajax/' . $ret[__entree]['call']['lib'] . '/' . $ret[__entree]['call']['file'] . '.php')){

            $ret[__xms][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'programme ajan non trouvé : "' . INCLUDE_PATH . '/ajax/' . $ret[__entree]['call']['lib'] . '/ajax_' . $ret[__entree]['call']['funct'] . '.php"';

        }else{

            
            if(session_status() == PHP_SESSION_NONE){

                session_start();

            }

            
            if($ret[__entree]['call']['funct'] !== ''){

                
                if(true === checkGroupAjaxPages()){

                    require_once(INCLUDE_PATH . '/ajax/' . $ret[__entree]['call']['lib'] . '/' . $ret[__entree]['call']['file'] . '.php');
                    /* appel d'une fonction dont le nom est "$ret[__entree]['call']['funct']" avec comme paramètre : "$ret" */
                    $ret[__entree]['call']['funct']($ret);

                }


            }else{

                
                if(true === checkGroupAjaxPages()){

                    /* inclusion d'un fichier */
                    require_once(INCLUDE_PATH . '/ajax/' . $ret[__entree]['call']['lib'] . '/' . $ret[__entree]['call']['file'] . '.php');

                }

            }

        }


    }else{

        $ret[__xst]=false;
        $ret[__xms][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'les paramètres de l\'appel ajax sont incomplets (lib,file,func) : "' . var_export($ret[__entree],true) . '"';
    }


}else{

    $ret[__xst]=false;
    $ret[__xms][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'ajax_param est absent : "' . var_export($_POST,true) . '"';
}


if(isset($_SESSION[APP_KEY][NAV])){

    $ret['signaux']=$_SESSION[APP_KEY][NAV];
    unset($_SESSION[APP_KEY][NAV]);

}

/*if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,PHP_EOL.'========================'.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ .PHP_EOL.'$ret='.var_export($ret,true).PHP_EOL); fclose($fdtoto);}*/
header('Content-Type: application/json; charset=utf-8');
echo json_encode($ret,JSON_FORCE_OBJECT) ;
exit(0);