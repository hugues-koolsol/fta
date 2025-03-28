<?php
date_default_timezone_set('Europe/Paris');
define('APP_KEY','fta');
define('PREFIXE_REPERTOIRES','fta');
define('RACINE_DU_PROJET',realpath(dirname(__FILE__,2)));
define('INCLUDE_PATH',RACINE_DU_PROJET . DIRECTORY_SEPARATOR . PREFIXE_REPERTOIRES . '_inc');
define('BACKUP_PATH',RACINE_DU_PROJET . DIRECTORY_SEPARATOR . PREFIXE_REPERTOIRES . '_backup');
define('RACINE_FICHIERS_PROVISOIRES',RACINE_DU_PROJET . DIRECTORY_SEPARATOR . PREFIXE_REPERTOIRES . '_temp');
define('LIEN_BDD','LIEN_BDD');
define('BDD','BDD');
$GLOBALS[BDD]=array();
define('NAV','NAV');
define('CRLF',"\r\n");
define('__entree','__entree');
/*define('INPUT','input');*/
define('VALUE','value');
define('TAILLE_MAXI_SOURCE',512000);
define('ENCRYPTION_DONNEES_EN_PLUS',base64_encode('une_valeur_très_compliquée_et_"suffisament"_longue'));
define('ENCRYPTION_METHODE','aes-256-cbc');
/*statut*/
define('__xst','__xst');
/*n° erreur*/
define('__xer',0);
/*n° succes*/
define('__xsu',1);
/*n° alarme*/
define('__xal',2);
/*n° info*/
define('__xif',3);
/*message*/
define('__xme','__xme');
/*valeur*/
define('__xva','__xva');
define('__mode_traque','__mode_traque');
define('__date','__date');
define('__le_biscuit','__le_biscuit');
/* on peut facilement modifier la date pour des simulations et des tests */
$GLOBALS[__date]=date('Y-m-d H:i:s');
$GLOBALS[__le_biscuit]=array();
$GLOBALS[__mode_traque]=false;
/*
  =====================================================================================================================
  ====================== un temps de traitement supérieur à 5 secondes est suspect ====================================
  =====================================================================================================================
*/
set_time_limit(5);
/* bug();*/
/*
  =====================================================================================================================
*/
function initialiser_les_services($initialiser_session,$initialiser_bdd){

    
    if($initialiser_bdd === true){

        /*
          il peut y avoir plusieurs bases sqlite rattachées à une seule connexion
          On ouvre donc une connexion "neutre" et on rattache les bases
        */
        require_once('../fta_inc/db/__liste_des_acces_bdd.php');
        /*
          'fournisseur'
        */
        $sqlite_trouve=false;
        foreach($GLOBALS[BDD] as $k1 => $v1){
            
            if($v1['fournisseur'] === 'sqlite' && $sqlite_trouve === false){

                $db0=new SQLite3('');
                $sqlite_trouve=true;

            }

        }
        $ret=$db0->exec('PRAGMA encoding = "UTF-8";PRAGMA foreign_keys=1;PRAGMA journal_mode=WAL;');
        
        if($ret === false){

            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export(__LINE__,true) . '</pre>' ;
            exit(0);

        }

        foreach($GLOBALS[BDD] as $k1 => $v1){
            define('BDD_' . $v1['id'],$v1['id']);
            $GLOBALS[BDD][$k1][LIEN_BDD]=$db0;
            
            if($v1['fournisseur'] === 'sqlite'){

                /*
                  l'initialisation permet de déclencher par exemple
                  attach database "C:\\...chemin...\\fta_inc\db\\sqlite\\system.db" as "system.db"
                */
                $sql0=$v1['initialisation'];
                $ret0=$db0->exec($sql0);

            }

        }

    }

    
    if($initialiser_session === true){

        
        if(session_status() === PHP_SESSION_NONE){

            session_start();

        }


    }


}
/*
  =====================================================================================================================
*/
function texte_aleatoire($lng){

    $str=random_bytes($lng);
    $str=base64_encode($str);
    $str=str_replace(array( "+", "/", "="),"",$str);
    $str=substr($str,0,$lng);
    return $str;

}
/*
  =====================================================================================================================
*/
function cst($a=''){

    return $a;

}
/*
  =====================================================================================================================
*/
function sauvegarder_et_supprimer_fichier($chemin_du_fichier,$ne_pas_faire_de_copie=false){

    /*
      Il n'y a qu'ici qu'on trouve unlink.
      Quand on crée un fichier temporaire et qu'on le supprime, on ne fait pas de copie dans le répertoire BACKUP_PATH
    */
    
    if($ne_pas_faire_de_copie){

        
        if(is_file($chemin_du_fichier)){

            
            if((@unlink($chemin_du_fichier))){

                return true;

            }


        }


    }else{

        $repertoire=BACKUP_PATH . DIRECTORY_SEPARATOR . date('Y/m/d');
        
        if(is_dir($repertoire) || mkdir($repertoire,511,true)){

            $chemin_fichier_copie=$repertoire . DIRECTORY_SEPARATOR . uniqid() . str_replace('\\','_',str_replace('/','_',str_replace(':','_',$chemin_du_fichier)));
            
            if((@rename($chemin_du_fichier,$chemin_fichier_copie))){

                return true;

            }


        }

    }

    return false;

}
/*
  =====================================================================================================================
  ==================================== fonctions vides intentionnelles à conserver ====================================
  =====================================================================================================================
*/
/**/
function sql_inclure_source($i){
}
function sql_inclure_reference($i){
}
/*
  =====================================================================================================================
  quand un champ de recherche contient des id, ils sont séparés par des virgules
  par exemple, 1,2,3  , le where doit être sous la forme WHERE id in ( 1 , 2 , 3 )
*/
function construction_where_sql_sur_id($nom_du_champ,$critere){

    $champ_where='';
    
    if(strpos($critere,',') !== false){

        $tableau_liste_des_valeurs=explode(',',$critere);
        $chaine_recherche='';
        foreach($tableau_liste_des_valeurs as $k1 => $v1){
            
            if(is_numeric($v1)){

                $chaine_recherche .= ',' . $v1;

            }

        }
        
        if($chaine_recherche !== ''){

            $chaine_recherche=substr($chaine_recherche,1);
            $champ_where .= 'AND ' . sq0($nom_du_champ) . ' in (' . sq0($chaine_recherche) . ') ';

        }


    }else if($critere === null){

        $champ_where .= 'AND ' . sq0($nom_du_champ) . ' IS NULL ';

    }else if(is_numeric($critere)){

        $champ_where .= 'AND ' . sq0($nom_du_champ) . ' = ' . sq0($critere) . ' ';
    }

    return $champ_where;

}
/*
  =====================================================================================================================
*/
function nfp1($n){

    $t=number_format($n,0,',',' ');
    return '<div style="display:inline-block;min-width:2em;text-align:right;margin-left:3px;">' . $t . '</div>';

}
/*
  =====================================================================================================================
*/
function construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$__xpage,$boutons_avant=''){

    $o1='';
    $__bouton_enregs_suiv=' <a class="yyunset">&raquo;</a>';
    
    if($__debut + $__nbMax < $__nbEnregs){

        $__bouton_enregs_suiv=' <a href="' . BNF . '?__xpage=' . ($__xpage + 1) . $consUrlRedir . '">&raquo;</a>';

    }

    $__bouton_enregs_prec=' <a class="yyunset">&laquo;</a>';
    
    if($__xpage > 0){

        $__bouton_enregs_prec=' <a href="' . BNF . '?__xpage=' . ($__xpage - 1) . $consUrlRedir . '">&laquo;</a>';

    }

    
    if($__nbEnregs > 0){

        $o1 .= '<form class="yylistForm1" method="post">' . PHP_EOL;
        $o1 .= $boutons_avant;
        $o1 .= $__bouton_enregs_prec . PHP_EOL . $__bouton_enregs_suiv . PHP_EOL . ' <div style="display:inline-block;">' . PHP_EOL;
        $o1 .= ' page' . nfp1($__xpage + 1) . '/' . number_format(ceil($__nbEnregs / $__nbMax),0,',',' ') . ' (' . number_format($__nbEnregs,0,',',' ') . ' enregistrements )' . PHP_EOL;
        $o1 .= ' </div>' . PHP_EOL;
        $o1 .= '</form>' . PHP_EOL;

    }else{

        $o1 .= '<form class="yylistForm1 yyalarme" method="post">';
        $o1 .= $boutons_avant;
        $o1 .= 'Aucun enregistrement trouvé</form>' . PHP_EOL;
    }

    return $o1;

}
/*
  =====================================================================================================================
*/
function html_du_bouton_rechercher_pour_les_listes(){

    $o='    <label for="button_chercher">rechercher</label>' . PHP_EOL;
    $o .= '    <button id="button_chercher" name="button_chercher" type="submit" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche" value="0">🔎</button>' . PHP_EOL;
    return $o;

}
/*
  =====================================================================================================================
*/
function bouton_retour_a_la_liste($url){

    return '<a id="__retour_a_la_liste" href="' . $url . '" title="retour à la liste">&nbsp;⬱&nbsp;</a>';

}
/*
  =====================================================================================================================
*/
function recharger_la_page($a){

    header("HTTP/1.1 303 See Other");
    header('Location: ' . $a);
    exit(0);

}
/*
  =====================================================================================================================
  Utilitaire pour repérer les chaines de caractères qui contiennent du html quand on fait du rev
  =====================================================================================================================
*/
function htmlDansPhp($s){

    return $s;

}
/*
  =====================================================================================================================
*/
function checkGroupAjaxPages(){

    return true;

}
/*
  =====================================================================================================================
*/
function le_dossier_est_vide($dossier){

    
    if(is_dir($dossier)){

        return count(scandir($dossier)) == 2;

    }else{

        return true;
    }


}
/*
  =====================================================================================================================
*/
function pushkv(&$a,$k,$v){

    $a[$k]=$v;

}
/*
  =====================================================================================================================
*/
function concat(...$ps){

    $t='';
    foreach($ps as $p){
        $t .= $p;
    }
    return $t;

}
/*
  =====================================================================================================================
*/
function recuperer_et_sauvegarder_les_parametres_de_recherche($k,$bnf){

    /*
      
      on veut garder les paramètres de navigation des pages
    */
    
    if(!isset($_SESSION[APP_KEY]['__filtres'][BNF])){

        $_SESSION[APP_KEY]['__filtres'][BNF]=array();
        $_SESSION[APP_KEY]['__filtres'][BNF]['champs']=array( '__xpage' => 0);

    }

    
    if(!isset($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'])){

        $_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']=0;

    }

    $ret='';
    $ret=$_GET[$k]??'';
    
    if(isset($_GET[$k])){

        /* si on a changé un critère de recherche, il faut revenir à la première page */
        
        if(isset($_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k])
           && $_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k] !== $_GET[$k]
        ){

            $_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']=0;

        }

        $_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k]=$_GET[$k];
        $ret=$_GET[$k];

    }else if(isset($_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k])){

        
        if(isset($_GET['idMenu']) && '__xpage' === $k){

            $_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k]=0;
            $ret=0;

        }else{

            $ret=$_SESSION[APP_KEY]['__filtres'][BNF]['champs'][$k];
        }


    }else{

        $ret='';
        
        if('__xpage' === $k){

            $ret=0;

        }

    }

    return $ret;

}
/*
  =====================================================================================================================
*/
function enti1($s){

    
    if($s === null){

        return '';

    }

    return htmlentities($s,ENT_COMPAT,'utf-8');

}
/*
  =====================================================================================================================
*/
function sq1($s){

    
    if(is_numeric($s)){

        return $s;

    }else if($s === null){

        return 'NULL';
    }

    $s1=SQLite3::escapeString($s);
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
        'Ü' => 'Ü'
    );
    $s1=strtr($s1,$ua);
    return '\'' . $s1 . '\'';

}
/*
  =====================================================================================================================
*/
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
        'Ü' => 'Ü'
    );
    return strtr($s,$ua);

}
/*
  =====================================================================================================================
*/
function signaler($tab){

    
    if(isset($tab['provenance']) && $tab['provenance'] !== ''){

        ajouterMessage(__xer,$tab[__xme],$tab['provenance']);

    }else{

        ajouterMessage(__xer,$tab[__xme]);
    }

    return $tab;

}
/*
  =====================================================================================================================
*/
function ajouterMessage($type_de_message,$message,$page=''){

    $tableauTypeMessage=array( __xer, __xsu, __xal, __xif);
    
    if($page === ''){

        
        if(!isset($_SESSION[APP_KEY][NAV])){

            foreach($tableauTypeMessage as $v1){
                $_SESSION[APP_KEY][NAV][$v1]=array();
            }

        }

        
        if(in_array($type_de_message,$tableauTypeMessage)){

            $_SESSION[APP_KEY][NAV][$type_de_message][]=$message;

        }else{

            $_SESSION[APP_KEY][NAV][__xer][]='MESSAGE AVEC UN MAUVAIS TYPE "' . $type_de_message . '" ' . $message;
        }


    }else{

        
        if(!isset($_SESSION[APP_KEY][NAV][$page])){

            foreach($tableauTypeMessage as $v1){
                $_SESSION[APP_KEY][NAV][$page][$v1]=array();
            }

        }

        
        if(in_array($type_de_message,$tableauTypeMessage)){

            $_SESSION[APP_KEY][NAV][$page][$type_de_message][]=$message;

        }else{

            $_SESSION[APP_KEY][NAV][$page][__xer][]='MESSAGE AVEC UN MAUVAIS TYPE "' . $type_de_message . '" ' . $message;
        }

    }


}
/*
  
  =====================================================================================================================
*/
function recupere_les_messages_de_session($bnf){

    $les_messages_a_afficher='';
    $tableauTypeMessage=array( __xer => 'erreur', __xsu => 'succes', __xal => 'alarme', __xif => 'info');
    $visible='hidden';
    foreach($tableauTypeMessage as $k1 => $v1){
        
        if(isset($_SESSION[APP_KEY][NAV][$bnf][$k1])){

            
            if(count($_SESSION[APP_KEY][NAV][$bnf][$k1]) > 0){

                foreach($_SESSION[APP_KEY][NAV][$bnf][$k1] as $kerr => $verr){
                    $les_messages_a_afficher .= '<div class="yy' . $v1 . '">' . $verr . '</div>' . PHP_EOL;
                    $visible='visible;';
                }

            }

            unset($_SESSION[APP_KEY][NAV][$bnf][$k1]);

        }

        
        if(isset($_SESSION[APP_KEY][NAV][$k1])){

            
            if(count($_SESSION[APP_KEY][NAV][$k1]) > 0){

                foreach($_SESSION[APP_KEY][NAV][$k1] as $kerr => $verr){
                    $les_messages_a_afficher .= '<div class="yy' . $v1 . '">' . $verr . '</div>' . PHP_EOL;
                    $visible='visible;';
                }

            }

            unset($_SESSION[APP_KEY][NAV][$k1]);

        }

    }
    return array( $visible, $les_messages_a_afficher);

}
/*
  =====================================================================================================================
*/
function encrypter($donnee){

    $donnee=ENCRYPTION_DONNEES_EN_PLUS . $donnee;
    $premiere_cle=base64_decode($_SESSION[APP_KEY]['sess_premiere_cle_chiffrement']);
    $deuxieme_cle=base64_decode($_SESSION[APP_KEY]['sess_deuxième_cle_chiffrement']);
    $iv_length=openssl_cipher_iv_length(ENCRYPTION_METHODE);
    $iv=openssl_random_pseudo_bytes($iv_length);
    $first_encrypted=openssl_encrypt($donnee,ENCRYPTION_METHODE,$premiere_cle,OPENSSL_RAW_DATA,$iv);
    $second_encrypted=hash_hmac('sha3-512',$first_encrypted,$deuxieme_cle,true);
    $output=base64_encode($iv . $second_encrypted . $first_encrypted);
    return $output;

}
/*
  =====================================================================================================================
*/
function decrypter($entree){

    $premiere_cle=base64_decode($_SESSION[APP_KEY]['sess_premiere_cle_chiffrement']);
    $deuxieme_cle=base64_decode($_SESSION[APP_KEY]['sess_deuxième_cle_chiffrement']);
    $mix=base64_decode($entree);
    $iv_length=openssl_cipher_iv_length(ENCRYPTION_METHODE);
    $iv=substr($mix,0,$iv_length);
    $second_encrypted=substr($mix,$iv_length,64);
    $first_encrypted=substr($mix,$iv_length + 64);
    $donnee=@openssl_decrypt($first_encrypted,ENCRYPTION_METHODE,$premiere_cle,OPENSSL_RAW_DATA,$iv);
    $second_encrypted_new=hash_hmac('sha3-512',$first_encrypted,$deuxieme_cle,true);
    
    if((@hash_equals($second_encrypted,$second_encrypted_new))){

        return substr($donnee,strlen(ENCRYPTION_DONNEES_EN_PLUS));

    }

    return false;

}
/*
  =====================================================================================================================
*/
function xcleanSession1($par){

    
    if(isset($_SESSION[APP_KEY][NAV])){

        foreach($_SESSION[APP_KEY][NAV] as $k => $v){
            
            if($par['except'] != $k){

                unset($_SESSION[APP_KEY][NAV][$k]);

            }

        }

    }

    
    if(isset($_SESSION[APP_KEY]['choose'])){

        unset($_SESSION[APP_KEY]['choose']);

    }


}
/*
  =====================================================================================================================
*/
function supprimerLesParametresDeNavigationEnSession(){

    
    if(isset($_GET['idMenu'])){

        $sauf='';
        xcleanSession1(array( 'except' => ''));

    }else{

        $sauf=BNF;
        xcleanSession1(array( 'except' => BNF));
    }

    
    if(isset($_SESSION[APP_KEY][NAV])){

        foreach($_SESSION[APP_KEY][NAV] as $k => $v){
            
            if($sauf != $k){

                unset($_SESSION[APP_KEY][NAV][$k]);

            }

        }

    }

    
    if(isset($_SESSION[APP_KEY]['valeurPourChoixCroise'])){

        unset($_SESSION[APP_KEY]['valeurPourChoixCroise']);

    }


}
/*
  =====================================================================================================================
  quand on fait une maj, il faut vérifier que l'id envoyé en post correspond bien à l'id du formulaire
  =====================================================================================================================
*/
function verifie_id_envoye($nom_du_champ,$page_de_redirection,$bnf,&$post){

    
    if(isset($post['__action']) && $post['__action'] == '__creation'){

        return;

    }

    
    if(!isset($_SESSION[APP_KEY][NAV][$bnf]['sha1'][$nom_du_champ])
       || sha1($post[$nom_du_champ]) !== $_SESSION[APP_KEY][NAV][$bnf]['sha1'][$nom_du_champ]
    ){

        
        if(isset($post['__action'])
           && $post['__action'] == '__modification'
           && is_numeric($_SESSION[APP_KEY][NAV][$bnf][$nom_du_champ])
        ){

            ajouterMessage('alarme',__LINE__ . ' désolé, il faut sauvegarder à nouveau');
            recharger_la_page($bnf . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][$bnf][$nom_du_champ]);

        }else{

            ajouterMessage(__xer,__LINE__ . ' désolé, sha1 différents sur ' . $nom_du_champ . ', cette erreur sera analysée');
            recharger_la_page($page_de_redirection);
        }


    }


}
/*
  =====================================================================================================================
*/
function html_header1($parametres){

    
    if(!ob_start("ob_gzhandler")){

        ob_start();

    }

    $o1='';
    $o1 .= '<!DOCTYPE HTML>' . PHP_EOL;
    $o1 .= '<html lang="fr">' . PHP_EOL;
    $o1 .= ' <head>' . PHP_EOL;
    $o1 .= '  <meta charset="utf-8" />' . PHP_EOL;
    $o1 .= '  <title>' . ($parametres['title']??'titre de la page à compléter') . '</title>' . PHP_EOL;
    $o1 .= '  <meta name="viewport" content="width=device-width, initial-scale=1" />' . PHP_EOL;
    $o1 .= '  <link rel="icon" href="favicon.ico" type="image/x-icon" />' . PHP_EOL;
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
    $css_hauteur_ligne=$css_taille_reference_textes + $css_taille_reference_padding;
    $css_hauteur_mini_bouton=$css_taille_reference_textes + 4 * $css_taille_reference_padding + 2 * $css_taille_reference_border;
    $css_hauteur_mini_conteneur=$css_hauteur_mini_bouton + 2 * $css_taille_reference_margin;
    $css_hauteur_menu_defilement=$css_hauteur_mini_bouton + 2 * $css_taille_reference_margin + 11;
    $css_hauteur_grands_boutons=$css_hauteur_menu_defilement - 2 * $css_taille_reference_margin - 1;
    
    if(isset($_COOKIE[APP_KEY . '_biscuit'])){

        $json_biscuit_texte=rawurldecode($_COOKIE[APP_KEY . '_biscuit']);
        $le_biscuit=@json_decode($json_biscuit_texte,true);
        
        if($le_biscuit !== null){

            $css_taille_reference_generale=isset($le_biscuit['--yyvtrg']) ? (int)(str_replace('px','',$le_biscuit['--yyvtrg'])) : $css_taille_reference_generale;
            $css_taille_reference_textes=isset($le_biscuit['--yyvtrt']) ? (int)(str_replace('px','',$le_biscuit['--yyvtrt'])) : $css_taille_reference_textes;
            $css_taille_reference_padding=isset($le_biscuit['--yyvtrp']) ? (int)(str_replace('px','',$le_biscuit['--yyvtrp'])) : $css_taille_reference_padding;
            $css_taille_reference_border=isset($le_biscuit['--yyvtrb']) ? (int)(str_replace('px','',$le_biscuit['--yyvtrb'])) : $css_taille_reference_border;
            $css_taille_reference_margin=isset($le_biscuit['--yyvtrm']) ? (int)(str_replace('px','',$le_biscuit['--yyvtrm'])) : $css_taille_reference_margin;
            $css_hauteur_ligne=isset($le_biscuit['--yyvhal']) ? (int)(str_replace('px','',$le_biscuit['--yyvhal'])) : $css_hauteur_ligne;
            $css_hauteur_mini_bouton=isset($le_biscuit['--yyvhmb']) ? (int)(str_replace('px','',$le_biscuit['--yyvhmb'])) : $css_hauteur_mini_bouton;
            $css_hauteur_menu_defilement=isset($le_biscuit['--yyvhmd']) ? (int)(str_replace('px','',$le_biscuit['--yyvhmd'])) : $css_hauteur_menu_defilement;
            $css_hauteur_grands_boutons=isset($le_biscuit['--yyvhgb']) ? (int)(str_replace('px','',$le_biscuit['--yyvhgb'])) : $css_hauteur_grands_boutons;
            $css_hauteur_mini_conteneur=isset($le_biscuit['--yyvhmc']) ? (int)(str_replace('px','',$le_biscuit['--yyvhmc'])) : $css_hauteur_mini_conteneur;

        }else{

            $le_biscuit=array(
                '--yyvtrg' => $css_taille_reference_generale . 'px',
                '--yyvtrt' => $css_taille_reference_textes . 'px',
                '--yyvtrp' => $css_taille_reference_padding . 'px',
                '--yyvtrb' => $css_taille_reference_border . 'px',
                '--yyvtrm' => $css_taille_reference_margin . 'px',
                '--yyvhmb' => $css_hauteur_mini_bouton . 'px',
                '--yyvhal' => $css_hauteur_ligne . 'px',
                '--yyvhmd' => $css_hauteur_menu_defilement . 'px',
                '--yyvhgb' => $css_hauteur_grands_boutons . 'px',
                '--yyvhmc' => $css_hauteur_mini_conteneur . 'px'
            );
        }


    }else{

        $useragent=$_SERVER['HTTP_USER_AGENT'];
        
        if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)
           || preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4))
        ){

            $css_taille_reference_padding=4;

        }

        $le_biscuit=array(
            '--yyvtrg' => $css_taille_reference_generale . 'px',
            '--yyvtrt' => $css_taille_reference_textes . 'px',
            '--yyvtrp' => $css_taille_reference_padding . 'px',
            '--yyvtrb' => $css_taille_reference_border . 'px',
            '--yyvtrm' => $css_taille_reference_margin . 'px',
            '--yyvhmb' => $css_hauteur_mini_bouton . 'px',
            '--yyvhal' => $css_hauteur_ligne . 'px',
            '--yyvhmd' => $css_hauteur_menu_defilement . 'px',
            '--yyvhgb' => $css_hauteur_grands_boutons . 'px',
            '--yyvhmc' => $css_hauteur_mini_conteneur . 'px'
        );
    }

    $css_hauteur_ligne=$css_taille_reference_textes + $css_taille_reference_padding;
    $css_hauteur_mini_bouton=$css_taille_reference_textes + 4 * $css_taille_reference_padding + 2 * $css_taille_reference_border;
    $css_hauteur_mini_conteneur=$css_hauteur_mini_bouton + 2 * $css_taille_reference_margin;
    $css_hauteur_menu_defilement=$css_hauteur_mini_bouton + 2 * $css_taille_reference_margin + 11;
    $css_hauteur_grands_boutons=$css_hauteur_menu_defilement - 2 * $css_taille_reference_margin - 1;
    $le_biscuit['--yyvhmb']=$css_hauteur_mini_bouton . 'px';
    $le_biscuit['--yyvhal']=$css_hauteur_ligne . 'px';
    $le_biscuit['--yyvhmd']=$css_hauteur_menu_defilement . 'px';
    $le_biscuit['--yyvhgb']=$css_hauteur_grands_boutons . 'px';
    $le_biscuit['--yyvhmc']=$css_hauteur_mini_conteneur . 'px';
    $GLOBALS['__le_biscuit']=$le_biscuit;
    $texte_base_css=PHP_EOL;
    $texte_base_css .= '<style type="text/css">:root{' . PHP_EOL;
    $texte_base_css .= '--yyvtrg:' . $le_biscuit['--yyvtrg'] . ';' . PHP_EOL;
    $texte_base_css .= '--yyvtrt:' . $le_biscuit['--yyvtrt'] . '; /* taille de référence du texte */' . PHP_EOL;
    $texte_base_css .= '--yyvtrp:' . $le_biscuit['--yyvtrp'] . '; /* taille de référence du espaces ( padding ) */' . PHP_EOL;
    $texte_base_css .= '--yyvtrb:' . $le_biscuit['--yyvtrb'] . '; /* taille de référence des bordures */' . PHP_EOL;
    $texte_base_css .= '--yyvtrm:' . $le_biscuit['--yyvtrm'] . '; /* taille de référence dus marges */' . PHP_EOL;
    $texte_base_css .= '--yyvhmb:' . $le_biscuit['--yyvhmb'] . '; /* hauteur minimales des boutons */' . PHP_EOL;
    $texte_base_css .= '--yyvhal:' . $le_biscuit['--yyvhal'] . '; /* hauteur de ligne */' . PHP_EOL;
    $texte_base_css .= '--yyvhmd:' . $le_biscuit['--yyvhmd'] . '; /* hauteur du menu à défilement */' . PHP_EOL;
    $texte_base_css .= '--yyvhgb:' . $le_biscuit['--yyvhgb'] . '; /* hauteur des grands boutons ( quitter et index ) */' . PHP_EOL;
    $texte_base_css .= '--yyvhmc:' . $le_biscuit['--yyvhmc'] . '; /* hauteur minimale de conteneur ( div ) */' . PHP_EOL;
    $texte_base_css .= '}' . PHP_EOL;
    $texte_base_css .= '</style>' . PHP_EOL;
    /* on met en ligne le root car il est dynamique */
    $o1 .= $texte_base_css;
    /*
      la valeur çi dessous devrait être à false pour ne pas inclure de css dans le html renvoyé      
    */
    
    if(true){

        /* dans le cas ou ou on met le css en lien externe */
        $o1 .= '  <link rel="stylesheet" rel="preload" as="style" type="text/css" href="6.css" />' . PHP_EOL;

    }else{

        /* dans le cas ou on met tout dans le html reçu */
        $o1 .= '<style type="text/css">' . PHP_EOL;
        $o1 .= file_get_contents('6.css');
        $o1 .= '</style>' . PHP_EOL;
    }

    $o1 .= '<script type="text/javascript">' . PHP_EOL;
    /*
      attention, __gi1 doit être déclarée en "var" plutôt qu'en "let" sinon lorsqu'on ferme une sous fenêtre,  
      par l'appel à window.parent[this.#nom_de_la_variable]['fermerModale2']();
      ça ne fonctionne plus
    */
    $o1 .= 'var __gi1=null;' . PHP_EOL;
    $o1 .= '</script>' . PHP_EOL;
    $o1 .= '<script type="module" src="js/module_interface1.js" onload="initialiser_le_module_apres_chargement(this)"></script>' . PHP_EOL;
    $o1 .= '<script type="module" src="js/mf_rev1.js" onload="initialiser_le_module_apres_chargement(this)"></script>' . PHP_EOL;
    $o1 .= '<script type="text/javascript">' . PHP_EOL;
    $o1 .= '//<![CDATA[' . PHP_EOL;
    $o1 .= '"use strict";' . PHP_EOL;
    $o1 .= 'const APP_KEY=\'' . APP_KEY . '\';' . PHP_EOL;
    $o1 .= 'const CSS_TAILLE_REFERENCE_TEXTE=' . $css_taille_reference_textes . ';' . PHP_EOL;
    $o1 .= 'const CSS_TAILLE_REFERENCE_BORDER=' . $css_taille_reference_border . ';' . PHP_EOL;
    $o1 .= 'const CSS_TAILLE_REFERENCE_PADDING=' . $css_taille_reference_padding . ';' . PHP_EOL;
    $o1 .= 'const CSS_TAILLE_REFERENCE_MARGIN=' . $css_taille_reference_margin . ';' . PHP_EOL;
    $o1 .= 'const CSS_TAILLE_REFERENCE_HAUTEUR_MIN_DIV=' . $css_hauteur_mini_conteneur . ';' . PHP_EOL;
    $o1 .= 'const CSS_HAUTEUR_MENU_DEFILEMENT=' . $css_hauteur_menu_defilement . ';' . PHP_EOL;
    $o1 .= <<<EOT
const DEBUT_EXECUTION=performance.now();
const CRLF='\\r\\n';
const CR='\\r';
const LF='\\n';
const NBESPACESREV=3;
const NBESPACESSOURCEPRODUIT=4;
const __xst='__xst';
const __xme='__xme';
const __xva='__xva';
const __xer=0;
const __xsu=1;
const __xal=2;
const __xif=3;
const __entree='__entree';
/*
  =====================================================================================================================
*/
let __m_rev1=null;
let __module_html1=null;
let __module_svg1=null;
let __module_requete_sql1=null;
let __m_astphpparseur_vers_rev1=null;
let __m_astjs_vers_rev1=null;
let __m_astpostcss_vers_rev1=null;
let __m_rev_vers_js1=null;
let __m_rev_vers_php1=null;
let __m_rev_vers_sql1=null;
let __m_rev_vers_css1=null;
let __m_rev_vers_html1=null;
let __m_astphpnikic_vers_rev1=null;
let __m_astsqliteparseur_vers_rev1=null;


function initialiser_le_module_apres_chargement(element){
    if(element.src.indexOf("js/module_interface1.js") >= 0){
        import(element.src).then(function(Module){
                __gi1=new Module.interface1('__gi1',"zone_global_messages");
                __gi1.deplace_la_zone_de_message();
                __gi1.ajoute_de_quoi_faire_disparaitre_les_boutons_et_les_liens();
            });
    }else if(element.src.indexOf("js/mf_rev1.js") >= 0){
        import(element.src).then(function(Module){
                __m_rev1=new Module.c_rev1('__m_rev1');
            });
    }else if(element.src.indexOf("js/module_html.js") >= 0){
        import(element.src).then(function(Module){
                __module_html1=new Module.traitements_sur_html('__module_html1');
            });
    }else if(element.src.indexOf("js/mf_astphpparseur_vers_rev1.js") >= 0){
        import(element.src).then(function(Module){
                __m_astphpparseur_vers_rev1=new Module.c_astphpparseur_vers_rev1('__m_astphpparseur_vers_rev1');
            });
    }else if(element.src.indexOf("js/mf_astsqliteparseur_vers_rev1.js") >= 0){
         import(element.src).then(function(Module){
                __m_astsqliteparseur_vers_rev1=new Module.c_astsqliteparseur_vers_rev1('__m_astsqliteparseur_vers_rev1');
            });
    }else if(element.src.indexOf("js/mf_astphpnikic_vers_rev1.js") >= 0){
          import(element.src).then(function(Module){
                __m_astphpnikic_vers_rev1=new Module.c_astphpnikic_vers_rev1('__m_astphpnikic_vers_rev1');
            });
    }else if(element.src.indexOf("js/module_requete_sql.js") >= 0){
         import(element.src).then(function(Module){
                __module_requete_sql1=new Module.requete_sql('__module_requete_sql1','div_de_travail',true);
            });
    }else if(element.src.indexOf("js/mf_astjs_vers_rev1.js") >= 0){
         import(element.src).then(function(Module){
                __m_astjs_vers_rev1=new Module.c_astjs_vers_rev1('__m_astjs_vers_rev1');
            });
    }else if(element.src.indexOf("js/mf_astpostcss_vers_rev1.js") >= 0){
         import(element.src).then(function(Module){
                __m_astpostcss_vers_rev1=new Module.c_astpostcss_vers_rev1('__m_astpostcss_vers_rev1');
            });
    }else if(element.src.indexOf("js/mf_rev_vers_php1.js") >= 0){
         import(element.src).then(function(Module){
                __m_rev_vers_php1=new Module.c_rev_vers_php1('__m_rev_vers_php1');
            });
    }else if(element.src.indexOf("js/mf_rev_vers_js1.js") >= 0){
         import(element.src).then(function(Module){
                __m_rev_vers_js1=new Module.c_rev_vers_js1('__m_rev_vers_js1');
            });
    }else if(element.src.indexOf("js/mf_rev_vers_sql1.js") >= 0){
         import(element.src).then(function(Module){
                __m_rev_vers_sql1=new Module.c_rev_vers_sql1('__m_rev_vers_sql1');
         });
    }else if(element.src.indexOf("js/mf_rev_vers_css1.js") >= 0){
         import(element.src).then(function(Module){
                __m_rev_vers_css1=new Module.c_rev_vers_css1('__m_rev_vers_css1');
         });
    }else if(element.src.indexOf("js/mf_rev_vers_html1.js") >= 0){
         import(element.src).then(function(Module){
                __m_rev_vers_html1=new Module.c_rev_vers_html1('__m_rev_vers_html1');
         });
         
    }else if(element.src.indexOf("js/module_svg_bdd.js") >= 0){
         import(element.src).then(function(Module){
                __module_svg1=new Module.module_svg_bdd('__module_svg1','div_svg1',CSS_TAILLE_REFERENCE_BORDER,'donnees_travail');
         });
    }else{
      console.log('il faut initialiser '+element.src);
    }
    
 
}
EOT;
    $o1 .= PHP_EOL . '//]]>' . PHP_EOL . '</script>' . PHP_EOL;
    $o1 .= ' </head>' . PHP_EOL;
    $o1 .= ' <body>' . PHP_EOL;
    /*
      pour la phase de conception
      $o1.='<!-- '.$texte_base_css.' -->'.PHP_EOL;
    */
    
    if(!isset($parametres['pas_de_menu'])){

        $nombre_de_boutons=3;
        $taille=$css_hauteur_grands_boutons * $nombre_de_boutons + $nombre_de_boutons * $css_taille_reference_margin;
        $o1 .= '  <nav id="menu_haut">' . PHP_EOL;
        /*
          à gauche
        */
        $o1 .= '    <div style="display:flex;min-width:' . $taille . 'px;max-width:' . $taille . 'px;">' . PHP_EOL;
        /*
          code utf8 de la maison &#127968;
          bouton messages = 💬
        */
        $o1 .= '        <div style="display:flex;flex-grow: 1;">' . PHP_EOL;
        $o1 .= '        <a style="" href="./" class="yytbgrand ' . ('index.php' === BNF ? 'yymenusel1' : '') . '" id="buttonhome" title="page d\'accueil" style=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="6 4  49 59"><path d=" M 8 29 L 31 6 L 54 29 V 33 H 51 V 58  H 11 V 33 H 8 V 29" stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:rgb(0, 0, 0);fill:white;stroke-width:0.01;"></path><path d="M 17 57 H 11 c 0 -2 1 -4 2 -2 " stroke="rgb(0, 0, 0)" stroke-width="5" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:lawngreen;fill:transparent;stroke-width:4;"></path><rect x="20" y="27" width="7" height="7" stroke="rgb(0, 0, 0)" stroke-width="0.1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:rgb(0, 0, 0);fill:deepskyblue;stroke-width:0.1;"></rect><rect x="34" y="27" width="7" height="7" stroke="rgb(0, 0, 0)" stroke-width="0.1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:rgb(0, 0, 0);fill:deepskyblue;stroke-width:0.1;"></rect><rect x="34" y="41" width="7" height="7" stroke="rgb(0, 0, 0)" stroke-width="0.1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:rgb(0, 0, 0);fill:deepskyblue;stroke-width:0.1;"></rect><rect x="20" y="41" width="7" height="16" stroke="rgb(0, 0, 0)" stroke-width="0.1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:rgb(0, 0, 0);fill:red;stroke-width:0.1;"></rect><path d=" M 11 30 l 20 -20 l 20 20 " stroke="rgb(0, 0, 0)" stroke-width="3" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:red;fill:transparent;stroke-width:5;"></path><path d="M 30 57 H 50 c 0 -2 -1 -4 -2 -2 " stroke="rgb(0, 0, 0)" stroke-width="5" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:lawngreen;fill:transparent;stroke-width:4;"></path></svg></a>' . PHP_EOL;
        $o1 .= '        <a style="" class="noHide yytbgrand yyinfo" title="afficher ou masquer les messages" href="javascript:__gi1.masquer_ou_afficher_les_messages1()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="4 10  75 62"><path stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="miter" stroke-linecap="square" d=" M 14 15 H 67 C 70 15 72 17 72 20 V 51 C 72 54 70 56 67 56 H 30 L 18 69  V 56 H 14 C 11 56 9 54 9 51 V 20 C 9 17 11 15 14 15" style="stroke:red;fill:white;stroke-width:3;"></path><circle cx="56" cy="36" r="3" stroke="rgb(0, 0, 0)" stroke-width="3" fill="transparent" transform="" style="stroke:red;fill:red;stroke-width:3;"></circle><circle cx="41" cy="36" r="3" stroke="rgb(0, 0, 0)" stroke-width="3" fill="transparent" transform="" style="stroke:red;fill:red;stroke-width:3;"></circle><circle cx="26" cy="36" r="3" stroke="rgb(0, 0, 0)" stroke-width="3" fill="transparent" transform="" style="stroke:red;fill:red;stroke-width:3;"></circle></svg></a>' . PHP_EOL;
        $o1 .= '        </div>' . PHP_EOL;
        $o1 .= '        <a id="vv_decal_menu_gauche" class="noHide" style="visibility:hidden;" href="javascript:__gi1.menu_principal_gauche()">&lt;</a>' . PHP_EOL;
        $o1 .= '    </div>' . PHP_EOL;
        /*
          barre centrale
        */
        $o1 .= '    <div id="vv_menu_principal" class="menuScroller" style="flex-grow: 1;">' . PHP_EOL;
        $o1 .= '      <div style="display:flex;flex-grow:1;justify-content:space-around;" id="vv_scroller_principal">' . PHP_EOL;
        $idMenu=0;
        
        if(isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur']){

            $o1 .= '          <a class="' . ('traiteHtml.php' === BNF ? 'yymenusel1' : '') . '" href="traiteHtml.php?idMenu=' . $idMenu++ . '">HTML</a>' . PHP_EOL;
            $o1 .= '          <a class="' . ('traiteJs.php' === BNF ? 'yymenusel1' : '') . '" href="traiteJs.php?idMenu=' . $idMenu++ . '">JS</a>' . PHP_EOL;
            $o1 .= '          <a class="' . ('traitePhp.php' === BNF ? 'yymenusel1' : '') . '" href="traitePhp.php?idMenu=' . $idMenu++ . '">PHP</a>' . PHP_EOL;
            $o1 .= '          <a class="' . ('traiteSql.php' === BNF ? 'yymenusel1' : '') . '" href="traiteSql.php?idMenu=' . $idMenu++ . '">SQL</a>' . PHP_EOL;
            $o1 .= '          <a class="' . ('traiteCss.php' === BNF ? 'yymenusel1' : '') . '" href="traiteCss.php?idMenu=' . $idMenu++ . '">CSS</a>' . PHP_EOL;
            $o1 .= '          <a class="' . ('index_source.php' === BNF ? 'yymenusel1' : '') . '" href="index_source.php?idMenu=' . $idMenu++ . '">REV</a>' . PHP_EOL;
            $o1 .= '          <a class="' . ('zz_taches_l1.php' === BNF ? 'yymenusel1' : '') . '" href="zz_taches_l1.php?idMenu=' . $idMenu++ . '&chp_priorite_tache2=99">tâches</a>' . PHP_EOL;
            $o1 .= '          <a class="' . ('zz_cibles_l1.php' === BNF ? 'yymenusel1' : '') . '" href="zz_cibles_l1.php?idMenu=' . $idMenu++ . '">cibles</a>' . PHP_EOL;
            
            if(isset($_SESSION[APP_KEY]['cible_courante'])){

                $o1 .= '          <a class="' . ('zz_dossiers_l1.php' === BNF ? 'yymenusel1' : '') . '" href="zz_dossiers_l1.php?idMenu=' . $idMenu++ . '">dossiers</a>' . PHP_EOL;
                $o1 .= '          <a class="' . ('zz_sources_l1.php' === BNF ? 'yymenusel1' : '') . '" href="zz_sources_l1.php?idMenu=' . $idMenu++ . '">sources</a>' . PHP_EOL;
                $o1 .= '          <a class="' . ('zz_bdds_l1.php' === BNF ? 'yymenusel1' : '') . '" href="zz_bdds_l1.php?idMenu=' . $idMenu++ . '">bdds</a>' . PHP_EOL;
                $o1 .= '          <a class="' . ('zz_requetes_l1.php' === BNF ? 'yymenusel1' : '') . '" href="zz_requetes_l1.php?idMenu=' . $idMenu++ . '">rsql</a>' . PHP_EOL;
                $o1 .= '          <a class="' . ('zz_rev_l1.php' === BNF ? 'yymenusel1' : '') . '" href="zz_revs_l1.php?idMenu=' . $idMenu++ . '">revs</a>' . PHP_EOL;

            }


        }

        $o1 .= '      </div>' . PHP_EOL;
        $o1 .= '    </div>' . PHP_EOL;
        /*
          à droite
        */
        $nombre_de_boutons=2;
        $taille=$css_hauteur_grands_boutons * $nombre_de_boutons + $nombre_de_boutons * $css_taille_reference_margin;
        $o1 .= '<div style="display:flex;min-width:' . $taille . 'px;max-width:' . $taille . 'px;">';
        $o1 .= '        <a id="vv_decal_menu_droite" class="noHide"  style="visibility:hidden;" href="javascript:__gi1.menu_principal_droite()">&gt;</a>' . PHP_EOL;
        
        if(isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur']){

            $o1 .= '      <a id="buttonQuit2" title="quitter" href="aa_login.php?a=logout" alt="" class="yytbgrand yydanger"><svg xmlns="http://www.w3.org/2000/svg" viewBox="19 4  130 142"><path d=" M 73 80 A 34 35 48 1 1 92 60 l 46 46 l 0 21 l -22 0 l 0 -12 l -11 0 l 0 -11 l -11 0 l 0 -11 l -8 0 l -13 -13 " stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:red;fill:gold;stroke-width:4;"></path><circle cx="51" cy="38" r="8" stroke="rgb(0, 0, 0)" stroke-width="4" fill="transparent" transform="" style="stroke:red;fill:black;stroke-width:4;"></circle></svg></a>' . PHP_EOL;

        }else{

            
            if(BNF !== 'aa_login.php'){

                $o1 .= '    <a id="buttonQuit2"  title="quitter" href="aa_login.php?a=logout" alt="" class="yytbgrand yysucces"><svg xmlns="http://www.w3.org/2000/svg" viewBox="19 4  130 142"><path d=" M 73 80 A 34 35 48 1 1 92 60 l 46 46 l 0 21 l -22 0 l 0 -12 l -11 0 l 0 -11 l -11 0 l 0 -11 l -8 0 l -13 -13 " stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:red;fill:gold;stroke-width:4;"></path><circle cx="51" cy="38" r="8" stroke="rgb(0, 0, 0)" stroke-width="4" fill="transparent" transform="" style="stroke:red;fill:black;stroke-width:4;"></circle></svg></a>' . PHP_EOL;

            }else{

                $o1 .= '    <span class="yytbgrand"><svg xmlns="http://www.w3.org/2000/svg" viewBox="19 4  130 142"><path d=" M 73 80 A 34 35 48 1 1 92 60 l 46 46 l 0 21 l -22 0 l 0 -12 l -11 0 l 0 -11 l -11 0 l 0 -11 l -8 0 l -13 -13 " stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:red;fill:gold;stroke-width:4;"></path><circle cx="51" cy="38" r="8" stroke="rgb(0, 0, 0)" stroke-width="4" fill="transparent" transform="" style="stroke:red;fill:black;stroke-width:4;"></circle></svg></span>' . PHP_EOL;
            }

        }

        $o1 .= '    </div>' . PHP_EOL;
        $o1 .= '  </nav>' . PHP_EOL;

    }

    $o1 .= '  <main id="contenuPrincipal">' . PHP_EOL;
    $les_messages=recupere_les_messages_de_session(BNF);
    $o1 .= '   <div id="zone_global_messages" style="visibility:' . $les_messages[0] . ';">' . $les_messages[1] . '</div>' . PHP_EOL;
    return $o1;

}
/*
  =====================================================================================================================
*/
function html_footer1($parametres=array()){

    $o1='';
    $o1 .= '</main>' . PHP_EOL;
    $o1 .= '<dialog id="modale1">' . PHP_EOL . ' <a id="__fermerModale1" href="javascript:__gi1.fermerModale2()" class="yydanger">×</a>' . PHP_EOL;
    $o1 .= ' <div id="__message_modale" style="max-height:200px;overflow-y:scroll;position:fixed;width:75vw;"></div>' . PHP_EOL;
    $o1 .= ' <div id="__contenu_modale">' . PHP_EOL;
    $o1 .= '  <iframe id="iframe_modale_1" src=""></iframe>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= '</dialog>' . PHP_EOL;
    $o1 .= '<div id="bas_de_page">' . PHP_EOL;
    $o1 .= '<a href="javascript:__gi1.vers_le_haut_de_la_page(0,150)" style="font-size:2em;opacity:0.5;">⇑</a>' . PHP_EOL;
    
    if(!preg_match('/.*_a[0-9]+\.php/',BNF)){

        $o1 .= '<a href="javascript:__gi1.fixer_les_dimentions(\'dimension_du_texte\')" style=""   title="taille texte">A' . $GLOBALS['__le_biscuit']['--yyvtrt'] . '</a>' . PHP_EOL;
        $o1 .= '<a href="javascript:__gi1.fixer_les_dimentions(\'dimension_du_padding\')" style="" title="taille espace">p' . $GLOBALS['__le_biscuit']['--yyvtrp'] . '</a>' . PHP_EOL;
        $o1 .= '<a href="javascript:__gi1.fixer_les_dimentions(\'dimension_du_border\')" style=""  title="taille bordure">b' . $GLOBALS['__le_biscuit']['--yyvtrb'] . '</a>' . PHP_EOL;
        $o1 .= '<a href="javascript:__gi1.fixer_les_dimentions(\'dimension_du_margin\')" style=""  title="taille marge">m' . $GLOBALS['__le_biscuit']['--yyvtrm'] . '</a>' . PHP_EOL;
        $o1 .= '<a href="javascript:__gi1.fixer_les_parametres_pour_une_liste(&quot;' . enti1(BNF) . '&quot;)" style="opacity:0.5;">⚙️</a>' . PHP_EOL;

    }

    $o1 .= '</div>' . PHP_EOL;
    
    if(isset($parametres['module_a_inclure'])){

        foreach($parametres['module_a_inclure'] as $k1 => $v1){
            
            if($v1 !== ''){

                $o1 .= '  <script type="module" src="' . $v1 . '" onload="initialiser_le_module_apres_chargement(this)"></script>' . PHP_EOL;

            }

        }

    }

    
    if(isset($parametres['js_a_inclure'])){

        foreach($parametres['js_a_inclure'] as $k1 => $v1){
            
            if($v1 !== ''){

                $o1 .= '  <script type="text/javascript" src="' . $v1 . '"></script>' . PHP_EOL;

            }

        }

    }

    $o1 .= '<script type="text/javascript">' . PHP_EOL;
    $o1 .= '"use strict";' . PHP_EOL;
    
    if(isset($parametres['js_a_executer_apres_chargement'])){

        $o1 .= 'function fonctionDeLaPageAppeleeQuandToutEstCharge(){' . PHP_EOL;
        $txt1='';
        foreach($parametres['js_a_executer_apres_chargement'] as $k1 => $v1){
            
            if(isset($v1['nomDeLaFonctionAappeler'])){

                
                if($txt1 != ''){

                    $txt1 .= ',' . PHP_EOL;

                }

                $txt1 .= ' ' . json_encode($v1,JSON_FORCE_OBJECT) . '';

            }

        }
        $o1 .= ' var arrayLocalJs=[' . PHP_EOL . $txt1 . PHP_EOL . ' ];' . PHP_EOL;
        $o1 .= ' setTimeout(function(){__gi1.executerCesActionsPourLaPageLocale2(arrayLocalJs);},100);' . PHP_EOL;
        $o1 .= '}' . PHP_EOL;

    }else{

        $o1 .= 'function fonctionDeLaPageAppeleeQuandToutEstCharge(){ /* on ne fait rien */};' . PHP_EOL;
    }

    /* document.addEventListener("DOMContentLoaded",function(event){});     *_/*/
    $o1 .= <<<EOT
window.addEventListener("load",function(event){
 /* console.log('tout est chargé'); */
 fonctionDeLaPageAppeleeQuandToutEstCharge();
});
EOT;
    $o1 .= '</script>' . PHP_EOL;
    $o1 .= '</body></html>' . PHP_EOL;
    
    if(isset($parametres['ne_pas_supprimer_les_valeurs_de_session_sur_un_choix'])){


    }else{

        supprimerLesParametresDeNavigationEnSession();
    }

    return $o1;

}
/*
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-26.3303 -10.7052  56.3303 58.7052">
  <title>poubelle</title>
  <path stroke-linecap="round" stroke-linejoin="round" d=" M -12 -4 H 12 V 6 H 24 V 12 H -24 V 6 H -12 V -4 M 8 0 H -8 V 7  H 8 V 0" style="fill:white;stroke:red;stroke-width:2;stroke-opacity:1;fill-opacity:1;opacity:1;" transform="translate(-2 -3) rotate(-9 0 0)  "></path>
  <path d="M -24 14 H 24 V 42 H -24 V 14 M -10 20 H -18 V 38 H -10 V 20 M 4 20 H -4 V 38 H 4 V 20 M 18 20 H 10 V 38 H 18 V 20 " stroke="rgb(0, 0, 0)" stroke-width="4" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="   " style="stroke:red;fill:white;stroke-width:2;"></path>
  </svg>
*/