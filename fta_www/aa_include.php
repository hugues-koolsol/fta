<?php
date_default_timezone_set('Europe/Paris');
define('APP_KEY','fta');
define('PREFIXE_REPERTOIRES','fta');
define('RACINE_DU_PROJET',realpath(dirname(__FILE__,2)));
define('INCLUDE_PATH',RACINE_DU_PROJET.DIRECTORY_SEPARATOR.PREFIXE_REPERTOIRES.'_inc');
define('BACKUP_PATH',RACINE_DU_PROJET.DIRECTORY_SEPARATOR.PREFIXE_REPERTOIRES.'_backup');
define('LIEN_BDD','LIEN_BDD');
define('BDD','BDD');
$GLOBALS[BDD]=array();
define('NAV','NAV');
/*
PHP_EOL = \r\n
*/
define('CRLF',"\r\n");
define('OK','OK');
define('MESSAGES','messages');
define('INPUT','input');
define('VALUE','value');
define('STATUS','status');
define('TAILLE_MAXI_SOURCE',512000);
define('ENCRYPTION_DONNEES_EN_PLUS',base64_encode('une_valeur_très_compliquée_et_"suffisament"_longue'));
define('ENCRYPTION_METHODE','aes-256-cbc');
$GLOBALS['__date']=date('Y-m-d H:i:s');


/*===================================================================================================================*/
function initialiser_les_services($initialiser_session,$initialiser_bdd){
  if($initialiser_bdd===true){
      /*
        il peut y avoir plusieurs bases sqlite rattachées à une seule connexion
        On ouvre donc une connexion "neutre" et on rattache les bases
      */
      
      require_once('../fta_inc/db/__liste_des_acces_bdd.php');
      /*
      'fournisseur'
      */
      $sqlite_trouve=false;
      foreach($GLOBALS[BDD] as $k1=>$v1){
          if($v1['fournisseur']==='sqlite' && $sqlite_trouve===false){
              $db0 = new SQLite3('');
              $sqlite_trouve=true;
          }
      }
      
      $ret=$db0->exec('PRAGMA encoding = "UTF-8";PRAGMA foreign_keys=1;');
      if($ret===false){
          echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
      }
      

      foreach($GLOBALS[BDD] as $k1=>$v1){
          define('BDD_'.$v1['id'],$v1['id']);
          $GLOBALS[BDD][$k1][LIEN_BDD]=$db0;
          /*
            l'initialisation permet de déclencher par exemple
            attach database "C:\\...chemin...\\fta_inc\db\\sqlite\\system.db" as "system.db"
          */
          $sql0=$v1['initialisation'];
          $ret0=$db0->exec($sql0);
      }
  }
  if($initialiser_session===true){
      session_start();
  }
}

/*===================================================================================================================*/

function sauvegarder_et_supprimer_fichier($chemin_du_fichier,$ne_pas_faire_de_copie=false){

    /*
      
      Il n'y a qu'ici qu'on trouve unlink.
      Quand on crée un fichier temporaire et qu'on le supprime, on ne fait pas de copie dans le répertoire BACKUP_PATH
    */

    if(($ne_pas_faire_de_copie)){

        if(is_file($chemin_du_fichier)){
         
            if((@unlink($chemin_du_fichier))){

                return(true);

            }
        }


    }else{

        $repertoire=BACKUP_PATH.DIRECTORY_SEPARATOR.date('Y/m/d');

        if((is_dir($repertoire) || mkdir($repertoire,511,true))){

            $chemin_fichier_copie=$repertoire.DIRECTORY_SEPARATOR.uniqid().str_replace('\\','_',str_replace('/','_',$chemin_du_fichier));

            if((@copy($chemin_du_fichier,$chemin_fichier_copie))){


                if((@unlink($chemin_du_fichier))){

                    return(true);

                }


            }


        }

    }

    return(false);

}

/*
=====================================================================
quand un champ de recherche contient des id, ils sont séparés par des virgules 
par exemple, 1,2,3  , le where doit être sous la forme WHERE id in ( 1 , 2 , 3 )
*/
function construction_where_sql_sur_id($nom_du_champ,$critere){

    $champ_where='';
    if(strpos($critere,',')!==false){
        $tableau_liste_des_valeurs=explode(',',$critere);
        $chaine_recherche='';
        foreach($tableau_liste_des_valeurs as $k1=>$v1){
            if(is_numeric($v1)){
                $chaine_recherche.=','.$v1;
            }
        }
        if($chaine_recherche!==''){
            $chaine_recherche=substr($chaine_recherche,1);
            $champ_where.='AND '.sq0($nom_du_champ).' in ('.sq0($chaine_recherche).')';
        }    
     
    }else{
        if(is_numeric($critere)){
            $champ_where.='AND '.sq0($nom_du_champ).' = '.sq0($critere).'';
        }
    }

    return $champ_where;
}


/*
  =====================================================================================================================
*/
function construire_navigation_pour_liste($__debut , $__nbMax , $__nbEnregs , $consUrlRedir , $boutons_avant=''){
   $o1='';

   $__bouton_enregs_suiv=' <a class="yyunset">&raquo;</a>';

   if(($__debut+$__nbMax < $__nbEnregs)){

       $__bouton_enregs_suiv=' <a href="'.BNF.'?__xpage='.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).$consUrlRedir.'">&raquo;</a>';

   }

   $__bouton_enregs_prec=' <a class="yyunset">&laquo;</a>';

   if(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

       $__bouton_enregs_prec=' <a href="'.BNF.'?__xpage='.($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']-1).$consUrlRedir.'">&laquo;</a>';

   }

   if(($__nbEnregs > 0)){

       $o1.='<form class="yylistForm1">';
       $o1.=$boutons_avant;
       $o1.=' '.$__bouton_enregs_prec.' '.$__bouton_enregs_suiv.' <div style="display:inline-block;">';
       $o1.='page '.number_format((($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)),0,',' , ' ').'/'.number_format(ceil($__nbEnregs/($__nbMax)),0,',' , ' ').' ('.number_format($__nbEnregs,0,',' , ' ').' enregistrements )</div>'.CRLF;
       $o1.='</form>';

   }else{

       $o1.='<form class="yylistForm1 yyavertissement">';
       $o1.=$boutons_avant;
       $o1.='Aucun enregistrement trouvé</form>'.CRLF;
   }

 
 
 return $o1; 
}


/*
  =====================================================================================================================
*/
function bouton_retour_a_la_liste($url){
  return '<a id="__retour_a_la_liste" href="'.$url.'" title="retour à la liste">&nbsp;⬱&nbsp;</a>';
}

/*===================================================================================================================*/

function recharger_la_page($a){

    header("HTTP/1.1 303 See Other");
    header('Location: '.$a);
    exit(0);

}
/*
  
  =====================================================================================================================
  Utilitaire pour repérer les chaines de caractères qui contiennent du html quand on fait du rev
  =====================================================================================================================
*/

function htmlDansPhp($s){

    return($s);

}
/*===================================================================================================================*/

function checkGroupAjaxPages(){

    return(true);

}
/*
  
  =====================================================================================================================
*/

function le_dossier_est_vide($dossier){


    if((is_dir($dossier))){

        return(count(scandir($dossier))==2);

    }else{

        return(true);
    }


}
/*===================================================================================================================*/

function pushkv(&$a,$k,$v){

    $a[$k]=$v;

}
/*===================================================================================================================*/

function concat(...$ps){

    $t='';
    foreach($ps as $p){
        $t.=$p;
    }
    return($t);

}
/*========================================================================================================================*/

function cleanSession1(){


    if((isset($_GET['idMenu']) && is_numeric($_GET['idMenu']))){

        xcleanSession1(array( 'except' => ''));

    }else{

        xcleanSession1(array( 'except' => BNF));
    }


}
/*========================================================================================================================*/

function xcleanSession1($par){


    if((isset($_SESSION[APP_KEY][NAV]))){

        foreach($_SESSION[APP_KEY][NAV] as $k => $v){

            if(($par['except'] != $k)){

                unset($_SESSION[APP_KEY][NAV][$k]);

            }

        }

    }


    if((isset($_SESSION[APP_KEY]['choose']))){

        unset($_SESSION[APP_KEY]['choose']);

    }


}
/*========================================================================================================================*/

function recuperer_et_sauvegarder_les_parametres_de_recherche($k,$bnf){

    /*
      
      on veut garder les paramètres de navigation des pages
    */

    if(( !(isset($_SESSION[APP_KEY]['__filtres'][BNF])))){

        $_SESSION[APP_KEY]['__filtres'][BNF]=array();
        $_SESSION[APP_KEY]['__filtres'][BNF]['champs']=array( '__xpage' => 0);

    }


    if(( !(isset($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'])))){

        $_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']=0;

    }

    $ret='';
    $ret=$_GET[$k]??'';

    if((isset($_GET[$k]))){

        /* si on a changé un critère de recherche, il faut revenir à la première page */

        if((isset($_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k]) && $_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k] !== $_GET[$k])){

            $_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']=0;

        }

        $_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k]=$_GET[$k];
        $ret=$_GET[$k];

    }else if((isset($_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k]))){


        if((isset($_GET['idMenu']) && '__xpage' === $k)){

            $_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k]=0;
            $ret=0;

        }else{

            $ret=$_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k];
        }


    }else{

        $ret='';

        if(('__xpage' === $k)){

            $ret=0;

        }

    }

    return($ret);

}
/*========================================================================================================================*/

function enti1($s){

    return(htmlentities($s,ENT_COMPAT,'utf-8'));

}
/*========================================================================================================================*/

function sq0($s){

    $s=SQLite3::escapeString($s);
    $ua=array(
        'à' => 'à',
        'â' => 'â',
        'ã' => 'ã',
        'á' => 'á',
        'é' => 'é',
        'è' => 'è',
        'ê' => 'ê',
        'É' => 'É',
        'ï' => 'ï',
        'î' => 'î',
        'ñ' => 'ñ',
        'Ñ' => 'Ñ',
        'ó' => 'ó',
        'ô' => 'ô',
        'ö' => 'ö',
        'ü' => 'ü',
        'Ü' => 'Ü');
    return(strtr($s,$ua));

}
/*
  =====================================================================================================================
  pour les programmes sources, il ne faut pas transformer les caractères "bizarres" 
  pour pouvoir intégrer la fonction sq0 çi dessus
*/

function sq1($s){
    return(SQLite3::escapeString($s));
}
/*
  
  ========================================================================================
*/

function signaler_erreur($tab){


    if((isset($tab['provenance']) && $tab['provenance'] !== '')){

        ajouterMessage('erreur',$tab['message'],$tab['provenance']);

    }else{

        ajouterMessage('erreur',$tab['message']);
    }

    return($tab);

}
/*
  
  =====================================================================================================================
*/

function ajouterMessage($type_de_message,$message,$page=''){


//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
    $tableauTypeMessage=array(
        'normal',
        'succes',
        'info',
        'erreur',
        'danger',
        'avertissement');

    if(($page === '')){


        if(( !(isset($_SESSION[APP_KEY][NAV])))){

            foreach($tableauTypeMessage as $v1){
                $_SESSION[APP_KEY][NAV][$v1]=array();
            }

        }


        if((in_array($type_de_message,$tableauTypeMessage))){

            $_SESSION[APP_KEY][NAV][$type_de_message][]=$message;

        }else{

            $_SESSION[APP_KEY][NAV]['erreur'][]='MESSAGE AVEC UN MAUVAIS TYPE "'.$type_de_message.'" '.$message;
        }


    }else{


        if(( !(isset($_SESSION[APP_KEY][NAV][$page])))){

            foreach($tableauTypeMessage as $v1){
                $_SESSION[APP_KEY][NAV][$page][$v1]=array();
            }

        }


        if((in_array($type_de_message,$tableauTypeMessage))){

            $_SESSION[APP_KEY][NAV][$page][$type_de_message][]=$message;

        }else{

            $_SESSION[APP_KEY][NAV][$page]['erreur'][]='MESSAGE AVEC UN MAUVAIS TYPE "'.$type_de_message.'" '.$message;
        }

    }

    //echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV] , true ) . '</pre>' ; exit(0);

}
/*
  
  =====================================================================================================================
*/

function recupereLesMessagesDeSession($f){
    $numero_de_message=0;
    $les_messages_a_afficher='';
    $tableauTypeMessage=array(
        'normal',
        'succes',
        'info',
        'erreur',
        'danger',
        'avertissement');
    foreach($tableauTypeMessage as $v1){

        if((isset($_SESSION[APP_KEY][NAV][$f][$v1]))){


            if((count($_SESSION[APP_KEY][NAV][$f][$v1]) > 0)){

                foreach($_SESSION[APP_KEY][NAV][$f][$v1] as $kerr => $verr){
                    if($numero_de_message===0){
                        $les_messages_a_afficher.='<div class="yy'.$v1.'" style="padding-left:30px;">'.$verr.'</div>'.CRLF;
                        $numero_de_message++;
                    }else{
                        $les_messages_a_afficher.='<div class="yy'.$v1.'">'.$verr.'</div>'.CRLF;
                    }
                }

            }

            unset($_SESSION[APP_KEY][NAV][$f][$v1]);

        }


        if((isset($_SESSION[APP_KEY][NAV][$v1]))){


            if((count($_SESSION[APP_KEY][NAV][$v1]) > 0)){

                foreach($_SESSION[APP_KEY][NAV][$v1] as $kerr => $verr){
                    if($numero_de_message===0){
                        $les_messages_a_afficher.='<div class="yy'.$v1.'" style="padding-left:30px;">'.$verr.'</div>'.CRLF;
                        $numero_de_message++;
                    }else{
                        $les_messages_a_afficher.='<div class="yy'.$v1.'">'.$verr.'</div>'.CRLF;
                    }
                }

            }

            unset($_SESSION[APP_KEY][NAV][$v1]);

        }

    }

    if(($les_messages_a_afficher !== '')){

        $les_messages_a_afficher='<a class="yyavertissement" style="position: fixed;" href="javascript:masquerLesMessage(&quot;zone_global_messages&quot;)">🙈</a>'.$les_messages_a_afficher;

    }



    return($les_messages_a_afficher);

}
/*===================================================================================================================*/

function encrypter($donnee){

    $donnee=ENCRYPTION_DONNEES_EN_PLUS.$donnee;
    $premiere_cle=base64_decode($_SESSION[APP_KEY]['sess_premiere_cle_chiffrement']);
    $deuxieme_cle=base64_decode($_SESSION[APP_KEY]['sess_deuxième_cle_chiffrement']);
    $iv_length=openssl_cipher_iv_length(ENCRYPTION_METHODE);
    $iv=openssl_random_pseudo_bytes($iv_length);
    $first_encrypted=openssl_encrypt($donnee,ENCRYPTION_METHODE,$premiere_cle,OPENSSL_RAW_DATA,$iv);
    $second_encrypted=hash_hmac('sha3-512',$first_encrypted,$deuxieme_cle,TRUE);
    $output=base64_encode($iv.$second_encrypted.$first_encrypted);
    return($output);

}
/*===================================================================================================================*/

function decrypter($entree){

    $premiere_cle=base64_decode($_SESSION[APP_KEY]['sess_premiere_cle_chiffrement']);
    $deuxieme_cle=base64_decode($_SESSION[APP_KEY]['sess_deuxième_cle_chiffrement']);
    $mix=base64_decode($entree);
    $iv_length=openssl_cipher_iv_length(ENCRYPTION_METHODE);
    $iv=substr($mix,0,$iv_length);
    $second_encrypted=substr($mix,$iv_length,64);
    $first_encrypted=substr($mix,($iv_length+64));
    $donnee=@openssl_decrypt($first_encrypted,ENCRYPTION_METHODE,$premiere_cle,OPENSSL_RAW_DATA,$iv);
    $second_encrypted_new=hash_hmac('sha3-512',$first_encrypted,$deuxieme_cle,TRUE);

    if((@hash_equals($second_encrypted,$second_encrypted_new))){

        return(substr($donnee,strlen(ENCRYPTION_DONNEES_EN_PLUS)));

    }

    return(false);

}
/*===================================================================================================================*/

function html_header1($parametres){


    if(( !(ob_start("ob_gzhandler")))){

        ob_start();

    }
    $o1='';
    $o1.='<!DOCTYPE html>'.CRLF;
    $o1.='<html lang="fr">'.CRLF;
    $o1.=' <head>'.CRLF;
    $o1.='  <meta charset="utf-8" />'.CRLF;
    $o1.='  <title>'.(($parametres['title']??'titre de la page à compléter')).'</title>'.CRLF;
    $o1.='  <meta name="viewport" content="width=device-width, initial-scale=1" />'.CRLF;

    /* 
      attention, les variables css ajoutent un espace dans le css 
      heigh:(var --taille)px; 
      donnera en réalité
      heigh:16 px; ( il y a un espace entre le 16 et le px )
      => on doit déclarer les tailles en px
    */
    $css_taille_reference_generale=40;
    $css_taille_reference_textes=16;
    $css_taille_reference_padding=2;
    $css_taille_reference_border=1;
    $css_taille_reference_margin=1;
    $css_hauteur_ligne=$css_taille_reference_textes+$css_taille_reference_padding;
    $css_hauteur_mini_bouton=$css_taille_reference_textes+4*$css_taille_reference_padding+2*$css_taille_reference_border;
    $css_hauteur_mini_conteneur=$css_hauteur_mini_bouton+2*$css_taille_reference_margin;
    $css_hauteur_menu_defilement=$css_hauteur_mini_bouton+2*$css_taille_reference_margin+11;
    $css_hauteur_grands_boutons=$css_hauteur_menu_defilement-2*$css_taille_reference_margin-1;
    
    
    if(isset($_COOKIE[APP_KEY.'_biscuit'])){

     $json_biscuit_texte=rawurldecode($_COOKIE[APP_KEY.'_biscuit']);

     $le_biscuit=@json_decode($json_biscuit_texte,true);


     if($le_biscuit!==null){
      

         $css_taille_reference_generale=isset($le_biscuit['--yyvtrg'])?(int)str_replace('px','',$le_biscuit['--yyvtrg']):$css_taille_reference_generale;
         $css_taille_reference_textes  =isset($le_biscuit['--yyvtrt'])?(int)str_replace('px','',$le_biscuit['--yyvtrt']):$css_taille_reference_textes;
         $css_taille_reference_padding =isset($le_biscuit['--yyvtrp'])?(int)str_replace('px','',$le_biscuit['--yyvtrp']):$css_taille_reference_padding;
         $css_taille_reference_border  =isset($le_biscuit['--yyvtrb'])?(int)str_replace('px','',$le_biscuit['--yyvtrb']):$css_taille_reference_border;
         $css_taille_reference_margin  =isset($le_biscuit['--yyvtrm'])?(int)str_replace('px','',$le_biscuit['--yyvtrm']):$css_taille_reference_margin;
         $css_hauteur_ligne            =isset($le_biscuit['--yyvhal'])?(int)str_replace('px','',$le_biscuit['--yyvhal']):$css_hauteur_ligne;
         $css_hauteur_mini_bouton      =isset($le_biscuit['--yyvhmb'])?(int)str_replace('px','',$le_biscuit['--yyvhmb']):$css_hauteur_mini_bouton;
         $css_hauteur_menu_defilement  =isset($le_biscuit['--yyvhmd'])?(int)str_replace('px','',$le_biscuit['--yyvhmd']):$css_hauteur_menu_defilement;
         $css_hauteur_grands_boutons   =isset($le_biscuit['--yyvhgb'])?(int)str_replace('px','',$le_biscuit['--yyvhgb']):$css_hauteur_grands_boutons;
         $css_hauteur_mini_conteneur   =isset($le_biscuit['--yyvhmc'])?(int)str_replace('px','',$le_biscuit['--yyvhmc']):$css_hauteur_mini_conteneur;
         
         

     }else{
         $le_biscuit=array(
          '--yyvtrg' =>  $css_taille_reference_generale.'px',
          '--yyvtrt' =>  $css_taille_reference_textes.'px',
          '--yyvtrp' =>  $css_taille_reference_padding.'px',
          '--yyvtrb' =>  $css_taille_reference_border.'px',
          '--yyvtrm' =>  $css_taille_reference_margin.'px',
          '--yyvhmb' =>  $css_hauteur_mini_bouton.'px',
          '--yyvhal' =>  $css_hauteur_ligne.'px',
          '--yyvhmd' =>  $css_hauteur_menu_defilement.'px',
          '--yyvhgb' =>  $css_hauteur_grands_boutons.'px',
          '--yyvhmc' =>  $css_hauteur_mini_conteneur.'px',
         );
     }
    }else{
     
        $useragent=$_SERVER['HTTP_USER_AGENT'];

        if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4))){
         $css_taille_reference_padding=4;
        }



     
     $le_biscuit=array(
      '--yyvtrg' =>  $css_taille_reference_generale.'px',
      '--yyvtrt' =>  $css_taille_reference_textes.'px',
      '--yyvtrp' =>  $css_taille_reference_padding.'px',
      '--yyvtrb' =>  $css_taille_reference_border.'px',
      '--yyvtrm' =>  $css_taille_reference_margin.'px',
      '--yyvhmb' =>  $css_hauteur_mini_bouton.'px',
      '--yyvhal' =>  $css_hauteur_ligne.'px',
      '--yyvhmd' =>  $css_hauteur_menu_defilement.'px',
      '--yyvhgb' =>  $css_hauteur_grands_boutons.'px',
      '--yyvhmc' =>  $css_hauteur_mini_conteneur.'px',
     );
    }

    $css_hauteur_ligne=$css_taille_reference_textes+$css_taille_reference_padding;
    $css_hauteur_mini_bouton=$css_taille_reference_textes+4*$css_taille_reference_padding+2*$css_taille_reference_border;
    $css_hauteur_mini_conteneur=$css_hauteur_mini_bouton+2*$css_taille_reference_margin;
    $css_hauteur_menu_defilement=$css_hauteur_mini_bouton+2*$css_taille_reference_margin+11;
    $css_hauteur_grands_boutons=$css_hauteur_menu_defilement-2*$css_taille_reference_margin-1;
    $le_biscuit['--yyvhmb']=$css_hauteur_mini_bouton.'px';
    $le_biscuit['--yyvhal']=$css_hauteur_ligne.'px';
    $le_biscuit['--yyvhmd']=$css_hauteur_menu_defilement.'px';
    $le_biscuit['--yyvhgb']=$css_hauteur_grands_boutons.'px';
    $le_biscuit['--yyvhmc']=$css_hauteur_mini_conteneur.'px';


    
    $texte_base_css=CRLF;
    $texte_base_css.='<style type="text/css">:root{'.CRLF;
    $texte_base_css.='--yyvtrg:'.$le_biscuit['--yyvtrg'].';'.CRLF;
    $texte_base_css.='--yyvtrt:'.$le_biscuit['--yyvtrt'].'; /* taille de référence du texte */'.CRLF;
    $texte_base_css.='--yyvtrp:'.$le_biscuit['--yyvtrp'].'; /* taille de référence du espaces ( padding ) */'.CRLF;
    $texte_base_css.='--yyvtrb:'.$le_biscuit['--yyvtrb'].'; /* taille de référence des bordures */'.CRLF;
    $texte_base_css.='--yyvtrm:'.$le_biscuit['--yyvtrm'].'; /* taille de référence dus marges */'.CRLF;
    $texte_base_css.='--yyvhmb:'.$le_biscuit['--yyvhmb'].'; /* hauteur minimales des boutons */'.CRLF;
    $texte_base_css.='--yyvhal:'.$le_biscuit['--yyvhal'].'; /* hauteur de ligne */'.CRLF;
    $texte_base_css.='--yyvhmd:'.$le_biscuit['--yyvhmd'].'; /* hauteur du menu à défilement */'.CRLF;
    $texte_base_css.='--yyvhgb:'.$le_biscuit['--yyvhgb'].'; /* hauteur des grands boutons ( quitter et index ) */'.CRLF;
    $texte_base_css.='--yyvhmc:'.$le_biscuit['--yyvhmc'].'; /* hauteur minimale de conteneur ( div ) */'.CRLF;
    $texte_base_css.='}</style>'.CRLF;

    $o1.=$texte_base_css;
    
    $o1.='  <link rel="stylesheet" type="text/css" href="6.css" />'.CRLF;
    $o1.='<script type="text/javascript">'.CRLF;
    $o1.=' var APP_KEY=\''.APP_KEY.'\';'.CRLF;
    $o1.=' var NOMBRE_DE_TRAVAUX_EN_ARRIERE_PLAN='.(isset($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan'])?count($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']):0).';'.CRLF;
    $o1.=' var CSS_TAILLE_REFERENCE_TEXTE='.$css_taille_reference_textes.';'.CRLF;
    $o1.=' var CSS_TAILLE_REFERENCE_BORDER='.$css_taille_reference_border.';'.CRLF;
    $o1.=' var CSS_TAILLE_REFERENCE_PADDING='.$css_taille_reference_padding.';'.CRLF;
    $o1.=' var CSS_TAILLE_REFERENCE_MARGIN='.$css_taille_reference_margin.';'.CRLF;
    
    $o1.='</script>    '.CRLF;
    $o1.='    '.CRLF;

    $o1.=' </head>'.CRLF;
    $o1.=' <body data-temp="temp">'.CRLF;

    $o1.='<!-- '.$texte_base_css.' -->';


    if(( !(isset($parametres['pas_de_menu'])))){

        $o1.='  <nav id="navbar" class="yynavbar">'.CRLF;
        $o1.='    <div style="min-width:'.($css_hauteur_grands_boutons*2+4*$css_taille_reference_margin).'px;">'.CRLF;
        $o1.='     <a href="./" id="buttonhome" class="yytbgrand '.(('index.php' === BNF)?'yymenusel1':'').'" style="">&#127968;</a>'.CRLF;
        $o1.='     <a class="yytbgrand yyavertissement" style="position: fixed;" href="javascript:afficherOuMasquerLesMessages()">🙈</a>'.CRLF;
        $o1.='    </div>'.CRLF;
        $o1.='    <div id="menuPrincipal" class="menuScroller">'.CRLF;
        $o1.='      <div>'.CRLF;
        $o1.='        <ul>'.CRLF;
        $idMenu=0;

        if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){

            $o1.='          <li><a class="yytbfixe '.(('traiteHtml.php' === BNF)?'yymenusel1':'').'" href="traiteHtml.php?idMenu='.($idMenu++).'">HTML</a></li>'.CRLF;
            $o1.='          <li><a class="yytbfixe '.(('traiteJs.php' === BNF)?'yymenusel1':'').'" href="traiteJs.php?idMenu='.($idMenu++).'">JS</a></li>'.CRLF;
            $o1.='          <li><a class="yytbfixe '.(('traitePhp.php' === BNF)?'yymenusel1':'').'" href="traitePhp.php?idMenu='.($idMenu++).'">PHP</a></li>'.CRLF;
            $o1.='          <li><a class="yytbfixe '.(('traiteSql.php' === BNF)?'yymenusel1':'').'" href="traiteSql.php?idMenu='.($idMenu++).'">SQL</a></li>'.CRLF;
            $o1.='          <li><a class="yytbfixe '.(('index_source.php' === BNF)?'yymenusel1':'').'" href="index_source.php?idMenu='.($idMenu++).'">REV</a></li>'.CRLF;
            $o1.='          <li><a class="yytbfixe '.(('zz_cibles_l1.php' === BNF)?'yymenusel1':'').'" href="zz_cibles_l1.php?idMenu='.($idMenu++).'">cibles</a></li>'.CRLF;

            if((isset($_SESSION[APP_KEY]['cible_courante']))){

                $o1.='          <li><a class="yytbfixe '.(('zz_dossiers_l1.php' === BNF)?'yymenusel1':'').'" href="zz_dossiers_l1.php?idMenu='.($idMenu++).'">dossiers</a></li>'.CRLF;
                $o1.='          <li><a class="yytbfixe '.(('zz_sources_l1.php' === BNF)?'yymenusel1':'').'" href="zz_sources_l1.php?idMenu='.($idMenu++).'">sources</a></li>'.CRLF;
                $o1.='          <li><a class="yytbfixe '.(('zz_bdds_l1.php' === BNF)?'yymenusel1':'').'" href="zz_bdds_l1.php?idMenu='.($idMenu++).'">bdds</a></li>'.CRLF;
                $o1.='          <li><a class="yytbfixe '.(('zz_rev_l1.php' === BNF)?'yymenusel1':'').'" href="zz_revs_l1.php?idMenu='.($idMenu++).'">revs</a></li>'.CRLF;

            }
            $o1.='          <li><a class="yytbfixe '.(('zz_taches_l1.php' === BNF)?'yymenusel1':'').'" href="zz_taches_l1.php?idMenu='.($idMenu++).'">tâches</a></li>'.CRLF;


        }

        $o1.='        </ul>'.CRLF;
        $o1.='      </div>'.CRLF;
        $o1.='    </div>'.CRLF;

        if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){

            $o1.='    <div class="">'.CRLF;
            $o1.='      <a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yytbgrand yydanger">🔑</a>'.CRLF;
            $o1.='    </div>'.CRLF;

        }else if((BNF !== 'aa_login.php')){

            $o1.='    <div class="yydivhomequit"><a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yytbgrand yysucces">🔑</a></div>'.CRLF;

        }
        

        $o1.='  </nav>'.CRLF;

    }

    $o1.='    <main id="contenuPrincipal">'.CRLF;
    $les_messages=recupereLesMessagesDeSession(BNF);
    if($les_messages!==''){
      $o1.=' <div id="zone_global_messages" style="visibility:visible;">'.$les_messages.'</div>'.CRLF;
    }else{
      $o1.=' <div id="zone_global_messages" style="visibility:hidden;">'.$les_messages.'</div>'.CRLF;
    }
    return($o1);

}
/*========================================================================================================================*/

function supprimerLesParametresDeNavigationEnSession(){


    if((isset($_GET['idMenu']))){

        $sauf='';
        xcleanSession1(array( 'except' => ''));

    }else{

        $sauf=BNF;
        xcleanSession1(array( 'except' => BNF));
    }


    if((isset($_SESSION[APP_KEY][NAV]))){

        foreach($_SESSION[APP_KEY][NAV] as $k => $v){

            if(($sauf != $k)){

                unset($_SESSION[APP_KEY][NAV][$k]);

            }

        }

    }


    if((isset($_SESSION[APP_KEY]['valeurPourChoixCroise']))){

        unset($_SESSION[APP_KEY]['valeurPourChoixCroise']);

    }


}
/*===================================================================================================================*/

function html_footer1($parametres=array()){

    $o1='';
    $o1.='</main>'.CRLF;
    $o1.='<dialog id="modale1"><a id="__fermerModale1" href="javascript:fermerModale1()" class="yydanger">×</a><div id="__contenu_modale"><iframe id="iframe_modale_1" src=""></iframe></div></dialog>'.CRLF;
    $o1.='<div id="bas_de_page">'.CRLF;
    $o1.='<a href="javascript:__gi1.vers_le_haut_de_la_page(0,150)" style="font-size:2em;opacity:0.5;">⇑</a>'.CRLF;
    if(!preg_match('/.*_a[0-9]+\\.php/',BNF)){
        $o1.='<a href="javascript:__gi1.fixer_les_dimentions(\'dimension_du_texte\')" style="opacity:0.5;"   title="taille texte">A±</a>'.CRLF;
        $o1.='<a href="javascript:__gi1.fixer_les_dimentions(\'dimension_du_padding\')" style="opacity:0.5;" title="taille espace">p±</a>'.CRLF;
        $o1.='<a href="javascript:__gi1.fixer_les_dimentions(\'dimension_du_border\')" style="opacity:0.5;"  title="taille bordure">b±</a>'.CRLF;
        $o1.='<a href="javascript:__gi1.fixer_les_dimentions(\'dimension_du_margin\')" style="opacity:0.5;"  title="taille marge">m±</a>'.CRLF;
        
        $o1.='<a href="javascript:__gi1.fixer_les_parametres_pour_une_liste(&quot;'.enti1(BNF).'&quot;)" style="opacity:0.5;">⚙️</a>'.CRLF;
    }
    $o1.='</div>'.CRLF;
    $o1.='  <script type="text/javascript" src="js/core6.js"></script>'.CRLF;
    $o1.='  <script type="module" src="js/module_interface1.js"></script>'.CRLF;

    /*
     d'un point de vue fonctionnel, ce n'est pas util car les modules sont chargés dynamiquement
     mais grâce à ces lignes, le module js est mis en cache et les appels suivants sont plus rapides
    */
    if((isset($parametres['module_a_inclure']))){

        foreach($parametres['module_a_inclure'] as $k1 => $v1){

            if(($v1 !== '')){

                $o1.='  <script type="module" src="'.$v1.'"></script>'.CRLF;

            }

        }

    }

    if((isset($parametres['js_a_inclure']))){

        foreach($parametres['js_a_inclure'] as $k1 => $v1){

            if(($v1 !== '')){

                $o1.='  <script type="text/javascript" src="'.$v1.'" defer></script>'.CRLF;

            }

        }

    }

    $o1.='<script type="text/javascript">'.CRLF;

    if((isset($parametres['js_a_executer_apres_chargement']))){

        $o1.='function fonctionDeLaPageAppeleeQuandToutEstCharge(){'.CRLF;
        $txt1='';
        foreach($parametres['js_a_executer_apres_chargement'] as $k1 => $v1){

            if((isset($v1['nomDeLaFonctionAappeler']))){


                if(($txt1 != '')){

                    $txt1.=','.CRLF;

                }

                $txt1.=' '.json_encode($v1,JSON_FORCE_OBJECT).'';

            }

        }
        $o1.=' arrayLocalJs=['.CRLF.$txt1.CRLF.' ];'.CRLF;
        $o1.=' executerCesActionsPourLaPageLocale(arrayLocalJs);'.CRLF;
        $o1.='}'.CRLF;

    }else{

        $o1.='function fonctionDeLaPageAppeleeQuandToutEstCharge(){ /* do nothing */};'.CRLF;
    }

    $o1.='</script>'.CRLF;
    $o1.='  <script type="text/javascript" src="js/interface0.js"></script>'.CRLF;
    $o1.='</body></html>'.CRLF;

    if((isset($parametres['ne_pas_supprimer_les_valeurs_de_session_sur_un_choix']))){


    }else{

        supprimerLesParametresDeNavigationEnSession();
    }

    return($o1);

}
?>