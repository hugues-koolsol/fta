"use strict";

/*
  entête[
  ['id','id'                                 ,''], // 00
  ['val','value'                             ,''],
  ['typ','type'                              ,''],
  ['niv','niveau'                            ,''],
  ['coQ','constante quotee'                  ,''],
  ['pre','position du premier caractère'     ,''], // 05
  ['der','position du dernier caractère'     ,''],
  ['pId','Id du parent'                      ,''], // 10 ->  7
  ['nbE','nombre d\'enfants'                 ,''], // 11 ->  8
  ['nuE','numéro enfants'                    ,''], // 12 ->  9
  ['pro','profondeur'                        ,''], // 15 -> 10
  ['pop','position ouverture parenthese'     ,''], // 22 -> 11
  ['pfp','position fermeture parenthese'     ,''], // 23 -> 12
  ['com','commentaire'                       ,''],  
  
  ];
  
  
  =====================================================================================================================
*/
function js_texte_convertit_texte_en_rev_racine(le_texte,niveau){
    var t = 'texte(`' + le_texte.replace(/`/g,'\\`') + '`)';
    return({"__xst" : true ,"value" : t});
}
/*
  =====================================================================================================================
*/
function convertir_tableau_rev_vers_texte_racine(tab,id,niveau){
    /*
      appel à la fonction récursive
    */
    var ob = convertir_tableau_rev_vers_texte1(tab,id,niveau);
    if(ob.__xst === true){
        if(ob.value.substr(0,2) === CRLF){
            ob.value=ob.value.substr(2);
        }
    }
    return ob;
}
/*
  =====================================================================================================================
*/
function convertir_tableau_rev_vers_texte1(tab,id,niveau){
    var t='';
    var i=0;
    var contenu='';
    var l01=tab.length;
    for( i=id + 1 ; i < l01 && tab[i][3] >= tab[id][3] ; i++ ){
        /*
          pour chaque élément du tableau dont le niveau est supérieur ou égal à l'id de référence
        */
        if(tab[i][7] === id){
            /*
              si c'est un enfant de la référence
            */
            if(tab[i][2] === 'f'){
                /*
                  si c'est une fonction alors on accepte deux fonctions ....
                */
                if(tab[i][1] === '#'){
                    /*
                      ... la fonction commentaire pour laquelle on ne fait rien
                    */
                }else if(tab[i][1] === 'texte'){
                    /*
                      ... la fonction texte pour laquelle on appelle le récursif 
                    */
                    var objTexte = convertir_tableau_rev_vers_texte1(tab,i,niveau);
                    if(objTexte.__xst === true){
                        t+=objTexte.value;
                    }else{
                        return(logerreur({"__xst" : false ,"id" : i ,"__xme" : '0070 erreur dans un texte'}));
                    }
                }else{
                    return(logerreur({"__xst" : false ,"id" : i ,"__xme" : '0067seules les fonctions texte et # sont admises dans un texte'}));
                }
            }else if(tab[i][2] === 'c'){
                /*
                  si c'est une constante, on ajoute le texte
                */
                if(tab[i][4] === 0){
                    /* c'est une constante non quotée, on ne fait aucune transformation */
                    contenu=tab[i][1];
                }else if(tab[i][4] === 1){
                    /* c'est une constante quotée par des apostrophes ['] */
                    contenu=tab[i][1].replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
                }else if(tab[i][4] === 2){
                    /* c'est une constante quotée par des apostrophes inversés / accent graves [`] */
                    contenu=tab[i][1].replace(/\\`/g,'`').replace(/\\\\/g,'\\');
                }else if(tab[i][4] === 3){
                    /* c'est une constante quotée par des guillemets ["] */
                    contenu=tab[i][1].replace(/\\\"/g,'"').replace(/\\\\/g,'\\');
                }else if(tab[i][4] === 4){
                    /* c'est une constante quotée par des slashs [/] */
                    contenu=tab[i][1].replace(/\\\//g,'/').replace(/\\\\/g,'\\');
                }
                contenu=contenu.replace(/¶CR¶/g,'\r').replace(/¶LF¶/g,'\n');
                t+=contenu;
            }
        }
    }
    return({"__xst" : true ,"value" : t});
}