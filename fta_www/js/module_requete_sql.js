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
    #nom_webs=APP_KEY+'_web_sess_storage';
    /*
      structure principale de ce programme
    */
    #obj_webs={
     type_de_requete:'select',
     bases:[],
     ordre_des_tables:[],
     nom_zone_cible:'',
     champs_sortie:[],
     champs_where:[],
    };
    #div_de_travail=null;
    /*
      ================================================================================================================
    */
    constructor(nom_de_la_variable , nom_de_la_div_de_travail){
        this.#nom_de_la_variable=nom_de_la_variable;
        this.#div_de_travail=document.getElementById(nom_de_la_div_de_travail)
//        console.log(this.#nom_de_la_variable);
    }
    /*
      ================================================================================================================
    */
    get nom_de_la_variable(){
        return this.#nom_de_la_variable
    }
    /*
      ================================================================================================================
    */
    initialisation(){
        console.log('initialisation de l\'objet ' , this.#nom_de_la_variable);     
    }
    /* 
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
                /*
                 remplir la liste des tables et champs associés
                */
                
                
                
                break;
            }
        }
        sessionStorage.setItem(this.#nom_webs, JSON.stringify(this.#obj_webs));
        this.#afficher_les_donnees();
        
    }
    /*
      ================================================================================================================
      function selectionner_ou_deselectionner_cette_table
    */
    selectionner_ou_deselectionner_cette_table(id_bdd , nom_de_la_table){
        for(var i in this.#obj_webs['bases']){
            if(id_bdd===this.#obj_webs['bases'][i]['chi_id_basedd']){
                for(var j in this.#obj_webs['bases'][i]['tables']){
                    if(j===nom_de_la_table){
                        if(this.#obj_webs['bases'][i]['tables'][nom_de_la_table].active===true){
                            this.#obj_webs['bases'][i]['tables'][nom_de_la_table].active=false;
                            for(var k=0;k<this.#obj_webs['ordre_des_tables'].length;k++){
                                if(this.#obj_webs['ordre_des_tables'][k].id_bdd===id_bdd && this.#obj_webs['ordre_des_tables'][k].nom_de_la_table===nom_de_la_table){
                                    this.#obj_webs['ordre_des_tables'].splice(k,1);
                                }
                            }
                            break;
                        }else{
                            this.#obj_webs['ordre_des_tables'].push({id_bdd:id_bdd , nom_de_la_table:nom_de_la_table });
                            this.#obj_webs['bases'][i]['tables'][nom_de_la_table].active=true;
                            break;
                        }
                    }
                 
                }
            }
        }
        sessionStorage.setItem(this.#nom_webs, JSON.stringify(this.#obj_webs));
        this.#afficher_les_donnees();
    }
    /* 
      ================================================================================================================
      function maj_type_de_requete
    */
    maj_type_de_requete(){
        this.#obj_webs.type_de_requete=document.getElementById('type_de_requete').value;
        sessionStorage.setItem(this.#nom_webs, JSON.stringify(this.#obj_webs));
        this.#afficher_les_donnees();
    }
    /*
      ================================================================================================================
      function selectionner_ce_champ
    */
    selectionner_ce_champ(nom_du_champ , nom_de_la_table,id_bdd){
        var nom_zone_cible='champs_sortie';
        if(this.#obj_webs.type_de_requete!=='insert'){
            var lst=document.getElementsByName('champs_selectionnes');
            for(var i=0;i<lst.length;i++){
                if(lst[i].checked===true){
                    nom_zone_cible=lst[i].value;
                    break
                }
            }

         
        }else{
         nom_zone_cible='champs_sortie';
        }
        if(nom_zone_cible==='champs_sortie'){
         this.#obj_webs.champs_sortie.push({
          id_bdd:id_bdd,
          nom_de_la_table:nom_de_la_table,
          nom_du_champ:nom_du_champ,
         })
        }
        sessionStorage.setItem(this.#nom_webs, JSON.stringify(this.#obj_webs));
        this.#afficher_les_donnees();
    }
    /*
      ================================================================================================================
      function retirer_ce_champ_de_sortie
    */
    retirer_ce_champ_de_sortie(ind){
     this.#obj_webs.champs_sortie.splice(ind,1);
     sessionStorage.setItem(this.#nom_webs, JSON.stringify(this.#obj_webs));
     this.#afficher_les_donnees();
    }
    
    /* 
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
     t+='<option value="select" '+( this.#obj_webs.type_de_requete==='select'?' selected="true"':'')+'>select</option>';
     t+='<option value="update" '+( this.#obj_webs.type_de_requete==='update'?' selected="true"':'')+'>update</option>';
     t+='<option value="insert" '+( this.#obj_webs.type_de_requete==='insert'?' selected="true"':'')+'>insert</option>';
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
         t+='<a class="'+la_class_de_la_base+'" href="javascript:'+this.#nom_de_la_variable+'.selectionner_ou_deselectionner_cette_base('+this.#obj_webs['bases'][ind]['chi_id_basedd']+')">'+this.#obj_webs['bases'][ind]['chp_nom_basedd']+'</a>';
         t+='</td>';
         if(la_class_de_la_base!==''){
             t+='<td>';
             for( var nom_de_la_table in this.#obj_webs['bases'][ind]['tables']){
                 la_classe_de_la_table='';
                 if(this.#obj_webs['bases'][ind]['tables'][nom_de_la_table].active===true){
                     la_classe_de_la_table='yyinfo';
                 }
                 t+='<a class="'+la_classe_de_la_table+'" href="javascript:'+this.#nom_de_la_variable+'.selectionner_ou_deselectionner_cette_table('+ind+',&quot;'+nom_de_la_table+'&quot;)">'+nom_de_la_table+'</a>';
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
//         t+='<a class="'+la_class+'" href="javascript:'+this.#nom_de_la_variable+'.selectionner_ou_deselectionner_cette_base('+this.#obj_webs['bases'][ind]['chi_id_basedd']+')">'+this.#obj_webs['bases'][ind]['chp_nom_basedd']+'</a>';
     }
     
     t+='<hr />' 
     if(this.#obj_webs['ordre_des_tables'].length>0){
         t+='<table>' 
         for(var i=0;i<this.#obj_webs['ordre_des_tables'].length;i++){
             var elem=this.#obj_webs['ordre_des_tables'][i];
             t+='<tr>' 
             t+='<td>' 
             t+=elem.id_bdd + ' ' + elem.nom_de_la_table;
             t+='</td>' 
             t+='<td>' 
             for( var id_du_champ in this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs']){
                 t+='<a href="javascript:'+this.#nom_de_la_variable+'.selectionner_ce_champ(&quot;';
                 t+=this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ;
                 t+='&quot;,&quot;'+nom_de_la_table+'&quot;,'+elem.id_bdd+')">';
                 t+=this.#obj_webs['bases'][elem.id_bdd]['tables'][elem.nom_de_la_table]['champs'][id_du_champ].nom_du_champ;
                 t+='</a>';
             }
             t+='</td>' 
             t+='</tr>' 
         }
         t+='</table>' 
     }
     
     
     t+='<div>' ;
     t+='champs sortie' ;
     if(this.#obj_webs.type_de_requete!=='insert'){
         t+='<input type="radio" name="champs_selectionnes" id="champs_selectionnes_1" value="champs_sortie" checked="true" />' ;
     }
     t+='</div>' ;
     t+='<table>' ;
     t+='<tr>' ;
     t+='<td>' ;
     for(var i=0;i<this.#obj_webs.champs_sortie.length;i++){
      t+='<a href="javascript:'+this.#nom_de_la_variable+'.retirer_ce_champ_de_sortie('+i+')">'+this.#obj_webs.champs_sortie[i].nom_du_champ+'</a>';
     }
     t+='</td>' ;
     t+='</tr>' ;
     t+='</table>' ;
     if(this.#obj_webs.type_de_requete!=='insert'){
         t+='<div>' ;
         t+='champs WHERE' ;
         t+='<input type="radio"  name="champs_selectionnes" id="champs_selectionnes_2" value="champs_where" />' ;
         t+='</div>' ;
         t+='<table>' ;
         t+='<tr>' ;
         t+='<td>' ;
         t+='</td>' ;
         t+='</tr>' ;
         t+='</table>' ;
     }
     
     
     
//     console.log('this.#obj_webs[\'bases\']=' , this.#obj_webs['bases'] );
     this.#div_de_travail.innerHTML=t;
     
     
     
     
    }
    /* 
      ================================================================================================================
      function nouvelle
    */
    nouvelle(){
        console.log('nouvelle() ' , this.#nom_de_la_variable);     
        this.#obj_webs={
            type_de_requete  : 'select',
            bases            : [],
            ordre_des_tables : [],
            nom_zone_cible   : '',
            champs_sortie    : [],
            champs_where     : [],
        };
        sessionStorage.setItem(this.#nom_webs, JSON.stringify(this.#obj_webs));
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
                console.log('OK' , donnees);
                this.#obj_webs['bases']=[];
                for(var i in donnees.valeurs){
                    var obj2 = rev_texte_vers_matrice(donnees.valeurs[i]['T0.chp_rev_travail_basedd']);
                    if(obj2.status === true){
                        
                     
                        this.#obj_webs['bases'][donnees.valeurs[i]['T0.chi_id_basedd']]={
                           'chi_id_basedd'          : donnees.valeurs[i]['T0.chi_id_basedd']          ,
                           'chp_nom_basedd'         : donnees.valeurs[i]['T0.chp_nom_basedd']         ,
                           'chp_rev_travail_basedd' : donnees.valeurs[i]['T0.chp_rev_travail_basedd'] ,
                           'matrice'                : obj2.value                                      ,
                           'tables'                 : []                                              ,
                           'selectionne'            : false                                           ,
                        }
                    }
                    
                    
                }
                for(var ind in this.#obj_webs['bases']){
                    var tab=this.#obj_webs['bases'][ind]['matrice'];
                    var l01=tab.length;
                    for( var i=1;i<l01;i++){
                        if(tab[i][1]==='create_table'){
                            var nom_de_la_table='';
                            var la_classe_de_la_table='';
                            for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                                if(tab[j][7]===i){
                                    if("nom_de_la_table"===tab[j][1] && tab[j][2] ==='f'){
                                        nom_de_la_table=tab[j+1][1];
                                        this.#obj_webs['bases'][ind]['tables'][nom_de_la_table]={active:false,champs:[]};
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
                                                this.#obj_webs['bases'][ind]['tables'][nom_de_la_table]['champs'].push(le_champ);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                console.log('this.#obj_webs[bases]',this.#obj_webs['bases']);
                sessionStorage.setItem(this.#nom_webs, JSON.stringify(this.#obj_webs));
                this.#afficher_les_donnees();
                
            }else{
                console.log('KO donnees=',donnees);
            }
        });
        
        
        
    }
    

}
export {requete_sql};