<?php
/*  exemple de programme très simple en php : on a déjà écrit cette page en html */
require_once('index.html');
/*
  fonction php qui ne sert à rien mais c'est pour l'exemple
*/

function ne_sert_a_rien0($par1=array(),&$par2){

    echo 'c\'est pour l\'exemple' ;

}?>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>

function ne_sert_a_rien_1(){
    var a=1;
    console.log('c\'est pour l\'exemple 1');
}
//</source_javascript_rev>
//]]>
</script>

<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>

function ne_sert_a_rien_2(){
    var b=2;
    console.log('c\'est pour l\'exemple 2');
}
//</source_javascript_rev>
//]]>
</script>

<?php
echo '' ;?>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>

function ne_sert_a_rien_3(){
    var c=3;
    console.log('c\'est pour l\'exemple 3');
}
//</source_javascript_rev>
//]]>
</script>

<?php