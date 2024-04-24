<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();


$o1='';
$o1=html_header1(array('title'=>'php home' , 'description'=>'php home'));
print($o1);$o1='';
?>
        <h1>PHP HOME</h1>
        <ul class="menu2">
            <li>
                <a href="javascript:chargerSourceDeTest()">source de test</a>
            </li>
        </ul>
        <textarea class="txtar1" id="txtar1" rows="10"></textarea>
        <a href="javascript:transformLeRev()">transform</a>
        <div id="message1"></div>
        <div id="resultat1"></div>
<script type="text/javascript" src="js/core5.js"></script>

<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>

        function chargerSourceDeTest(){
            var t=`#( début aaaa  debut),
a(
  #(test , 👍),
  b(
    xx(
      y(
        #(dedans
          commentaire bloc
        ),
        t,
        v),
      #(aa),
      xx(
        #(dedans
          commentaire bloc
        )),
      #( bb),
      5,
      #(cc
      )
    ),
    #(comment 1),
    y(
      ' dd&nbsp;',
      #( bla
blu),
      ee,
      2,
      #( @ )
    ),
    #( comment 2 ),
    a(b())
  ),
  #(Iñtërnâtiônàà̀lizætiøn ☃ 💩 ❤ 😁 👍),
  f(g),
  #(👍😁💥💪👎☀🌞🟥🟩"àà")
)`;
            dogid('txtar1').value=t;
        }
        function chargerLeDernierSourceRev(){
            var fta_indexhtml_dernier_fichier_charge = localStorage.getItem('fta_indexhtml_dernier_fichier_charge');
            if(fta_indexhtml_dernier_fichier_charge !== null){
                dogid('txtar1').value=fta_indexhtml_dernier_fichier_charge;
            }
        }
        function transformLeRev(){
            clearMessages();
            console.log('\n=========================\ndébut de transforme');
            document.getElementById('message1').innerHTML='';
            document.getElementById('resultat1').innerHTML='';
            var a = document.getElementById('txtar1');
            localStorage.setItem('fta_indexhtml_dernier_fichier_charge',a.value);
            var lines = mySplit(a.value,'\\r|\\r\\n|\\n');
            var count=lines.length;
            a.setAttribute('rows',(count+1));
            var startMicro = performance.now();
            var tableau1 = iterateCharacters2(a.value);
            var endMicro = performance.now();
            console.log('mise en tableau endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
            console.log(a.value.substr(4,1),a.value.length);
            var startMicro = performance.now();
            var matriceFonction1 = functionToArray2(tableau1.out,true,false);
            var endMicro = performance.now();
            console.log('analyse syntaxique endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
            document.getElementById('message1').innerHTML='';
            document.getElementById('resultat1').innerHTML='';
            if(matriceFonction1.status === true){
                var parent = document.getElementById('resultat1');
                var startMicro = performance.now();
                var fonctionReecriteAvecRetour1 = arrayToFunct1(matriceFonction1.value,true,false);
                var diResultatsCompactes = document.createElement('pre');
                if(fonctionReecriteAvecRetour1.status === true){
                    var compacteOriginal = arrayToFunct1(matriceFonction1.value,false,false);
                    var tableau2 = iterateCharacters2(fonctionReecriteAvecRetour1.value);
                    var matriceDeLaFonctionReecrite = functionToArray2(tableau2.out,true,false);
                    var compacteReecrit = arrayToFunct1(matriceDeLaFonctionReecrite.value,false,false);
                    if((compacteOriginal.status == true) && (compacteReecrit.status === true)){
                        if(compacteOriginal.value == compacteReecrit.value){
                            diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:green;">👍 sources compactés Egaux</b><textarea rows="1" cols="30">'+strToHtml(compacteOriginal.value)+'</textarea>';
                        }else{
                            diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">💥sources compactés différents</b>';
                            diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br />o='+compacteOriginal.value;
                            diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br />r='+compacteReecrit.value;
                        }
                    }else{
                        diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">compacteOriginal='+JSON.stringify(compacteOriginal)+'</b>';
                        diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br /><b style="color:red;">compacteReecrit='+JSON.stringify(compacteReecrit)+'</b>';
                    }
                }
                var endMicro = performance.now();
                console.log('tests compactes=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
                document.getElementById('resultat1').appendChild(diResultatsCompactes);
                var fonctionReecriteAvecEtColoration1 = arrayToFunct1(matriceFonction1.value,true,true);
                var difonctionReecriteAvecRetour1 = document.createElement('pre');
                difonctionReecriteAvecRetour1.style.fontSize='0.8em';
                if(fonctionReecriteAvecEtColoration1.status === true){
                    difonctionReecriteAvecRetour1.innerHTML='<hr  />arrayToFunctNoComment2:<hr />'+fonctionReecriteAvecEtColoration1.value;
                }else{
                    difonctionReecriteAvecRetour1.innerHTML='<hr />💥arrayToFunctNoComment2:'+fonctionReecriteAvecRetour1.message;
                }
                document.getElementById('resultat1').appendChild(difonctionReecriteAvecRetour1);
                var t1 = document.createElement('table');
                ConstruitHtmlMatrice(t1,matriceFonction1);
                document.getElementById('resultat1').appendChild(t1);
                var t2 = document.createElement('table');
                ConstruitHtmlTableauCaracteres(t2,a.value,tableau1);
                document.getElementById('resultat1').appendChild(t2);
            }else{
                var t2 = document.createElement('table');
                ConstruitHtmlTableauCaracteres(t2,a.value,tableau1);
                document.getElementById('resultat1').appendChild(t2);
            }
            displayMessages('message1');
        }
        chargerLeDernierSourceRev();
//</source_javascript_rev>
//]]>
</script>

<?php
$o1.=html_footer1(array());
print($o1);$o1='';