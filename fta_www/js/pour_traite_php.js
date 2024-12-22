"use strict";
/*
  =====================================================================================================================
*/
function transform_text_area_php_en_rev3(nom_de_la_text_area_php,nom_de_la_text_area_rev,options_traitement){
    var options_traitement = JSON.parse(options_traitement.replace(/\'/g,'"'));
    document.getElementById('txtar2').value='Veuillez patienter !';
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_de_la_text_area_php);
    localStorage.setItem("fta_indexhtml_php_dernier_fichier_charge",a.value);
    var lines = a.value.split(/\r|\r\n|\n/);
    var count=lines.length;
    
    try{
        // {parser:{extractDoc: true,php7: true,},ast:{withPositions: true}}
        
        var startMicro = performance.now();
        var parseur=window.PhpParser.Engine({parser:{extractDoc: true},ast:{withPositions: true}});
        var ast_de_php=parseur.parseCode(a.value);
        
        var obj=__module_php_parseur1.traite_ast(ast_de_php,options_traitement);
        if(obj.__xst===true){
            document.getElementById(nom_de_la_text_area_rev).value=obj.__xva;;
        }else{
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar1');
         
        }
        
        
        var endMicro = performance.now();
        console.log(endMicro - startMicro);
         
    }catch(e){
        if(e.lineNumber){
             logerreur({"__xst" : false ,"__xme" : 'erreur dans le source php : <br />'+e.message, line:e.lineNumber});
        }else{
             logerreur({"__xst" : false ,"__xme" : 'erreur dans le source php : <br />'+e.message});
        }
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar1');
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar2');
}    
/*
  =====================================================================================================================
*/
function transform_text_area_php_en_rev2(nom_de_la_text_area_php,nom_de_la_text_area_rev,options_traitement){
    var options_traitement = JSON.parse(options_traitement.replace(/\'/g,'"'));
    document.getElementById('txtar2').value='Veuillez patienter !';
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_de_la_text_area_php);
    localStorage.setItem("fta_indexhtml_php_dernier_fichier_charge",a.value);
    var lines = a.value.split(/\r|\r\n|\n/);
    var count=lines.length;
    try{
        var ret = recupereAstDePhp2(a.value,{"zone_php" : nom_de_la_text_area_php ,"zone_rev" : nom_de_la_text_area_rev ,"options_traitement" : options_traitement},traitement_apres_recuperation_ast_de_php2);
        if(ret.__xst === false){
            return(astphp_logerreur({"__xst" : false ,"__xme" : 'il y a une erreur d\'envoie du source php à convertir'}));
            ret=false;
        }
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar2');
    }catch(e){
        console.log('erreur transform 0178',e);
        ret=false;
    }
}
/*
  =====================================================================================================================
*/
function chargerSourceDeTestPhp(){
    var t=`<?php
$a=realpath(dirname(dirname(dirname(__FILE__))));
require($a.'/phplib/vendor/autoload.php');
/*
https://github.com/nikic/php-parser
*/
use PhpParser\\Error;
use PhpParser\\NodeDumper;
use PhpParser\\ParserFactory;

function recupererAstDePhp(&$data){
    $parser = (new ParserFactory())->createForNewestSupportedVersion();
    try {
        $ast = $parser->parse($data[__entree]['texteSource']);
        $data[__xva]=json_encode($ast);
        $data[__xst]=true;
    } catch (Error $error) {
       $data[__xms][]=$error->getMessage();
       return;
    }
}
/* si vous devez intégrer du javascript dans du html dans du php, mettez la partie javascript dans des CDATA */
$i=0;
while($i<5){
  if(1===1){
    for($i=0;$i<10;$i++){
      ?>hello<?php echo ' world';?> and others
<script type="text/javascript">
//<![CDATA[
  for(var i=0;i<10;i++){
      console.log('on est dans du javascript dans du html dans du php :-]');
  }
//]]>  
</script>
<?php
    }
  }
}
?>
<script type="text/javascript">
//<![CDATA[
  var b=2;
//]]>  
</script>
<script type="text/javascript">
//<![CDATA[
  var c=2;
//]]>  
</script>

`;
    document.getElementById('txtar1').value=t;
}
function chargerLeDernierSourcePhp(){
    var fta_indexhtml_php_dernier_fichier_charge = localStorage.getItem("fta_indexhtml_php_dernier_fichier_charge");
    if(fta_indexhtml_php_dernier_fichier_charge !== null){
        document.getElementById('txtar1').value=fta_indexhtml_php_dernier_fichier_charge;
    }
}