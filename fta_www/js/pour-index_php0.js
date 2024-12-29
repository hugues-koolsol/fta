/*
  var startMicro=performance.now();
  var endMicro=performance.now();  console.log('temps=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');
  
  
  var chaine = '  antislash \\ quot \' antislash*3+quot \\\' ';
  var t=chaine.replace(/[^\\]'/g,"\\'");
  alert('{'+chaine +'}\n{'+ t+'}');
  
  
  var aa='"\'';
  alert('<'+aa+'>')
  var bb=aa.replace(/"/,'\\"')
  var c='';
  var me='c="<'+bb+'>"';
  eval(me);
  alert(c);
  
  
  var aaa="\\'\"\\[]";
  var bbb=aaa.replace(/\\/g,"&#92;").replace(/'/g,'&apos;').replace(/"/g,"&quot;").replace(/\[/g,"crochetOuvrant");
  alert(bbb);
  
  =====================================================================================================================
*/
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
)
a( p(/ " \\' \\" \\n \\r \\\\r \\\\n \\\\\\\\ /g) , p(" \\\\ \\" \\\\\\" \\n \\r '") , p(' \\\\ \\' \\n \\r "  ') ),
#(
p('\\\\\\' \\' \\r \\n ')


        a( p(/ " \\' \\" \\n \\r \\\\r \\\\n \\\\\\\\ /g) , p(" \\\\ \\" \\n \\r '") , p(' \\\\ \\n \\r "  ') ),

appelf(nomf(f),p(/\\\\\\\\n/g),p('\\\\n'),p('\\\\r'))
      affecte(sql , "\\r\\n \\" \\\\\\\\
      select * from toto
      "),

      affecte(sql , '\\n \\r \\\\r \\\\n 
      select * from toto
      '),

\
)
`;
    document.getElementById('txtar1').value=t;
    var lines = t.split(/\r|\r\n|\n/);
    var count=lines.length;
    document.getElementById('txtar1').setAttribute('rows',count + 1);
    transformLeRev();
}
/* ===================================================================================================================== */
function transformLeRev(autoriser_constante_dans_la_racine=false){
    /* ✍"àà" */
    __gi1.raz_des_messages();
    console.log('\n=========================\ndébut de transforme');
    document.getElementById('resultat1').innerHTML='';
    var a = document.getElementById('txtar1');
    localStorage.setItem("fta_indexhtml_dernier_fichier_charge",a.value);
    var lines = a.value.split(/\r|\r\n|\n/);
    var count=lines.length;
    a.setAttribute('rows',count + 1);
    var beginMicro = performance.now();
    var startMicro = performance.now();
    var tableau1 = iterateCharacters2(a.value);
    var endMicro = performance.now();
    console.log('mise en tableau endMicro=',(parseInt((endMicro - startMicro) * 1000,10) / 1000) + ' ms');
    /* ✍  console.log(a.value.substr(4,1),a.value.length) */
    var startMicro = performance.now();
    var matriceFonction1 = functionToArray2(tableau1.out,true,autoriser_constante_dans_la_racine,'');
    var endMicro = performance.now();
    console.log('analyse syntaxique endMicro=',(parseInt((endMicro - startMicro) * 1000,10) / 1000) + ' ms');
    var tempsTraitement = (parseInt((endMicro - beginMicro) * 1000,10) / 1000) + ' ms';
    console.log(matriceFonction1);
    /* ✍  console.log(JSON.stringify(matriceFonction1.value)); */
    document.getElementById('resultat1').innerHTML='';
    if(matriceFonction1.__xst === true){
        var parent = document.getElementById('resultat1');
        var startMicro = performance.now();
        var fonctionReecriteAvecRetour1 = arrayToFunct1(matriceFonction1.__xva,true);
        var diResultatsCompactes = document.createElement('pre');
        if(fonctionReecriteAvecRetour1.__xst === true){
            var compacteOriginal = arrayToFunct1(matriceFonction1.__xva,false);
            var tableau2 = iterateCharacters2(fonctionReecriteAvecRetour1.__xva);
            var matriceDeLaFonctionReecrite = functionToArray2(tableau2.out,true,autoriser_constante_dans_la_racine,'');
            var compacteReecrit = arrayToFunct1(matriceDeLaFonctionReecrite.__xva,false);
            if(compacteOriginal.__xst === true && compacteReecrit.__xst === true){
                if(compacteOriginal.__xva == compacteReecrit.__xva){
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<hr /><b style="color:green;">👍 sources compactés Egaux</b><br />';
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<textarea rows="3" cols="30" style="overflow:scroll;" autocorrect="off" autocapitalize="off" spellcheck="false">' + (strToHtml(compacteOriginal.__xva)) + '</textarea>';
                    logerreur({"__xst" : true ,"__xme" : '👍 sources compactés Egaux : ' + tempsTraitement});
                }else{
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<hr /><b style="color:red;">💥sources compactés différents</b>';
                    logerreur({"__xst" : false ,"__xme" : '💥sources compactés différents'});
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<br />o=' + compacteOriginal.__xva;
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<br />r=' + compacteReecrit.__xva;
                }
            }else{
                diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<hr /><b style="color:red;">compacteOriginal=' + (JSON.stringify(compacteOriginal)) + '</b>';
                diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<br /><b style="color:red;">compacteReecrit=' + (JSON.stringify(compacteReecrit)) + '</b>';
            }
        }
        var endMicro = performance.now();
        console.log('tests compactes=',(parseInt((endMicro - startMicro) * 1000,10) / 1000) + ' ms');
        document.getElementById('resultat1').appendChild(diResultatsCompactes);
        var fonctionReecriteAvecEtColoration1 = arrayToFunct1(matriceFonction1.__xva,true);
        var difonctionReecriteAvecRetour1 = document.createElement('pre');
        difonctionReecriteAvecRetour1.style.fontSize='0.9em';
        if(fonctionReecriteAvecEtColoration1.__xst === true){
            difonctionReecriteAvecRetour1.innerHTML='<hr  />arrayToFunctNoComment2:<hr /><textarea class="txtar1" rows="10">' + (strToHtml(fonctionReecriteAvecEtColoration1.__xva)) + '</textarea>';
        }else{
            difonctionReecriteAvecRetour1.innerHTML='<hr />💥arrayToFunctNoComment2:<textarea class="txtar1" rows="10">' + (strToHtml(fonctionReecriteAvecRetour1.message)) + '</textarea>';
        }
        document.getElementById('resultat1').appendChild(difonctionReecriteAvecRetour1);
        var t0 = document.createElement('div');
        t0.style.overflowX='scroll';
        var t1 = document.createElement('table');
        __gi1.construit_tableau_html_de_le_matrice_rev(t1,matriceFonction1);
        t0.appendChild(t1);
        document.getElementById('resultat1').appendChild(t0);
        var t0 = document.createElement('div');
        t0.style.overflowX='scroll';
        var t2 = document.createElement('table');
        __gi1.construit_un_html_du_tableau_des_caracteres(t2,a.value,tableau1);
        t0.appendChild(t2);
        document.getElementById('resultat1').appendChild(t0);
    }else{
        var t2 = document.createElement('table');
        __gi1.construit_un_html_du_tableau_des_caracteres(t2,a.value,tableau1);
        document.getElementById('resultat1').appendChild(t2);
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar1');
}
/* ===================================================================================================================== */
function chargerLeDernierSourceRev(){
    var fta_indexhtml_dernier_fichier_charge = localStorage.getItem("fta_indexhtml_dernier_fichier_charge");
    /* ✍ console.log('fta_indexhtml_dernier_fichier_charge=' , fta_indexhtml_dernier_fichier_charge ); */
    if(fta_indexhtml_dernier_fichier_charge !== null){
        document.getElementById('txtar1').value=fta_indexhtml_dernier_fichier_charge;
        var lines = fta_indexhtml_dernier_fichier_charge.split(/\r|\r\n|\n/);
        var count=lines.length;
        document.getElementById('txtar1').setAttribute('rows',count + 1);
        /* ✍  sessionStorage.setItem("clé", "valeur_fenetre2"); */
    }
}
chargerLeDernierSourceRev();