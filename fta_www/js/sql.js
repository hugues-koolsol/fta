
"use strict";
/*
  
  sur sqlite
  selection des tables
  SELECT * FROM sqlite_master WHERE  name NOT LIKE 'sqlite_%'
  PRAGMA table_info('tbl_cibles')
  PRAGMA foreign_key_list('tbl_dossiers');
  
  var global_enteteTableau=[
  ['id','id'                                 ,''], // 00
  ['val','value'                             ,''],
  ['typ','type'                              ,''],
  ['niv','niveau'                            ,''],
  ['coQ','constante quotee'                  ,''], 
  ['pre','position du premier caractère'     ,''], // 05
  ['der','position du dernier caractère'     ,''], // 06
  ['pId','Id du parent'                      ,''], // 07
  ['nbE','nombre d\'enfants'                 ,''], // 08
  ['nuE','numéro enfants'                    ,''], // 09
  ['pro','profondeur'                        ,''], // 10
  ['pop','position ouverture parenthese'     ,''], // 11
  ['pfp','position fermeture parenthese'     ,''], // 12
  ['com','commentaire'                       ,''], // 13 
  
  ];
  
*/

/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function tabToSql1(tab,id,niveau,au_format_php){
    var options={
        'dans_definition_de_table':false,
        'dans_definition_de_champ':false,
        'longueur_maximum_des_champs':0,
        'nom_du_champ_max'                : '',
        'tableau_tables_champs'           : [],
        'tableau_champ'                   : [],
        'tableau_des_alias'               : [],
        'au_format_php'                   : au_format_php,
        'id_base_principale'              : 0,
        'debut_sql_pour_insert'           : '',
        'tableau_des_valeurs_pour_insert' : [],
    };
    var ob = tabToSql0(tab,id,niveau,options);
    ob.longueur_maximum_des_champs=options.longueur_maximum_des_champs;
    ob.nom_du_champ_max=options.nom_du_champ_max;
    ob.tableau_tables_champs=options.tableau_tables_champs;
    ob.tableau_champ=options.tableau_champ;
    ob.id_base_principale=options.id_base_principale;
    ob.debut_sql_pour_insert=options.debut_sql_pour_insert;
    ob.tableau_des_valeurs_pour_insert=options.tableau_des_valeurs_pour_insert;

    return ob;
}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function recuperer_operateur_sqlite(op){
    var t='';
    if(op === ''){
        t='';
    }else if(op === 'décroissant'){
        t='DESC';
    }else if(op === 'croissant'){
        t='ASC';
    }else if(op === 'plus'){
        t='+';
    }else if(op === 'egal'){
        t=' = ';
    }else if(op === 'diff'){
        t=' <> ';
    }else if(op === 'comme'){
        t=' LIKE ';
    }else if(op === 'et'){
        t=' AND ';
    }else if(op === 'ou'){
        t=' OR ';
    }else if(op === 'champ'){
        t='';
    }else if(op === 'tous_les_champs'){
        t='tous_les_champs';
    }else if(op === 'concat'){
        t='concat';
    }else if(op === 'nombre_d_element'){
        t='nombre_d_element';
    }else if(op === 'compter'){
        t='compter';
    }else if(op === 'limité_à'){
        t='LIMIT';
    }else if(op === 'quantité'){
        t='';
    }else if(op === 'début'){
        t='OFFSET';
    }else if(op === '#'){
        t='#';
    }else if(op === 'conditions'){
        t='';
    }else{
        debugger;
        t='sql.js 94 inconnu opérateur "' + op + '"';
    }
    return t;
}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function traite_sqlite_fonction_de_champ(tab,id,niveau,options){
    var t='';
    if((tab[id][1] === 'champ') && (tab[id][2] === 'f')){
        if((tab[id][8] === 1) && (tab[id + 1][2] === 'c')){
            t+=maConstante(tab[id + 1]);
            return({status:true,value:t});
        }else if((tab[id][8] === 2) && (tab[id + 1][2] === 'c') && (tab[id + 2][2] === 'c')){
            t+=maConstante(tab[id + 1]) + '.' + maConstante(tab[id + 2]);
            return({status:true,value:t});
        }else{
            return(logerreur({status:false,'message':'0114 traite_sqlite_fonction_de_champ'}));
        }
    }
    var operateur = recuperer_operateur_sqlite(tab[id][1]);
    var premierChamp=true;
    var i = (id + 1);
    var l01=tab.length;
    for(i=id + 1;(i < l01) && (tab[i][3] > tab[id][3]);i++){
        if(tab[i][7] === id){
            if(premierChamp === false){
                if(operateur === 'concat'){
                    t+=',';
                }else if(operateur === 'LIMIT'){
                    t='LIMIT ' + t;
                }else{
                    t+=operateur;
                }
            }
            if(tab[i][2] === 'c'){
                if(tab[i][1].toLowerCase() === 'null'){
                    t+='NULL';
                }else{
                    
                    if(tab[i][4] === 0){
                     
                        if(options.au_format_php===true){

                            if(tab[i][1].substr(0,1)===':'){
                                t+='\'.sq1($par[\''+tab[i][1].substr(1)+'\']).\'';
                            }else{
                                t+=tab[i][1];
                            }
                        }else{
                            t+=tab[i][1];
                        }
                    }else{
                        if(options.au_format_php===true){
                            if(tab[i][1].substr(0,1)===':'){
                                t+='\'.sq1($par[\'' + tab[i][1].substr(1).replace(/\'/g,"''") + '\']).\'';
                            }else{
                                t+='\'' + tab[i][1].replace(/\'/g,"''") + '\'';
                            }
                        }else{
                            t+='\'' + tab[i][1].replace(/\'/g,"''") + '\'';
                        }
                    }
                }
                premierChamp=false;
            }else{
                var obj = traite_sqlite_fonction_de_champ(tab,i,niveau,options);
                if(obj.status === true){
                    t+=obj.value;
                    if(obj.operateur==='#' && premierChamp===true){
                     /*
                       cas d'un commentaire avant les contitions,
                       / *  * /`T0`.`chi_id_test` = :par0 AND `T0`.`chp_nom_test` = :par1
                       le commentaire n'est pas un premier champ
                     */
                     t+=' ';
                    }else{
                        premierChamp=false;
                    }
                }else{
                    return(logerreur({status:false,'message':'0078 traite_sqlite_fonction_de_champ "' + tab[i][1] + '"'}));
                }
            }
        }
    }
    if(operateur === 'conditions'){
        t+='';
    }else if(operateur.substr(0,7) === 'inconnu'){
        t+='/* ' + operateur + ' */';
    }else if(operateur === '#'){
        t='/* ' + t.trim() + ' */';
    }else if(operateur === 'DESC'){
        t+=' DESC';
    }else if(operateur === 'ASC'){
        t+=' ASC';
    }else if(operateur === 'compter'){
        t='count(' + t + ')';
    }else if(operateur === 'tous_les_champs'){
        t='*';
    }else if(operateur === 'concat'){
        t='concat(' + t + ')';
    }else if(operateur === 'OFFSET'){
        t=' OFFSET ' + t + ' ';
    }
    if((operateur === '+')
     || (operateur === '-')
     || (operateur === '*')
     || (operateur === '/')
     || (operateur === ' AND ')
     || (operateur === ' OR ')){
        t='(' + t + ')';
    }
    return({status:true,value:t,operateur:operateur});
}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function tabToSql0(tab,id,niveau,options){
    var t='';
    var i=0;
    var j=0;
    var k=0;
    var l=0;
    var m=0;
    var n=0;
    var o=0;
    var c='';
    var nam='';
    var oldnam='';
    var list='';
    var conditions='';
    var def='';
    var uniq='';
    var la_valeur='';
    var liste_des_valeurs='';
    var obj=null;
    var premiere_jointure_croisee=true;
    var meta='';
    var l01=tab.length;
    for(i=id + 1;i < l01;i++){
        if(tab[i][7] === id){
            if(tab[i][1] === 'sql'){
                var obj = tabToSql0(tab,i,niveau,options);
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(logerreur({status:false,message:'erreur 0062'}));
                }
            }else if(tab[i][1] === 'sélectionner'){
                /*
                  
                  =====================================================================================
                  SELECT
                  =====================================================================================
                */
                nam='';
                list='';
                conditions='';
                la_valeur='';
                var nom_du_champ='';
                var valeur_du_champ='';
                var liste_des_tables='';
                var tableau_des_alias = [];
                liste_des_tables='';
                /* on commence par les tables pour avoir les références des alias ( select * from tbl T0 ) */
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if((tab[j][1] === 'provenance') && (tab[j][8] >= 1)){
                        premiere_jointure_croisee=true;
                        for(l=j + 1;(l < l01) && (tab[l][3] > tab[j][3]);l++){
                            if(tab[l][7] === j){
                                if((tab[l][2] === 'f') && ((tab[l][1] === 'table_reference') || (tab[l][1] === 'jointure_croisée') || (tab[l][1] === 'jointure_gauche'))){
                                    /*
                                      
                                      on commence par la source pour avoir les références des alias
                                    */
                                    for(m=l + 1;(m < l01) && (tab[m][3] > tab[l][3]);m++){
                                        if(tab[m][7] === l){
                                            if(tab[m][1] === 'source'){
                                                for(n=m + 1;(n < l01) && (tab[n][3] > tab[m][3]);n++){
                                                    if(tab[n][7] === m){
                                                        if(tab[n][1] === 'nom_de_la_table'){
                                                            var nom_de_la_table='';
                                                            var nom_de_la_base='';
                                                            var nom_de_l_alias='';
                                                            var o = (n + 1);
                                                            for(o=n + 1;(o < l01) && (tab[o][3] > tab[n][3]);o++){
                                                                if(tab[o][7] === n){
                                                                    if(tab[o][2] === 'c'){
                                                                        nom_de_la_table=tab[o][1];
                                                                    }else if((tab[o][2] === 'f') && (tab[o][1] === 'alias') && (tab[o][8] === 1)){
                                                                        nom_de_l_alias=tab[o + 1][1];
                                                                    }else if((tab[o][2] === 'f') && (tab[o][1] === 'base') && (tab[o][8] === 1)){
                                                                        nom_de_la_base=tab[o + 1][1];
                                                                        
                                                                    }else{
                                                                        return(logerreur({status:false,'message':'0257 nom_de_la_table doit avoir que 1 ou 2 ou 3 paramètre(s) "' + tab[n][1] + '"'}));
                                                                    }
                                                                }
                                                            }
                                                            if(nom_de_la_table === ''){
                                                                return(logerreur({status:false,'message':'0262 nom_de_la_table non trouvé "' + tab[n][1] + '"'}));
                                                            }
                                                            
                                                            if(options.au_format_php===true){
                                                             if(nom_de_la_base.substr(0,1)==='b'){
                                                              nom_de_la_base=nom_de_la_base.substr(1);
                                                             }
                                                            }
                                                            
                                                            if(tab[l][1] === 'jointure_gauche'){
                                                                if(options.au_format_php===true){
                                                                    liste_des_tables+=CRLF + ' LEFT JOIN `\'.$GLOBALS[BDD][BDD_'+nom_de_la_base+'][\'nom_bdd\'].\'`.' + nom_de_la_table + '' + ((nom_de_l_alias !== '')?(' ' + nom_de_l_alias):'') + '';
                                                                }else{
                                                                    liste_des_tables+=CRLF + ' LEFT JOIN ' + ((nom_de_la_base !== '')?(nom_de_la_base + '.'):'') + '' + nom_de_la_table + '' + ((nom_de_l_alias !== '')?(' ' + nom_de_l_alias):'') + '';
                                                                }
                                                            }else if(tab[l][1] === 'table_reference'){
                                                                if(options.au_format_php===true){
                                                                    liste_des_tables+=' FROM `\'.$GLOBALS[BDD][BDD_'+nom_de_la_base+'][\'nom_bdd\'].\'`.' + nom_de_la_table + '' + ((nom_de_l_alias !== '')?(' ' + nom_de_l_alias):'') + '';
                                                                    options.id_base_principale=nom_de_la_base;
                                                                }else{
                                                                
                                                                    liste_des_tables+=' FROM ' + ((nom_de_la_base !== '')?(nom_de_la_base + '.'):'') + '' + nom_de_la_table + '' + ((nom_de_l_alias !== '')?(' ' + nom_de_l_alias):'') + '';
                                                                }
                                                            }else if(tab[l][1] === 'jointure_croisée'){
                                                                if(options.au_format_php===true){
                                                                    liste_des_tables+=' , ' + CRLF + '      `\'.$GLOBALS[BDD][BDD_'+nom_de_la_base+'][\'nom_bdd\'].\'`.' + nom_de_la_table + '' + ((nom_de_l_alias !== '')?(' ' + nom_de_l_alias):'') + '';
                                                                }else{
                                                                    liste_des_tables+=' , ' + CRLF + '      '+((nom_de_la_base !== '')?(nom_de_la_base + '.'):'') + '' + nom_de_la_table + '' + ((nom_de_l_alias !== '')?(' ' + nom_de_l_alias):'') + '';
                                                                }
                                                            }else{
                                                                return(logerreur({status:false,'message':'0271 type jointure non prévue "' + tab[n][1] + '"'}));
                                                            }
                                                            if(nom_de_l_alias !== ''){
                                                                tableau_des_alias.push({'minuscule':nom_de_l_alias.toLowerCase(),'majuscule':nom_de_l_alias.toUpperCase(),'original':nom_de_l_alias});
                                                            }
                                                        }else if(tab[m][1] === '#'){
                                                            liste_des_tables+='/* ' + tab[n][13].trim() + ' */';
                                                        }else{
                                                            return(logerreur({status:false,'message':'0245 seuls nom_de_la_table() et #() sont permis dans source  "' + tab[n][1] + '"'}));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    for(m=l + 1;(m < l01) && (tab[m][3] > tab[l][3]);m++){
                                        if(tab[m][7] === l){
                                            if(tab[m][1] === 'contrainte'){
                                                options.tableau_des_alias=tableau_des_alias;
//                                                var obj = traite_sqlite_fonction_de_champ(tab,(m + 1),niveau,{tableau_des_alias:tableau_des_alias});
                                                var obj = traite_sqlite_fonction_de_champ(tab,(m + 1),niveau,options);
                                                if(obj.status === true){
                                                    liste_des_tables+=' ON ' + obj.value + '\n';
                                                }else{
                                                    return(logerreur({status:false,'message':'0198 erreur sur fonction dans select "' + tab[l][1] + '"'}));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                if(liste_des_tables.substr((liste_des_tables.length - 1),1) === ','){
                    liste_des_tables=liste_des_tables.substr(0,(liste_des_tables.length - 1));
                }
                /* liste des champs extraits */
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if((tab[j][1] === 'valeurs') && (tab[j][8] >= 1)){
                        liste_des_valeurs='';
                        for(l=j + 1;(l < l01) && (tab[l][3] > tab[j][3]);l++){
                            if(tab[l][7] === j){
                                if(la_valeur !== ''){
                                    la_valeur+=' , ';
                                }
                                if((tab[l][2] === 'f') && (tab[l][1] === 'champ')){
                                    if((tab[l][8] === 1) && (tab[l + 1][2] === 'c')){
                                        nom_du_champ=maConstante(tab[l + 1]);
                                    }else if((tab[l][8] === 2) && (tab[l + 1][2] === 'c') && (tab[l + 2][2] === 'c')){
                                        var nom_de_alias = tab[l + 1][1];
                                        var dans_tableau_des_alias=-1;
                                        var ind=0;
                                        for(ind=0;ind < tableau_des_alias.length;ind++){
                                            if(tableau_des_alias[ind].minuscule === nom_de_alias.toLowerCase()){
                                                dans_tableau_des_alias=ind;
                                                break;
                                            }
                                        }
                                        if((tableau_des_alias.length > 0) && (dans_tableau_des_alias >= 0)){
                                            nom_du_champ='`' + tableau_des_alias[dans_tableau_des_alias].original + '`.' + maConstante(tab[l + 2]);
                                        }else{
                                            return(logerreur({status:false,'message':'314 erreur select champ "' + tab[l + 1][1] + '"'}));
                                        }
                                    }else{
                                        return(logerreur({status:false,'message':'327 erreur select champ "' + tab[l + 1][1] + '"'}));
                                    }
                                }else{
                                    if(tab[l][2] === 'f'){
                                        options.tableau_des_alias=tableau_des_alias;
//                                        var obj = traite_sqlite_fonction_de_champ(tab,l,niveau,{tableau_des_alias:tableau_des_alias});
                                        var obj = traite_sqlite_fonction_de_champ(tab,l,niveau,options);
                                        if(obj.status === true){
                                            nom_du_champ=obj.value;
                                        }else{
                                            return(logerreur({status:false,'message':'0198 erreur sur fonction dans select "' + tab[l][1] + '"'}));
                                        }
                                    }else{
                                        if(tab[l][1].toLowerCase() === 'null'){
                                            nom_du_champ='NULL';
                                        }else if(tab[l][1].substr(0,1) === ':'){
                                            /*
                                              les variables sql commencent par un caractère ":"
                                            */
                                            if(options.au_format_php===true){
                                                nom_du_champ='\'.sq1($par[\'' + tab[l][1].substr(1) + '\']).\'';
                                            }else{
                                                nom_du_champ='' + tab[l][1] + '';
                                            }
                                        }else{
                                            nom_du_champ='\'' + tab[l][1].replace(/\'/g,"''") + '\'';
                                        }
                                    }
                                }
                                la_valeur+='' + nom_du_champ;
                            }
                        }
                        if(la_valeur !== ''){
                            liste_des_valeurs+=espacesn(true,niveau);
                            liste_des_valeurs+=la_valeur;
                        }
                    }
                }
                /* liste des conditions (where)*/
                var liste_des_conditions='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if((tab[j][1] === 'conditions') && (tab[j][8] >= 1)){
//                        var obj = traite_sqlite_fonction_de_champ(tab,j,niveau,{tableau_des_alias:tableau_des_alias});
                        options.tableau_des_alias=tableau_des_alias;

                        var obj = traite_sqlite_fonction_de_champ(tab,j,niveau,options);
                        if(obj.status === true){
                            liste_des_conditions=obj.value;
                        }else{
                            return(logerreur({status:false,message:'0354 erreur sur conditions dans select '}));
                        }
                    }
                }
                if(liste_des_conditions !== ''){
                    liste_des_conditions='\nWHERE ' + liste_des_conditions;
                }
                /* liste des tris (ORDER BY)*/
                var liste_des_tris='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if((tab[j][1] === 'trier_par') && (tab[j][8] >= 1)){
                        for(l=j + 1;(l < l01) && (tab[l][3] > tab[j][3]);l++){
                            if(tab[l][7] === j){
//                                var obj = traite_sqlite_fonction_de_champ(tab,l,niveau,{tableau_des_alias:tableau_des_alias});
                                options.tableau_des_alias=tableau_des_alias;
                                var obj = traite_sqlite_fonction_de_champ(tab,l,niveau,options);
                                if(obj.status === true){
                                    liste_des_tris+=', ' + obj.value;
                                }else{
                                    return(logerreur({status:false,message:'0354 erreur sur conditions dans select '}));
                                }
                            }
                        }
                    }
                }
                if(liste_des_tris !== ''){
                    liste_des_tris='\nORDER BY ' + liste_des_tris.substr(1);
                }
                /* LIMIT */
                var liste_des_limites='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if((tab[j][1] === 'limité_à') && (tab[j][8] >= 1)){
//                        var obj = traite_sqlite_fonction_de_champ(tab,j,niveau,{tableau_des_alias:tableau_des_alias});
                        options.tableau_des_alias=tableau_des_alias;
                        var obj = traite_sqlite_fonction_de_champ(tab,j,niveau,options);
                        if(obj.status === true){
                            liste_des_limites+=',' + obj.value;
                        }else{
                            return(logerreur({status:false,message:'0354 erreur sur conditions dans select '}));
                        }
                        for(l=j + 1;(l < l01) && (tab[l][3] > tab[j][3]);l++){
                            if(tab[l][7] === j){
                            }
                        }
                    }
                }
                if(liste_des_limites !== ''){
                    liste_des_limites='\n' + liste_des_limites.substr(1);
                }
                if(liste_des_valeurs !== ''){
                    t+='SELECT ' + liste_des_valeurs + '\n' + liste_des_tables + liste_des_conditions + liste_des_tris + liste_des_limites + ';';
                }else{
                    return(logerreur({status:false,message:'0231 erreur dans select, pas de valeurs sélectionnées'}));
                }
            }else if(tab[i][1] === 'modifier' || tab[i][1] === 'insérer' || tab[i][1] === 'supprimer' ){
                /*
                  =====================================================================================
                  UPDATE OR INSERT OR DELETE
                  =====================================================================================
                */

                nom_de_la_table='';
                var nom_de_la_base='';
                list='';
                conditions='';
                la_valeur='';
                var nom_du_champ='';
                var liste_des_champs_pour_insert='';
                var liste_des_valeurs_pour_insert='';
                var valeur_du_champ='';
                var commentaire_general='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][7] === tab[i][0]){
                        if((tab[j][1] === 'provenance') && (tab[j][8] >= 1)){
                            for(l=j + 1;(l < l01) && (tab[l][3] > tab[j][3]);l++){
                                if(tab[l][7] === j){
                                    if((tab[l][2] === 'f') && (tab[l][1] === 'table_reference')){
                                        /*
                                          
                                          on commence par la source pour avoir les références des alias
                                        */
                                        for(m=l + 1;(m < l01) && (tab[m][3] > tab[l][3]);m++){
                                            if(tab[m][7] === l){
                                                if(tab[m][1] === 'source'){
                                                    for(n=m + 1;(n < l01) && (tab[n][3] > tab[m][3]);n++){
                                                        if(tab[n][7] === m){
                                                            if(tab[n][1] === 'nom_de_la_table'){
                                                                var o = (n + 1);
                                                                for(o=n + 1;(o < l01) && (tab[o][3] > tab[n][3]);o++){
                                                                    if(tab[o][7] === n){
                                                                        if(tab[o][2] === 'c'){
                                                                            nom_de_la_table=tab[o][1];
                                                                        }else if((tab[o][2] === 'f') && (tab[o][1] === 'base') && (tab[o][8] === 1)){
                                                                            nom_de_la_base=tab[o + 1][1];
                                                                            options.id_base_principale=nom_de_la_base;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if(tab[j][1] === 'nom_de_la_table' && tab[j][2] === 'f'){
                            var o = (j + 1);
                            for(o=j + 1;(o < l01) && (tab[o][3] > tab[j][3]);o++){
                                if(tab[o][7] === j){
                                    if(tab[o][2] === 'c'){
                                        nom_de_la_table=tab[o][1];
                                    }else if((tab[o][2] === 'f') && (tab[o][1] === 'base') && (tab[o][8] === 1)){
                                        nom_de_la_base=tab[o + 1][1];
                                        options.id_base_principale=nom_de_la_base;
                                    }
                                }
                            }
                        }

                        
                        if((tab[j][1] === 'valeurs') && (tab[j][8] >= 1)){

                            liste_des_valeurs='';
                            for(l=j + 1;(l < l01) && (tab[l][3] > tab[j][3]);l++){
                                if(tab[l][7] === j){
                                    if(la_valeur !== ''){
                                        la_valeur+=' , ';
                                    }
                                    if((tab[l][1] === 'champ') && (tab[l][2] === 'f')){
                                        nom_du_champ=tab[l + 1][1];
                                    }
                                    if(tab[l][1] === 'affecte'){
                                        for(m=l + 1;(m < l01) && (tab[m][3] > tab[l][3]);m++){
                                            if(tab[m][7] === tab[l][0]){
                                                if((tab[m][2] === 'f') && (tab[m][1] === 'champ')){
                                                    nom_du_champ=tab[m + 1][1];
                                                }else{
                                                    if(tab[m][2] === 'f'){
//                                                        var obj = traite_sqlite_fonction_de_champ(tab,m,niveau,{});
                                                        var obj = traite_sqlite_fonction_de_champ(tab,m,niveau,options);
                                                        if(obj.status === true){
                                                            valeur_du_champ=obj.value;
                                                        }else{
                                                            return(logerreur({status:false,'message':'0198 erreur sur fonction dans update conditions "' + tab[l][1] + '"'}));
                                                        }
                                                    }else{
                                                        if((tab[m][1].toLowerCase() === 'null') && (tab[m][4] === 0)){
                                                            valeur_du_champ='NULL';
                                                        }else{
                                                            if(tab[m][1].substr(0,1)===':'){
                                                                if(options.au_format_php===true){
                                                                    valeur_du_champ='\'.sq1($par[\''+tab[m][1].substr(1)+'\']).\'';
                                                                }else{
                                                                    valeur_du_champ=tab[m][1];
                                                                }
                                                            }else{
                                                                valeur_du_champ='\'' + tab[m][1].replace(/\'/g,"''") + '\'';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(options.au_format_php===true){
                                        la_valeur+='\n      `' + nom_du_champ + '` = ' + valeur_du_champ + '';
                                        
                                        if(liste_des_champs_pour_insert!==''){
                                            liste_des_champs_pour_insert+=' , ';
                                        }
                                        liste_des_champs_pour_insert+=CRLF+'   `'+nom_du_champ+'`';
                                        
                                        if(liste_des_valeurs_pour_insert!==''){
                                            liste_des_valeurs_pour_insert+=' , ';
                                        }
                                        liste_des_valeurs_pour_insert+=CRLF+'    '+valeur_du_champ;

                                        options.tableau_des_valeurs_pour_insert.push(valeur_du_champ.replace(/\$par\[/g,'$par[\'groupes\'][$i]['));
                                        
                                        
                                    }else{
                                        if(nom_du_champ==='' && valeur_du_champ===''){
                                         /*
                                           dans le cas d'un commentaire
                                         */
                                        }else{
                                            la_valeur+='`' + nom_du_champ + '` = ' + valeur_du_champ + '';
                                            if(liste_des_champs_pour_insert!==''){
                                                liste_des_champs_pour_insert+=' , ';
                                            }
                                            liste_des_champs_pour_insert+=CRLF+'    `'+nom_du_champ+'`';
                                            
                                            if(liste_des_valeurs_pour_insert!==''){
                                                liste_des_valeurs_pour_insert+=' , ';
                                            }
                                            liste_des_valeurs_pour_insert+=CRLF+'    '+valeur_du_champ;
                                            
                                            
                                        }
                                    }
                                }
                            }
                            

                            if(la_valeur !== ''){
                                liste_des_valeurs+=espacesn(true,niveau) + ' (';
                                liste_des_valeurs+=la_valeur + ' ) ,';
                            }
                        }
                        if((tab[j][1] === 'conditions') && (tab[j][8] >= 1)){
                            conditions='';
                            for(l=j + 1;(l < l01) && (tab[l][3] > tab[j][3]);l++){
                                if(tab[l][7] === j){
                                    if(conditions !== ''){
                                        conditions+=' , ';
                                    }
                                    if(tab[l][2] === 'f'){
//                                        var obj = traite_sqlite_fonction_de_champ(tab,l,niveau,{});
                                        var obj = traite_sqlite_fonction_de_champ(tab,l,niveau,options);
                                        if(obj.status === true){
                                            conditions+=obj.value;
                                        }else{
                                            return(logerreur({status:false,'message':'0198 erreur sur fonction dans update conditions "' + tab[l][1] + '"'}));
                                        }
                                    }
                                }
                            }
                        }
                        if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                          debugger
                          commentaire_general=tab[j][13];
                        }
                    }
                }
                if((nom_de_la_table !== '') && (la_valeur !== '' || ( tab[i][1] === 'supprimer' && la_valeur === '' ) )){
                    t+=espacesn(true,niveau);
                    
                    if(tab[i][1] === 'supprimer'){
                        if(options.au_format_php===true){
                            t+='DELETE '+(commentaire_general!==''?'/* '+commentaire_general+' */ ':'')+'FROM '+(nom_de_la_base!==''?  '`\'.$GLOBALS[BDD][BDD_'+nom_de_la_base+'][\'nom_bdd\'].\'`.':'') + nom_de_la_table + '';
                        }else{
                            t+='DELETE '+(commentaire_general!==''?'/* '+commentaire_general+' */ ':'')+'FROM '+(nom_de_la_base!==''?nom_de_la_base+'.':'') + nom_de_la_table + '';
                        }
                        if(conditions.length > 0){
                            if(options.au_format_php===true){
                                t+='\n    WHERE ' + conditions + ' ;';
                            }else{
                                t+='\nWHERE ' + conditions + ' ;';
                            }
                        }
                    }else if(tab[i][1] === 'insérer'){
                        if(options.au_format_php===true){
                            t+='INSERT '+(commentaire_general!==''?'/* '+commentaire_general+' */ ':'')+'INTO '+(nom_de_la_base!==''?  '`\'.$GLOBALS[BDD][BDD_'+nom_de_la_base+'][\'nom_bdd\'].\'`.':'') +'`'+ nom_de_la_table + '`(';
                            t+=''+liste_des_champs_pour_insert+CRLF+') VALUES ('+liste_des_valeurs_pour_insert+CRLF+');';
                            
                            options.debut_sql_pour_insert='INSERT INTO '+(nom_de_la_base!==''?  '`\'.$GLOBALS[BDD][BDD_'+nom_de_la_base+'][\'nom_bdd\'].\'`.':'') +'`'+ nom_de_la_table + '`('+liste_des_champs_pour_insert+CRLF+') VALUES ';
                            
                            
                        }else{
                            t+='INSERT '+(commentaire_general!==''?'/* '+commentaire_general+' */ ':'')+'INTO '+(nom_de_la_base!==''?nom_de_la_base+'.':'') +'`'+ nom_de_la_table +'`(';
                            t+=liste_des_champs_pour_insert+CRLF+') VALUES ('+liste_des_valeurs_pour_insert+CRLF+');';
                        }
                    }else{
                    
                        if(options.au_format_php===true){
                            t+='UPDATE '+(commentaire_general!==''?'/* '+commentaire_general+' */ ':'')+''+(nom_de_la_base!==''?  '`\'.$GLOBALS[BDD][BDD_'+nom_de_la_base+'][\'nom_bdd\'].\'`.':'') + nom_de_la_table + ' SET ' + la_valeur + '';
                        }else{
                            t+='UPDATE '+(commentaire_general!==''?'/* '+commentaire_general+' */ ':'')+''+(nom_de_la_base!==''?nom_de_la_base+'.':'') + nom_de_la_table + ' SET ' + la_valeur + '';
                        }
                        if(conditions.length > 0){
                            if(options.au_format_php===true){
                                t+='\n    WHERE ' + conditions + ' ;';
                            }else{
                                t+='\nWHERE ' + conditions + ' ;';
                            }
                        }
                    }
                }

            }else if((tab[i][1] === 'add_index') || ('ajouter_index' === tab[i][1])){
                nam='';
                list='';
                uniq=' INDEX ';
                def='';
                meta='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][7] === tab[i][0]){
                        if(((tab[j][1] === 'nom_de_la_table_pour_l_index') || (tab[j][1] === 'on_table') || ('sur_table' === tab[j][1])) && (tab[j][8] === 1)){
                            nam=tab[j + 1][1];
                        }
                        if((tab[j][1] === 'index_name') && (tab[j][8] === 1)){
                            def=tab[j + 1][1];
                        }
                        if((tab[j][1] === 'unique') && (tab[j][8] === 0)){
                            uniq=' UNIQUE INDEX ';
                        }
                        if(((tab[j][1] === 'fields') || (tab[j][1] === 'champs')) && (tab[j][8] >= 1)){
                            for(k=j + 1;k < l01;k++){
                                if((tab[k][3] === (tab[j][3] + 1)) && (tab[k][7] === tab[j][0])){
                                    list+=' `' + tab[k][1] + '` ,';
                                }
                            }
                        }
                        if((tab[j][1] === 'meta') && (tab[j][2] === 'f') && (tab[j][8] > 0)){
                            var obj = a2F1(tab,j,false,(j + 1),false);
                            if(obj.status === true){
                                meta=espacesn(true,(niveau + 2));
                                meta+='/* meta(' + obj.value + ') */';
                                meta+=espacesn(true,(niveau + 2));
                            }else{
                                return(logerreur({status:false,value:t,id:i,message:'0930 sql.js erreur dans un meta'}));
                            }
                        }
                    }
                }
                if((nam !== '') && (list !== '') && (def !== '')){
                    t+=espacesn(true,niveau);
                    t+='/* ==========DEBUT DEFINITION=========== */';
                    t+=espacesn(true,niveau);
                    t+='CREATE ' + uniq + ' ' + def + ' ON `' + nam + '` ' + meta + ' (' + list.substr(0,(list.length - 1)) + ') ;';
                }
            }else if(tab[i][1] === 'change_field'){
                nam='';
                oldnam='';
                def='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][7] === tab[i][0]){
                        if((tab[j][1] === 'nom_du_champ') && (tab[j][8] === 1)){
                            nam=tab[j + 1][1];
                        }
                        if((tab[j][1] === 'old_name') && (tab[j][8] === 1)){
                            oldnam=tab[j + 1][1];
                        }
                        if(tab[j][1] === 'new_def'){
                            dans_definition_de_champ=true;
                            options.dans_definition_de_champ=true;
                            obj=tabToSql0(tab,j,niveau,options);
                            options.dans_definition_de_champ=false;
                            if(obj.status === true){
                                for(k=obj.value.length - 1;k >= 0;k--){
                                    c=obj.value.substr(k,1);
                                    if(c === ','){
                                        def=obj.value.substr(0,k);
                                        break;
                                    }
                                }
                            }else{
                                return(logerreur({status:false,value:t,id:i,message:'sql.js erreur dans un sql définit dans un php'}));
                            }
                        }
                    }
                }
                if((nam !== '') && (oldnam !== '')){
                    t+=espacesn(true,niveau);
                    t+='ALTER TABLE ' + nam + ' CHANGE ' + oldnam + ' ' + def + ';';
                }
            }else if(tab[i][1] === 'add_primary_key'){
                nam='';
                list='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][7] === tab[i][0]){
                        if((tab[j][1] === 'nom_de_la_table') && (tab[j][8] === 1)){
                            nam=tab[j + 1][1];
                        }
                        if((tab[j][1] === 'fields') && (tab[j][8] >= 1)){
                            for(k=j + 1;k < l01;k++){
                                if((tab[k][3] === (tab[j][3] + 1)) && (tab[k][7] === tab[j][0])){
                                    list+=' ' + tab[k][1] + ' ,';
                                }
                            }
                            break;
                        }
                    }
                }
                if((nam !== '') && (list !== '')){
                    t+=espacesn(true,niveau);
                    t+='ALTER TABLE ' + nam + ' ADD PRIMARY KEY (' + list.substr(0,(list.length - 1)) + ');';
                }
            }else if(tab[i][1] === 'use'){
                if((tab[i][8] === 1) && (tab[i + 1][2] === 'c')){
                    t+=espacesn(true,niveau);
                    t+='use ' + tab[i + 1][1] + ';';
                    j++;
                }else{
                    return(logerreur({status:false,value:t,id:i,message:'sql.js erreur dans un sql(use) définit dans un php'}));
                }
            }else if(tab[i][1] === 'set'){
                if((tab[i][8] === 2) && (tab[i + 1][2] === 'c') && (tab[i + 2][2] === 'c')){
                    t+=espacesn(true,niveau);
                    t+='set ';
                    if(tab[i + 1][1] === 'NAMES'){
                        t+=tab[i + 1][1];
                        t+='  ';
                        t+=tab[i + 2][1];
                    }else{
                        t+=((tab[i + 1][4] === true)?('\'' + tab[i + 1][1] + '\''):tab[i + 1][1]);
                        t+=' = ';
                        t+=((tab[i + 2][4] === true)?('\'' + tab[i + 2][1] + '\''):tab[i + 2][1]);
                    }
                    t+=';';
                }else{
                    return(logerreur({status:false,value:t,id:i,message:'sql.js cas non prévu dans un SET()'}));
                }
            }else if(tab[i][1] === 'field'){
                /*
                  
                  field[
                  n[fld_id_user],
                  type[bigint],
                  unsigned[],
                  notnull[]
                  default[0]
                  comment[0]
                  `fld_id_css` bigint[20] UNSIGNED NOT NULL AUTO_INCREMENT,
                  `fld_name_css` varchar[32] COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '{"showDeleteField":true}',
                  
                */
                var variables_pour_tableau_tables={
                    /* */
                    'nom_du_champ':'',
                    'autoincrement':false,
                    'non_nulle':false,
                    'defaut':{'est_defini':false,'valeur':null},
                    'cle_primaire':false,
                    'reference':{'est_defini':false,'table':'','champ':''},
                    'type':{'nom':false,'longueur':false},
                    'commentaire':'',
                    'meta':'',
                    'tableau_meta':{}
                };
                var definition_sql_du_champ='';
                var meta_du_champ='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][7] === i){
                        if((tab[j][1] === 'nom_du_champ') && (tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                            if(options.longueur_maximum_des_champs < (tab[j + 1][1].length + 1)){
                                options.longueur_maximum_des_champs=tab[j + 1][1].length + 1;
                                options.nom_du_champ_max=tab[j + 1][1];
                            }
                            /*
                              
                              nom_du_champ_max ici
                            */
                            definition_sql_du_champ+=' ' + tab[j + 1][1] + '';
                            /*
                              
                            */
                            variables_pour_tableau_tables.nom_du_champ=tab[j + 1][1];
                            j++;
                        }else if(tab[j][1] === '#'){
                            if(tab[j][13] === ''){
                            }else{
                                definition_sql_du_champ+='/* ' + tab[j][13].replace(/\/\*/g,'/ *').replace(/\*\//g,'* /') + ' */';
                                variables_pour_tableau_tables.commentaire=tab[j][13];
                            }
                            definition_sql_du_champ+=espacesn(true,niveau);
                        }else if((tab[j][1] === 'auto_increment') && (tab[j][8] === 0)){
                            definition_sql_du_champ+=' AUTOINCREMENT';
                            variables_pour_tableau_tables.autoincrement=true;
                        }else if((tab[j][1] === 'unsigned') && (tab[j][8] === 0)){
                            definition_sql_du_champ+=' UNSIGNED';
                        }else if(((tab[j][1] === 'notnull') || (tab[j][1] === 'non_nulle') || (tab[j][1] === 'not_null')) && (tab[j][8] === 0)){
                            definition_sql_du_champ+=' NOT NULL';
                            variables_pour_tableau_tables.non_nulle=true;
                        }else if(((tab[j][1] === 'default') || (tab[j][1] === 'valeur_par_defaut')) && (tab[j][8] === 1)){
                            definition_sql_du_champ+=' DEFAULT ';
                            if((tab[j + 1][1].toLowerCase() === 'null')){
                                definition_sql_du_champ+=' NULL ';
                            }else{
                                if(tab[j + 1][4]===0){
                                    definition_sql_du_champ+=' ' + maConstante(tab[j + 1]) + ' ';
                                    variables_pour_tableau_tables.defaut.est_defini=true;
                                    variables_pour_tableau_tables.defaut.valeur=maConstante(tab[j + 1]);
                                }else if(tab[j + 1][4]===1){
                                    definition_sql_du_champ+=' \'' + tab[j + 1][1].replace(/\\\'/g,'\'\'').replace(/\\\\/g,'\\') + '\' ';

                                    variables_pour_tableau_tables.defaut.est_defini=true;
                                    variables_pour_tableau_tables.defaut.valeur=maConstante(tab[j + 1]);
                                }else{
                                     return(logerreur({status:false,value:t,id:i,message:'0914 sql.js on admet que les constantes quotées par des apostrophes pour les valeurs de texte par défaut'}));
                                }
                            }
                            j++;
                        }else if((tab[j][1] === 'primary_key') && (tab[j][8] === 0)){
                            definition_sql_du_champ+=' PRIMARY KEY ';
                            variables_pour_tableau_tables.cle_primaire=true;
                        }else if((tab[j][1] === 'references') && (tab[j][8] === 2) && (tab[j + 1][2] === 'c')){
                            definition_sql_du_champ+=' REFERENCES ' + maConstante(tab[j + 1]) + '(' + maConstante(tab[j + 2]) + ') ';
                            variables_pour_tableau_tables.reference.est_defini=true;
                            variables_pour_tableau_tables.reference.table=+maConstante(tab[j + 1]);
                            variables_pour_tableau_tables.reference.champ=+maConstante(tab[j + 2]);
                            j+=2;
                        }else if((tab[j][1] === 'type') && ((tab[j][8] === 1) || (tab[j][8] === 2))){
                            if(tab[j][8] === 1){
                                if(tab[j + 1][2] === 'c'){
                                    definition_sql_du_champ+=' ' + tab[j + 1][1] + '';
                                    variables_pour_tableau_tables.type.nom=tab[j + 1][1];
                                    j++;
                                }else{
                                    if(tab[j + 2][2] === 'c'){
                                        definition_sql_du_champ+=' ' + tab[j + 1][1] + '(' + tab[j + 2][1] + ')';
                                    }else{
                                        return(logerreur({status:false,value:t,id:i,message:'0732 sql.js erreur dans un type'}));
                                    }
                                }
                            }else if(tab[j][8] === 2){
                                definition_sql_du_champ+=' ' + tab[j + 1][1] + '(' + tab[j + 2][1] + ')';
                                variables_pour_tableau_tables.type.nom=tab[j + 1][1];
                                variables_pour_tableau_tables.type.longueur=tab[j + 2][1];
                                j+=2;
                            }else{
                                return(logerreur({status:false,id:i,message:'0271 sql.js erreur dans un field'}));
                            }
                        }else if((tab[j][1] === 'meta') && (tab[j][8] > 0)){
                            var obj = a2F1(tab,j,false,(j + 1),false);
                            if(obj.status === true){
                                meta_du_champ+=espacesn(true,(niveau + 2));
                                meta_du_champ+='/* meta(' + obj.value + ') */';
                                variables_pour_tableau_tables.meta=obj.value;
                                meta_du_champ+=espacesn(true,(niveau + 2));
                                for(k=j + 1;(k < l01) && (tab[k][3] > tab[j][3]);k++){
                                    if(tab[k][7] === j){
                                        if(tab[k][8] === 2){
                                            variables_pour_tableau_tables.tableau_meta[tab[k + 1][1]]=tab[k + 2][1];
                                        }
                                    }
                                }
                            }else{
                                return(logerreur({status:false,value:t,id:i,message:'0930 sql.js erreur dans un meta'}));
                            }
                        }else{
                            return(logerreur({status:false,id:i,'message':'0275 sql.js erreur dans un field pour ' + tab[j][1]}));
                        }
                    }
                }
                if(options.dans_definition_de_table === true){
                    t+=',';
                    t+=espacesn(true,niveau);
                }
                t+=meta_du_champ + definition_sql_du_champ;
                if((options.hasOwnProperty('dans_definition_de_champ')) && (options.dans_definition_de_champ === true)){
                    options.tableau_tables_champs[options.tableau_tables_champs.length - 1].champs.push(variables_pour_tableau_tables);
                }
                if(options.hasOwnProperty('tableau_champ')){
                    options.tableau_champ=variables_pour_tableau_tables;
                }
            }else if((tab[i][1] === 'create_table') || (tab[i][1] === 'créer_table')){
                var engine='';
                var auto_increment='';
                var charset='';
                var collate='';
                t+=espacesn(true,niveau);
                t+=espacesn(true,niveau);
                t+='/* ==========DEBUT DEFINITION=========== */';
                t+=espacesn(true,niveau);
                t+=espacesn(true,niveau);
                var nom_table_en_cours='';
                
                var donnees_table={
                    /* */
                    'nom_de_la_table':'',
                    'champs':[],
                    'engine':'',
                    'charset':'',
                    'collate':'',
                    'meta':{},
                    'chaine_meta':''
                };
                var if_exists='';
                var complementaires='';
                var definitions_des_champs='';
                var chaine_meta_table='';
                
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][3] > tab[i][3]){
                        if(tab[j][3] === (tab[i][3] + 1)){
                            if((tab[j][1] === 'ifexists') && (tab[j][8] === 0)){
                                if_exists='IF EXISTS';
                            }else if((tab[j][1] === 'ifnotexists') && (tab[j][8] === 0)){
                                if_exists='IF NOT EXISTS';
                            }else if((tab[j][1] === 'engine') && (tab[j][8] === 1)){
                                complementaires+=' ENGINE=' + tab[j + 1][1] + '';
                                donnees_table.engine=tab[j + 1][1];
                            }else if((tab[j][1] === 'auto_increment') && (tab[j][8] === 1)){
                                complementaires+=' AUTO_INCREMENT=' + tab[j + 1][1] + '';
                            }else if((tab[j][1] === 'charset') && (tab[j][8] === 1)){
                                complementaires+=' DEFAULT CHARSET=' + tab[j + 1][1] + '';
                                donnees_table.charset=tab[j + 1][1];
                            }else if((tab[j][1] === 'collate') && (tab[j][8] === 1)){
                                complementaires+=' COLLATE=' + tab[j + 1][1] + '';
                                donnees_table.collate=tab[j + 1][1];
                            }else if((tab[j][1] === 'nom_de_la_table') && (tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                                nom_table_en_cours=tab[j + 1][1];
//                                t+=' ' + nom_table_en_cours + '(';
                                if(donnees_table.chaine_meta === ''){
                                    donnees_table.chaine_meta='/* meta(';
                                    donnees_table.chaine_meta+='(table , \'' + nom_table_en_cours + '\'),';
                                    donnees_table.chaine_meta+='(nom_long_de_la_table  , \'à faire ' + nom_table_en_cours + '\'),';
                                    donnees_table.chaine_meta+='(nom_court_de_la_table , \'à faire ' + nom_table_en_cours + '\'),';
                                    donnees_table.chaine_meta+='(nom_bref_de_la_table  , \'à faire ' + nom_table_en_cours + '\'),';
                                    donnees_table.chaine_meta+=') */';
                                }
//                                t+=espacesn(true,(niveau + 1));
//                                t+=donnees_table.chaine_meta;
                                j++;
                            }else if(((tab[j][1] === 'fields') || (tab[j][1] === 'champs')) && (tab[j][8] > 0)){
//                                t+=' ';
                                options.dans_definition_de_table=true;
                                options.dans_definition_de_champ=true;
                                donnees_table.nom_de_la_table=nom_table_en_cours;
                                options.tableau_tables_champs.push(donnees_table);
                                obj=tabToSql0(tab,j,(niveau + 1),options);
                                options.dans_definition_de_champ=false;
                                if(obj.status === true){
//                                    t+=espacesn(true,niveau);
                                    /*
                                      on supprime la virgule
                                    */
                                    definitions_des_champs=obj.value.substr(1);
                                }else{
                                    return(logerreur({status:false,value:t,id:i,message:'sql.js erreur dans un sql définit dans un php'}));
                                }

//                                t+='' + ((engine === '')?'':(' ' + engine)) + ((auto_increment === '')?'':(' ' + auto_increment)) + ((charset === '')?'':(' ' + charset)) + ((collate === '')?'':(' ' + collate));
                                for(k=j + 1;k < l01;k++){
                                    if(tab[k][3] > tab[j][3]){
                                    }else{
                                        j=k - 1;
                                        break;
                                    }
                                }
//                                nom_table_en_cours='';
                                options.dans_definition_de_table=false;
                            }else if((tab[j][1] === 'meta') && (tab[j][8] > 0)){
                                var obj = a2F1(tab,j,false,(j + 1),false);
                                if(obj.status === true){
//                                    t+=espacesn(true,(niveau + 1));
//                                    donnees_table.chaine_meta='/* meta(' + obj.value + ') */';
                                    chaine_meta_table='/* meta(' + obj.value + ') */';
//                                    t+=espacesn(true,(niveau + 1));
                                    for(k=j + 1;(k < l01) && (tab[k][3] > tab[j][3]);k++){
                                        if(tab[k][7] === j){
                                            if(tab[k][8] === 2){
                                                donnees_table.meta[tab[k + 1][1]]=tab[k + 2][1];
                                            }
                                        }
                                    }
                                }else{
                                    return(logerreur({status:false,value:t,id:i,message:'0930 sql.js erreur dans un meta'}));
                                }
                            }else{
                                t+=' todo sql.js repere 0350 ' + tab[j][1];
                            }
                        }
                    }else{
                        break;
                    }
                }
                t+='CREATE TABLE '+if_exists + ' ' + nom_table_en_cours + '(';
                t+=espacesn(true,niveau);
                t+=chaine_meta_table;
                t+=definitions_des_champs;
                t+=espacesn(true,(niveau + 1));
                t+=')' + complementaires+';';
                nom_table_en_cours='';

            }else if(tab[i][1] === 'drop_table'){
                t+=espacesn(true,niveau);
                t+='DROP TABLE';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][3] > tab[i][3]){
                        if(tab[j][3] === (tab[i][3] + 1)){
                            if((tab[j][1] === 'ifexists') && (tab[j][8] === 0)){
                                t+=' IF EXISTS';
                            }else if((tab[j][1] === 'ifnotexists') && (tab[j][8] === 0)){
                                t+=' IF NOT EXISTS';
                            }else if((tab[j][1] === 'nom_de_la_table') && (tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                                t+=' ' + tab[j + 1][1] + '';
                                j++;
                            }else{
                                t+=' todo sql.js repere 0375 ' + tab[j][1];
                            }
                        }
                    }else{
                        break;
                    }
                }
                t+=';';
            }else if(tab[i][1] === 'create_database'){
                t+=espacesn(true,niveau);
                t+='CREATE DATABASE';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][3] > tab[i][3]){
                        if(tab[j][3] === (tab[i][3] + 1)){
                            if((tab[j][1] === 'ifnotexists') && (tab[j][8] === 0)){
                                t+=' IF NOT EXISTS';
                            }else if((tab[j][1] === 'ifexists') && (tab[j][8] === 0)){
                                t+=' IF EXISTS';
                            }else if((tab[j][1] === 'nom_de_la_base') && (tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                                t+=' ' + tab[j + 1][1] + '';
                                j++;
                            }else if((tab[j][1] === 'charset') && (tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                                t+=' CHARACTER SET ' + tab[j + 1][1] + '';
                                j++;
                            }else if((tab[j][1] === 'collate') && (tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                                t+=' COLLATE ' + tab[j + 1][1] + '';
                                j++;
                            }else{
                                t+=' todo sql.js repere 76 ' + tab[j][1];
                            }
                        }
                    }else{
                        break;
                    }
                }
                t+=';';
            }else if(tab[i][1] === 'commit'){
                t+=espacesn(true,niveau);
                t+='COMMIT;';
            }else if(tab[i][1] === 'transaction'){
                niveau++;
                obj=tabToSql0(tab,i,niveau,options);
                niveau--;
                if(obj.status === true){
                    t+=espacesn(true,niveau);
                    t+='BEGIN TRANSACTION;';
                    t+=obj.value;
                    t+=espacesn(true,niveau);
                }else{
                    return(logerreur({status:false,value:t,id:i,message:'sql.js erreur dans un sql définit dans un php'}));
                }
            }else if(tab[i][1] === '#'){
                if(tab[i][13] === ''){
                }else{
                    t+=espacesn(true,niveau);
                    t+='/*';
                    t+=traiteCommentaire2(tab[i][13],niveau,i);
                    t+='*/';
                }
            }else if(tab[i][1] === 'meta'){
                var obj = a2F1(tab,i,false,(i + 1),false);
                if(obj.status === true){
                    t+=espacesn(true,niveau);
                    t+='/* meta(' + obj.value + ') */';
                    t+=espacesn(true,niveau);
                }else{
                    return(logerreur({status:false,value:t,id:i,message:'1057 sql.js erreur dans un meta'}));
                }
            }else{
                t+=espacesn(true,niveau);
                t+='-- todo repere 0524 fonction sql non prevue  "' + tab[i][1] + '"';
            }
        }
    }
    return({status:true,value:t});
}
/*
  =====================================================================================================================
  =====================================================================================================================
*/
function traite_le_tableau_de_la_base_sqlite_v2(par){
    var nom_de_la_table='';
    var txt='';
    var tab_meta = [];
    var i=0;
    var j=0;
    var k=0;
    var ci='';
    var dans_comm=false;
    var l01=0;
    var txt_meta='';
    var obj={};
    var t='\n';
    var cle_etrangere=false;
    var meta_ecrit=false;
    var nom_champ='';
    for(nom_de_la_table in par['donnees']){
        /*
          
          analyse des requêtes ayant permis de créer les tables 
        */
        txt=par['donnees'][nom_de_la_table].create_table;
        tab_meta=[];
        l01=txt.length;
        for(i=0;i < l01;i++){
            ci=txt.substr(i,1);
            if(dans_comm === true){
                if(ci === '*'){
                    if(i === (l01 - 1)){
                        return({status:false,message:'1053 erreur commentaire'});
                    }else{
                        if(txt.substr((i + 1),1) === '/'){
                            dans_comm=false;
                            i++;
                            tab_meta.push({
                                txt_meta:txt_meta,
                                statut:false,
                                'matrice':[],
                                type_element:'table|champ',
                                nom_element:''
                            });
                            txt_meta='';
                        }
                    }
                }else{
                    txt_meta+=ci;
                }
            }else{
                if(ci === '/'){
                    if(i === (l01 - 1)){
                        return({status:false,message:'1053 erreur commentaire'});
                    }else{
                        if(txt.substr((i + 1),1) === '*'){
                            dans_comm=true;
                            i++;
                        }
                    }
                }
            }
        }
        for(j in par['donnees'][nom_de_la_table].create_index){
            txt=par['donnees'][nom_de_la_table].create_index[j];
            if(txt !== null){
                /*
                  on peut avoir un index du type "sqlite_autoindex_tbl_a_1" avec un texte qui est nul
                */
                l01=txt.length;
                for(i=0;i < l01;i++){
                    ci=txt.substr(i,1);
                    if(dans_comm === true){
                        if(ci === '*'){
                            if(i === (l01 - 1)){
                                return({status:false,message:'1053 erreur commentaire'});
                            }else{
                                if(txt.substr((i + 1),1) === '/'){
                                    dans_comm=false;
                                    i++;
                                    tab_meta.push({
                                        txt_meta:txt_meta,
                                        statut:false,
                                        'matrice':[],
                                        type_element:'table|champ',
                                        nom_element:''
                                    });
                                    txt_meta='';
                                }
                            }
                        }else{
                            txt_meta+=ci;
                        }
                    }else{
                        if(ci === '/'){
                            if(i === (l01 - 1)){
                                return({status:false,message:'1053 erreur commentaire'});
                            }else{
                                if(txt.substr((i + 1),1) === '*'){
                                    dans_comm=true;
                                    i++;
                                }
                            }
                        }
                    }
                }
            }
        }
        for(i=0;i < tab_meta.length;i++){
            if(tab_meta[i].txt_meta.indexOf('meta') >= 0){
                obj=functionToArray(tab_meta[i].txt_meta,true,false,'');
                if(obj.status === true){
                    tab_meta[i].statut=true;
                    tab_meta[i].matrice=obj.value;
                    for(j=1;j < tab_meta[i].matrice.length;j++){
                        if((tab_meta[i].matrice[j][3] === 2) 
                           && (tab_meta[i].matrice[j][9] === 1) 
                           && (tab_meta[i].matrice[j][1] === 'table') 
                           && (tab_meta[i].matrice[tab_meta[i].matrice[j][7]][8] === 2)){
                            tab_meta[i].type_element='table';
                            tab_meta[i].nom_element=tab_meta[i].matrice[j + 1][1];
                            tab_meta[i].statut=true;
                            break;
                        }
                        if((tab_meta[i].matrice[j][3] === 2) && (tab_meta[i].matrice[j][9] === 1) && (tab_meta[i].matrice[j][1] === 'champ') && (tab_meta[i].matrice[tab_meta[i].matrice[j][7]][8] === 2)){
                            tab_meta[i].type_element='champ';
                            tab_meta[i].nom_element=tab_meta[i].matrice[j + 1][1];
                            tab_meta[i].statut=true;
                            break;
                        }
                        if((tab_meta[i].matrice[j][3] === 2) && (tab_meta[i].matrice[j][9] === 1) && (tab_meta[i].matrice[j][1] === 'index') && (tab_meta[i].matrice[tab_meta[i].matrice[j][7]][8] === 2)){
                            tab_meta[i].type_element='index';
                            tab_meta[i].nom_element=tab_meta[i].matrice[j + 1][1];
                            tab_meta[i].statut=true;
                            break;
                        }
                    }
                }
            }
        }
        /*
          utf8mb4_unicode_ci OK
          utf8mb4_general_ci ne pas utiliser 
        */
        meta_ecrit=false;
        t+='\n' + '#(\n  =================================================================================';
        t+='\n' + '  table ' + nom_de_la_table + '';
        t+='\n' + '=================================================================================\n)';
        t+='\n' + 'create_table(';
        /*
          on remplit les éléments par défaut
        */
        var liste_meta_table={
            table:nom_de_la_table,
            'nom_long_de_la_table':'à faire ' + nom_de_la_table + '',
            'nom_court_de_la_table':'à faire ' + nom_de_la_table + '',
            'nom_bref_de_la_table':'à faire ' + nom_de_la_table + '',
            'transform_table_sur_svg':'',
            engine:'',
            default_charset:'',
            collate:''
        };
        var texte_meta_champ='';
        /* on vérifie que pour chaque libellé ci dessus on a quelque chose, sinon, on complète */
        for(i=0;i < tab_meta.length;i++){
            if((tab_meta[i].statut === true) && (tab_meta[i].type_element === 'table')){
                var elt_meta={};
                var tab=tab_meta[i].matrice;
                for(elt_meta in liste_meta_table){
                    if(elt_meta === 'transform_table_sur_svg'){
                        for(j=1;j < tab.length;j++){
                            if(tab[j][1] === 'transform_table_sur_svg'){
                                var obj = a2F1(tab,(j + 1),false,(j + 2),false);
                                if(obj.status === true){
                                    liste_meta_table[elt_meta]='transform(' + obj.value + ')';
                                    break;
                                }else{
                                    debugger;
                                }
                            }
                        }
                    }else{
                        for(j=1;j < tab.length;j++){
                            if((elt_meta === tab[j][1])
                             && (tab[j][3] === 2)
                             && (tab[j][2] === 'c')
                             && (tab[tab[j][7]][8] === 2)
                             && (tab[j + 1][2] === 'c')){
                                liste_meta_table[elt_meta]=tab[j + 1][1];
                            }
                        }
                    }
                }
            }
        }
        t+='\n' + ' meta(';
        var elt_meta={};
        for(elt_meta in liste_meta_table){
            if(elt_meta === 'transform_table_sur_svg'){
                if(liste_meta_table[elt_meta] !== ''){
                    t+='\n' + '  (' + elt_meta + ' , ' + liste_meta_table[elt_meta] + '),';
                }else{
                    t+='\n' + '  (' + elt_meta + ' , transform(translate(0,0))),';
                }
            }else{
                if(liste_meta_table[elt_meta] !== ''){
//                    t+='\n' + '  (' + elt_meta + ' , \'' + liste_meta_table[elt_meta].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),';
                    t+='\n' + '  (' + elt_meta + ' , \'' + liste_meta_table[elt_meta] + '\'),';
                }
            }
        }
        t+='\n' + ' ),';
        t+='\n' + ' nom_de_la_table(\'' + nom_de_la_table + '\'),';
        t+='\n' + ' fields(#(),';
        for(nom_champ in par['donnees'][nom_de_la_table]['structure']['liste_des_champs']){
            var pc = par['donnees'][nom_de_la_table]['structure']['liste_des_champs'][nom_champ];
            cle_etrangere=false;
            if((pc['cle_etrangere']) && (pc['cle_etrangere']['from']) && (pc['cle_etrangere']['from'] === nom_champ)){
                cle_etrangere=true;
            }
            var type_champ = pc['type'].toUpperCase();
            if(type_champ.indexOf('(') >= 0){
                type_champ=type_champ.substr(0,type_champ.indexOf('('));
            }
            /*
              
              <select id="type_du_champ">
              <option value="">choisissez un type</option>
              <option value="chi">index entier (chi) integer[n]</option>
              <option value="chx">référence croisée (chx) integer[n]</option>
              <option value="che">entier (che) integer[n]</option>
              
              <option value="chn">numérique (chn) float</option>
              
              <option value="chu">choix unique (chu) integer(n)</option>
              
              <option value="chm">choix multiple (chm) text</option>
              <option value="cht">texte (cht) text</option>
              <option value="chp">phrase (chp) varchar(n)</option>
              <option value="cho">mot (cho) character(n)</option>
              <option value="chd">date heure (chd) text(23) YYYY-MM-DD HH:MM:SS.SSS</option>
              <option value="cha">date character(10)</option>
              <option value="chh">heure character(8)</option>
              <option value="chb">blob (chb) blob</option></select>
            */
            var typologie='ch?';
            var types_entiers = [
                'INT',
                'INTEGER',
                'TINYINT',
                'SMALLINT',
                'MEDIUMINT',
                'BIGINT',
                'UNSIGNED BIG INT',
                'INT2',
                'INT8'
            ];
            var types_caracteres = [
                'CHARACTER',
                'CHAR',
                'VARCHAR',
                'VARYING CHARACTER',
                'NCHAR',
                'NATIVE CHARACTER',
                'NVARCHAR',
                'TEXT',
                'CLOB',
                'STRING'
            ];
            if(types_entiers.includes(type_champ)){
                if(pc['pk'] === 1){
                    typologie='chi';
                }else{
                    if(cle_etrangere === true){
                        typologie='chx';
                    }else{
                        typologie='che';
                    }
                }
            }
            if(typologie === 'ch?'){
                if(types_caracteres.includes(type_champ)){
                    if((type_champ === 'CHARACTER') || (type_champ === 'CHAR')){
                        typologie='cho';
                    }else if((type_champ === 'VARCHAR')
                     || (type_champ === 'VARYING CHARACTER')
                     || (type_champ === 'NCHAR')
                     || (type_champ === 'NATIVE CHARACTER')
                     || (type_champ === 'NVARCHAR')){
                        typologie='chp';
                    }else if((type_champ === 'TEXT') || (type_champ === 'CLOB') || (type_champ === 'STRING')){
                        typologie='cht';
                    }
                }
            }
            var liste_meta_champ={
                /* */
                champ:nom_champ,
                'nom_long_du_champ':'à faire ' + nom_champ + '',
                'nom_court_du_champ':'à faire ' + nom_champ + '',
                'nom_bref_du_champ':'à faire ' + nom_champ + '',
                typologie:typologie,
                default_charset:'',
                collate:''
            };
            var texte_meta_champ='';
            /* on vérifie que pour chaque libellé ci dessus on a quelque chose, sinon, on complète */
            for(i=0;i < tab_meta.length;i++){
                if((tab_meta[i].statut === true) && (tab_meta[i].type_element === 'champ') && (tab_meta[i].nom_element === nom_champ)){
                    var elt_meta={};
                    for(elt_meta in liste_meta_champ){
                        var tab=tab_meta[i].matrice;
                        for(j=1;j < tab.length;j++){
                            if((elt_meta === tab[j][1])
                             && (tab[j][3] === 2)
                             && (tab[j][2] === 'c')
                             && (tab[tab[j][7]][8] === 2)
                             && (tab[j + 1][2] === 'c')){
                                liste_meta_champ[elt_meta]=tab[j + 1][1];
                            }
                        }
                    }
                }
            }
            t+='\n' + '  field(';
            t+='\n' + '   nom_du_champ(' + nom_champ + ')';
            if((pc['type'].indexOf('(') >= 0) && (pc['type'].lastIndexOf(')') >= pc['type'].indexOf('('))){
                t+='\n' + '   type(' + pc['type'].substr(0,pc['type'].indexOf('(')) + ' , ' + pc['type'].substr((pc['type'].indexOf('(') + 1),(pc['type'].lastIndexOf(')') - pc['type'].indexOf('(') - 1)) + ')';
            }else{
                t+='\n' + '   type(' + pc['type'] + ')';
            }
            if((pc['type'].toUpperCase() === 'INTEGER') && (pc['pk'] === 1) && (pc['auto_increment'] === true)){
                t+='\n' + '   primary_key()';
                t+='\n' + '   auto_increment()';
            }else{
                if(pc['pk'] === 1){
                    t+='\n' + '   primary_key()';
                }
            }
            if(pc['notnull'] === 1){
                t+='\n' + '   non_nulle()';
            }
            if(pc['dflt_value']){
                
                  if(pc['dflt_value']!=='' && pc['dflt_value'].substr(0,1)==="'"){
                      t+=('\n' + '   valeur_par_defaut(\'' + pc['dflt_value'].substr(1,pc['dflt_value'].length-2).replace(/\'\'/g,'\\\'') + '\')');
                  }else if(pc['dflt_value']!=='' && pc['dflt_value'].substr(0,1)==='"'){
                      t+=('\n' + '   valeur_par_defaut("' + pc['dflt_value'].substr(1,pc['dflt_value'].length-2) + '")');
                  }else{
                      t+=('\n' + '   valeur_par_defaut(' + pc['dflt_value'] + ')');
                  }
                
//                t+='\n' + '   valeur_par_defaut(' + pc['dflt_value'].replace(/\'\'/g,'\\\'') + ')';
            }
            if(cle_etrangere === true){
                t+='\n' + '   references(\'' + pc['cle_etrangere']['table'].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\' , \'' + pc['cle_etrangere']['to'].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\' )';
            }
            t+='\n' + '   meta(';
            var elt_meta={};
            for(elt_meta in liste_meta_champ){
                if(liste_meta_champ[elt_meta] !== ''){
//                    t+='\n' + '    (' + elt_meta + ' , \'' + liste_meta_champ[elt_meta].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),';
                    t+='\n' + '    (' + elt_meta + ' , \'' + liste_meta_champ[elt_meta] + '\'),';
                }
            }
            t+='\n' + '   )';
            t+='\n' + '  ),';
        }
        t+='\n' + ' )';
        t+='\n' + ')';
        t+='\n';
        /*
          
          =====================================================================================================
          ====== les indexes ===
          =====================================================================================================
        */
        var nom_index={};
        for(nom_index in par['donnees'][nom_de_la_table]['structure']['liste_des_indexes']){
            var pc = par['donnees'][nom_de_la_table]['structure']['liste_des_indexes'][nom_index];
            if((pc.origin) && (pc.origin !== 'c')){
                /*
                  seuls les indexes utilisateurs doivent être pris en compte
                  vu: pc.origin='pk' dans le cas ou un autoindex était créé sur un champ primary_key
                */
                continue;
            }
            t+=',';
            t+='\n' + '#(==============================)';
            var liste_meta_index={
                /*
                  meta((index chp_dossier_cible) , (message , 'un environnement de travail est déjà créé pour ce dossier cible'))
                */
                index:nom_index,
                'message':'à faire ' + nom_index + ''
            };
            var texte_meta_index='';
            /* on vérifie que pour chaque libellé ci dessus on a quelque chose, sinon, on complète */
            for(i=0;i < tab_meta.length;i++){
                if((tab_meta[i].statut === true) && (tab_meta[i].type_element === 'index') && (tab_meta[i].nom_element === nom_index)){
                    var tab=tab_meta[i].matrice;
                    var elt_meta={};
                    for(elt_meta in liste_meta_index){
                        for(j=1;j < tab.length;j++){
                            if((elt_meta === tab[j][1])
                             && (tab[j][3] === 2)
                             && (tab[j][2] === 'c')
                             && (tab[tab[j][7]][8] === 2)
                             && (tab[j + 1][2] === 'c')){
                                liste_meta_index[elt_meta]=tab[j + 1][1];
                            }
                        }
                    }
                }
            }
            t+='\n' + 'add_index(';
            t+='\n' + '   nom_de_la_table_pour_l_index(\'' + nom_de_la_table + '\'),';
            if(pc['unique'] === 1){
                t+='\n' + '   unique(),';
            }
            t+='\n' + '   index_name(\'' + nom_index + '\'),';
            var lc='';
            var champ_de_l_index={};
            for(champ_de_l_index in pc['champs']){
                lc+=',' + '\'' + champ_de_l_index + '\'';
            }
            if(lc !== ''){
                t+='\n' + '   fields(' + lc.substr(1) + ')';
            }
            t+='\n' + '   meta(';
            var elt_meta={};
            for(elt_meta in liste_meta_index){
                if(liste_meta_table[elt_meta] !== ''){
                    t+='\n' + '    (' + elt_meta + ' , \'' + liste_meta_index[elt_meta].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),';
                }
            }
            t+='\n' + '   )';
            t+='\n' + ')';
        }
    }
    t=t.substr(1);
    if(par['zone_rev']){
        if('___produire_le_rev_v2' === par['contexte']){
            dogid(par['zone_rev']).value=t;
            __gi1.formatter_le_source_rev(par['zone_rev']);
        }else{
            console.error('TODO');
            debugger;
        }
    }
    return({status:true,value:t});
}