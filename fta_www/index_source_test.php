<?php

define('BNF' , basename(__FILE__));
require_once('aa_include.php');
session_start();
start_session_messages();
/*
  // ======================================================== 
  // affichage de l'entête html 
*/
$o1='';
$a=array( 'title' => 'accueil', 'description' => 'accueil');
$o1=html_header1($a);
$o1=concat($o1,session_messages());
/*//      on imprime le texte ...,*/
print($o1);
/*//  ... puis on le reinitialise,*/
$o1='';
?>

    <!-- // ===================================================== -->
    <table>
      <tr>
        <td>
          <button onclick="charger('source4.txt')">
            source4
          </button>
          <button onclick="charger('source5.txt')">
            source5
          </button>
          <button onclick="charger('source6.txt')">
            source6
          </button>
        </td>
        <td>
          <textarea id="zonesource" cols="100" rows="60"></textarea>
          <div>
            <button onclick="enregistrer()">
              Enregistrer
            </button>
          </div>
        </td>
        <td style="vertical-align: text-top;">
          <textarea id="normalise" cols="100" rows="10"></textarea>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <div id="message_erreur"></div>
        </td>
      </tr>
    </table>
    <!-- 
      // =====================================================
      // et un javascript dans le html
      // =====================================================
     -->
    <script type="text/javascript" data-lang="fr">
// = = = = <source javascript = = = =
"use strict";

/*
  // ====================================================================
  // fonction met la zone normalisée à la même hauteur que la zone source
  // ====================================================================
*/
function memeHauteur(normalise,source){
  var zoneSource=null;
  var zonenormalisée=null;
  zoneSource=document.getElementById(source);
  zonenormalisée=document.getElementById(normalise);
  var bou=null;
  bou=zoneSource.getBoundingClientRect();
  var t='';
  t=concat(bou.height,'px');
  zonenormalisée.style.height=t;
}
/*
  // =====================================================
  // fonction qui ajuste la largeur d'une zone de textarea
  // =====================================================
*/
function ajusteTailleTextareaContenantSource(nomZone){
  var zoneSource=null;
  zoneSource=document.getElementById(nomZone);
  var tab=[];
  tab=zoneSource.value.split('\n');
  var i=0;
  var largeur=0;
  for(i=0;i < tab.length;i=i+1){
    if((tab[i].length > largeur)){
      largeur=tab[i].length;
    }
  }
  largeur=largeur+5;
  if((largeur > 100)||largeur <= 0){
    largeur=100;
  }
  zoneSource.cols=largeur;
}
/*
  // ==============================================
  // fonction qui convertit et enregistre le source
  // ==============================================
*/
function enregistrer(){
  /*
    // =========================
    // raz de la zone de message
  */
  var zoneMessageErreur=null;
  zoneMessageErreur=document.getElementById('message_erreur');
  zoneMessageErreur.innerHTML='';
  /*
    // ===================================================
    // déclaration et affectation des zones de l'interface
  */
  var zoneNormalisée=null;
  var zoneSource=null;
  zoneNormalisée=document.getElementById('normalise');
  zoneSource=document.getElementById('zonesource');
  /*
    // ===============================================================
    // on essaie de reconstruire la fonction pour détecter des erreurs
  */
  var testSourceReconstruit={};
  testSourceReconstruit=compareSourceEtReconstruit(zoneSource.value);
  /*
    // =============================================================
    // conversion de la fonction en javascript 
    // en déclenchant une erreur si il y a une erreure de parenthese
  */
  var arr={};
  arr=functionToArray(zoneSource.value,true);
  if((arr.status == true)){
    /*
      // =============================================================
      // si pas d'erreur on construit le source normalise
    */
    var sourceNormalisé={};
    sourceNormalisé=arrayToFunctNormalize(arr.value,true);
    if((sourceNormalisé.status == true)){
      document.getElementById('normalise').value=sourceNormalisé.value;
      ajusteTailleTextareaContenantSource('normalise');
      memeHauteur('normalise','zonesource');
      arr=writePhpFile(zoneSource,arr);
      if((arr.status == false)){
        console.log(arr);
      }
    }
  }else{
    if(((arr.levelError)&&(arr.levelError == true))||((arr.message)&&(arr.message != ''))){
      zoneMessageErreur.innerHTML=concat(zoneMessageErreur.innerHTML,'\n',arr.message);
    }
    sourceNormalisé=arrayToFunctNormalize(arr.value,true);
    if((sourceNormalisé.status == true)){
      document.getElementById('normalise').value=srcNormalise.value;
      ajusteTailleTextareaContenantSource('normalise');
      memeHauteur('normalise','zonesource');
    }
  }
}
/*
  // ========================================================
  // fonction appelée après le chargement du fichier source
  // ========================================================
*/
function afficherFichierSource(source){
  if((source.nomZone)&&(source.status == true)){
    document.getElementById(source.nomZone).value=source.value;
    ajusteTailleTextareaContenantSource(source.nomZone);
  }else{
    console.log(source);
  }
}
/*
  // =============================================================================
  // fonction appelée quand on clique sur un bouton pour charger un fichier source
  // =============================================================================
*/
function charger(nomsource){
  document.getElementById('normalise').value='';
  chargerFichierSource(nomsource,afficherFichierSource,'zonesource');
}
// = = = = source javascript> = = = =

    </script>

<?php

$a=array( 'js' => array( 'js/php.js', 'js/javascript.js', 'js/html.js'));
$o1=concat($o1,html_footer1($a));
print($o1);
/*// ... puis on le reinitialise*/
$o1='';
?>