
/*
===========================================
fonction qui transforme un texte en tableau
===========================================
*/
function iterateCharacters(str){
    var out= Array();
    var te= new TextEncoder();
    var i=0;
    var bytes=0;
    var length=0;
    var numLigne=0;
    var position=0;
    var position2=0;
    var arr= Array(...str);
    var tableauBytes= Array();
    var longueurBytes=0;
    var l01=arr.length;
    var codeCaractere='';
    var retour={};
    for(i=0;i < l01;i=i+1){
        codeCaractere=arr[i].charCodeAt(0);
        if((codeCaractere != 8203)){
            tableauBytes=te.encode(arr[i]);
            longueurBytes=tableauBytes.length;
            out.push(
                Array(arr[i],bytes,position,position2,numLigne)
            );
            if((arr[i] == '\n')){
                numLigne=numLigne+1;
            }
            position=position+bytes;
            position2=position2+1;
            if((bytes == 4)){
                position2=position2+1;
            }
            position=position+bytes;
        }
    }
    retour={'out':out,'position':position,'position2':position2,'numLigne':numLigne};
    return retour;
}
/*
==================================================
tableau retourné par l'analyse syntaxique 
du texte en entrée de la fonction functionToArray2
==================================================
*/
var global_enteteTableau= Array(
    Array('id','id'),
    Array('val','value'),
    Array('typ','type'),
    Array('niv','niveau'),
    Array('coQ','constante quotée'),
    Array('pre','position du premier caractère'),
    Array('der','position du dernier caractère'),
    Array('pId','Id du parent'),
    Array('nbE','nombre d\'enfants'),
    Array('nuE','numéro enfants'),
    Array('pro','profondeur'),
    Array('pop','position ouverture parenthese'),
    Array('pfp','position fermeture parenthese'),
    Array('com','commentaire')
);
/*
===================================================
===================================================
===================================================
===================================================
fonction d'analyse syntaxique d'un programme source
===================================================
===================================================
===================================================
===================================================
*/
function functionToArray2(tableauEntree,exitOnLevelError){
    /*
    =========================
    les chaines de caractères
    =========================
    */
    var texte='';
    var commentaire='';
    var c='';
    var c1='';
    var c2='';
    /*
    =========================
    les entiers
    =========================
    */
    var i=0;
    var j=0;
    var k=0;
    var l=0;
    var indice=0;
    var niveau=0;
    var premier=0;
    var dernier=0;
    var numeroLigne=0;
    var posOuvPar=0;
    var posFerPar=0;
    var niveauDebutCommentaire=0;
    var niveauDansCommentaire=0;
    /*
    =========================
    les booléens
    =========================
    */
    var dansCst=false;
    var dsComment=false;
    var constanteQuotee=false;
    /*
    ====================================
    Le tableau en sortie si tout va bien
    ====================================
    */
    var T= new Array();
    var temp={};
    /*
    =======================================================================
    initialisation du tableau contenant le source structuré en arborescence
    =======================================================================
    0id    1val  2typ  3niv  4coQ
    5pre   6der  7pId  8nbE  9numEnfant  
    10pro 11OPa 12FPa 13comm
    */
    T.push(
        Array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,'')
    );
    var l01=tableauEntree.length;
    /*
    // ====================================================================
    // ====================================================================
    // boucle principale sur tous les caractères du texte passé en argument
    // on commence par analyser les cas ou on est dans des chaines, puis on
    // analyse les caractères
    // ====================================================================
    // ====================================================================
    */
    for(i=0;i < l01;i=i+1){
        c=tableauEntree[i][0];
        if((dsComment)){
            /*
            
            
            
            =============================
            Si on est dans un commentaire
            =============================
            */
            if((c == ')')){
                if(((niveau == niveauDebutCommentaire+1)&&niveauDansCommentaire == 0)){
                    posFerPar=i;
                    T[T.length-1][13]=commentaire;
                    T[T.length-1][12]=posFerPar;
                    commentaire='';
                    dsComment=false;
                    niveau=niveau-1;
                }else{
                    commentaire=concat(commentaire,c);
                    niveauDansCommentaire=niveauDansCommentaire-1;
                }
            }else if((c == '(')){
                commentaire=concat(commentaire,c);
                niveauDansCommentaire=niveauDansCommentaire+1;
            }else{
                commentaire=concat(commentaire,c);
            }
            /*
            =============================
            FIN de Si on est dans un commentaire
            =============================
            
            
            
            */
        }else if((dansCst == true)){
            /*
            
            
            
            ============================
            Si on est dans une constante
            ============================
            */
            if((c == '\'')){
                if((i == l01-1)){
                    temp={'status':false,'id':i,'value':T,'message':'-1 la racine ne peut pas contenir des constantes'};
                    return(logerreur(temp));
                }
                c1=tableauEntree[i+1][0];
                if((c1 == ',')||c1 == '\t'||c1 == '\n'||c1 == '\r'||c1 == '/'||c1 == ' '||c1 == ')'){
                    dernier=i-1;
                }else{
                    temp={'status':false,'value':T,'id':i,'message':'apres une constante, il doit y avoir un caractère d\'echappement'};
                    return(logerreur(temp));
                }
                dansCst=false;
                indice=indice+1;
                constanteQuotee=true;
                if((niveau == 0)){
                    temp={'status':false,'id':i,'value':T,'message':'-1 la racine ne peut pas contenir des constantes'};
                    return(logerreur(temp));
                }
                T.push(
                    Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,'')
                );
                texte='';
                constanteQuotee=false;
            }else if((c == '\\')){
                if((i == l01-1)){
                    temp={'status':false,'value':T,'id':i,'message':'un antislash ne doit pas terminer une fonction'};
                    return(logerreur(temp));
                }
                /**/
                c1=tableauEntree[i+1][0];
                if((c1 == '\\')||c1 == '\''){
                    if((texte == '')){
                        premier=i;
                    }
                    texte=concat(texte,c1);
                    i=i+1;
                }else{
                    if((c1 == 'n')||c1 == 't'||c1 == 'r'){
                        if((texte == '')){
                            premier=i;
                        }
                        texte=concat(texte,'\\',c1);
                        i=i+1;
                    }else{
                        temp={'status':false,'value':T,'id':i,'message':'un antislash doit être suivi par un autre antislash ou un apostrophe'};
                        return(logerreur(temp));
                    }
                }
            }else{
                if((texte == '')){
                    premier=i;
                }
                texte=concat(texte,c);
            }
            /*
            ===================================
            Fin de Si on est dans une constante
            ===================================
            
            
            
            */
        }else{
            /*
            
            
            
            ==================================================
            on n'est pas dans un commentaire ou une constante,  
            donc c'est un nouveau type qu'il faut détecter
            ==================================================
            */
            if((c == '(')){
                /*
                ====================
                Parenthèse ouvrante
                ====================
                
                
                */
                posOuvPar=i;
                indice=indice+1;
                if((texte == DEBUTCOMMENTAIRE)){
                    dsComment=true;
                    niveauDebutCommentaire=niveau;
                }
                T.push(
                    Array(indice,texte,'f',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,'')
                );
                niveau=niveau+1;
                texte='';
                dansCst=false;
                /*
                ==========================
                FIN DE Parenthèse ouvrante
                ==========================
                
                
                */
            }else if((c == ')')){
                /*
                
                
                ====================
                Parenthèse fermante
                ====================
                */
                posFerPar=i;
                if((texte != '')){
                    if((niveau == 0)){
                        temp={'status':false,'value':T,'id':i,'message':'une fermeture de parenthése ne doit pas être au niveau 0'};
                        return(logerreur(temp));
                    }
                    indice=indice+1;
                    T.push(
                        Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,'')
                    );
                    texte='';
                }
                niveau=niveau-1;
                /*
                
                maj de la position de fermeture de la parenthèse
                
                */
                for(j=indice;j >= 0;j=j-1){
                    if((T[j][3] == niveau)&&T[j][2] == 'f'){
                        T[j][12]=posFerPar;
                        break;
                    }
                }
                posFerPar=0;
                dansCst=false;
                /*
                ==========================
                FIN de Parenthèse fermante
                ==========================
                
                
                */
            }else if((c == '\\')){
                /*
                
                
                ===========
                anti slash 
                ===========
                */
                if(!(dansCst)){
                    temp={'status':false,'value':T,'id':i,'message':'un antislash doit être dans une constante'};
                    return(logerreur(temp));
                }
                /*
                ===================
                Fin d'un anti slash
                ===================
                
                
                */
            }else if((c == '\'')){
                /*
                
                
                //===========
                // apostrophe
                //===========
                */
                premier=i;
                if((dansCst == true)){
                    dansCst=false;
                }else{
                    dansCst=true;
                }
                /*
                //===============
                // FIN apostrophe
                //===============
                
                
                */
            }else if((c == ',')){
                /*
                
                
                //========================
                // virgule donc séparateur
                //========================
                */
                if((texte != '')){
                    indice=indice+1;
                    if((niveau == 0)){
                        temp={'status':false,'value':T,'id':i,'message':'la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                    T.push(
                        Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,'')
                    );
                }else{
                    if((T[indice][2] == 'f')){
                        /*ne rien faire*/
                    }else{
                        if((T[indice][3] >= niveau)){
                            /*ne rien faire*/
                        }else{
                            temp={'status':false,'value':T,'id':i,'message':'une virgule ne doit pas être précédée d\'un vide'};
                            return(logerreur(temp));
                        }
                    }
                }
                texte='';
                dansCst=false;
                /*
                //============================
                // FIN virgule donc séparateur
                //============================
                
                
                */
            }else if((c == ' ')||c == '\t'||c == '\r'||c == '\n'){
                /*
                
                
                =============================
                caractères séparateurs de mot
                =============================
                */
                if((texte != '')){
                    indice=indice+1;
                    if((niveau == 0)){
                        temp={'status':false,'value':T,'id':i,'message':'la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                    T.push(
                        Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,'')
                    );
                    texte='';
                    dansCst=false;
                }
                /*
                ====================================
                FIN de caractères séparateurs de mot
                ====================================
                
                
                */
            }else{
                if((texte == '')){
                    premier=i;
                }
                dernier=i;
                texte=concat(texte,c);
            }
        }
    }
    /*
    ========================================
    on est en dehors de la boucle principale
    ========================================
    */
    if((niveau != 0)&&exitOnLevelError){
        temp={'status':false,'value':T,'message':'des parenthèses ne correspondent pas'};
        return(logerreur(temp));
    }
    /**/
    if((texte != '')){
        indice=indice+1;
        if((niveau == 0)){
            temp={'status':false,'value':T,'message':'la racine ne peut pas contenir des constantes'};
            return(logerreur(temp));
        }
        /**/
        T.push(
            Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,'')
        );
    }
    /*
    
    ==============================================================
    // mise à jour de l'id du parent[7] et du nombre d'éléments[8]
    ============================================================== 
    */
    l01=T.length;
    for(i=l01-1;i > 0;i=i-1){
        niveau=T[i][3];
        for(j=i;j >= 0;j=j-1){
            if((T[j][3] == niveau-1)){
                T[i][7]=j;
                T[j][8]=T[j][8]+1;
                break;
            }
        }
    }
    /*
    
    ============================== 
    numérotation des enfants
    numenfant = k
    ==============================
    */
    k=0;
    for(i=0;i < l01;i=i+1){
        k=0;
        for(j=i+1;j < l01;j=j+1){
            if((T[j][7] == T[i][0])){
                k=k+1;
                T[j][9]=k;
            }
        }
    }
    /*
    =======================================
    profondeur des fonctions
    k=remonterAuNiveau
    l=idParent
    =======================================
    */
    for(i=l01-1;i > 0;i=i-1){
        if((T[i][2] == 'c')){
            T[i][10]=0;
        }
        if((T[i][7] > 0)){
            k=T[i][3];
            l=T[i][7];
            for(j=1;j <= k;j=j+1){
                if((T[l][10] < j)){
                    T[l][10]=j;
                }
                l=T[l][7];
            }
        }
    }
    temp={'status':true,'value':T};
    return temp;
}