"use strict";
/*
  =====================================================================================================================
  conversion d'un AST produit par https://github.com/nikic/PHP-Parser en rev
  =====================================================================================================================
  todo
  $c=$a<=>$b; // echo "a" <=> "b"; // -1 , ,,,, echo "a" <=> "a"; // 0 ,,,,, echo "b" <=> "a"; // 1
  $output = `ls -al`; // Utiliser les guillemets obliques revient à utiliser la fonction shell_exec().
  =====================================================================================================================
  point d'entrée : TransformAstPhpEnRev  
  fonction principale php_traite_Stmt_Expression
  =====================================================================================================================
*/
var tableau_de_html_dans_php_a_convertir=[];
/*
  =====================================================================================================================
*/
function transforme_html_de_php_en_rev(texteHtml,niveau){
    var t='';
    var esp0=' '.repeat(NBESPACESREV * niveau);
    var esp1=' '.repeat(NBESPACESREV);
    var supprimer_le_tag_html_et_head=true;
    var doctype='';
    var elementsJson={};
    var i=0;
    try{
        var position_doctype=texteHtml.toUpperCase().indexOf('<!DOCTYPE');
        if(position_doctype >= 0){
            if(position_doctype === 0){
                for( i=1 ; i < texteHtml.length && doctype == '' ; i++ ){
                    if(texteHtml.substr(i,1) === '>'){
                        doctype=texteHtml.substr(0,i + 1);
                        texteHtml=texteHtml.substr(i + 1);
                    }
                }
            }
        }
        elementsJson=__module_html1.mapDOM(texteHtml,false);
        if(elementsJson.__xst === true){
            if(elementsJson.parfait === true){
                supprimer_le_tag_html_et_head=false;
            }else{
                /*
                */
                var supprimer_le_tag_html_et_head=true;
                if(texteHtml.indexOf('<html') >= 0){
                    supprimer_le_tag_html_et_head=false;
                }
            }
            try{
                var tableau_de_javascripts_a_convertir=[];
                var obj=__module_html1.traiteAstDeHtml(elementsJson.__xva,0,supprimer_le_tag_html_et_head,'',tableau_de_javascripts_a_convertir);
                if(obj.__xst === true){
                    if(obj.__xva.trim().indexOf('html(') == 0){
                        if(doctype.toUpperCase() === '<!DOCTYPE HTML>'){
                            obj.__xva=obj.__xva.replace(/html\(/,'html((doctype)');
                        }else{
                            obj.__xva=obj.__xva.replace(/html\(/,'html(#((doctype)?? doctype pas html , normal="<!DOCTYPE html>" ?? )');
                        }
                    }
                    if(tableau_de_javascripts_a_convertir.length > 0){
                        for( var i=0 ; i < tableau_de_javascripts_a_convertir.length ; i++ ){
                            globale_tableau_des_js2.push(tableau_de_javascripts_a_convertir[i]);
                        }
                    }
                    return({"__xst" : true ,"__xva" : obj.__xva});
                }else{
                    debugger;
                }
            }catch(e){
                debugger;
            }
        }else{
            debugger;
        }
    }catch(e){}
    return({"__xst" : false ,"__xms" : 'le html dans php n\'est pas convertible'});
}
/*
  =====================================================================================================================
*/
function traiter_html_dans_php2(options){
    if(globale_tableau_des_php2.length === 0){
        if(globale_tableau_des_js2.length === 0){
            console.log('terminé');
        }else{
            console.log('todo');
        }
    }
    var zone_rev=null;
    if(options && options.hasOwnProperty('zone_rev')){
        zone_rev=options.zone_rev;
    }
    var zone_php=null;
    if(options && options.hasOwnProperty('zone_php')){
        zone_php=options.zone_php;
    }
    var en_ligne=null;
    if(options && options.hasOwnProperty('en_ligne') && options.en_ligne === true){
        en_ligne=true;
    }
    var a_convertir=globale_tableau_des_php2[0];
    for( var i=0 ; i < globale_tableau_des_php2.length ; i++ ){
        var obj=transforme_html_de_php_en_rev(globale_tableau_des_php2[i].valeur,0,options);
        if(obj.__xst === true){
            var chaine_a_remplacer='#(cle_html_dans_php_a_remplacer,' + globale_tableau_des_php2[i].cle + ')';
            globale_source_php2=globale_source_php2.replace(chaine_a_remplacer,obj.__xva);
        }else{
            return(logerreur({"__xst" : false ,"__xme" : '3052 erreur dans la convertion de html dans php'}));
        }
    }
    if(zone_rev){
        document.getElementById(zone_rev).value=globale_source_php2;
    }
    function fin_traitement_php(zone_rev,globale_source_php2){
        globale_tableau_des_js2=[];
        if(zone_rev){
            var tableau1=iterateCharacters2(globale_source_php2);
            var matriceFonction=functionToArray2(tableau1.out,true,false,'');
            if(matriceFonction.__xst === true){
                var obj2=arrayToFunct1(matriceFonction.__xva,true);
                if(obj2.__xst === true){
                    document.getElementById(zone_rev).value=obj2.__xva;
                    globale_source_php2='';
                    return(logerreur({"__xst" : true}));
                }else{
                    document.getElementById(zone_rev).value=globale_source_php2;
                    globale_source_php2='';
                    return(logerreur({"__xst" : true ,"__xva" : '3079 erreur de formattage de rev'}));
                }
            }else{
                document.getElementById(zone_rev).value=globale_source_php2;
                globale_source_php2='';
                return(logerreur({"__xst" : true ,"__xva" : '3083 erreur mise en matrice'}));
            }
        }
        if(en_ligne === true){
            sauvegarder_php_en_ligne2(globale_source_php2,options.donnees);
            globale_source_php2='';
            return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
        }else{
            globale_source_php2='';
            return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
        }
    }
    if(globale_tableau_des_js2.length > 0){
        var parseur_javascript=window.acorn.Parser;
        for( var i=0 ; i < globale_tableau_des_js2.length ; i++ ){
            try{
                var tableau_des_commentaires_js=[];
                var obj=parseur_javascript.parse(globale_tableau_des_js2[i].__xva,{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tableau_des_commentaires_js});
            }catch(e){
                globale_tableau_des_js2=[];
                return(logerreur({"__xst" : false ,"__xme" : '3770 il y a un problème dans un source javascript dans le php'}));
            }
            var phrase_a_remplacer='#(cle_javascript_a_remplacer,' + globale_tableau_des_js2[i].cle + ')';
            if(obj === '' || obj.hasOwnProperty('body') && Array.isArray(obj.body) && obj.body.length === 0){
                globale_source_php2=globale_source_php2.replace(phrase_a_remplacer,'');
            }else{
                if(tableau_des_commentaires_js.length > 0){
                    /*
                      il faut retirer les commentaires si ce sont des CDATA ou des <source_javascript_rev> 
                      car javascriptdanshtml les ajoute.
                    */
                    var commentaires_a_remplacer=['<![CDATA[',']]>','<source_javascript_rev>','</source_javascript_rev>'];
                    for( var nn=0 ; nn < commentaires_a_remplacer.length ; nn++ ){
                        for( var indc=tableau_des_commentaires_js.length - 1 ; indc >= 0 ; indc-- ){
                            if(tableau_des_commentaires_js[indc].value.trim() === commentaires_a_remplacer[nn]){
                                tableau_des_commentaires_js.splice(indc,1);
                            }
                        }
                    }
                    for( var indc=tableau_des_commentaires_js.length - 1 ; indc >= 0 ; indc-- ){
                        if(tableau_des_commentaires_js[indc].value.trim() === '' && tableau_des_commentaires_js[indc].type === 'Line'){
                            tableau_des_commentaires_js.splice(indc,1);
                        }
                    }
                }
                /* on transforme le ast du js en rev */
                var obj0=__m_astjs_vers_rev1.traite_ast(obj.body,tableau_des_commentaires_js,{});
                if(obj0.__xst === true){
                    /*on retire source()*/
                    globale_source_php2=globale_source_php2.replace(phrase_a_remplacer,obj0.__xva);
                }else{
                    globale_tableau_des_js2=[];
                    return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
                }
            }
        }
        return(fin_traitement_php(zone_rev,globale_source_php2));
    }else{
        return(fin_traitement_php(zone_rev,globale_source_php2));
    }
}
/*
  =====================================================================================================================
*/
var globale_tableau_des_php2=[];
var globale_source_php2='';
var globale_tableau_des_js2=[];
/*
  =====================================================================================================================
*/
function traitement_apres_recuperation_ast_de_php2(retour_avec_ast){
    var ast=JSON.parse(retour_avec_ast.__xva);
    var options={"nettoyer_html" : false};
    if(retour_avec_ast.hasOwnProperty('__entree') && retour_avec_ast.__entree.hasOwnProperty('opt')){
        options=retour_avec_ast.__entree.opt;
        if(retour_avec_ast.__entree.opt.hasOwnProperty('options_traitement')){
            if(retour_avec_ast.__entree.opt.options_traitement.hasOwnProperty('nettoyer_html')){
                options.nettoyer_html=retour_avec_ast.__entree.opt.options_traitement.nettoyer_html;
            }
        }else if(retour_avec_ast.__entree.opt.hasOwnProperty('nettoyer_html')){
            options.nettoyer_html=retour_avec_ast.__entree.opt.nettoyer_html;
        }else if(retour_avec_ast.__entree.opt.hasOwnProperty('zone_rev')){
            options.nettoyer_html=retour_avec_ast.__entree.opt.zone_rev;
        }else if(retour_avec_ast.__entree.opt.hasOwnProperty('zone_php')){
            options.nettoyer_html=retour_avec_ast.__entree.opt.zone_php;
        }
    }
    var obj=TransformAstPhpEnRev(ast,0,null,false,true,options);
    var zone_rev=null;
    var zone_php=null;
    if(options.hasOwnProperty('zone_rev')){
        zone_rev=options.zone_rev;
    }
    if(options.hasOwnProperty('zone_php')){
        zone_php=options.zone_php;
    }
    var en_ligne=null;
    if(options.hasOwnProperty('en_ligne') && options.en_ligne === true){
        en_ligne=true;
    }
    if(obj.__xst === true){
        if(obj.__xva.substr(0,4) !== 'php('){
            obj.__xva='php(' + obj.__xva + ')';
        }
        if(obj.hasOwnProperty('tableau_de_html_dans_php_a_convertir') && obj.tableau_de_html_dans_php_a_convertir.length > 0){
            /*
              il y a du html dans ce php, on le traite et on le remplace 
            */
            try{
                if(zone_rev !== null){
                    document.getElementById(zone_rev).value=obj.__xva;
                }
                globale_tableau_des_php2=obj.tableau_de_html_dans_php_a_convertir;
                globale_source_php2=obj.__xva;
                var obj=traiter_html_dans_php2(options);
                if(obj.status === true){
                    if(zone_rev !== null){
                        __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_rev);
                    }
                    return({"__xst" : true});
                }else{
                    if(zone_php !== null){
                        __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_php);
                    }
                }
            }catch(e){
                console.error('e=',e);
            }
        }else{
            if(en_ligne === true){
                sauvegarder_php_en_ligne2(obj.__xva,options.donnees);
                __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_rev);
            }else{
                __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_rev);
                var tableau1=iterateCharacters2(obj.__xva);
                var matriceFonction=functionToArray2(tableau1.out,true,false,'');
                if(matriceFonction.__xst === true){
                    var obj2=arrayToFunct1(matriceFonction.__xva,true);
                    if(obj2.__xst === true){
                        if(zone_rev !== null){
                            document.getElementById(zone_rev).value=obj2.__xva;
                            logerreur({"__xst" : true ,"__xme" : 'le fichier rev a été produit sans erreurs'});
                            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_php);
                        }
                    }else{
                        if(zone_rev !== null){
                            document.getElementById(zone_rev).value=obj.__xva;
                        }
                    }
                }else{
                    if(zone_rev !== null){
                        document.getElementById(zone_rev).value=obj.__xva;
                    }
                }
            }
        }
        return({"__xst" : true});
    }else{
        logerreur({"__xst" : false ,"__xme" : 'il y a eu une erreur de conversion du programme php'});
        if(zone_php !== null){
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_php);
        }
        if(options.hasOwnProperty('en_ligne') && options.en_ligne === true){
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_php);
        }
        return({"__xst" : false});
    }
}
/*
  =====================================================================================================================
*/
function recupereAstDePhp2(texteSource,opt,f_traitement_apres_recuperation_ast_de_php2){
    var ajax_param={
        "call" : {"lib" : 'php' ,"file" : 'ast' ,"funct" : 'recupererAstDePhp' ,"opt" : {"masquer_les_messages_du_serveur" : false}} ,
        "texteSource" : texteSource ,
        "opt" : opt
    };
    var r=new XMLHttpRequest();
    r.onerror=function(e){
        console.error('e=',e);
        return({"__xst" : false});
    };
    try{
        r.open("POST",'za_ajax.php?recupererAstDePhp',true);
        r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        r.onreadystatechange=function(){
            if(r.readyState != 4 || r.status != 200){
                if(r.status === 404){
                    logerreur({"__xst" : false ,"__xme" : ' === <b>Vérifiez l\'url de l\'appel synchrone </b> === , conv js 3131 url non trouvée '});
                    return({"__xst" : false ,"__xme" : 'conv js 3131url non trouvée '});
                }else{
                    return;
                }
                if(r.readyState === 2){
                    debugger;
                }
            }
            try{
                var json_retour=JSON.parse(r.responseText);
                if(json_retour.__xst === true){
                    var obj=traitement_apres_recuperation_ast_de_php2(json_retour);
                    return({"__xst" : obj.__xst});
                }else{
                    for(var elem in json_retour.__xms){
                        if(json_retour.__xms[elem].indexOf('on line ') >= 0
                               && isNumeric(json_retour.__xms[elem].substr(json_retour.__xms[elem].indexOf('on line ') + 8))
                        ){
                            var line=parseInt(json_retour.__xms[elem].substr(json_retour.__xms[elem].indexOf('on line ') + 8),10);
                            astphp_logerreur({"__xst" : false ,"line" : line});
                        }
                        astphp_logerreur({"__xst" : false ,"__xme" : json_retour.__xms[elem]});
                    }
                    if(json_retour.hasOwnProperty('__entree') && json_retour.__entree.hasOwnProperty('opt')){
                        if(json_retour.__entree.opt.hasOwnProperty('zone_php') && json_retour.__entree.opt.zone_php !== null){
                            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',json_retour.__entree.opt.zone_php);
                            return({"__xst" : false});
                        }else{
                            if(json_retour.__entree.opt.hasOwnProperty('en_ligne') && json_retour.__entree.opt.en_ligne === true){
                                __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
                                return({"__xst" : false});
                            }else{
                                debugger;
                            }
                        }
                    }
                    return({"__xst" : false ,"__xme" : 'erreur json'});
                }
            }catch(e){
                console.error('e=',e);
                return({"__xst" : false ,"__xme" : ' conv js message=' + e.message});
            }
        };
        r.send('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param)));
    }catch(e){
        console.error('e=',e);
        logerreur({"__xst" : false ,"__xme" : ' conv js 3127  message=' + e.message});
        return({"__xst" : false ,"__xme" : ' conv js message=' + e.message});
    }
    return({"__xst" : true});
}