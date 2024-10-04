/*
var global_enteteTableau=[
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
*/
class requete_sql{
    #nom_de_la_variable='';
    #obj_init={};
    /*
      structure principale de ce programme
    */
    #obj_webs={
        type_de_requete                   : 'select',
        bases                             : [],
        ordre_des_tables                  : [],
        nom_zone_cible                    : 'champs_sortie',
        indice_table_pour_jointure_gauche : 0 ,
        gauche_0_droite_1                 : 0 ,
        champs_sortie                     : [],
        conditions                      : [],
        complements                       : [],
        tableau_des_bases_tables_champs   : {},
    };
    #div_de_travail=null;
    #deb_selection_dans_formule=0;
    /*
      ================================================================================================================
      ================================================================================================================
      function constructor
    */
    constructor(nom_de_la_variable , nom_de_la_div_de_travail){
        this.#nom_de_la_variable=nom_de_la_variable;
        this.#div_de_travail=document.getElementById(nom_de_la_div_de_travail)
//        console.log(this.#nom_de_la_variable);
        this.nouvelle(this.apres_chargement_des_bases);
        //#obj_init
    }
    
    /*
      ================================================================================================================
      ================================================================================================================
      function enrichir_tableau_des_bases_tables_champs
    */
    #enrichir_tableau_des_bases_tables_champs(that,init){
     
        var nom_de_la_table='';
        
        that.#obj_webs.tableau_des_bases_tables_champs={};
        
        for(var indice_de_la_base in init.bases){

            that.#obj_webs.tableau_des_bases_tables_champs[indice_de_la_base]={}

            var tab2=init.bases[indice_de_la_base].matrice;
            
            
            var l02=tab2.length;
            
         
            for(var j=0;j<l02  ;j++){
                if(tab2[j][2]==='f' && tab2[j][1]==='create_table'){
                    for(var k=j+1;k<l02  && tab2[k][3]>tab2[j][3];j++){
                        if(tab2[k][2]==='f' && tab2[k][1]==='nom_de_la_table'){
                            if(tab2[k+1][2] === 'c'  ){ // && tab2[k+1][1]===nom_de_la_table ){
                                nom_de_la_table=tab2[k+1][1];
//                                that.#obj_webs.bases[indice_de_la_base].selectionne=true;
                                that.#obj_webs.tableau_des_bases_tables_champs[indice_de_la_base][nom_de_la_table]={'champs':{}};
                                
                                for(var l=j+1;l<l02  && tab2[l][3]>tab2[j][3];l++){
                                    if(tab2[l][7]===j){
                                        if(tab2[l][1]==='fields' || tab2[l][1]==='champs' ){
                                            for(var m=l+1;m<l02  && tab2[m][3]>tab2[l][3];m++){
                                                if(tab2[m][7]===l){
                                                    if(tab2[m][1]==='field' || tab2[m][1]==='champ' ){
                                                        var nom_du_champ='';
                                                        for(var n=m+1;n<l02  && tab2[n][3]>tab2[m][3];n++){
                                                            if(tab2[n][7]===m){
                                                                if(tab2[n][1]==='nom_du_champ' ){
                                                                    nom_du_champ=tab2[n+1][1];
                                                                    that.#obj_webs.tableau_des_bases_tables_champs[indice_de_la_base][nom_de_la_table]['champs'][nom_du_champ]={};
                                                                }
                                                            }
                                                        }
    //                                                                debugger
                                                        if(nom_du_champ!==''){
                                                            for(var n=m+1;n<l02  && tab2[n][3]>tab2[m][3];n++){
                                                                if(tab2[n][7]===m){
                                                                    if(tab2[n][1]==='type' ){
                                                                        that.#obj_webs.tableau_des_bases_tables_champs[indice_de_la_base][nom_de_la_table]['champs'][nom_du_champ]['type_du_champ']=tab2[n+1][1];
                                                                    }
                                                                    if(tab2[n][1]==='primary_key' ){
                                                                        that.#obj_webs.tableau_des_bases_tables_champs[indice_de_la_base][nom_de_la_table]['champs'][nom_du_champ]['primary_key']=true;
                                                                    }
                                                                    if(tab2[n][1]==='non_nulle' ){
                                                                        that.#obj_webs.tableau_des_bases_tables_champs[indice_de_la_base][nom_de_la_table]['champs'][nom_du_champ]['non_nulle']=true;
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
                }
            }


        }
        return;
    }

    /*
      ================================================================================================================
      ================================================================================================================
      function convertir_rev_pour_construction
      il faut vérifier que le rev de la requete contient bien les références des tables et des champs
      contenus dans init.bases[n].matrices
      puis mettre les valeurs dans les champs de #obj_webs
    */
    convertir_rev_pour_construction(that,init){
        
        that.#obj_webs.type_de_requete=globale_type_requete;
        that.#obj_webs.bases=init.bases;
        
//        that.#enrichir_tableau_des_bases_tables_champs(that,init);
        console.log( 'that.#obj_webs.tableau_des_bases_tables_champs=' , that.#obj_webs.tableau_des_bases_tables_champs );
      
        var tableau1 = iterateCharacters2(globale_rev_requete);
        var obj1=functionToArray2(tableau1.out,false,true,'');
        if(obj1.status!==true){
            return;
        }
        var tab=obj1.value;
        var l01=tab.length;
        var indice_table=0;
        var jointure='';
        var nom_de_la_table='';
        var id_bdd=0;
        /*
          etape 1 références des tables
        */

        for(var i=0;i<l01;i++){
            nom_de_la_table='';
            var alias_de_la_table='';
            var indice_de_la_base='0';
            if(tab[i][2]==='f' && ( 'table_reference' === tab[i][1] || 'jointure_croisée' === tab[i][1] || 'jointure_gauche' === tab[i][1] )){
                jointure=tab[i][1];
                for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                    if(tab[j][2] === 'f' && "nom_de_la_table"===tab[j][1] ){
                     
                        if(tab[j+1][2]==='c'){
                          nom_de_la_table=tab[j+1][1];
                        }
                        for(var k=j;k<l01 && tab[k][3] > tab[i+1][3] ; k++){
                            if(tab[k][2] === 'f' && "base"===tab[k][1] ){
                                if(tab[k+1][2]==='c'){
                                   indice_de_la_base=tab[k+1][1];
                                   indice_de_la_base=indice_de_la_base.replace(/b/g,'');
//                                   console.log(indice_de_la_base);
                                }
                            }
                        }
                        for(var k=j;k<l01 && tab[k][3] > tab[i+1][3] ; k++){
                            if(tab[k][2] === 'f' && "alias"===tab[k][1] ){
                                if(tab[k+1][2]==='c'){
                                   alias_de_la_table=tab[k+1][1];
                                }
                            }
                        }
                    }
                }
            }
            if(nom_de_la_table!=='' && indice_de_la_base!=='0'){
                if(init.bases.hasOwnProperty(indice_de_la_base) ){


                    /* 
                      il faut chercher dans la matrice le 'create_table(nom_de_la_table(' de la table
                    */
                    
                    var trouve=false; // 

                    if(that.#obj_webs.tableau_des_bases_tables_champs[indice_de_la_base] && that.#obj_webs.tableau_des_bases_tables_champs[indice_de_la_base][nom_de_la_table]){
                     trouve=true
                    }

                    if(trouve===true){
                         /*
                           on peut remplir ordre_des_tables
                         */
                         var champs_jointure_gauche={};
                         var tab_jointure_gauche=[];
                         if( 'jointure_gauche' === tab[i][1] ){
                             for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                                 if(tab[j][1]==='contrainte' && tab[j][2]==='f'){
                                     // contrainte(egal(champ('T1' , chi_id_test) , champ('T0' , chx_test_parent_test)))
                                     // champ_table_fille{ nom_du_champ: 'chi_id_test'          , nom_de_la_table: 'tbl_tests', id_bdd: 1, indice_table: 1}
                                     // champ_table_mere{  nom_du_champ: 'chx_test_parent_test' , nom_de_la_table: 'tbl_tests', id_bdd: 1, indice_table: 0 }
                                     for(var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
                                         if(tab[k][1]==='egal' && tab[j][2]==='f'){
                                             for(var l=k+1;l<l01 && tab[l][3]>tab[k][3];l++){
                                                 if(tab[l][1]==='champ' && tab[l][2]==='f'){
                                                     
                                                     var nom_du_champ='';
                                                     var alias_de_la_table_pour_le_champ='';
                                                      /*
                                                      champ(`T0` , `chi_id_test`)
                                                      */
                                                     if(tab[l][8]===2 ){
                                                         for(var m=l+1;m<l01 && tab[m][3] > tab[l][3] ; m++){
                                                             if(tab[m][2]==='c' ){
                                                                 if(alias_de_la_table_pour_le_champ===''){
                                                                     alias_de_la_table_pour_le_champ=tab[m][1];
                                                                 }else{
                                                                     nom_du_champ=tab[m][1];
                                                                 }
                                                             }
                                                         }
                                                     }else if(tab[l][8]===1){
                                                         for(var m=l+1;m<l01 && tab[m][3] > tab[l][3] ; m++){
                                                             if(tab[m][2]==='c' ){
                                                                 nom_du_champ=tab[m][1];
                                                             }
                                                         }
                                                     }

                                                     tab_jointure_gauche.push({
                                                         alias_de_la_table_pour_le_champ : alias_de_la_table_pour_le_champ ,
                                                         nom_du_champ                    : nom_du_champ                    ,
                                                     });
                                                 }
                                             }
                                         }
                                     }
                                 }
                             }
                         }
                         
                         
                         this.#obj_webs['ordre_des_tables'].push({
                             id_bdd                 : indice_de_la_base , 
                             nom_de_la_table        : nom_de_la_table,
                             alias_de_la_table      : alias_de_la_table ,
                             indice_table           : indice_table ,
                             jointure               : jointure ,
                             champs_jointure_gauche : champs_jointure_gauche,
                         });
                         if(tab_jointure_gauche.length===2){
                             

                             for( var j=0 ; j < tab_jointure_gauche.length ; j++){
                                 for( var k=0;k<this.#obj_webs['ordre_des_tables'].length;k++){
                                     
                                     if(
                                         tab_jointure_gauche[j].alias_de_la_table_pour_le_champ === this.#obj_webs['ordre_des_tables'][k].alias_de_la_table
                                      && alias_de_la_table === this.#obj_webs['ordre_des_tables'][k].alias_de_la_table
                                      && this.#obj_webs['ordre_des_tables'][k].jointure === 'jointure_gauche'
                                     ){
                                         champs_jointure_gauche['champ_table_mere']={ 
                                             nom_du_champ         : tab_jointure_gauche[j].nom_du_champ                                                             ,
                                             nom_de_la_table      : this.#obj_webs['ordre_des_tables'][k].nom_de_la_table ,
                                             id_bdd               : this.#obj_webs['ordre_des_tables'][k].id_bdd          ,
                                             indice_table         : this.#obj_webs['ordre_des_tables'][k].indice_table    ,                                          
                                         };
                                     }else if(
                                         tab_jointure_gauche[j].alias_de_la_table_pour_le_champ === this.#obj_webs['ordre_des_tables'][k].alias_de_la_table
                                     ){
                                         champs_jointure_gauche['champ_table_fille']={ 
                                             nom_du_champ         : tab_jointure_gauche[j].nom_du_champ                                                             ,
                                             nom_de_la_table      : this.#obj_webs['ordre_des_tables'][k].nom_de_la_table ,
                                             id_bdd               : this.#obj_webs['ordre_des_tables'][k].id_bdd          ,
                                             indice_table         : this.#obj_webs['ordre_des_tables'][k].indice_table    ,                                          
                                         };
                                     }
                                 }
                             }
                             this.#obj_webs['ordre_des_tables'][this.#obj_webs['ordre_des_tables'].length-1].champs_jointure_gauche=champs_jointure_gauche;
                         }
                         tab_jointure_gauche=[];
                         indice_table++;
                    }
                }
            }
        }
        /*
          pour un update, insert,delete, il n'y a qu'une table
        */        
        if(that.#obj_webs.type_de_requete==='update' || that.#obj_webs.type_de_requete==='insert' || that.#obj_webs.type_de_requete==='delete' ){
         if(this.#obj_webs['ordre_des_tables'].length===1){
          nom_de_la_table=this.#obj_webs['ordre_des_tables'][0].nom_de_la_table;
          id_bdd=this.#obj_webs['ordre_des_tables'][0].id_bdd;
         }
        }
        
        /*
          etape 2 références des champs pour champs_sortie chercher "valeurs"
        */
        var nom_du_champ='';
        var alias_du_champ='';
        for(var i=0;i<l01;i++){
            if(tab[i][2]==='f' && ( 'valeurs' === tab[i][1] ) ){
                for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                    if(tab[j][2] === 'f' && "champ"===tab[j][1] && tab[j][7]===i ){
                        nom_du_champ='';
                        var alias_de_la_table_pour_le_champ='';
                         /*
                         champ(`T0` , `chi_id_test`)
                         */
                        if(tab[j][8]===2 ){
                            for(var k=j+1;k<l01 && tab[k][3] > tab[j][3] ; k++){
                                if(tab[k][2]==='c' ){
                                    if(alias_de_la_table_pour_le_champ===''){
                                        alias_de_la_table_pour_le_champ=tab[k][1];
                                    }else{
                                        nom_du_champ=tab[k][1];
                                    }
                                }
                            }
                        }else if(tab[j][8]===1){
                            for(var k=j+1;k<l01 && tab[k][3] > tab[j][3] ; k++){
                                if(tab[k][2]==='c' ){
                                    nom_du_champ=tab[k][1];
                                }
                            }
                        }else if(tab[j][8]===3){
                            for(var k=j+1;k<l01 && tab[k][3] > tab[j][3] ; k++){
                                if(tab[k][2]==='c' ){
                                    if(alias_de_la_table_pour_le_champ===''){
                                        alias_de_la_table_pour_le_champ=tab[k][1];
                                    }else{
                                        nom_du_champ=tab[k][1];
                                    }
                                }else if(tab[k][2]==='f' && tab[k][1]==='alias_champ' ){

                                    alias_du_champ=tab[k+1][1];
                                    break;
                                }
                            }
                        }
                        if(nom_du_champ!==''){
                         
                            /*
                             il faut vérifier que ce champ appartient bien à une table référencée 
                             à la fois dans la base et dans la requête
                            */
                            var dans_requete_et_base=false;
                            var nom_des_table_pouvant_contenir_le_champ=[];
                            if(alias_de_la_table_pour_le_champ!==''){
                             
                             for( var k=0;k<this.#obj_webs['ordre_des_tables'].length;k++){
                              if(alias_de_la_table_pour_le_champ===this.#obj_webs['ordre_des_tables'][k].alias_de_la_table){
                               nom_des_table_pouvant_contenir_le_champ.push({
                                nom_de_la_table : this.#obj_webs['ordre_des_tables'][k].nom_de_la_table,
                                id_bdd          : this.#obj_webs['ordre_des_tables'][k].id_bdd,
                                indice_table    : k ,
                               });
                              }
                             }
                            }
                            if(nom_des_table_pouvant_contenir_le_champ.length===0){
                             /* 
                               si on a pas trouvé on var chercher le champ dans toutes les tables référencées plus haut 
                             */
                             for( var k=0;k<this.#obj_webs['ordre_des_tables'].length;k++){
                               nom_des_table_pouvant_contenir_le_champ.push({
                                nom_de_la_table : this.#obj_webs['ordre_des_tables'][k].nom_de_la_table ,
                                id_bdd          : this.#obj_webs['ordre_des_tables'][k].id_bdd,
                                indice_table    : k ,
                               });
                             }
                            }
                            var trouve=false;
                            for(var k=0;k<nom_des_table_pouvant_contenir_le_champ.length && trouve===false ;k++){
                                var tab2=init.bases[nom_des_table_pouvant_contenir_le_champ[k].id_bdd].matrice;
                                var l02=tab2.length;
                                for(var l=0;l<l02 && trouve===false ;l++){
                                    
                                    if(tab2[l][1]==='create_table' && tab2[l][2]==='f' && tab2[l][3]===0 ){

                                        for(var m=l+1 ; m<l02 && tab2[m][3]>tab2[l][3] && trouve===false ; m++){
                                            if( tab2[m][7] === l ){

                                                if(tab2[m][1]==='nom_de_la_table' &&  tab2[m+1][2]==='c' && tab2[m+1][1] === nom_des_table_pouvant_contenir_le_champ[k].nom_de_la_table){
                                                   trouve=nom_des_table_pouvant_contenir_le_champ[k];
                                                   nom_de_la_table=tab2[m+1][1];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            
                            if(trouve!==false && tab[j][7]===i){
                               /* 
                                 si c'est une référence de champ directe sous le 'valeurs' 
                                 alors c'est un champ en sortie, 
                                 sinon il est dans une formule 
                               */

                               this.#obj_webs['champs_sortie'].push({
                                   type_d_element  : 'champ'         ,
                                   id_bdd          : trouve.id_bdd   ,
                                   nom_de_la_table : nom_de_la_table ,
                                   nom_du_champ    : nom_du_champ    ,
                                   indice_table    : trouve.indice_table  ,
                                   alias_du_champ  : alias_du_champ ,
                               })
                            }
                        }

                    }else if(tab[j][2] === 'f' && "champ"!==tab[j][1] ){
                        /*
                          c'est probablement une formule
                        */
                        if(that.#obj_webs.type_de_requete==='update' || that.#obj_webs.type_de_requete==='insert' ){
                            /* si on a un update, et un affecte */
                            if(tab[j][1]==='affecte' && tab[j][2]==='f' ){

                                /*
                                  si le premier paramètre de affecte est un champ et le deuxième est une variable, 
                                  alors c'est un champ en sortie
                                */
                                var indice_du_champ=-1;
                                var indice_de_la_variable=-1;
                                for( var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
                                 if(tab[k][7]===j){
                                  if(tab[k][1]==='champ' && tab[k][2]==='f'){
                                   indice_du_champ=k;
                                   nom_du_champ=tab[k+1][1];
                                  }else if(tab[k][1].substr(0,1)===':' && tab[k][2]==='c'){
                                   indice_de_la_variable=k;
                                  }
                                 }
                                }
                                if(indice_de_la_variable>0 && indice_du_champ>0){
                                    /* 
                                      c'est un champ
                                    */

                                    
                                    this.#obj_webs['champs_sortie'].push({
                                        type_d_element  : 'champ'         ,
                                        id_bdd          : id_bdd          ,
                                        nom_de_la_table : nom_de_la_table ,
                                        nom_du_champ    : nom_du_champ    ,
                                        indice_table    : 0               ,
                                        alias_du_champ  : alias_du_champ  ,
                                    })
                                    
                                }else{
                                    /* 
                                      c'est une formule
                                    */
                                    var obj=a2F1(tab,tab[j][7],true,j,false);
                                    if(obj.status===true){
                                        this.#obj_webs['champs_sortie'].push({
                                            type_d_element  : 'formule'  ,
                                            formule         : obj.value  ,
                                        })
                                    }
                                }
                                
                                
                                
                             
                            }else{
                                /*
                                   c'est une formule
                                */
                                var obj=a2F1(tab,tab[j][7],true,j,false);
                                if(obj.status===true){
                                    this.#obj_webs['champs_sortie'].push({
                                        type_d_element  : 'formule'  ,
                                        formule         : obj.value  ,
                                    })
                                }
                            }
                             
                        
                        }else{

                            if(tab[j][1]==='alias_champ'){
                            }else{
                                var obj=a2F1(tab,tab[j][7],true,j,false);
                                if(obj.status===true){
                                    this.#obj_webs['champs_sortie'].push({
                                        type_d_element  : 'formule'  ,
                                        formule         : obj.value  ,
                                    })
                                }
                            }
                        }
                    }
                }
            }else if(tab[i][2]==='f' && ( 'conditions' === tab[i][1] ) ){
                var obj=a2F1(tab,tab[i+1][7],true,i+1,false);
                if(obj.status===true){
                    this.#obj_webs['conditions'].push({
                        type_d_element  : 'formule'  ,
                        formule         : obj.value  ,
                    })

                }
            }else if(tab[i][2]==='f' && ( 'complements' === tab[i][1] ) ){
                var obj=a2F1(tab,tab[i+1][7],true,i+1,false);
                if(obj.status===true){
                    this.#obj_webs['complements'].push({
                        type_d_element  : 'formule'  ,
                        formule         : obj.value  ,
                    })
                }
            }
        }
    }
    
    /*
      ================================================================================================================
      ================================================================================================================
      function apres_chargement_des_bases
    */
    apres_chargement_des_bases(init,that){
        
        if(globale_id_requete && globale_id_requete>0){
//            alert(globale_id_requete +'\n'+ globale_type_requete +'\n'+ globale_rev_requete );

            that.#enrichir_tableau_des_bases_tables_champs(that,init);
            that.convertir_rev_pour_construction(that,init);
            that.#mettre_en_stokage_local_et_afficher();
        }else{
        
            var sauvegarde=localStorage.getItem(APP_KEY+'_derniere_requete');
            if(sauvegarde!==null){
                sauvegarde=JSON.parse(sauvegarde);
                /*
                  vérifier que init et sauvegarde correspondent
                */
                var correspondance=true;
                
                for( var i in init.bases ){
                    if(!sauvegarde.bases.hasOwnProperty(i)){
                     correspondance=false;
                    }
                }
                if(correspondance===true){
                    for( var i in sauvegarde.bases ){
                        if(!init.bases.hasOwnProperty(i)){
                         correspondance=false;
                        }
                    }
                }
                if(correspondance===true){
                    for( var i in init.bases ){
                        for( var j in init.bases[i].tables ){
                            if(!sauvegarde.bases[i].tables.hasOwnProperty(j)){
                             correspondance=false;
                            }
                        }
                        for( var j in sauvegarde.bases[i].tables ){
                            if(!init.bases[i].tables.hasOwnProperty(j)){
                             correspondance=false;
                            }
                        }
                    }
                }
                
                if(correspondance===true){
                    that.#obj_webs=JSON.parse(JSON.stringify(sauvegarde));
                }else{
                    that.#obj_webs=JSON.parse(JSON.stringify(init));
                }
                
                
                
            }else{
                that.#obj_webs=JSON.parse(JSON.stringify(init));
            }
            that.#mettre_en_stokage_local_et_afficher();
        }

    }
    /*
      ================================================================================================================
      ================================================================================================================
    */
    get nom_de_la_variable(){
        return this.#nom_de_la_variable
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function mettre_en_stokage_local_et_afficher
    */
    #mettre_en_stokage_local_et_afficher(){
        localStorage.setItem(APP_KEY+'_derniere_requete' , JSON.stringify(this.#obj_webs) );
        this.#afficher_les_donnees();
     
/*     
        var stokage_local_derniere_requete
        var fta_derniere_requete=localStorage.getItem("fta_traiteSql_dernier_fichier_charge");
        if(fta_traiteSql_dernier_fichier_charge!==null){
            dogid(nom_de_la_textarea).value=fta_traiteSql_dernier_fichier_charge;
        }
*/        
    }
    /*
      ================================================================================================================
      ================================================================================================================
    */
    initialisation(){
//        console.log('initialisation de l\'objet ' , this.#nom_de_la_variable);     
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function selectionner_cette_base
    */
    selectionner_ou_deselectionner_cette_base(id_bdd){
        for(var i in this.#obj_webs['bases']){

            if(id_bdd===this.#obj_webs['bases'][i]['chi_id_basedd']){
                if(this.#obj_webs['bases'][i].selectionne===true){
                    this.#obj_webs['bases'][i].selectionne=false;
                    var liste_des_tables_a_retirer=[];
                    for(var k=0;k<this.#obj_webs['ordre_des_tables'].length;k++){
                        if(this.#obj_webs['ordre_des_tables'][k].id_bdd===id_bdd ){
                            liste_des_tables_a_retirer.push(k);
                        }
                    }
                    for(var k=liste_des_tables_a_retirer.length-1;k>=0;k--){
                     this.#obj_webs['ordre_des_tables'].splice(liste_des_tables_a_retirer[k],1);
                    }
                    
                    
                }else{
                    this.#obj_webs['bases'][i].selectionne=true;
                }
                break;
            }
        }
        this.#mettre_en_stokage_local_et_afficher();
        
    }
    /*
      ================================================================================================================
      ================================================================================================================
      function selectionner_ou_deselectionner_cette_table
    */
    selectionner_ou_deselectionner_cette_table(id_bdd , nom_de_la_table , selectionner , indice_table){
        if(selectionner===0){
            if(this.#obj_webs['ordre_des_tables'].length>0){
                /*
                  retirer le champ de champs_sortie
                */
                var liste_des_champ_a_retirer=[];
                for(var k=0;k<this.#obj_webs['champs_sortie'].length;k++){
                    if(this.#obj_webs['champs_sortie'][k].id_bdd===id_bdd && this.#obj_webs['champs_sortie'][k].nom_de_la_table===nom_de_la_table && indice_table===this.#obj_webs['champs_sortie'][k].indice_table){
                        liste_des_champ_a_retirer.push(k);
                    }
                }
                for(k=liste_des_champ_a_retirer.length-1;k>=0;k--){
                    this.#obj_webs['champs_sortie'].splice(liste_des_champ_a_retirer[k],1);
                }
                
                /*
                  retirer le champ de conditions
                */
                liste_des_champ_a_retirer=[];
                for(var k=0;k<this.#obj_webs['conditions'].length;k++){
                    if(this.#obj_webs['conditions'][k].id_bdd===id_bdd && this.#obj_webs['conditions'][k].nom_de_la_table===nom_de_la_table && indice_table===this.#obj_webs['conditions'][k].indice_table){
                        liste_des_champ_a_retirer.push(k);
                    }
                }
                for(k=liste_des_champ_a_retirer.length-1;k>=0;k--){
                    this.#obj_webs['conditions'].splice(liste_des_champ_a_retirer[k],1);
                }

                this.#obj_webs['ordre_des_tables'].splice(indice_table,1);
                /*
                si on supprime l'indice_table, il faut renumeroter les champs
                */
                for(var k=0;k<this.#obj_webs['champs_sortie'].length;k++){
                 if(this.#obj_webs['champs_sortie'][k].indice_table>=indice_table){
                  this.#obj_webs['champs_sortie'][k].indice_table-=1;
                 }
                }
                
                for(var k=0;k<this.#obj_webs['conditions'].length;k++){
                 if(this.#obj_webs['conditions'][k].indice_table>=indice_table){
                  this.#obj_webs['conditions'][k].indice_table-=1;
                 }
                }
                
                
            }
        }else{
            this.#obj_webs['ordre_des_tables'].push({
                id_bdd                 : id_bdd , 
                nom_de_la_table        : nom_de_la_table,
                indice_table           : 0 ,
                jointure               : 'jointure_croisée' ,
                champs_jointure_gauche : { champ_table_fille:null , champ_table_mere:null},
            });
         
        }
        if(this.#obj_webs['ordre_des_tables'].length>0){
            for(var i=0;i<this.#obj_webs['ordre_des_tables'].length;i++){
                this.#obj_webs['ordre_des_tables'][i].indice_table=i;
                if(i===0){
                    this.#obj_webs['ordre_des_tables'][i].jointure='table_reference';
                }else{
                    if(this.#obj_webs['ordre_des_tables'][i].jointure==='table_reference'){
                        this.#obj_webs['ordre_des_tables'][i].jointure='';
                    }
                }
            }
        }
        this.#enrichir_tableau_des_bases_tables_champs(this,this.#obj_webs);
        
        
        this.#mettre_en_stokage_local_et_afficher();
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function selectionner_champs_destination
    */
    selectionner_champs_destination(champs_selectionnes,indice_table,gauche_0_droite_1){
        if(champs_selectionnes==='champs_jointure_gauche'){
            this.#obj_webs.nom_zone_cible=champs_selectionnes;
            this.#obj_webs.indice_table_pour_jointure_gauche=indice_table;
            this.#obj_webs.gauche_0_droite_1=gauche_0_droite_1;

        }else{
    //        console.log('champs_selectionnes=' , champs_selectionnes );
            this.#obj_webs.nom_zone_cible=champs_selectionnes;
        }
        this.#mettre_en_stokage_local_et_afficher();
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function maj_type_de_requete
    */
    maj_type_de_requete(){
        this.#obj_webs.type_de_requete=document.getElementById('type_de_requete').value;
        if(this.#obj_webs.type_de_requete==='insert'){
            this.#obj_webs.nom_zone_cible='champs_sortie';
        }
        this.#mettre_en_stokage_local_et_afficher();
    }
    /*
      ================================================================================================================
      ================================================================================================================
      function selectionner_ce_champ
    */
    selectionner_ce_champ(nom_du_champ , nom_de_la_table,id_bdd,indice_table){

        var nom_zone_cible='champs_sortie';
        if(this.#obj_webs.type_de_requete !== 'insert'){
         
            if(this.#obj_webs.nom_zone_cible==="champs_jointure_gauche"){
                
                if(this.#obj_webs.gauche_0_droite_1===0){
                    this.#obj_webs.ordre_des_tables[this.#obj_webs.indice_table_pour_jointure_gauche].champs_jointure_gauche.champ_table_mere={
                        nom_du_champ    : nom_du_champ    ,
                        nom_de_la_table : nom_de_la_table ,
                        id_bdd          : id_bdd          ,
                        indice_table    : indice_table    ,
                    };
                }else{
                    this.#obj_webs.ordre_des_tables[this.#obj_webs.indice_table_pour_jointure_gauche].champs_jointure_gauche.champ_table_fille={
                        nom_du_champ    : nom_du_champ    ,
                        nom_de_la_table : nom_de_la_table ,
                        id_bdd          : id_bdd          ,
                        indice_table    : indice_table    ,
                    };
                }
                this.#mettre_en_stokage_local_et_afficher();
                return
                
            }else{
                var lst=document.getElementsByName('champs_selectionnes');
                for(var i=0;i<lst.length;i++){
                    if(lst[i].checked===true){
                        nom_zone_cible=lst[i].value;
                        break
                    }
                }
            }
        }else{
            nom_zone_cible='champs_sortie';
        }
        this.#obj_webs[nom_zone_cible].push({
            id_bdd          : id_bdd          ,
            nom_de_la_table : nom_de_la_table ,
            nom_du_champ    : nom_du_champ    ,
            indice_table    : indice_table    ,
            type_d_element  : 'champ'         ,
        })
        this.#obj_webs.nom_zone_cible=nom_zone_cible;
        this.#mettre_en_stokage_local_et_afficher();
    }
    
    
    
    /*
      ================================================================================================================
      ================================================================================================================
      function retirer_ce_champ_de_complements
    */
    retirer_ce_champ_de_complements(ind){
        if(confirm('Certain ?')){
            this.#obj_webs.complements.splice(ind,1);
            this.#mettre_en_stokage_local_et_afficher();
        }
    }
    /*
      ================================================================================================================
      ================================================================================================================
      function retirer_ce_champ_de_where
    */
    retirer_ce_champ_de_where(ind){
        if(confirm('Certain ?')){
            this.#obj_webs.conditions.splice(ind,1);
            this.#mettre_en_stokage_local_et_afficher();
        }
    }
    /*
      ================================================================================================================
      ================================================================================================================
      function retirer_ce_champ_de_sortie
    */
    retirer_ce_champ_de_sortie(ind){
        this.#obj_webs.champs_sortie.splice(ind,1);
        this.#mettre_en_stokage_local_et_afficher();
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function changer_la_jointure
    */
    changer_la_jointure(ind,element_html){
//        debugger
//        console.log(ind,element_html);
        this.#obj_webs['ordre_des_tables'][ind].jointure=element_html.value;
        this.#mettre_en_stokage_local_et_afficher();
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function ajouter_ce_champ_dans_la_formule
    */
    ajouter_ce_champ_dans_la_formule(nom_du_champ,nom_de_la_table,id_bdd,indice_table){
        
        var zone_formule=document.getElementById('zone_formule');
        if(this.#deb_selection_dans_formule===-1){
            if(this.#obj_webs.type_de_requete==='update' || this.#obj_webs.type_de_requete==='insert'){
                zone_formule.value=zone_formule.value+'champ(`'+nom_du_champ+'`),';
            }else{
                zone_formule.value=zone_formule.value+'champ(`T'+indice_table+'` , `'+nom_du_champ+'`),';
            }
        }else{
            var debut=zone_formule.value.substr(0,this.#deb_selection_dans_formule);
            var fin=zone_formule.value.substr(this.#deb_selection_dans_formule);
            if(this.#obj_webs.type_de_requete==='update' || this.#obj_webs.type_de_requete==='insert'){
                zone_formule.value=debut+'champ( `'+nom_du_champ+'`),'+fin;
            }else{
                zone_formule.value=debut+'champ(`T'+indice_table+'` , `'+nom_du_champ+'`),'+fin;
            }
        }
        zone_formule.focus();
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function ajouter_cette_formule_dans_la_formule
    */
    ajouter_cette_formule_dans_la_formule(formule){
        var zone_formule=document.getElementById('zone_formule');
        if(this.#deb_selection_dans_formule===-1){
            zone_formule.value=zone_formule.value+formule+',';
        }else{
            var debut=zone_formule.value.substr(0,this.#deb_selection_dans_formule);
            var fin=zone_formule.value.substr(this.#deb_selection_dans_formule);
            zone_formule.value=debut+formule+','+fin;
        }
        zone_formule.focus();
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function ajouter_la_formule
    */
    ajouter_la_formule(destination){
        var zone_formule=document.getElementById('zone_formule');
        var rev_de_la_formule=zone_formule.value;
        var obj=functionToArray(rev_de_la_formule , true, true , ''); //src,quitterSiErreurNiveau,autoriserConstanteDansLaRacine,rechercheParentheseCorrespondante
        if(obj.status===true){
            if(!this.#obj_webs[destination]){
             this.#obj_webs[destination]=[];
            }
            this.#obj_webs[destination].push({
                type_d_element  : 'formule'  ,
                formule  : rev_de_la_formule  ,
            });
            global_modale1.close();
            this.#mettre_en_stokage_local_et_afficher();
        }
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function ajouter_une_formule
    */
    ajouter_une_formule(destination){

        this.#deb_selection_dans_formule=-1;
     
        var t='';
        var tabchamps=[];
        t+='<h1>ajouter une formule</h1>';

        if(this.#obj_webs['ordre_des_tables'].length>0){
            for(var i=0;i<this.#obj_webs['ordre_des_tables'].length;i++){
                var elem=this.#obj_webs['ordre_des_tables'][i];
                for( var id_du_champ in this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs']){
                    t+='<a href="javascript:'+this.#nom_de_la_variable+'.ajouter_ce_champ_dans_la_formule(';
                    t+=' &quot;'+this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ+'&quot;';
                    t+=',&quot;'+elem.nom_de_la_table+'&quot;';
                    t+=','+elem.id_bdd+'';
                    t+=','+i+'';
                    t+=')">+T'+this.#obj_webs['ordre_des_tables'][i].indice_table+'.'+this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ;
                    t+='</a>';

                    var nom_du_champ=this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ;
                    var type_du_champ=this.#obj_webs.tableau_des_bases_tables_champs[elem.id_bdd][elem.nom_de_la_table]['champs'][nom_du_champ].type_du_champ;
                    var non_nulle=this.#obj_webs.tableau_des_bases_tables_champs[elem.id_bdd][elem.nom_de_la_table]['champs'][nom_du_champ].hasOwnProperty('non_nulle');

                    tabchamps.push({
                     indice_table : this.#obj_webs['ordre_des_tables'][i].indice_table ,
                     nom_du_champ : nom_du_champ,
                     type_du_champ : type_du_champ,
                     non_nulle     : non_nulle,
                    });
                }
            }
        }
        var tab_ex=[
              'tous_les_champs()'
            , 'plus(champ(xxx) , 2)'
            , 'concat(\'=>\',champ(xxx),\'<=\')'
            , 'compter(tous_les_champs())'
            , '5'
        ];
        if(destination==='complements'){
         tab_ex.push('trier_par((champ(xxx),décroissant()),(champ(xxx),croissant()))')
         tab_ex.push(',limité_à(quantité(:quantitee),début(:debut))')
        }
        
           
        
        
        for(var i=0;i<tab_ex.length;i++){
            t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.ajouter_cette_formule_dans_la_formule(&quot;'+tab_ex[i].replace(/"/g,'&#34;')+'&quot;)">'+tab_ex[i]+'</a>';
        }
        var contenu='';
        if("select_liste" === this.#obj_webs.type_de_requete && tabchamps.length>0 ){
            if( "conditions" === destination ){
                for(var i in tabchamps){

                    if( tabchamps[i].type_du_champ.substr(0,3).toLowerCase()==='int' ||
                       tabchamps[i].type_du_champ.substr(0,5).toLowerCase()==='float' ||
                       tabchamps[i].type_du_champ.substr(0,6).toLowerCase()==='double' ||
                       tabchamps[i].type_du_champ.substr(0,7).toLowerCase()==='decimal'
                    ){
                        contenu+=CRLF+' egal(champ(`T'+tabchamps[i].indice_table+'` , `'+tabchamps[i].nom_du_champ+'`), :T'+tabchamps[i].indice_table+'_'+tabchamps[i].nom_du_champ+'),';
                    }else{
                        contenu+=CRLF+' comme(champ(`T'+tabchamps[i].indice_table+'` , `'+tabchamps[i].nom_du_champ+'`), :T'+tabchamps[i].indice_table+'_'+tabchamps[i].nom_du_champ+'),';
                    }
                    
                    
//                    contenu+=CRLF+' egal(champ(`T'+tabchamps[i].indice_table+'` , `'+tabchamps[i].nom_du_champ+'`), :T'+tabchamps[i].indice_table+'_'+tabchamps[i].nom_du_champ+'),'
                }
                contenu='et('+contenu+CRLF+')';
            }else if( "complements" === destination ){
                contenu+='trier_par('+CRLF+'(champ(`T'+tabchamps[0].indice_table+'` , `'+tabchamps[0].nom_du_champ+'`),décroissant()),'+CRLF+'),'+CRLF+'limité_à(quantité(:quantitee),début(:debut))';
            }
        }else if("update" === this.#obj_webs.type_de_requete && tabchamps.length>0 ){
            if( "champs_sortie" === destination ){
                for(var i in tabchamps){
                    contenu+=CRLF+' affecte(champ(`'+tabchamps[i].nom_du_champ+'`), :n_'+tabchamps[i].nom_du_champ+'),';
                }
            }else if( "conditions" === destination ){
                var nombre=0;
                for(var i in tabchamps){
                    contenu+=CRLF+' egal(champ(`'+tabchamps[i].nom_du_champ+'`), :c_'+tabchamps[i].nom_du_champ+'),';
                    nombre++;
                }
                if(nombre>1){
                    contenu='et('+contenu+CRLF+')';
                }
            }

        }else if("delete" === this.#obj_webs.type_de_requete && tabchamps.length>0 ){
            if( "conditions" === destination ){
                var nombre=0;
                for(var i in tabchamps){
                    contenu+=CRLF+' egal(champ(`'+tabchamps[i].nom_du_champ+'`), :'+tabchamps[i].nom_du_champ+'),';
                    nombre++;
                }
                if(nombre>1){
                    contenu='et('+contenu+CRLF+')';
                }
            }
         
        }
        t+='<a href="javascript:__gi1.formatter_le_source_rev(&quot;zone_formule&quot;);" title="formatter le source rev">(😊)</a>';
        t+='<a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;zone_formule&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>';
        t+='<textarea id="zone_formule" rows="20" autocorrect="off" autocapitalize="off" spellcheck="false">'+strToHtml(contenu)+'</textarea>';
        t+='<br /><a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.ajouter_la_formule(&quot;'+destination+'&quot;)">ajouter la formule</a>';
         
        
        document.getElementById('__contenu_modale').innerHTML=t;
        global_modale1.showModal();
        document.getElementById('zone_formule').addEventListener('click',this.clic_sur_textarea_formule.bind(this));
        document.getElementById('zone_formule').addEventListener('keyup',this.clic_sur_textarea_formule.bind(this));
        
     
     
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function clic_sur_textarea_formule
    */
    clic_sur_textarea_formule(evt){
     this.#deb_selection_dans_formule=evt.target.selectionStart;
    }
    
    /* 
      ================================================================================================================
      ================================================================================================================
      function modifier_la_formule_de_destination
    */
    modifier_la_formule_de_destination(ind,destination){
     
        this.#deb_selection_dans_formule=-1;
     
        var t='';
        t+='<h1>modifier une formule</h1>'
        
        if(this.#obj_webs['ordre_des_tables'].length>0){
            for(var i=0;i<this.#obj_webs['ordre_des_tables'].length;i++){
                var elem=this.#obj_webs['ordre_des_tables'][i];
                for( var id_du_champ in this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs']){
                    t+='<a href="javascript:'+this.#nom_de_la_variable+'.ajouter_ce_champ_dans_la_formule(';
                    t+=' &quot;'+this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ+'&quot;';
                    t+=',&quot;'+elem.nom_de_la_table+'&quot;';
                    t+=','+elem.id_bdd+'';
                    t+=','+i+'';
                    t+=')">+T'+this.#obj_webs['ordre_des_tables'][i].indice_table+'.'+this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ;
                    t+='</a>';
                }
            }
        }
        var tab_ex=[
              'tous_les_champs()'
            , 'plus(champ(xxx) , 2)'
            , 'concat(\'=>\',champ(xxx),\'<=\')'
            , 'compter(tous_les_champs())'
            , 'xxx'
        ];
        if(destination==='complements'){
         tab_ex.push('trier_par((champ(xxx),décroissant()),(champ(xxx),croissant()))')
         tab_ex.push(',limité_à(quantité(:quantitee),début(:debut))')
        }
        
        for(var i=0;i<tab_ex.length;i++){
            t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.ajouter_cette_formule_dans_la_formule(&quot;'+tab_ex[i].replace(/"/g,'&#34;')+'&quot;)">'+tab_ex[i]+'</a>';
        }
         
        t+='<a href="javascript:__gi1.formatter_le_source_rev(&quot;zone_formule&quot;);" title="formatter le source rev">(😊)</a>';
        t+='<a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;zone_formule&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>';
        t+='<textarea id="zone_formule" rows="20" autocorrect="off" autocapitalize="off" spellcheck="false">';
        t+=this.#obj_webs[destination][ind].formule.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        t+='</textarea>';
        t+='<br /><a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.enregistrer_la_formule_de_destination('+ind+',&quot;'+destination+'&quot;)">modifier la formule</a>';
         
         
        document.getElementById('__contenu_modale').innerHTML=t;
        global_modale1.showModal();
        document.getElementById('zone_formule').addEventListener('click',this.clic_sur_textarea_formule.bind(this));
        document.getElementById('zone_formule').addEventListener('keyup',this.clic_sur_textarea_formule.bind(this));
     
     
    }
    
    
    /* 
      ================================================================================================================
      ================================================================================================================
      function enregistrer_la_formule_de_destination
    */
    enregistrer_la_formule_de_destination(ind,destination){
        var zone_formule=document.getElementById('zone_formule');
        var rev_de_la_formule=zone_formule.value;
        var obj=functionToArray(rev_de_la_formule , true, true , ''); //src,quitterSiErreurNiveau,autoriserConstanteDansLaRacine,rechercheParentheseCorrespondante
        if(obj.status===true){
            if(!this.#obj_webs[destination]){
                this.#obj_webs[destination]=[];
            }
            this.#obj_webs[destination][ind]={
                type_d_element  : 'formule'  ,
                formule  : rev_de_la_formule  ,
            };
            global_modale1.close();
            this.#mettre_en_stokage_local_et_afficher();
        }
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function afficher_les_donnees
    */
    #afficher_les_donnees(){
        this.#div_de_travail.innerHTML='';
        var t='';
        var champs_affiches=false;
        t+='<div>';
        t+='type de requête : ';
        t+='<select id="type_de_requete" onchange="'+this.#nom_de_la_variable+'.maj_type_de_requete()">';
        t+='<option value="select_liste" '+( this.#obj_webs.type_de_requete==='select_liste'?' selected="true"':'')+'>select_liste</option>';
        t+='<option value="select" '+( this.#obj_webs.type_de_requete==='select'?' selected="true"':'')+'>select</option>';
        t+='<option value="update" '+( this.#obj_webs.type_de_requete==='update'?' selected="true"':'')+'>update</option>';
        t+='<option value="insert" '+( this.#obj_webs.type_de_requete==='insert'?' selected="true"':'')+'>insert</option>';
        t+='<option value="delete" '+( this.#obj_webs.type_de_requete==='delete'?' selected="true"':'')+'>delete</option>';
        t+='</select>';
        t+='</div>';
        t+='<table>';
        var la_class_de_la_base='';
        var la_classe_de_la_table='';

        for(var ind in this.#obj_webs['bases']){
            t+='<tr>';
            t+='<td>';
            la_class_de_la_base='';
            if(this.#obj_webs['bases'][ind].selectionne===true){
                la_class_de_la_base='yyinfo'
            }
            t+='<a class="'+la_class_de_la_base+'" href="javascript:'+this.#nom_de_la_variable+'.selectionner_ou_deselectionner_cette_base('+this.#obj_webs['bases'][ind]['chi_id_basedd']+')">('+this.#obj_webs['bases'][ind]['chi_id_basedd']+')'+this.#obj_webs['bases'][ind]['chp_nom_basedd']+'</a>';
            t+='</td>';
            if(la_class_de_la_base!==''){
                t+='<td>';
                for( var nom_de_la_table in this.#obj_webs['bases'][ind]['tables']){
                    la_classe_de_la_table='';
                    if(this.#obj_webs['bases'][ind]['tables'][nom_de_la_table].active===true){
                        la_classe_de_la_table='yyinfo';
                    }
                    t+='<a class="'+la_classe_de_la_table+'" href="javascript:'+this.#nom_de_la_variable+'.selectionner_ou_deselectionner_cette_table('+ind+',&quot;'+nom_de_la_table+'&quot;,1,0)">'+nom_de_la_table+'</a>';
                }
                t+='</td>';
            }
            t+='</tr>';
        }
        t+='</table>';
        for(var ind in this.#obj_webs['bases']){
            var la_class='';
            if(this.#obj_webs['bases'][ind].selectionne===true){
                la_class='yyinfo'
            }
        }
        
        t+='<hr />' 
        if(this.#obj_webs['ordre_des_tables'].length>0){
            t+='<table id="ordre_des_tables">' 
            for(var i=0;i<this.#obj_webs['ordre_des_tables'].length;i++){
                var elem=this.#obj_webs['ordre_des_tables'][i];
                t+='<tr>' 
                t+='<td>' 
                t+=elem.id_bdd + ' ' + elem.nom_de_la_table + ' T'+this.#obj_webs['ordre_des_tables'][i].indice_table  ;
                t+='<a class="yydanger" href="javascript:'+this.#nom_de_la_variable+'.selectionner_ou_deselectionner_cette_table('+elem.id_bdd+',&quot;'+elem.nom_de_la_table+'&quot;,0,'+i+')">-</a>';
                t+='</td>' 
                t+='<td>' 
                if(i>0){
                t+='<td>' 
                t+='<select onchange="javascript:'+this.#nom_de_la_variable+'.changer_la_jointure('+i+',this)">';
                t+='<option '+(this.#obj_webs['ordre_des_tables'][i].jointure==='jointure_croisée'?' selected="true" ':'')+' value="jointure_croisée" >jointure croisée</option>';
                t+='<option '+(this.#obj_webs['ordre_des_tables'][i].jointure==='jointure_gauche' ?' selected="true" ':'')+' value="jointure_gauche"  >jointure gauche</option>';
                t+='</select>';
                t+='</td>' 
                }else{
                  t+='<td>table_reference</td>' 
                }
                t+='<td>' 
                for( var id_du_champ in this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs']){
                    t+='<a href="javascript:'+this.#nom_de_la_variable+'.selectionner_ce_champ(';
                    t+=' &quot;'+this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ+'&quot;';
                    t+=',&quot;'+elem.nom_de_la_table+'&quot;';
                    t+=','+elem.id_bdd+'';
                    t+=','+i+'';
                    t+=',&quot;'+this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].type+'&quot;';
                    t+=')">';
                    t+='T'+this.#obj_webs['ordre_des_tables'][i].indice_table+'.'+this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ;
                    t+='</a>';
                }
                t+='</td>' 
                if(this.#obj_webs['ordre_des_tables'][i].jointure==='jointure_gauche'){
                    t+='<td>' 
                    t+='ON:' 
                    t+='<input type="radio" ';
                    t+=' onclick="javascript:'+this.#nom_de_la_variable+'.selectionner_champs_destination(&quot;champs_jointure_gauche&quot;,'+i+',0)" ';
                    t+='name="champs_selectionnes" ';
                    t+='id="champs_selectionnes_0_'+i+'" ';
                    
                    var chacked='';
                    if(  this.#obj_webs.nom_zone_cible==='champs_jointure_gauche' 
                      && this.#obj_webs.indice_table_pour_jointure_gauche===i 
                      && this.#obj_webs.gauche_0_droite_1 === 0
                    ){
                     chacked=' checked="true" ';
                    }
                    t+='value="champs_sortie" '+chacked+'/>' ;

                    if(    this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche 
                        && this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche.hasOwnProperty('champ_table_mere') // champ_table_fille
                        && this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche.champ_table_mere !==null
                    ){
                        t+='( T'+this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche.champ_table_mere.indice_table+ ' , ' + this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche.champ_table_mere.nom_du_champ+')';
                    }



                    t+=' &nbsp; = &nbsp; ' 

                    var chacked='';
                    if(  this.#obj_webs.nom_zone_cible==='champs_jointure_gauche' 
                      && this.#obj_webs.indice_table_pour_jointure_gauche===i 
                      && this.#obj_webs.gauche_0_droite_1 === 1
                    ){
                     chacked=' checked="true" ';
                    }

                    t+='<input type="radio" ';
                    t+=' onclick="javascript:'+this.#nom_de_la_variable+'.selectionner_champs_destination(&quot;champs_jointure_gauche&quot;,'+i+',1)" ';
                    t+='name="champs_selectionnes" ';
                    t+='id="champs_selectionnes_1_'+i+'" ';
                    t+='value="champs_sortie"  '+chacked+'/>' ;
                    
                    if(    this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche 
                        && this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche.hasOwnProperty('champ_table_fille') 
                        && this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche.champ_table_fille !==null
                    ){
                        t+='( T'+this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche.champ_table_fille.indice_table+ ' , ' + this.#obj_webs.ordre_des_tables[i].champs_jointure_gauche.champ_table_fille.nom_du_champ+')';
                    }

                    
                    
                    t+='</td>' 
                }
                t+='</tr>' 
            }
            t+='</table>' 
        }
        
        
        t+='<div>' ;
        t+='champs sortie' ;

        if(this.#obj_webs.type_de_requete!=='insert'){
            t+='<input type="radio" ';
            t+=' onclick="javascript:'+this.#nom_de_la_variable+'.selectionner_champs_destination(';
            t+='&quot;champs_sortie&quot;';
            t+=')" ';
            t+='name="champs_selectionnes" ';
            t+='id="champs_selectionnes_1" ';
            t+='value="champs_sortie" '+(this.#obj_webs.nom_zone_cible==='champs_sortie'?' checked="true" ':'')+'/>' ;
        }else{
            t+='<input type="radio" onclick="javascript:'+this.#nom_de_la_variable+'.selectionner_champs_destination(&quot;champs_sortie&quot;)" name="champs_selectionnes" id="champs_selectionnes_1" value="champs_sortie" checked="true" />' ;
        }
        t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.ajouter_une_formule(&quot;champs_sortie&quot;)">+f()</a>';
        t+='</div>' ;
        t+='<table>' ;
        t+='<tr>' ;
        t+='<td>' ;
        for(var i=0;i<this.#obj_webs.champs_sortie.length;i++){
         if(this.#obj_webs.champs_sortie[i].type_d_element==='champ'){
             if(this.#obj_webs.type_de_requete==='update'){
                 t+='<a href="javascript:'+this.#nom_de_la_variable+'.retirer_ce_champ_de_sortie('+i+')">affecte(champ(`'+this.#obj_webs.champs_sortie[i].nom_du_champ+'` , :n_'+this.#obj_webs.champs_sortie[i].nom_du_champ+')</a>';
             }else{
                 t+='<a href="javascript:'+this.#nom_de_la_variable+'.retirer_ce_champ_de_sortie('+i+')">T'+this.#obj_webs.champs_sortie[i].indice_table+'.'+this.#obj_webs.champs_sortie[i].nom_du_champ+'</a>';
             }
         }else if(this.#obj_webs.champs_sortie[i].type_d_element==='formule'){
             t+='<a href="javascript:'+this.#nom_de_la_variable+'.retirer_ce_champ_de_sortie('+i+')">'+this.#obj_webs.champs_sortie[i].formule.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')+'</a>';
         }
        }     
        t+='</td>' ;
        t+='</tr>' ;
        t+='</table>' ;
        if(this.#obj_webs.type_de_requete!=='insert'){
            t+='<div>' ;
            t+='champs WHERE' ;
            t+='</div>' ;
            t+='<ul>' ;
            if(this.#obj_webs.conditions){
                for(var i=0;i<this.#obj_webs.conditions.length;i++){
                    t+='<li id="liste_des_conditions">' ;
                    if(this.#obj_webs.conditions[i].type_d_element==='champ'){
                        t+='<a href="javascript:'+this.#nom_de_la_variable+'.retirer_ce_champ_de_where('+i+')">'+this.#obj_webs.conditions[i].nom_du_champ+'</a>';
                    }else if(this.#obj_webs.conditions[i].type_d_element==='formule'){
                        t+='<a style="max-width: 90%;display: inline;" href="javascript:'+this.#nom_de_la_variable+'.retirer_ce_champ_de_where('+i+')">'+this.#obj_webs.conditions[i].formule.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')+'</a>';
                        t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.modifier_la_formule_de_destination('+i+',&quot;conditions&quot;)">✎</a>';
                    }
                    t+='</li>' ;
                }
                t+='</ul>' ;
                if(this.#obj_webs.conditions.length===0){
                    t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.ajouter_une_formule(&quot;conditions&quot;)">+f()</a>';
                }
            }else{
                t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.ajouter_une_formule(&quot;conditions&quot;)">+f()</a>';
            }
            t+='<div>' ;
            t+='complements' ;
            t+='</div>' ;
            if(this.#obj_webs.complements){
                if(this.#obj_webs.complements.length>0){
                    t+='<ul>' ;
                    for(var i=0;i<this.#obj_webs.complements.length;i++){
                        t+='<li id="liste_des_complements">' ;
                        if(this.#obj_webs.complements[i].type_d_element==='champ'){
                            t+='<a href="javascript:'+this.#nom_de_la_variable+'.retirer_ce_champ_de_complements('+i+')">'+this.#obj_webs.complements[i].nom_du_champ+'</a>';
                        }else if(this.#obj_webs.complements[i].type_d_element==='formule'){
                            t+='<a href="javascript:'+this.#nom_de_la_variable+'.retirer_ce_champ_de_complements('+i+')">'+this.#obj_webs.complements[i].formule.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')+'</a>';
                            t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.modifier_la_formule_de_destination('+i+',&quot;complements&quot;)">✎</a>';
                        }
                        t+='</li>' ;
                    }
                    t+='</ul>' ;
                }else{
                   t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.ajouter_une_formule(&quot;complements&quot;)">+f()</a>';
                }
            }else{
            }


        }
        t+='<div>' ;
        t+='<h3>rev</h3>' ;
        var rev_texte='';
        var valeurs='';
        var provenance='';
        var conditions='';
        var complements='';
        var numero_champ=0;
        
        if(this.#obj_webs['champs_sortie'].length>0){
            for(var i=0;i<this.#obj_webs['champs_sortie'].length;i++){
                var elem=this.#obj_webs['champs_sortie'][i];
                if(valeurs!==''){
                    valeurs+=',';
                }
                if(elem.type_d_element==='champ'){
                     if( this.#obj_webs.type_de_requete==='update' ){
                      
                         valeurs+=CRLF+'      '+'affecte( champ( `'+elem.nom_du_champ+'`) , :n_'+elem.nom_du_champ+')';
                         numero_champ++;
                     }else if( this.#obj_webs.type_de_requete==='insert' ){
                      
                         valeurs+=CRLF+'      '+'affecte( champ( `'+elem.nom_du_champ+'`) , :'+elem.nom_du_champ+')';
                         numero_champ++;
                     }else{
                         valeurs+=CRLF+'      '+'champ(`T'+elem.indice_table+'` , `'+elem.nom_du_champ+'` '+(elem.alias_du_champ && elem.alias_du_champ!==''?' , alias_champ(`'+elem.alias_du_champ+'`)':'')+' )';
                     }
                }else if(elem.type_d_element==='formule'){
                     valeurs+=CRLF+'      '+elem.formule;
                }
            }
        }
        
        
        if(this.#obj_webs['ordre_des_tables'].length>0){
            for(var i=0;i<this.#obj_webs['ordre_des_tables'].length;i++){
                var elem=this.#obj_webs['ordre_des_tables'][i];
                if(provenance!==''){
                    provenance+=',';
                }
                provenance+=CRLF+'      '+elem.jointure+'(';
                provenance+=CRLF+'         '+'source(';
                provenance+='nom_de_la_table(';
                if( this.#obj_webs.type_de_requete==='update' || this.#obj_webs.type_de_requete==='insert' || this.#obj_webs.type_de_requete==='delete' ){
                    provenance+=elem.nom_de_la_table+',base(b'+elem.id_bdd+')';
                }else{
                    provenance+=elem.nom_de_la_table+',alias(T'+elem.indice_table+'),base(b'+elem.id_bdd+')';
                }
                provenance+=')';
                provenance+=')';
                if(elem.jointure==='jointure_gauche'){
                 provenance+=',';
                 provenance+=CRLF+'         contrainte(';
                 provenance+=CRLF+'            egal(';
                 provenance+='  champ(';
                 if(elem.champs_jointure_gauche.hasOwnProperty('champ_table_mere') && elem.champs_jointure_gauche.champ_table_mere!==null){
                     provenance+='   T'+elem.champs_jointure_gauche.champ_table_mere.indice_table+ ' , ' + elem.champs_jointure_gauche.champ_table_mere.nom_du_champ;
                 }
                 provenance+='  ),';
                 provenance+='  champ(';
                 if(elem.champs_jointure_gauche.hasOwnProperty('champ_table_fille') && elem.champs_jointure_gauche.champ_table_fille!==null){
                     provenance+='   T'+elem.champs_jointure_gauche.champ_table_fille.indice_table+ ' , ' + elem.champs_jointure_gauche.champ_table_fille.nom_du_champ;
                 }
                 provenance+='  )';
                 provenance+=' )';
                 provenance+=CRLF+'         )';
                }
                provenance+=CRLF+')';

            }
        }
        
        
        if(this.#obj_webs['conditions'] && this.#obj_webs['conditions'].length>0){
            for(var i=0;i<this.#obj_webs['conditions'].length;i++){
                var elem=this.#obj_webs['conditions'][i];
                if(conditions!==''){
                    conditions+=',';
                }
                if(elem.type_d_element==='champ'){
                     conditions+=CRLF+'      '+'champ(T'+elem.indice_table+'.'+elem.nom_du_champ+')';
                }else if(elem.type_d_element==='formule'){
                     conditions+=CRLF+'      '+elem.formule;
                }
            }
            conditions='conditions('+conditions+')'
        }
        
        
        if(this.#obj_webs['complements'] && this.#obj_webs['complements'].length>0){
            for(var i=0;i<this.#obj_webs['complements'].length;i++){
                var elem=this.#obj_webs['complements'][i];
                if(complements!==''){
                    complements+=',';
                }
                if(elem.type_d_element==='champ'){
                     complements+=CRLF+'   '+'champ(T'+elem.indice_table+'.'+elem.nom_du_champ+')';
                }else if(elem.type_d_element==='formule'){
                     complements+=CRLF+'   '+elem.formule;
                }
            }
        }
        
        
        if(this.#obj_webs.type_de_requete==='select' || this.#obj_webs.type_de_requete==='select_liste'){
            rev_texte+='sélectionner(';
        }else if(this.#obj_webs.type_de_requete==='insert'){
            rev_texte+='insérer(';
        }else if(this.#obj_webs.type_de_requete==='update'){
            rev_texte+='modifier(';
        }else if(this.#obj_webs.type_de_requete==='delete'){
            rev_texte+='supprimer(';
        }
        if(this.#obj_webs.type_de_requete!=='delete'){
            rev_texte+=CRLF+'   '+'valeurs('+valeurs+CRLF+'   )';
        }

        if(provenance!==''){
            rev_texte+=CRLF+'   '+'provenance('+provenance;
            rev_texte+=CRLF+'   )';
        }
        if(conditions!==''){
            rev_texte+=CRLF+'   '+conditions;
        }
        if(this.#obj_webs.type_de_requete==='select' || this.#obj_webs.type_de_requete==='select_liste'){
           if(complements!==''){
               rev_texte+=CRLF+'   ,complements('+complements+')';
           }
        }
        
        rev_texte+=CRLF+')';
        

        var tableau1 = iterateCharacters2(rev_texte);
        var matriceFonction = functionToArray2(tableau1.out,true,false,'');
        if(matriceFonction.status === true){
            var obj2 = arrayToFunct1(matriceFonction.value,true,false);
            if(obj2.status === true){
                rev_texte=obj2.value;
            }
        }
        
        t+='<div>';
        t+='<a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar1&quot;);" title="formatter le source rev">(😊)</a>';
        t+='<a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar1&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>';
        t+='<a href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">👊</a>';
        t+='<a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">🖐</a>';
        t+='</div>';
        t+='<textarea class="txtar1" id="txtar1" rows="20" autocorrect="off" autocapitalize="off" spellcheck="false">'+rev_texte.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</textarea>' ;
        t+='</div>' ;
        t+='<div>' ;
        t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.transform_rev_vers_sql(&quot;txtar1&quot; , &quot;txtar2&quot;);" title="convertir rev en SQL">R2S</a>'
        t+='<a class="yysucces" href="javascript:'+this.#nom_de_la_variable+'.bouton_ajouter_le_rev_en_base()" title="enregistrer_en_base">ajouter en base</a>';
        if(globale_id_requete && globale_id_requete>0){
            t+='<a class="yyinfo" href="javascript:'+this.#nom_de_la_variable+'.bouton_modifier_le_rev_en_base('+globale_id_requete+')" title="modifier_en_base">modifier en base('+globale_id_requete+')</a>';
            document.getElementById('init').value=globale_rev_requete.replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }
        t+='<a href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">👊</a>';
        t+='<a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">🖐</a>';
        t+='</div>' ;
        console.log(' this.#obj_webs=' , this.#obj_webs );

        
   //     console.log('this.#obj_webs[\'bases\']=' , this.#obj_webs['bases'] );
        
        
        
        this.#div_de_travail.innerHTML=t;
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function bouton_ajouter_le_rev_en_base
    */
    bouton_modifier_le_rev_en_base(id_requete){
        async function modifier_la_requete_en_base(url="",ajax_param){
            var response= await fetch(url,{
                /* 6 secondes de timeout */
                'signal':AbortSignal.timeout(1000),
                // *GET, POST, PUT, DELETE, etc. 
                method:"POST",
                // no-cors, *cors, same-origin 
                mode:"cors",
                // default, no-cache, reload, force-cache, only-if-cached 
                cache:"no-cache",
                // include, *same-origin, omit 
                credentials:"same-origin",
                // "Content-Type": "application/json"   'Content-Type': 'application/x-www-form-urlencoded'  
                'headers':{'Content-Type':'application/x-www-form-urlencoded'},
                redirect:"follow",
                
                  //no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                
                referrerPolicy:"no-referrer",
                'body':('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param)))
            });
            return(response.json());
        }
        
        var tableau1 = iterateCharacters2(document.getElementById('txtar1').value);
        var obj1=functionToArray2(tableau1.out,false,true,'');
        if(obj1.status===true){
            var obj2=tabToSql1(obj1.value,0 , 0 , false );
            if(obj2.status===true){
                var ajax_param={
                     'call':{
                          'lib':'core','file':'bdd','funct':'modifier_la_requete_en_base'
                      },
                      'rev':document.getElementById('txtar1').value , 
                      'sql':document.getElementById('txtar2').value , 
                      'php':document.getElementById('txtar3').value , 
                      'type':this.#obj_webs.type_de_requete,
                      id_requete : id_requete,
                      tableau_rev_requete : obj1.value,
                };

                modifier_la_requete_en_base('za_ajax.php?modifier_la_requete_en_base',ajax_param).then((donnees) => {
                    console.log('donnees=' , donnees );
                    if(donnees.status === 'OK'){
                     console.log('OK');
                    }
                });
            }else{
            }
        }else{
        }
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function bouton_ajouter_le_rev_en_base
    */
    bouton_ajouter_le_rev_en_base(){
     
        async function enregistrer_la_requete_en_base(url="",ajax_param){
            var response= await fetch(url,{
                // 6 secondes de timeout 
                'signal':AbortSignal.timeout(1000),
                // *GET, POST, PUT, DELETE, etc. 
                method:"POST",
                // no-cors, *cors, same-origin 
                mode:"cors",
                // default, no-cache, reload, force-cache, only-if-cached 
                cache:"no-cache",
                // include, *same-origin, omit 
                credentials:"same-origin",
                // "Content-Type": "application/json"   'Content-Type': 'application/x-www-form-urlencoded'  
                'headers':{'Content-Type':'application/x-www-form-urlencoded'},
                redirect:"follow",
                
                  //no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                
                referrerPolicy:"no-referrer",
                'body':('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param)))
            });
            return(response.json());
        }
        
        var tableau1 = iterateCharacters2(document.getElementById('txtar1').value);
        var obj1=functionToArray2(tableau1.out,false,true,'');
        if(obj1.status===true){
            var obj2=tabToSql1(obj1.value,0 , 0 , false );
            if(obj2.status===true){
                var ajax_param={
                 'call':{'lib':'core','file':'bdd','funct':'enregistrer_la_requete_en_base'},
                 'rev':document.getElementById('txtar1').value , 
                 'sql':document.getElementById('txtar2').value , 
                 'php'  :document.getElementById('txtar3').value , 
                 'type'                : this.#obj_webs.type_de_requete,
                 'tableau_rev_requete' : obj1.value,
                };
                enregistrer_la_requete_en_base('za_ajax.php?enregistrer_la_requete_en_base',ajax_param).then((donnees) => {
                    console.log('donnees=' , donnees );
                    if(donnees.status === 'OK'){
                     var recharger_page='zz_requetes_a1.php?__action=__modification&__id='+donnees.nouvel_id;
                     window.location=recharger_page;
                     return;
                    }
                });
            }else{
            }
        }else{
        }
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function traiter_chaine_sql_pour_php
    */
    #traiter_chaine_sql_pour_php( chaine ){
        var i=0;
        var nouvelle_chaine='';
        var c='';
        var l01=chaine.length;
        for(i=0;i<l01;i++){
            c=chaine.substr(i,1);
            if(c==='\''){
                if(i>0 && chaine.substr(i-1,1)==='.'){
                    nouvelle_chaine+=c;
                }else if(i<l01-1 && chaine.substr(i+1,1)==='.'){
                    nouvelle_chaine+=c;
                }else if(i>0 && chaine.substr(i-1,1)==='['){
                    nouvelle_chaine+=c;
                }else if(i<l01-1 && chaine.substr(i+1,1)===']'){
                    nouvelle_chaine+=c;
                }else{
                    nouvelle_chaine+='\\\'';
                }
            }else{
                nouvelle_chaine+=c;
            }
        }
        return(nouvelle_chaine);
        
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function transform_rev_vers_sql
    */
    #transformer_requete_en_fonction_php( type_de_requete , obj3  ){
        var t='';
        var i=0;
        var c='';
        var id_requete_en_base=0;
        var nouvelle_chaine='';
        if(globale_id_requete && globale_id_requete>0){
         id_requete_en_base=globale_id_requete;
        }
        t+='function sql_'+id_requete_en_base+'($par){'+CRLF;
        if(obj3.id_base_principale===0){
         /*
          si c'est une requete de type "SELECT 1;", on prend la première référence de base disponible
         */
         for(var n in this.#obj_webs.bases){
          obj3.id_base_principale=n;
          break;
         }
        }else{
            if(obj3.id_base_principale.substr(0,1)==='b'){
             obj3.id_base_principale=obj3.id_base_principale.substr(1);
            }
        }

        if(type_de_requete==='delete' ){
            nouvelle_chaine=this.#traiter_chaine_sql_pour_php(obj3.value);
            t+='    $texte_sql_'+id_requete_en_base+'=\''+CRLF;
            t+='      '+nouvelle_chaine.replace(/\r/g,'').replace(/\n/g,CRLF+'      ')+CRLF;
            t+='    \';'+CRLF;
            t+='    if(false === $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->exec($texte_sql_'+globale_id_requete+')){'+CRLF;         
            t+='        return(array( ';         
            t+='\'statut\' => false, ';         
            t+='\'code_erreur\' => $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastErrorCode() ,';
            t+='\'message\' => \'erreur sql_'+id_requete_en_base+'()\'.\' \'.$GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastErrorMsg()));'+CRLF;
            t+='    }else{'+CRLF;         
            t+='        return(array( \'statut\' => true, \'changements\' => $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->changes()));'+CRLF;
            t+='    }'+CRLF;         
        }else if(type_de_requete==='insert' ){
            nouvelle_chaine=this.#traiter_chaine_sql_pour_php(obj3.debut_sql_pour_insert);
            t+='    $texte_sql_'+id_requete_en_base+'=\''+CRLF;
            t+='      '+nouvelle_chaine.replace(/\r/g,'').replace(/\n/g,CRLF+'      ')+CRLF;
            t+='    \';'+CRLF;
            t+='    $liste_des_valeurs=\'\';'+CRLF;
            t+='    for($i=0;($i < count($par));$i++){'+CRLF;
            t+='        if($liste_des_valeurs != \'\'){'+CRLF;
            t+='            $liste_des_valeurs.=\',\';'+CRLF;
            t+='        }'+CRLF;
            t+='        $liste_des_valeurs.=\'(\';'+CRLF;
            for(i=0;i<obj3.tableau_des_valeurs_pour_insert.length;i++){
                t+='        $liste_des_valeurs.=CRLF.\'      '+obj3.tableau_des_valeurs_pour_insert[i]+'';
                if(i<obj3.tableau_des_valeurs_pour_insert.length-1){
                 t+=',\';';
                }else{
                 t+='\';';
                }
                t+=CRLF;
            }
            
            t+='        $liste_des_valeurs.=\')\';'+CRLF;
            t+='    }'+CRLF;
            t+='    $texte_sql_'+id_requete_en_base+'.=$liste_des_valeurs;'+CRLF;
            t+='    if(false === $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->exec($texte_sql_'+id_requete_en_base+')){'+CRLF;
            t+='        return(array('+CRLF;
            t+='            \'statut\'      => false, '+CRLF;
            t+='            \'code_erreur\' => $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastErrorCode(), '+CRLF;
            t+='            \'message\' => \'erreur sql_'+id_requete_en_base+'()\'.\' \'.$GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastErrorMsg()'+CRLF;
            t+='        ));'+CRLF;
            t+='    }else{'+CRLF;
            t+='        return(array( '+CRLF;
            t+='            \'statut\'      => true,'+CRLF;
            t+='            \'changements\' => $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->changes(),'+CRLF;
            t+='            \'nouvel_id\'   => $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastInsertRowID(),'+CRLF;
            t+='        ));'+CRLF;
            t+='    }'+CRLF;
            
            
         
        }else if(type_de_requete==='select'){
            nouvelle_chaine=this.#traiter_chaine_sql_pour_php(obj3.value);
            t+='    $texte_sql_'+id_requete_en_base+'=\''+CRLF;
            t+='      '+nouvelle_chaine.replace(/\r/g,'').replace(/\n/g,CRLF+'      ')+CRLF;
            t+='    \';'+CRLF;
            t+='    $stmt=$GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->prepare($texte_sql_'+globale_id_requete+');'+CRLF;
            t+='    /* echo __FILE__ . \' \' . __LINE__ . \' $texte_sql_'+id_requete_en_base+' = <pre>\' . $texte_sql_'+id_requete_en_base+' . \'</pre>\' ; exit(0); */'+CRLF;
            t+='    if($stmt !== false){'+CRLF;
            t+='        $result=$stmt->execute();'+CRLF;
            t+='        $donnees=array();'+CRLF;
            t+='        $arr=$result->fetchArray(SQLITE3_NUM);'+CRLF;
            t+='        while($arr !== false){'+CRLF;
            t+='            $donnees[]=array('+CRLF;
            for(var i=0;i<obj3.tableau_des_champs_pour_select_php.length;i++){
                t+='                \''+obj3.tableau_des_champs_pour_select_php[i].alias+'.'+obj3.tableau_des_champs_pour_select_php[i].nom_du_champ+'\' => $arr['+i+'],'+CRLF;
            }
            t+='            );'+CRLF;
            t+='            $arr=$result->fetchArray(SQLITE3_NUM);'+CRLF;
            t+='        }'+CRLF;
            
            
            
            t+='        $stmt->close();'+CRLF;
            t+='        return(array( \'statut\' => true, \'valeur\' => $donnees));'+CRLF;
            t+='    }else{'+CRLF;
            t+='        return(array( \'statut\' => false, \'message\' => \'erreur sql_'+id_requete_en_base+'()\'.\' \'.$GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastErrorMsg()));'+CRLF;
            t+='    }'+CRLF;
        }else if(type_de_requete==='update' ){
            nouvelle_chaine=this.#traiter_chaine_sql_pour_php(obj3.value);
            t+='    $texte_sql_'+id_requete_en_base+'=\''+CRLF;
            t+='      '+nouvelle_chaine.replace(/\r/g,'').replace(/\n/g,CRLF+'      ')+CRLF;
            t+='    \';'+CRLF;
            t+='    if(false === $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->exec($texte_sql_'+globale_id_requete+')){'+CRLF;         
            t+='        return(array( ';         
            t+='\'statut\' => false, ';         
            t+='\'code_erreur\' => $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastErrorCode() ,';         
            t+='\'message\' => \'erreur sql_'+id_requete_en_base+'()\'.\' \'.$GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastErrorMsg()));'+CRLF;
            t+='    }else{'+CRLF;         
            t+='        return(array( \'statut\' => true, \'changements\' => $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->changes()));'+CRLF;
            t+='    }'+CRLF;         
        }else if(type_de_requete==='select_liste'){
            console.log(this.#obj_webs);
            var champs0='';
            for( var i=0;i<obj3.tableau_des_champs_pour_select_php.length;i++){
                if(champs0!==''){
                 champs0+=' , ';
                }
                if(i%5===0){
                 champs0+=CRLF+'      ';
                }
                champs0+='`'+obj3.tableau_des_champs_pour_select_php[i].alias+'`.`'+obj3.tableau_des_champs_pour_select_php[i].nom_du_champ+'`';
                if( obj3.tableau_des_champs_pour_select_php[i].hasOwnProperty('alias_champ') && obj3.tableau_des_champs_pour_select_php[i].alias_champ!==''){
                    champs0+=' as `'+obj3.tableau_des_champs_pour_select_php[i].alias_champ+'`'
                }
            }
            t+='    $champs0=\''+champs0+CRLF+'    \';'+CRLF;
            
            
            t+='    $sql0=\'SELECT \'.$champs0;'+CRLF;
            t+='    $from0=\''+CRLF;

            t+=obj3.liste_des_tables_pour_select_php;
//             FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_requetes `T0`
            t+='    \';'+CRLF;
            t+='    $sql0.=$from0;'+CRLF;
            var tableau_des_conditions=[];
            if(this.#obj_webs.conditions.length===0){
                t+='    /* ATTENTION : pas de condition dans cette liste */'+CRLF;
                t+='    $where0=\' WHERE 1 \';'+CRLF;
            }else{
                /* 
                  les conditions dans un select list sont soit une seule conditions, soit une liste contenue dans un et[] 
                  Il n'y a alors qu'une seule formule
                */
                t+='    $where0=\' WHERE 1=1 \'.CRLF;'+CRLF;
                var formule=this.#obj_webs.conditions[0].formule;
                var tableau1 = iterateCharacters2(formule);
                var matriceFonction = functionToArray2(tableau1.out,true,true,'');
                var tab=matriceFonction.value
                var l01=tab.length;
                var options={
                    au_format_php                : true,
                    tableau_des_tables_utilisees : obj3.tableau_des_tables_utilisees,
                    pour_where                   : true,
                    type_de_champ_pour_where     : '',
                    nom_du_champ_pour_where      : '',
                };
                
                for(var i=1;i<l01;i++){
                    if(tab[i][7]===0){
                        if(tab[i][1]==='#' && tab[i][2]==='f'){
                         
                        }else{
                            if(tab[i][1]==='et' && tab[i][2]==='f'){
                                for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                                    if(tab[j][7]===i){
                                        if( tab[j][2]==='f' && ( tab[j][1]==='egal' ||  tab[j][1]==='diff'   ||  tab[j][1]==='comme'  ||  tab[j][1]==='sup' ||  tab[j][1]==='inf'  )){
                                           var obj=traite_sqlite_fonction_de_champ(tab,j,0,options);
                                           if(obj.status===true){
                                               var parametre=obj.value.match(/\$par\[(.*)\]/);
                                               if(parametre===null){
                                                  tableau_des_conditions.push({type_condition:'constante',valeur:obj.value,type:options.type_de_champ_pour_where,nom_du_champ_pour_where:options.nom_du_champ_pour_where})
                                               }else{
                                                  tableau_des_conditions.push({type_condition:'variable',valeur:obj.value,condition:parametre[0],operation:tab[j][1],type:options.type_de_champ_pour_where,nom_du_champ_pour_where:options.nom_du_champ_pour_where})
                                               }
                                           }else{
                                            debugger
                                           }
                                         
                                         
                                        }else if( tab[j][2]==='f' &&  tab[j][1]==='#'){
                                        }else{
                                         debugger
                                        }
                                    }
                                }
                            }else if( tab[i][2]==='f' && ( tab[i][1]==='egal' ||  tab[i][1]==='diff' || tab[i][1]==='comme' || tab[i][1]==='sup' || tab[i][1]==='inf' )){
                                var obj=traite_sqlite_fonction_de_champ(tab,i,0,options);
                                
                                if(obj.status===true){
                                    var parametre=obj.value.match(/\$par\[(.*)\]/);
                                    if(parametre===null){
                                       tableau_des_conditions.push({type_condition:'constante',valeur:obj.value,type:options.type_de_champ_pour_where,nom_du_champ_pour_where:options.nom_du_champ_pour_where})
                                    }else{
                                       tableau_des_conditions.push({type_condition:'variable',valeur:obj.value,condition:parametre[0],operation:tab[i][1],type:options.type_de_champ_pour_where,nom_du_champ_pour_where:options.nom_du_champ_pour_where})
                                    }
                                }else{
                                 debugger
                                }
                            }else{
                               debugger
                            }
                        }
                    }
                }
            }
            for( var i=0;i<tableau_des_conditions.length;i++){
             var elem=tableau_des_conditions[i];
             if(elem.type_condition==='constante'){
              t+='    $where0+=\' AND '+elem.valeur+'\'.CRLF;'+CRLF;
             }else if(elem.type_condition==='variable'){
              t+='    if(('+elem.condition+' !== \'\')){'+CRLF;
              if((elem.type.toLowerCase()==='integer' || elem.type.toLowerCase()==='int' ) && elem.operation==='egal' ){
                  t+='        $where0.=CRLF.construction_where_sql_sur_id(\''+elem.nom_du_champ_pour_where+'\','+elem.condition+');'+CRLF
              }else{
                  t+='        $where0.=\' AND '+elem.valeur+'\'.CRLF;'+CRLF;
              }
              
              t+='    }'+CRLF;
             }
            }
            
            t+='    $sql0.=$where0;'+CRLF;
            
            if(this.#obj_webs.complements.length===0){
                t+='    /* ATTENTION : pas de complements ( order by , limit dans cette liste */'+CRLF;
                t+='    $order0=\'\';'+CRLF;
                t+='    $plage0=\'\';'+CRLF;
            }else{
                if(obj3.liste_des_tris!==''){
                   t+='    $order0=\''+obj3.liste_des_tris+'\';'+CRLF;
                }else{
                   t+='    /* ATTENTION : pas de tri */'+CRLF;
                   t+='    $order0=\'\';'+CRLF;
                }
                t+='    $sql0.=$order0;'+CRLF;
                if(obj3.liste_des_limites!==''){
                   t+='    $plage0=\''+obj3.liste_des_limites+'\';'+CRLF;
                }else{
                   t+='    /* ATTENTION : pas de limites */'+CRLF;
                   t+='    $plage0=\'\';'+CRLF;
                }
                t+='    $sql0.=$plage0;'+CRLF;
                
            }
            
            t+='    $donnees0=array();'+CRLF;
            t+='    //echo __FILE__ . \' \' . __LINE__ . \' $sql0 = <pre>\' . var_export( $sql0 , true ) . \'</pre>\' ; exit(0);'+CRLF;
            t+='    $stmt0=$GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->prepare($sql0);'+CRLF;
            t+='    if(($stmt0 !== false)){'+CRLF;
            t+='        $res0=$stmt0->execute();'+CRLF;
            t+='        while(($tab0=$res0->fetchArray(SQLITE3_NUM))){'+CRLF;
            t+='            $donnees0[]=array('+CRLF;
            
            for(var i=0;i<obj3.tableau_des_champs_pour_select_php.length;i++){
                 t+='                \''+obj3.tableau_des_champs_pour_select_php[i].alias+'.'+obj3.tableau_des_champs_pour_select_php[i].nom_du_champ+'\' => $tab0['+i+'],'+CRLF;
            }

            t+='            );'+CRLF;
            t+='        }'+CRLF;
            t+='        $stmt0->close();'+CRLF;
            t+='        $__nbEnregs=count($donnees0);'+CRLF;
            t+='        if(($__nbEnregs >= $par[\'quantitee\'] || $_SESSION[APP_KEY][\'__filtres\'][$par[\'page_courante\']][\'champs\'][\'__xpage\'] > 0)){'+CRLF;
            t+='            $sql1=\'SELECT COUNT(*) \'.$from0.$where0;'+CRLF;
            t+='            $__nbEnregs=$GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->querySingle($sql1);'+CRLF;
            t+='        }'+CRLF;
            t+='        return array('+CRLF;
            t+='           \'statut\'  => true       ,'+CRLF;
            t+='           \'valeurs\' => $donnees0  ,'+CRLF;
            t+='           \'nombre\' => $__nbEnregs ,'+CRLF;
            t+='           \'sql\' => $sql0          ,'+CRLF;
            t+='        );'+CRLF;
            t+='    }else{'+CRLF;
            t+='        return array('+CRLF;
            t+='         \'statut\'  => false ,'+CRLF;
            t+='         \'message\' => $GLOBALS[BDD][BDD_'+obj3.id_base_principale+'][LIEN_BDD]->lastErrorMsg(),'+CRLF;
            t+='         \'sql\' => $sql0,'+CRLF;
            t+='        );'+CRLF;
            t+='    }'+CRLF;
            
        }
        t+='}'+CRLF;
        
        
        return({'status':true,value:t});
    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function transform_rev_vers_sql
    */
    transform_rev_vers_sql(txtarea_source,txtarea_dest){
        raz_messages('zone_global_messages');
        masquerLesMessage('zone_global_messages');
//        transform_rev_de_textarea_en_sql(txtarea_source , txtarea_dest);
        
        var tableau1 = iterateCharacters2(document.getElementById(txtarea_source).value);
        var obj1=functionToArray2(tableau1.out,false,true,'');
        if(obj1.status===true){
            var obj2=tabToSql1(obj1.value,0 , 0 , false);
            if(obj2.status===true){
                obj2.value=obj2.value.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'');
                dogid(txtarea_dest).value=obj2.value;
                var obj3=tabToSql1(obj1.value,0 , 0 , true);
                if(obj3.status===true){
                 
                    for(var i=0;i<obj3.tableau_des_tables_utilisees.length;i++){
                        for(var base in this.#obj_webs.bases){
                            if(base===obj3.tableau_des_tables_utilisees[i].base){
                                for(var table in this.#obj_webs.bases[base].tables){
                                    if(table === obj3.tableau_des_tables_utilisees[i].table){
                                        obj3.tableau_des_tables_utilisees[i].champs=this.#obj_webs.bases[base].tables[table].champs;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                 

                    var obj4=this.#transformer_requete_en_fonction_php( this.#obj_webs.type_de_requete , obj3  );
                    if(obj4.status===true){
                        document.getElementById('txtar3').value=obj4.value;
                    }
                }
            }
        }
        displayMessages('zone_global_messages');

    }
    /* 
      ================================================================================================================
      ================================================================================================================
      function nouvelle
    */
    nouvelle( fonction_appelee_apres_chargement){
   
        this.#obj_init={
            type_de_requete                   : 'select',
            bases                             : {},
            ordre_des_tables                  : [],
            nom_zone_cible                    : 'champs_sortie',
            indice_table_pour_jointure_gauche : 0 ,
            gauche_0_droite_1                 : 0 ,
            champs_sortie                     : [],
            conditions                        : [],
            complements                       : [],
            tableau_des_bases_tables_champs   : {},
        };
        async function recuperer_les_bases(url="",donnees){
            var response= await fetch(url,{
                // 6 secondes de timeout 
                'signal':AbortSignal.timeout(1000),
                // *GET, POST, PUT, DELETE, etc. 
                method:"POST",
                // no-cors, *cors, same-origin 
                mode:"cors",
                // default, no-cache, reload, force-cache, only-if-cached 
                cache:"no-cache",
                // include, *same-origin, omit 
                credentials:"same-origin",
                // "Content-Type": "application/json"   'Content-Type': 'application/x-www-form-urlencoded'  
                'headers':{'Content-Type':'application/x-www-form-urlencoded'},
                redirect:"follow",
                
                  //no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                
                referrerPolicy:"no-referrer",
                'body':('ajax_param=' + encodeURIComponent(JSON.stringify(donnees)))
            });
            return(response.json());
        }
        var ajax_param={'call':{'lib':'core','file':'bdd','funct':'recuperer_les_bases'}};
        recuperer_les_bases('za_ajax.php?recuperer_les_bases',ajax_param).then((donnees) => {
            if(donnees.status === 'OK'){
//                console.log('OK' , donnees);
                this.#obj_init['bases']={};
                for(var i in donnees.valeurs){
                    var obj2 = rev_texte_vers_matrice(donnees.valeurs[i]['T0.chp_rev_travail_basedd']);
                    if(obj2.status === true){
                        this.#obj_init['bases'][donnees.valeurs[i]['T0.chi_id_basedd']]={
                           'chi_id_basedd'          : donnees.valeurs[i]['T0.chi_id_basedd']          ,
                           'chp_nom_basedd'         : donnees.valeurs[i]['T0.chp_nom_basedd']         ,
                           'chp_rev_travail_basedd' : donnees.valeurs[i]['T0.chp_rev_travail_basedd'] ,
                           'matrice'                : obj2.value                                      ,
                           'tables'                 : {}                                              ,
                           'selectionne'            : false                                           ,
                        }
                    }
                }
                for(var ind in this.#obj_init['bases']){
                    var tab=this.#obj_init['bases'][ind]['matrice'];
                    var l01=tab.length;
                    for( var i=1;i<l01;i++){
                        if(tab[i][1]==='create_table'){
                            var nom_de_la_table='';
                            var la_classe_de_la_table='';
                            for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                                if(tab[j][7]===i){
                                    if("nom_de_la_table"===tab[j][1] && tab[j][2] ==='f'){
                                        nom_de_la_table=tab[j+1][1];
                                        this.#obj_init['bases'][ind]['tables'][nom_de_la_table]={active:false,champs:[]};
                                        break;
                                    }
                                }
                            }
                            for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                                if(tab[j][7]===i){
                                    if("fields"===tab[j][1] && tab[j][2] ==='f'){
                                        
                                        for(var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
                                            if(tab[k][7]===j && tab[k][1]==='field' && tab[k][2]==='f' ){
                                                var le_champ={nom_du_champ:'',type:'',actif:false};
                                                for(var l=k+1;l<l01 && tab[l][3]>tab[k][3];l++){
                                                    if(tab[l][7]===k && tab[l][1]==='nom_du_champ' && tab[l][2]==='f' ){
                                                        le_champ.nom_du_champ=tab[l+1][1];
                                                    }
                                                    if(tab[l][7]===k && tab[l][1]==='type' && tab[l][2]==='f' ){
                                                        le_champ.type=tab[l+1][1];
                                                    }
                                                }
                                                this.#obj_init['bases'][ind]['tables'][nom_de_la_table]['champs'].push(le_champ);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if(fonction_appelee_apres_chargement!==null){
                    fonction_appelee_apres_chargement(this.#obj_init,this);
                    this.transform_rev_vers_sql('txtar1','txtar2');
                }else{
                  this.#obj_webs=JSON.parse(JSON.stringify(this.#obj_init));
                  this.#mettre_en_stokage_local_et_afficher();
                  document.location='zz_requetes_a1.php';
                }
                
            }else{
                console.log('KO donnees=',donnees);
            }
        });
    }
}
export {requete_sql};