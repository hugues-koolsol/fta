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
    #obj_webs={};
    #div_de_travail=null;
    constructor(nom_de_la_variable , nom_de_la_div_de_travail){
        this.#nom_de_la_variable=nom_de_la_variable;
        this.#div_de_travail=document.getElementById(nom_de_la_div_de_travail)
//        console.log(this.#nom_de_la_variable);
    }
    get nom_de_la_variable(){
        return this.#nom_de_la_variable
    }
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
                }else{
                    this.#obj_webs['bases'][i].selectionne=true;
                }
                break;
            }
        }
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
     for(var ind in this.#obj_webs['bases']){
         var la_class='';
         if(this.#obj_webs['bases'][ind].selectionne===true){
             la_class='yyinfo'
         }
         t+='<a class="'+la_class+'" href="javascript:'+this.#nom_de_la_variable+'.selectionner_ou_deselectionner_cette_base('+this.#obj_webs['bases'][ind]['chi_id_basedd']+')">'+this.#obj_webs['bases'][ind]['chp_nom_basedd']+'</a>';
         if(la_class!==''){
             t+='<table>' 
             t+='<tr>' 
             t+='<td>' 
             t+=this.#obj_webs['bases'][ind]['chp_nom_basedd']; 
             t+='</td>' 
             t+='<td>' 
             var tab=this.#obj_webs['bases'][ind]['matrice'];
             var l01=tab.length;
             for( var i=1;i<l01;i++){
              if(tab[i][1]==='create_table'){
               for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                if(tab[j][7]===i){
                 if("nom_de_la_table"===tab[j][1] && tab[j][2] ==='f'){
                  t+='<a href="">'+tab[j+1][1] +'</a>';
                 }
                }
                
               }
//               debugger
              }
             }
             t+='</td>' 
             t+='</tr>' 
             t+='</table>' 
         }
     }
     this.#div_de_travail.innerHTML=t;
     
     
     
     
    }
    /* 
      ================================================================================================================
      function nouvelle
    */
    nouvelle(){
        console.log('nouvelle() ' , this.#nom_de_la_variable);     
        this.#obj_webs={};
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
                           'selectionne'            : false                                           ,
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