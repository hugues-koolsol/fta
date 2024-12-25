"use strict";
/*
  =====================================================================================================================
  conversion d'un ast produit par https://github.com/glayzzle/php-parser en rev
  point d'entrée = traite_ast
  =====================================================================================================================
*/
class module_conversion_ast_de_php_parser_vers_rev1{
    #nom_de_la_variable='';
    #options_traitement=null;
    /*
      =============================================================================================================
      le seul argument est pour l'instant le nom de la variable qui est déclarée
    */
    constructor(nom_de_la_variable){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    /*
      =============================================================================================================
    */
    #astphp_logerreur(o){
        logerreur(o);
        if(o.hasOwnProperty('element') && o.element.hasOwnProperty('loc') && o.element.loc.hasOwnProperty('start') ){
            if(global_messages['lines'].length<5){
                global_messages['lines'].push(o.element.loc.start.line);
            }
        }
        return o;
    }
    /*
      =============================================================================================================
    */
    #traite_call(element,niveau,parent,tab_comm){
        let t = this.#traite_commentaires_debut(element,niveau,parent,tab_comm);
        var obj=null;
        var nomFonction='';
        var les_parametres='';
        obj=this.#traite_element(element.what,niveau,element,tab_comm);
        if(obj.__xst === true){
            nomFonction+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0051  #traite_call' ,"element" : element.what}));
        }
        if(element.arguments && element.arguments.length > 0){
            obj=this.#traite_parametres(element,niveau,element,tab_comm);
            if(obj.__xst === true){
                les_parametres+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0051  #traite_call' ,"element" : element.what}));
            }
        }
        if(element.what.kind === 'propertylookup' && nomFonction.indexOf('element(')>=0 &&  nomFonction.indexOf('nomf(')>=0 ){
            t+='appelf(' + nomFonction + les_parametres + ')';
        }else{
            t+='appelf(nomf(' + nomFonction + ')' + les_parametres + ')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_include(element,niveau,parent,tab_comm){
        let t='';
        var obj=null;
        var cible='';
        var obj = this.#traite_element(element.target,niveau,element,tab_comm);
        if(obj.__xst === true){
            cible=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_include' ,"element" : element}));
        }
        if(element.once === true && element.require === true){
            t+='appelf(nomf(require_once),p(' + cible + '))';
        }else if(element.once === false && element.require === true){
            t+='appelf(nomf(require),p(' + cible + '))';
        }else if(element.once === false && element.require === false){
            t+='appelf(nomf(include),p(' + cible + '))';
        }else if(element.once === true && element.require === false){
            t+='appelf(nomf(include_once),p(' + cible + '))';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_include '+ JSON.stringify(element) ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_inline(element,niveau,parent,tab_comm){
        let t='';
        let tableau_de_html_dans_php_a_convertir=[];
        const esp0 = ' '.repeat(NBESPACESREV * niveau);
        const esp1 = ' '.repeat(NBESPACESREV);
        var contenu=element.raw;
        /*
          =====================================================================================================
          Quand un php contient du html, ou bien ce dernier est un dom valide qui ne contient pas de php
          par exemple ">? <div>que_du_html</div><?php"
          ou bien il contient du php, 
          par exemple ">? <div> <?php echo '';?> </div> <?php"
          Dans ce dernier car la chaine " <div> " n'est pas un html "parfait"
          =====================================================================================================
        */
        var estTraiteSansErreur=false;
        var obj = isHTML(contenu);
        if(obj.__xst === true){
            var nettoye = contenu.replace(/\<\!\-\-(.*)\-\-\>/g,'').trim();
        }
        /* recherche d'au moins un tag dans le texte */
        var regex=/(<[a-zA-Z0-9\-_]+)/g;
        var found = contenu.match(regex);
        if(obj.__xst === true && (contenu.indexOf('<') >= 0 && found && found.length > 0 || nettoye === '')){
            var cle = php_construit_cle(10);
            tableau_de_html_dans_php_a_convertir.push({"cle" : cle ,"valeur" : contenu});
            t+='\n' + esp0 + 'html_dans_php(#(cle_html_dans_php_a_remplacer,' + cle + '))';
            estTraiteSansErreur=true;
        }else{
            /*
              On ne capture pas l'erreur car ce qui est traité ici n'est peut être pas un html "pur"
              dans ce cas tout est remplacé par des "echo" plus bas
            */
            estTraiteSansErreur=false;
        }
        if(estTraiteSansErreur === false){
            if(this.#options_traitement
             && this.#options_traitement.hasOwnProperty('nettoyer_html')
             && this.#options_traitement.nettoyer_html === true
            ){
            }else{
                return(this.#astphp_logerreur({
                    "__xst" : false ,
                    "__xme" : '2230 ATTENTION, ce php contient du html en ligne qui n\'est pas complet<br /> passez par le menu html pour le nettoyer <br />ou bien utilisez le bouton "convertir3" du menu php' ,
                    "element" : element
                }));
            }
            logerreur({"__xst" : false ,"__xme" : "ATTENTION, ce php contient du html en ligne qui n'est pas complet et qui est converti en echo !"});
            if(contenu.indexOf('<?') >= 0){
                /*
                  il semble qu'il y a une erreur dans ce parseur contrairement à celui de nikki
                  une ligne html qui contient : <form id="boite_de_connexion" method="post"><? echo 'h';?></form>
                  est prise dans le inline or le "short open tag" est vraiement problématique
                  
                */
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0151 les "tags php courts ne sont pas admis' ,"element" : element}));
            }
            if(contenu.toLowerCase().indexOf('<script') < 0){
                t+='appelf(nomf(echo),p(\'' + (contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')) + '\'))';
            }else{
                /*
                  =====================================================================================
                  cas ou le html incomplet contenu contient des scripts, 
                  =====================================================================================
                  
                */
                var obj1 = __module_html1.mapDOM(contenu);
                if(obj1.__xst === true && obj1.parfait === true && obj1.__xva.type.toLowerCase() === 'html'){
                    /*
                      si le contenu contient du HTML en racine, on peut essayer de le nettoyer 
                    */
                    if(obj1.content && obj1.content.length >= 0){
                        var j=0;
                        for( j=0 ; j < obj1.content.length ; j++ ){
                            if(obj1.content[j].type === 'BODY' || obj1.content[j].type === 'HEAD'){
                                if(obj1.content[j].content && obj1.content[j].content.length > 0){
                                    var k=0;
                                    for( k=0 ; k < obj1.content[j].content.length ; k++ ){
                                        if(obj1.content[j].content[k].type){
                                            var lesProprietes='';
                                            if(obj1.content[j].content[k].attributes){
                                                var attr={};
                                                for(attr in obj1.content[j].content[k].attributes){
                                                    if(lesProprietes !== ''){
                                                        lesProprietes+=',';
                                                    }
                                                    lesProprietes+='(\'' + (attr.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')) + '\' , \'' + (obj1.content[j].content[k].attributes[attr].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')) + '\')';
                                                }
                                            }
                                            if(obj1.content[j].content[k].type.toLowerCase() === 'script'){
                                                if(obj1.content[j].content[k].content){
                                                    var objScr = convertit_source_javascript_en_rev(obj1.content[j].content[k].content[0]);
                                                    if(objScr.__xst === true){
                                                        if(objScr.__xva === ''){
                                                            t+='\n' + esp0 + 'html_dans_php(script(' + lesProprietes + '))';
                                                        }else{
                                                            t+='\n' + esp0 + 'html_dans_php(script(' + lesProprietes + ',source(' + objScr.__xva + ')))';
                                                        }
                                                    }else{
                                                        console.log('un script KO : ' + obj1.content[j].content[k].content[0]);
                                                        t+='appelf(nomf(echo),p(\'<script type="text/javascript">\'))';
                                                        t+='appelf(nomf(echo),p(\'' + (obj1.content[j].content[k].content[0].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')) + '\'))';
                                                    }
                                                }else{
                                                    t+='\n' + esp0 + 'html_dans_php(script(' + lesProprietes + '))';
                                                }
                                            }else{
                                                var obj = __module_html1.traiteAstDeHtml(obj1.content[j].content[k],0,true,'',tableau_de_javascripts_dans_php_a_convertir);
                                                if(obj.__xst === true){
                                                    t+='\n' + esp0 + 'html_dans_php(' + obj.__xva + ')';
                                                }else{
                                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2433 dans TransformAstPhpEnRev ' ,"element" : element}));
                                                }
                                            }
                                        }
                                    }
                                }
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2440 dans TransformAstPhpEnRev ' ,"element" : element}));
                            }
                        }
                    }
                }else{
                    /*
                      si le contenu ne contient pas du HTML en racine, on "echo" 
                    */
                    t+='appelf(nomf(echo),p(\'' + (contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')) + '\'))';
                }
            }
        }
        var globale_tableau_des_js2=[];
        if(tableau_de_html_dans_php_a_convertir.length > 0){
            obj=this.#traiter_html_dans_php2(tableau_de_html_dans_php_a_convertir,t,globale_tableau_des_js2);
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0238 #traite_inline ' ,"element" : element}));
                debugger;
            }
        }
        return({"__xst" : true ,"__xva" : t ,"tableau_de_html_dans_php_a_convertir" : tableau_de_html_dans_php_a_convertir});
    }
    /*
      =============================================================================================================
    */
    #traiter_html_dans_php2(globale_tableau_des_php2,globale_source_php2,globale_tableau_des_js2){
        var options=null;
        var zone_rev=null;
        var zone_php=null;
        var en_ligne=null;
        var a_convertir=globale_tableau_des_php2[0];
        for( var i = globale_tableau_des_php2.length - 1 ; i >= 0 ; i-- ){
            var obj = this.#transforme_html_de_php_en_rev(globale_tableau_des_php2[i].valeur,0,options,globale_tableau_des_js2);
            if(obj.__xst === true){
                var chaine_a_remplacer = '#(cle_html_dans_php_a_remplacer,' + globale_tableau_des_php2[i].cle + ')';
                globale_source_php2=globale_source_php2.replace(chaine_a_remplacer,obj.__xva);
                globale_tableau_des_php2.splice(i);
            }else{
                return(logerreur({"__xst" : false ,"__xme" : '3052 erreur dans la convertion de html dans php'}));
            }
        }
        if(zone_rev){
            document.getElementById(zone_rev).value=globale_source_php2;
        }
        /*
          =====================================================================================================
        */
        function fin_traitement_php(zone_rev,globale_source_php2,globale_tableau_des_js2){
            globale_tableau_des_js2=[];
            if(zone_rev){
                var tableau1 = iterateCharacters2(globale_source_php2);
                var matriceFonction = functionToArray2(tableau1.out,true,false,'');
                if(matriceFonction.__xst === true){
                    var obj2 = arrayToFunct1(matriceFonction.__xva,true);
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
                sauvegarder_php_en_ligne(globale_source_php2,options.donnees);
                globale_source_php2='';
                return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
            }else{
                return(logerreur({"__xst" : true ,"__xva" : globale_source_php2}));
            }
        }
        /*
          =====================================================================================================
        */
        if(globale_tableau_des_js2.length > 0){
            var parseur_javascript=window.acorn.Parser;
            for( var i=0 ; i < globale_tableau_des_js2.length ; i++ ){
                try{
                    tabComment=[];
                    var obj = parseur_javascript.parse(globale_tableau_des_js2[i].__xva,{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tabComment});
                }catch(e){
                    globale_tableau_des_js2=[];
                    return(logerreur({"__xst" : false ,"__xme" : '3770 il y a un problème dans un source javascript dans le php'}));
                }
                var phrase_a_remplacer = '#(cle_javascript_a_remplacer,' + globale_tableau_des_js2[i].cle + ')';
                if(obj === '' || obj.hasOwnProperty('body') && Array.isArray(obj.body) && obj.body.length === 0){
                    globale_source_php2=globale_source_php2.replace(phrase_a_remplacer,'');
                }else{
                    var obj0 = TransformAstEnRev(obj.body,0);
                    if(obj0.__xst === true){
                        globale_source_php2=globale_source_php2.replace(phrase_a_remplacer,obj0.__xva);
                    }else{
                        globale_tableau_des_js2=[];
                        return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
                    }
                }
            }
            return(fin_traitement_php(zone_rev,globale_source_php2,globale_tableau_des_js2));
        }else{
            return(fin_traitement_php(zone_rev,globale_source_php2,globale_tableau_des_js2));
        }
    }
    /*
      =============================================================================================================
    */
    #transforme_html_de_php_en_rev(texteHtml,niveau,options,globale_tableau_des_js2){
        var t='';
        var esp0 = ' '.repeat(NBESPACESREV * niveau);
        var esp1 = ' '.repeat(NBESPACESREV);
        var supprimer_le_tag_html_et_head=true;
        var doctype='';
        var elementsJson={};
        var i=0;
        try{
            var position_doctype = texteHtml.toUpperCase().indexOf('<!DOCTYPE');
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
                    var obj = __module_html1.traiteAstDeHtml(elementsJson.__xva,0,supprimer_le_tag_html_et_head,'',tableau_de_javascripts_a_convertir);
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
        }catch(e){
        }
        return({"__xst" : false ,"__xms" : 'le html dans php n\'est pas convertible'});
    }
    /*
      =============================================================================================================
    */
    #traite_isset(element,niveau,parent,tab_comm){
        let t='';
        let les_variables='';
        let obj=null;
        for( let i=0 ; i < element.variables.length ; i++ ){
            les_variables+=',';
            obj=this.#traite_element(element.variables[i],niveau,element,tab_comm);
            if(obj.__xst === true){
                les_variables+='p(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_isset' ,"element" : element}));
            }
        }
        t+='appelf(nomf(isset)' + les_variables + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_unset(element,niveau,parent,tab_comm){
        let t='';
        let les_variables='';
        let obj=null;
        for( let i=0 ; i < element.variables.length ; i++ ){
            les_variables+=',';
            obj=this.#traite_element(element.variables[i],niveau,element,tab_comm);
            if(obj.__xst === true){
                les_variables+='p(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_unset' ,"element" : element}));
            }
        }
        t+='appelf(nomf(unset)' + les_variables + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_echo(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let les_variables='';
        if(element.expressions){
            for( let i=0 ; i < element.expressions.length ; i++ ){
                les_variables+=',';
                obj=this.#traite_element(element.expressions[i],niveau,element,tab_comm);
                if(obj.__xst === true){
                    les_variables+='p(' + obj.__xva + ')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0472  #traite_echo' ,"element" : element}));
                }
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0476  #traite_unset' ,"element" : element}));
        }
        t+='appelf(nomf(echo)' + les_variables + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_print(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let les_variables='';
        obj=this.#traite_element(element.expression,niveau,element,tab_comm);
        if(obj.__xst === true){
            les_variables+='p(' + obj.__xva + ')';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_print' ,"element" : element}));
        }
        t+='appelf(nomf(print)' + les_variables + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_usegroup(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        for( let i=0 ; i < element.items.length ; i++ ){
            if(element.items[i].kind === 'useitem'){
                if(t !== ''){
                    t+=',';
                }
                t+='appelf( nomf(use) , p( \'' + (element.items[i].name.replace(/\\/g,'\\\\')) + '\' ))';
                /* ✍ PhpParser\\Error\ */
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0507  #traite_usegroup' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_silent(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        obj=this.#traite_element(element.expr,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            t='supprimeErreur(' + obj.__xva + ')';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0513 #traite_silent body' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_exit(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        if(element.expression === null){
            if(element.useDie === true){
                t='mourir()';
            }else{
                t='sortir()';
            }
        }else{
            obj=this.#traite_element(element.expression,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                if(element.useDie === true){
                    t='mourir(' + obj.__xva + ')';
                }else{
                    t='sortir(' + obj.__xva + ')';
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0532 #traite_exit' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_return(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        if(element.expr === null){
            t='revenir()';
        }else{
            obj=this.#traite_element(element.expr,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                t='retourner(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0532 #traite_return ' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_catch(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let what='';
        let variable='';
        let contenu='';
        if(element.what && element.what.length > 0){
            for( var i=0 ; i < element.what.length ; i++ ){
                obj=this.#traite_element(element.what[i],niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    variable+=obj.__xva + ',';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0532 #traite_catch body' ,"element" : element}));
                }
            }
        }
        if(element.variable){
            obj=this.#traite_element(element.variable,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                variable+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0532 #traite_catch body' ,"element" : element}));
            }
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0532 #traite_catch body' ,"element" : element}));
            }
        }
        t+='err(' + variable + '),faire(' + contenu + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_try(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let contenu='';
        let catches=[];
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0533 #traite_try body' ,"element" : element}));
            }
        }else if(element.kind === 'block'){
            obj=this.#traite_ast0(element,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0540 #traite_try body' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0543 #traite_try ni body ni block' ,"element" : element}));
        }
        if(element.catches && element.catches.length && element.catches.length > 0){
            for( let i=0 ; i < element.catches.length ; i++ ){
                obj=this.#traite_element(element.catches[i],niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    catches.push(obj.__xva);
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0533 #traite_try body' ,"element" : element}));
                }
            }
        }
        t+='essayer(faire(' + contenu + ')';
        for( var i=0 ; i < catches.length ; i++ ){
            t+='sierreur(';
            t+=catches[i];
            t+=')';
        }
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_new(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        var les_parametres='';

        var what='';
        obj=this.#traite_parametres(element,niveau,parent,tab_comm,'parametres');
        if(obj.__xst === true){
            les_parametres+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0526  #traite_new' ,"element" : element}));
        }
        obj=this.#traite_element(element.what,niveau,parent,tab_comm,'parametres');
        if(obj.__xst === true){
            what+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0526  #traite_new' ,"element" : element}));
        }
        if(element.parenthesizedExpression === true){
            t+='(nouveau(appelf(nomf(' + what + ')' + les_parametres + ')))';
        }else{
            t+='nouveau(appelf(nomf(' + what + ')' + les_parametres + '))';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      $s1=SQLite3::escapeString($s); -> affecte( $s1 , appelf( nomf(SQLite3::escapeString) , p($s) )),
    */
    #staticlookup(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let offset='';
        let what='';
        if(element.offset){
            obj=this.#traite_element(element.offset,niveau,element,tab_comm);
            if(obj.__xst === true){
                offset+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0690  #staticlookup' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0693  #staticlookup' ,"element" : element}));
        }
        if(element.what){
            obj=this.#traite_element(element.what,niveau,element,tab_comm);
            if(obj.__xst === true){
                what+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0700  #staticlookup' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0704  #staticlookup' ,"element" : element}));
        }
        t=what + '::' + offset;
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_propertylookup(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let what='';
        var les_arguments='';
        var offset='';
        if(element.what && element.what.kind==='variable' && element.offset && element.offset.kind==='identifier'){
          t+='$'+element.what.name+'->'+element.offset.name;
        }else{
            if(element.what){
                obj=this.#traite_element(element.what,niveau,element,tab_comm);
                if(obj.__xst === true){
                    what+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_print' ,"element" : element}));
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0556  #traite_propertylookup' ,"element" : element}));
            }
            if(element.offset){
                obj=this.#traite_element(element.offset,niveau,element,tab_comm);
                if(obj.__xst === true){
                    offset+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_print' ,"element" : element}));
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0567  #traite_propertylookup' ,"element" : element}));
            }
            /* ✍        t+=what+'->'+offset; */
            t+='element(' + what + '),nomf(' + offset + ')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_retif(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let condition='';
        let si_vrai='';
        let si_faux='';
        obj=this.#traite_element(element.test,niveau,element,tab_comm);
        if(obj.__xst === true){
            condition+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0754  #traite_retif' ,"element" : element}));
        }
        obj=this.#traite_element(element.trueExpr,niveau,element,tab_comm);
        if(obj.__xst === true){
            si_vrai+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0759  #traite_retif' ,"element" : element}));
        }
        obj=this.#traite_element(element.falseExpr,niveau,element,tab_comm);
        if(obj.__xst === true){
            si_faux+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0765  #traite_retif' ,"element" : element}));
        }
        t='testEnLigne( condition( ' + condition + ' ) , siVrai(' + si_vrai + ') , siFaux(' + si_faux + '))';
        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =============================================================================================================
    */
    #traite_global(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let items='';
        for(let i=0;i<element.items.length;i++){
            obj=this.#traite_element(element.items[i],niveau,parent,tab_comm);
            if(obj.__xst === true){
                items+=','+obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0745 #traite_pre quoi' ,"element" : element}));
            }
        }
        if(items!==''){
            items=items.substr(1);
        }
        t='globale('+items+')';

        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =============================================================================================================
    */
    #traite_break(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        if(element.level!==null){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0802 #traite_break ' ,"element" : element}));
        }
        t+='break()';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_cast(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        obj=this.#traite_element(element.expr,niveau,element,tab_comm);
        if(obj.__xst === true){
            if(element.raw === '(int)'){
                t='castint(' + obj.__xva + ')';
            }else if(element.raw === '(string)'){
                t='caststring(' + obj.__xva + ')';
            }else if(element.raw === '(float)'){
                t='castfloat(' + obj.__xva + ')';
            }else if(element.raw === '(array)'){
                t='casttableau(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0780  #traite_cast "'+element.raw+'"' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0785  #traite_cast' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      <<<EOT ... EOT -> heredoc('EOT' , `...`);
    */
    #traite_encapsed(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        if(element.label === undefined && element.type==='string'){
         
            obj=this.#traite_string(element,niveau,parent,tab_comm);

            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1226 #traite_element string type non prévu "' + (JSON.stringify(element)) + '"' ,"element" : element}));
            }
            
        }else{
            t+='heredoc(\'' + element.label + '\',`\n' + (element.raw.replace('<<<' + element.label,'').replace(element.label,'').replace(/`/g,'\\`')) + '`)';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_pre(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let quoi='';
        obj=this.#traite_element(element.what,niveau,parent,tab_comm);
        if(obj.__xst === true){
            quoi+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0745 #traite_pre quoi' ,"element" : element}));
        }
        if(element.type === '+'){
            t+='preinc(' + quoi + ')';
        }else if(element.type === '-'){
            t+='predec(' + quoi + ')';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0712 #traite_pre' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_post(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let quoi='';
        obj=this.#traite_element(element.what,niveau,parent,tab_comm);
        if(obj.__xst === true){
            quoi+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0726 #traite_post quoi' ,"element" : element}));
        }
        if(element.type === '+'){
            t+='postinc(' + quoi + ')';
        }else if(element.type === '-'){
            t+='postdec(' + quoi + ')';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0734 #traite_post' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_foreach(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let contenu='';
        let cle='';
        let source='';
        let valeur='';
        if(element.key){
            obj=this.#traite_element(element.key,niveau,parent,tab_comm);
            if(obj.__xst === true){
                cle+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0753 #traite_foreach cle' ,"element" : element}));
            }
        }else{
            cle='';
        }
        if(element.source){
            obj=this.#traite_element(element.source,niveau,parent,tab_comm);
            if(obj.__xst === true){
                source+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0767 #traite_foreach source' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0770 #traite_foreach source' ,"element" : element}));
        }
        if(element.value){
            obj=this.#traite_element(element.value,niveau,parent,tab_comm);
            if(obj.__xst === true){
                valeur+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0767 #traite_foreach source' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0770 #traite_foreach source' ,"element" : element}));
        }
        if(element.body){
            if(element.body.kind==='expressionstatement' || element.body.kind==='block' ){
                obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0903 #traite_foreach body' ,"element" : element}));
                }
            }else{
                obj=this.#traite_element(element.body,niveau,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0911  #traite_foreach' ,"element" : element}));
                }
            }
        }else if(element.kind === 'block'){
            obj=this.#traite_ast0(element,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0755 #traite_foreach body' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0758 #traite_foreach ni body ni block' ,"element" : element}));
        }
        if(cle === ''){
            t='boucleSurTableau(pourChaque( dans( ' + valeur + ' , ' + source + ' )),faire(' + contenu + '))';
        }else{
            t='boucleSurTableau(pourChaque( dans( ' + cle + ' , ' + valeur + ', ' + source + ' )),faire(' + contenu + '))';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_for(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let condition='';
        let contenu='';
        let increment='';
        let initialisation='';
        if(element.body){
            if(element.body.kind==='expressionstatement' || element.body.kind==='block' ){
                obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0748 #traite_for body' ,"element" : element}));
                }
            }else{
                obj=this.#traite_element(element.body,niveau,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0945  #traite_for' ,"element" : element}));
                }

            }
        }else if(element.kind === 'block'){
            obj=this.#traite_ast0(element,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0755 #traite_for body'}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0758 #traite_for ni body ni block' ,"element" : element}));
        }
        if(element.test){
            for( let i=0 ; i < element.test.length ; i++ ){
                obj=this.#traite_element(element.test[i],niveau,element,tab_comm);
                if(obj.__xst === true){
                    condition+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0766  #traite_for' ,"element" : element}));
                }
            }
        }else{
            debugger;
        }
        if(element.increment){
            for( let i=0 ; i < element.increment.length ; i++ ){
                obj=this.#traite_element(element.increment[i],niveau,element,tab_comm);
                if(obj.__xst === true){
                    increment+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0779  #traite_for' ,"element" : element}));
                }
            }
        }else{
            debugger;
        }
        if(element.init){
            for( let i=0 ; i < element.init.length ; i++ ){
                obj=this.#traite_element(element.init[i],niveau,element,tab_comm);
                if(obj.__xst === true){
                    initialisation+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0843  #traite_for' ,"element" : element}));
                }
            }
        }else{
            debugger;
        }
        t='boucle(initialisation(' + initialisation + '),condition(' + condition + '),increment(' + increment + '),faire(' + contenu + '))';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_while(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let condition='';
        let contenu='';
        if(element.test){
            obj=this.#traite_element(element.test,niveau,element,tab_comm);
            if(obj.__xst === true){
                condition+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0157  #traite_while' ,"element" : element}));
            }
        }else{
            debugger;
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_while body' ,"element" : element}));
            }
        }else if(element.kind === 'block'){
            obj=this.#traite_ast0(element,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_while body' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1048 #traite_while ni body ni block'}));
        }
        t='tantQue(condition( ' + condition + ' ),faire(' + contenu + '))';
        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =============================================================================================================
    */
    #traite_empty(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let express='';
        if(element.expression){
            obj=this.#traite_element(element.expression,niveau,element,tab_comm);
            if(obj.__xst === true){
                express+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0157  #traite_while' ,"element" : element}));
            }
        }else{
            debugger;
        }
        t+='appelf(nomf(empty),p('+express+'))';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_continue(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let level='';
        
        if(element.level){
            obj=this.#traite_element(element.level,niveau,element,tab_comm);
            if(obj.__xst === true){
                level+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0157  #traite_while' ,"element" : element}));
            }
        }
        t+='continue('+level+')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_list(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;        
        let les_elements='';
        
        for( let i=0 ; i < element.items.length ; i++ ){
            if(element.items[i].kind === 'entry'){
                obj=this.#traite_element(element.items[i].value,niveau,element,tab_comm);
                if(obj.__xst === true){
                    if(les_elements!==''){
                        les_elements+=',';
                    }
                    les_elements+='p('+obj.__xva+')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1067  #traite_list' ,"element" : element}));
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1070  #traite_list' ,"element" : element}));
            }
        }
        t+='liste('+les_elements+')';

        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_case(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;        
        let valeur='';
        let contenu='';
        
        if(element.test){
            /* c'est un if ou un else if */
            obj=this.#traite_element(element.test,niveau,element,tab_comm);
            if(obj.__xst === true){
                valeur+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1056  #traite_case' ,"element" : element}));
            }
        }else{
            valeur='';
        }
        
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_case body' ,"element" : element}));
            }
        }else if(element.kind === 'block'){
            obj=this.#traite_ast0(element,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_case body' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1156 #traite_case ni body ni block' ,"element" : element}));
        }
        if(valeur===''){
            t+='est(valeurNonPrevue(),faire('+contenu+'))';
        }else{
            t+='est(valeur('+valeur+'),faire('+contenu+'))';
        }

        return({"__xst" : true ,"__xva" : t});
    }
     
    /*
      =============================================================================================================
    */
    #traite_switch(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let condition='';
        let les_cas='';
        
        if(element.body && element.body.children){
            for( let i=0;i<element.body.children.length;i++){
               obj=this.#traite_element(element.body.children[i],niveau,element,tab_comm);
               if(obj.__xst === true){
                   les_cas+=','+obj.__xva;

               }else{
                   return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1056  #traite_switch' ,"element" : element}));
               }
               
                
             
            }
         
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1050  #traite_switch' ,"element" : element}));
        }
        
        if(element.test){
            /* c'est un if ou un else if */
            obj=this.#traite_element(element.test,niveau,element,tab_comm);
            if(obj.__xst === true){
                condition+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1056  #traite_switch' ,"element" : element}));
            }
        }else{
            condition='';
            /* c'est un else */
        }
        
        t+='bascule(quand('+condition+')'+les_cas+')';
        
        
        

        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_if(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let condition='';
        let c_est_un_sinon=false;
        let contenu='';
        let suite='';

        if(element.body===undefined){
            if(element.children){
                obj=this.#traite_ast0(element,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_if body' ,"element" : element}));
                }
            }else{
                if(element.expression){
                    obj=this.#traite_element(element.expression,niveau,element,tab_comm);
                    if(obj.__xst === true){
                        contenu+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1211  #traite_if' ,"element" : element}));
                    }
                }else{
                    obj=this.#traite_element(element,niveau,element,tab_comm);
                    if(obj.__xst === true){
                        contenu+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1211  #traite_if' ,"element" : element}));
                    }
                }
            }
        }else if(element.body){
            if(element.body.children){
                obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_if body' ,"element" : element}));
                }
            }else if(element.body.kind==='expressionstatement'){
             
                obj=this.#traite_element(element.body.expression,niveau,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1211  #traite_if' ,"element" : element}));
                }
            }else{
                contenu+=this.#traite_commentaires_debut(element.body,niveau,parent,tab_comm);
                obj=this.#traite_element(element.body,niveau,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1211  #traite_if' ,"element" : element}));
                }
            }
/*
        }else if(element.kind === 'block'){

            obj=this.#traite_ast0(element,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_if body' ,"element" : element}));
            }
           
        }else if(element.expr ){
         
            obj=this.#traite_element(element.expr,niveau,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1231  #traite_if' ,"element" : element}));
            }

        }else if(element.expression ){
         
            obj=this.#traite_element(element.expression,niveau,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1240  #traite_if' ,"element" : element}));
            }
         
        }else if(element.expressions ){
            for( let i=0 ; i < element.expressions.length ; i++ ){
                obj=this.#traite_element(element.expressions[i],niveau,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0472  #traite_echo' ,"element" : element}));
                }
            }
         
*/         
         
        }else{
            contenu='';
//            debugger
//            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0656 #traite_if ni body ni block' ,"element" : element}));
        }
        if(element.alternate){
            obj=this.#traite_if(element.alternate,niveau,element,tab_comm,true);
            if(obj.__xst === true){
                suite+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0148  #traite_if' ,"element" : element}));
            }
        }
        if(element.test){
            /* c'est un if ou un else if */
            obj=this.#traite_element(element.test,niveau,element,tab_comm);
            if(obj.__xst === true){
                condition+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0157  #traite_if' ,"element" : element}));
            }
        }else{
            c_est_un_sinon=true;
            /* c'est un else */
        }
        if(est_alternate !== undefined && est_alternate===true){
            /* sinon si ou sinon */
            if(c_est_un_sinon){
                t+='  sinon(';
                t+='    alors(' + contenu + ')';
                t+='  )';
            }else{
                t+='  sinonsi(';
                t+='    condition(' + condition + ')';
                t+='    alors(' + contenu + ')';
                t+='  )';
                t+=suite;
            }
        }else{
            t+='choix(';
            t+='  si(';
            t+='    condition(' + condition + ')';
            t+='    alors(' + contenu + ')';
            t+='  )';
            t+=suite;
            t+=')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #simplifie_tableau(nom_variable,parametres){
        var t='';
        var obj_nom_tableau = functionToArray(nom_variable,true,true,'');
        if(obj_nom_tableau.__xst === true){
            if(obj_nom_tableau.__xva.length === 2
             && obj_nom_tableau.__xva[1][2] === 'c'
             && obj_nom_tableau.__xva[1][4] === 0
             && obj_nom_tableau.__xva[1][1].substr(0,1) === '$'
            ){
                /*
                  cas $xxx
                */
                if(parametres.substr(0,1) === ','){
                    parametres=parametres.substr(1);
                }
                var obj_indice_tableau = functionToArray(parametres,true,true,'');
                if(obj_indice_tableau.__xst === true
                 && obj_indice_tableau.__xva.length === 3
                 && obj_indice_tableau.__xva[1][1] === 'p'
                 && obj_indice_tableau.__xva[1][2] === 'f'
                 && obj_indice_tableau.__xva[1][8] === 1
                 && obj_indice_tableau.__xva[2][2] === 'c'
                 && obj_indice_tableau.__xva[2][4] === 0
                ){
                    t=obj_nom_tableau.__xva[1][1] + '[' + obj_indice_tableau.__xva[2][1] + ']';
                }else{
                    t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                }
            }else if(obj_nom_tableau.__xva.length === 3
             && obj_nom_tableau.__xva[2][2] === 'c'
             && obj_nom_tableau.__xva[1][8] === 1
             && obj_nom_tableau.__xva[1][1] === 'nomt'
            ){
                /*
                  cas nomt($xxx)
                */
                if(parametres.substr(0,1) === ','){
                    parametres=parametres.substr(1);
                }
                var obj_indice_tableau = functionToArray(parametres,true,true,'');
                if(obj_indice_tableau.__xst === true
                 && obj_indice_tableau.__xva.length === 3
                 && obj_indice_tableau.__xva[1][1] === 'p'
                 && obj_indice_tableau.__xva[1][2] === 'f'
                 && obj_indice_tableau.__xva[1][8] === 1
                 && obj_indice_tableau.__xva[2][2] === 'c'
                 && obj_indice_tableau.__xva[2][4] === 0
                ){
                    t=obj_nom_tableau.__xva[2][1] + '[' + obj_indice_tableau.__xva[2][1] + ']';
                }else{
                    t='tableau(' + nom_variable + '' + parametres + ')';
                }
            }else{
                /* si */
                if(nom_variable.substr(0,4) === 'nomt'){
                    var ne_contient_que_des_nomt_et_p=true;
                    for( var i=1 ; i < obj_nom_tableau.__xva.length ; i++ ){
                        if(obj_nom_tableau.__xva[i][7] === 0){
                            if(obj_nom_tableau.__xva[i][2] === 'f' && (obj_nom_tableau.__xva[i][1] === 'nomt' || obj_nom_tableau.__xva[i][1] === 'p')){
                            }else{
                                ne_contient_que_des_nomt_et_p=false;
                            }
                        }
                    }
                    if(ne_contient_que_des_nomt_et_p === true){
                        t='tableau(' + nom_variable + '' + parametres + ')';
                    }else{
                        t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                    }
                }else{
                    t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                }
            }
        }else{
            t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
        }
        return t;
    }
    /*
      =============================================================================================================
    */
    #traite_deftab(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let obj1=null;
        let les_elements='';
        for( let i=0 ; i < element.items.length ; i++ ){
            les_elements+=',';
            if(element.items[i].kind === 'entry'){
                obj=this.#traite_element(element.items[i].value,niveau,element,tab_comm);
                if(obj.__xst === true){
                    if(element.items[i].key){
                        obj1=this.#traite_element(element.items[i].key,niveau,element,tab_comm);
                        if(obj1.__xst === true){
                            les_elements+='(' + obj1.__xva + ',' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0317 #traite_deftab ' ,"element" : element}));
                        }
                    }else{
                        les_elements+='(' + obj.__xva + ')';
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0312 #traite_deftab ' ,"element" : element}));
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0315 #traite_deftab ' ,"element" : element}));
            }
        }
        if(les_elements.length > 1){
            les_elements=les_elements.substr(1);
        }
        t+='defTab(' + les_elements + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_tableau(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let quoi='';
        let offset='';
        obj=this.#traite_element(element.what,niveau,parent,tab_comm);
        if(obj.__xst === true){
            quoi+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_tableau quoi' ,"element" : element}));
        }
        if(element.offset === false){
            offset='';
        }else{
            obj=this.#traite_element(element.offset,niveau,parent,tab_comm);
            if(obj.__xst === true){
                offset+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_tableau offset' ,"element" : element}));
            }
        }
        t=this.#simplifie_tableau('nomt(' + quoi + ')','p(' + offset + ')');
        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =============================================================================================================
    */
    #traite_assignref(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';
        
        if(element.left && element.right){
            obj=this.#traite_element(element.left,niveau,element,tab_comm);
            if(obj.__xst === true){
                gauche+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1444 #traite_assignref gauche' ,"element" : element}));
            }
            obj=this.#traite_element(element.right,niveau,element,tab_comm);
            if(obj.__xst === true){
                droite+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1450 #traite_assignref droite' ,"element" : element}));
            }
            t+='affecte_reference(' + gauche + ',' + droite + ')';
            if(element.operator !== undefined){
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1455 #traite_assignref opérateur non traité : "' + element.operator + '"' ,"element" : element}));
                t+='affecte_reference(' + gauche + ',' + droite + ')';
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1470 #traite_assignref il manque un gauche ou un droite : "' + element.type + '"' ,"element" : element}));
        }
        
        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =============================================================================================================
    */
    #traite_assign(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';
        if(element.left && element.right){
            obj=this.#traite_element(element.left,niveau,element,tab_comm);
            if(obj.__xst === true){
                gauche+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0341 #traite_assign gauche' ,"element" : element}));
            }
            obj=this.#traite_element(element.right,niveau,element,tab_comm);
            if(obj.__xst === true){
                droite+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0347 #traite_assign droite' ,"element" : element}));
            }
            if(element.operator === '='){
                t+='affecte(' + gauche + ',' + droite + ')';
            }else if(element.operator === '+='){
                if(droite.substr(0,5) === 'plus('){
                    t+='affecte(' + gauche + ',plus(' + gauche + ' , ' + (droite.substr(5,droite.length - 6)) + '))';
                }else{
                    t+='affecte(' + gauche + ',plus(' + gauche + ',' + droite + '))';
                }
            }else if(element.operator === '.='){
                if(droite.substr(0,7) === 'concat('){
                    t+='affecte(' + gauche + ',concat(' + gauche + ' , ' + (droite.substr(7,droite.length - 8)) + '))';
                }else{
                    t+='affecte(' + gauche + ',concat(' + gauche + ' , ' + droite + '))';
                }
            }else if(element.operator === '|='){
                if(droite.substr(0,11) === 'ou_binaire('){
                    t+='affecte(' + gauche + ',ou_binaire(' + gauche + ' , ' + (droite.substr(11,droite.length - 12)) + '))';
                }else{
                    t+='affecte(' + gauche + ',ou_binaire(' + gauche + ' , ' + droite + '))';
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1515 #traite_assign opérateur non traité : "' + element.operator + '"' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1518 #traite_assign il manque un gauche ou un droite : "' + element.type + '"' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_unary(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let what='';
        if(element.what){
            obj=this.#traite_element(element.what,niveau,element,tab_comm);
            if(obj.__xst === true){
                what+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0329 #traite_unary what' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1108 #traite_unary what' ,"element" : element}));
        }
        switch (element.type){
            case '!' : t+='non(' + what + ')';
                break;
            case '-' : t+='moins(' + what + ')';
                break;
            case '+' : t+='plus(' + what + ')';
                break;
            default:
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1286 #traite_unary non traité : "' + element.type + '"' ,"element" : element}));
                break;
                
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_bin(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';
        if(element.left){
            obj=this.#traite_element(element.left,niveau,element,tab_comm);
            if(obj.__xst === true){
                gauche+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0329 #traite_bin gauche' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1138 #traite_bin gauche' ,"element" : element}));
        }
        if(element.right){
            obj=this.#traite_element(element.right,niveau,element,tab_comm);
            if(obj.__xst === true){
                droite+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0335 #traite_bin droite' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1148 #traite_bin droite' ,"element" : element}));
        }
        switch (element.type){
            case '&&' : t+='et(' + gauche + ',' + droite + ')';
                break;
            case '||' : t+='ou(' + gauche + ',' + droite + ')';
                break;
            case '>' : t+='sup(' + gauche + ',' + droite + ')';
                break;
            case '<' : t+='inf(' + gauche + ',' + droite + ')';
                break;
            case '<=' : t+='infeg(' + gauche + ',' + droite + ')';
                break;
            case '>=' : t+='supeg(' + gauche + ',' + droite + ')';
                break;
            case '+' : t+='plus(' + gauche + ',' + droite + ')';
                break;
            case '-' : t+='moins(' + gauche + ',' + droite + ')';
                break;
            case '*' : t+='mult(' + gauche + ',' + droite + ')';
                break;
            case '/' : t+='divi(' + gauche + ',' + droite + ')';
                break;
            case '%' : t+='modulo(' + gauche + ',' + droite + ')';
                break;
            case '^' : t+='xou_binaire(' + gauche + ',' + droite + ')';
                break;
            case '??' : t+='??(' + gauche + ',' + droite + ')';
                break;
            case '.' : t+='concat(' + gauche + ',' + droite + ')';
                break;
            case '===' : t+='egalstricte(' + gauche + ',' + droite + ')';
                break;
            case '!==' : t+='diffstricte(' + gauche + ',' + droite + ')';
                break;
            case '!=' : t+='diff(' + gauche + ',' + droite + ')';
                break;
            case '==' : t+='egal(' + gauche + ',' + droite + ')';
                break;
            case '|' : t+='ou_binaire(' + gauche + ',' + droite + ')';
                break;
                
            default:
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0346 #traite_bin non traité : "' + element.type + '"' ,"element" : element}));
                break;
                
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      en php, une chaine 'bla \ bla' avec un antislash au milieu est accepté 
      mais pour les fichiers rev, c'est pas excellent, 
      on accepte les \r \n \t \x \o , \" et \' \\ donc on fait une 
      petite analyse et on remonte une erreur si on n'est pas dans ces cas
      =============================================================================================================
    */
    #traite_string(element,niveau,parent,tab_comm){
        let t='';
        var rv=element.raw;
        var contenu = rv.substr(1,rv.length - 2);
        if(rv.substr(0,1) === '\''
         && contenu.indexOf('\'') < 0
         && contenu.indexOf('\\') < 0
         || rv.substr(0,1) === '"'
         && contenu.indexOf('"') < 0
         && contenu.indexOf('\\') < 0
        ){
            /*
              si c'est une chaine "simple" cad ne contenant ni terminateur ni antislash
            */
            t+=element.raw;
        }else{
            /*
            */
            var l01 = rv.length - 2;
            var probablement_dans_une_regex = element.raw.substr(1,1) === '/' ? ( true ) : ( false );
            /*
              la chaine reçue dans le "raw" inclue le " ou les ' en début et fin 
              on les retire pour l'analyse, donc on part de l'avant dernier caractère 
              et on redescend jusqu'à l'indice 1
            */
            var nouvelle_chaine='';
            var i=l01;
            for( i=l01 ; i > 0 ; i-- ){
                if(rv.substr(i,1) === '\\'){
                    /* on remonte à partir du dernier caractère */
                    if(i === l01){
                        /* si le dernier caractère est un \ et que l'avant dernier est aussi un \, pas de problème */
                        if(rv.length > 2 && l01 > 1 && i > 1 && rv.substr(i - 1,1) === '\\'){
                            nouvelle_chaine='\\\\';
                            i--;
                        }else{
                            /* position du \ en dernier */
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1230  une chaine ne doit pas contenir un simple \\ en dernière position  ' ,"element" : element}));
                        }
                    }else{
                        if(i > 1){
                            /*
                              si on est avant le dernier caractère;
                            */
                            if(rv.substr(i - 1,1) === '\\'){
                                nouvelle_chaine='\\\\' + nouvelle_chaine;
                                i--;
                            }else{
                                if(rv.substr(i + 1,1) === 'r'
                                 || rv.substr(i + 1,1) === 'n'
                                 || rv.substr(i + 1,1) === 't'
                                 || rv.substr(i + 1,1) === '\''
                                 || rv.substr(i + 1,1) === '.'
                                 || rv.substr(i + 1,1) === '-'
                                 || rv.substr(i + 1,1) === 'A'
                                 || rv.substr(i + 1,1) === '?'
                                 || rv.substr(i + 1,1) === 'd'
                                 || rv.substr(i + 1,1) === '/'
                                 || rv.substr(i + 1,1) === 'x'
                                 || rv.substr(i + 1,1) === 'o'
                                 || rv.substr(i + 1,1) === 'b'
                                 || rv.substr(i + 1,1) === 'B'
                                 || rv.substr(i + 1,1) === '"'
                                 || rv.substr(i + 1,1) === '$'
                                 || rv.substr(i + 1,1) === 'w'
                                 || rv.substr(i + 1,1) === 's'
                                 || rv.substr(i + 1,1) === 'z'
                                 || rv.substr(i + 1,1) === 'Z'
                                 || rv.substr(i + 1,1) === '('
                                 || rv.substr(i + 1,1) === ')'
                                 || rv.substr(i + 1,1) === '['
                                 || rv.substr(i + 1,1) === ']'
                                ){
                                    if(rv.substr(i + 1,1) === 'r'
                                     || rv.substr(i + 1,1) === 't'
                                     || rv.substr(i + 1,1) === 'n'
                                     || rv.substr(i + 1,1) === '\''
                                     && rv.substr(0,1) === "'"
                                     || rv.substr(i + 1,1) === '"'
                                     && rv.substr(0,1) === '"'
                                    ){
                                        nouvelle_chaine='\\' + nouvelle_chaine;
                                    }else{
                                        nouvelle_chaine='\\\\' + nouvelle_chaine;
                                    }
                                }else{
                                    if(probablement_dans_une_regex === false){
                                        if(i > 0 && rv.substr(i - 1,1) !== '\\'){
                                            nouvelle_chaine='\\\\' + nouvelle_chaine;
                                        }else{
                                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1283 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + (rv.substr(i + 1,1)) + '" ' ,"element" : element}));
                                        }
                                    }else{
                                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1456 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + (rv.substr(i + 1,1)) + '" ' ,"element" : element}));
                                    }
                                }
                            }
                        }else{
                            /*
                              si on est au premier caractère;
                            */
                            if(rv.substr(i,1) === '\\'){
                                var c = nouvelle_chaine.substr(0,1);
                                if(c === '.'
                                 || c === '-'
                                 || c === 'd'
                                 || c === '/'
                                 || c === 'x'
                                 || c === 'o'
                                 || c === 'b'
                                 || c === 's'
                                 || c === '\\'
                                 || c === ']'
                                 || c === '['
                                 || c === '$'
                                 || c === '"'
                                 && rv.substr(0,1) === '\''
                                ){
                                    nouvelle_chaine='\\\\' + nouvelle_chaine;
                                }else if(c === 'r' || c === 'n' || c === 't' || c === '\'' && rv.substr(0,1) === '\'' || c === '"' && rv.substr(0,1) === '"'){
                                    nouvelle_chaine='\\' + nouvelle_chaine;
                                }else{
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1315 après un backslash il ne peut y avoir que les caractères entre les crochets suivants [\\"\'tonrxb] ' ,"element" : element}));
                                }
                            }else{
                                nouvelle_chaine=rv.substr(i,1) + nouvelle_chaine;
                            }
                        }
                    }
                }else if(rv.substr(i,1) === '\'' && rv.substr(0,1) === '\''){
                    if(i >= 2 && rv.substr(i - 1,1) === '\\'){
                        nouvelle_chaine='\\\'' + nouvelle_chaine;
                        i--;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1327 il doit y avoir un backslash avant un apostrophe ' ,"element" : element}));
                    }
                }else if(rv.substr(i,1) === '"' && rv.substr(0,1) === '"'){
                    if(i >= 2 && rv.substr(i - 1,1) === '\\'){
                        nouvelle_chaine='\\"' + nouvelle_chaine;
                        i--;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1774 il doit y avoir un backslash avant un guillemet ' ,"element" : element}));
                    }
                }else{
                    nouvelle_chaine=rv.substr(i,1) + nouvelle_chaine;
                }
            }
            t+=rv.substr(0,1) + nouvelle_chaine + rv.substr(0,1);
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_parametres(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let les_arguments='';
        for( let i=0 ; i < element.arguments.length ; i++ ){
            t+=',';
            obj=this.#traite_element(element.arguments[i],niveau,element,tab_comm);
            if(obj.__xst === true){
                t+='p(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1089 #traite_arguments' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_arguments(element,niveau,parent,tab_comm,type){
        let t='';
        let obj=null;
        let les_arguments='';
        let valeur_par_defaut='';
        for( let i=0 ; i < element.arguments.length ; i++ ){
            t+=',';
            /* ✍, valeur_defaut( defTab() ) */
            valeur_par_defaut='';
            if(element.arguments[i].value){
                obj=this.#traite_element(element.arguments[i].value,niveau,element,tab_comm);
                if(obj.__xst === true){
                    valeur_par_defaut=', valeur_defaut( ' + obj.__xva + ' )';+('argument()');
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1514 #traite_arguments' ,"element" : element}));
                }
            }
            obj=this.#traite_element(element.arguments[i].name,niveau,element,tab_comm);
            if(obj.__xst === true){
                if(element.arguments[i].byref === true){
                    t+='adresseArgument($' + obj.__xva + valeur_par_defaut + ')';
                }else{
                    t+='argument($' + obj.__xva + valeur_par_defaut + ')';
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1089 #traite_arguments' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    
    
    /*
      =============================================================================================================
    */
    #traite_property(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        
        if(element.nullable){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1584 #traite_property ' ,"element" : element}));
        }
        
        if(element.readonly){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1588 #traite_property ' ,"element" : element}));
        }
        
        if(element.name){
                obj=this.#traite_element(element.name,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+='$'+obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0135 #traite_function nom' ,"element" : element}));
                }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1588 #traite_property ' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_propertystatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let visibility='';
        let statique='';
        
        if(element.isStatic){
            statique='_statique';
        }

        
        if(element.visibility==='private'){
            visibility='variable_privée'+statique;
        }else if(element.visibility==='protected'){
            visibility='variable_protégée'+statique;
        }else if(element.visibility==='public'){
            visibility='variable_publique'+statique;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1624 #traite_propertystatement "'+element.visibility+'"' ,"element" : element}));
        }
        if(element.properties){
            for(let i=0;i<element.properties.length;i++){
                obj=this.#traite_element(element.properties[i],niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=visibility+'('+obj.__xva+')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0135 #traite_function nom' ,"element" : element}));
                }
                
            }
        }

        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =============================================================================================================
    */
    #traite_method(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let visibility='';
        let nom_methode='';
        let les_arguments='';
        let contenu='';
        let statique='';
        
/*
arguments: []
attrGroups: []
body: Block {kind: 'block', loc: Location, children: Array(1)}
byref: false
isAbstract: false
isFinal: false
isReadonly: false
isStatic: false
kind: "method"
name: Identifier {kind: 'identifier', loc: Location, name: '__construct'}
nullable: false
type: null
visibility: "public"
*/        

        if(element.isFinal){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1877 #traite_method ' ,"element" : element}));
        }

        if(element.isStatic){
            statique=',statique()'
//            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1881 #traite_method ' ,"element" : element}));
        }

        if(element.isReadonly){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1885 #traite_method ' ,"element" : element}));
        }

        if(element.isAbstract){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1888 #traite_method ' ,"element" : element}));
        }

        if(element.byref){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1892 #traite_method ' ,"element" : element}));
        }
        
        if(element.type){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1897 #traite_method ' ,"element" : element}));
        }
        


        if(element.body){
            if(element.body.kind===undefined){
             element.body.kind='body';
            }
            if(Array.isArray(element.body)){
             element.body.children=element.body;
            }

            obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1606 #traite_method body' ,"element" : element}));
            }
        }

        obj=this.#traite_arguments(element,niveau,parent,tab_comm,'argument');
        if(obj.__xst === true){
            les_arguments+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1198 #traite_method arguments' ,"element" : element}));
        }

        
        if(element.visibility==='public'){
            visibility+=',publique()';
        }else if(element.visibility==='private'){
            visibility+=',privée()';
        }else if(element.visibility===''){
            visibility+='';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1587 #traite_method ' ,"element" : element}));
        }
        
        
        obj=this.#traite_element(element.name,niveau,element,tab_comm);
        if(obj.__xst === true){
            nom_methode+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1599 #traite_method nom' ,"element" : element}));
        }
        
        t+='méthode(definition( nomm('+nom_methode+') '+statique+visibility+les_arguments+'),contenu('+contenu+'))';

        
        
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_class(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let nom_class='';
        let contenu='';
/*
body: (2) [PropertyStatement, PropertyStatement]
extends: null
implements: null
isAbstract: false
isAnonymous: false
isFinal: false
isReadonly: false
kind: "class"
loc: Location {source: null, start: Position, end: Position}
name: Identifier {kind: 'identifier', loc: Location, name: 'MicroTimer'}
*/        
        obj=this.#traite_element(element.name,niveau,element,tab_comm);
        if(obj.__xst === true){
            nom_class+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1599 #traite_class nom' ,"element" : element}));
        }
        if(element.body){
            if(element.body.kind===undefined){
             element.body.kind='body';
            }
            if(Array.isArray(element.body)){
             element.body.children=element.body;
            }
            obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1606 #traite_class body' ,"element" : element}));
            }
        }
        if(element.extends){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1610 #traite_class ' ,"element" : element}));
        }
        if(element.implements){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1610 #traite_class ' ,"element" : element}));
        }
        
        if(element.isAbstract){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1610 #traite_class ' ,"element" : element}));
        }
        
        if(element.isAnonymous){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1610 #traite_class ' ,"element" : element}));
        }
        
        if(element.isFinal){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1610 #traite_class ' ,"element" : element}));
        }
        
        if(element.isReadonly){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1610 #traite_class ' ,"element" : element}));
        }
        
        
        t+='definition_de_classe( nom_classe('+nom_class+') , contenu( '+contenu+' ))';


        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_function(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let contenu='';
        let nom_fonction='';
        let les_arguments='';
        obj=this.#traite_element(element.name,niveau,element,tab_comm);
        if(obj.__xst === true){
            nom_fonction+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0135 #traite_function nom' ,"element" : element}));
        }
        obj=this.#traite_arguments(element,niveau,parent,tab_comm,'argument');
        if(obj.__xst === true){
            les_arguments+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1198 #traite_function arguments' ,"element" : element}));
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1098 #traite_function body' ,"element" : element}));
            }
        }
        t+='fonction(';
        t+='definition(';
        t+='nom(' + nom_fonction + ')';
        t+=les_arguments;
        t+='),';
        t+='contenu(\n';
        t+=contenu;
        t+=')';
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_commentaires_fin(element,niveau,parent,tab_comm){
        var t='';
        if(!element.hasOwnProperty('loc')){
         return t;
        }
        if(!element.loc.hasOwnProperty('end')){
         return t;
        }
        var position_de_fin=element.loc.end.offset;
        var commentaires_a_retirer=[];
        for( var i=0 ; i < tab_comm.length ; i++ ){
            if(tab_comm[i].loc.end.offset <= position_de_fin){
                commentaires_a_retirer.push(i);
                if(tab_comm[i].kind === 'commentline'){
                    t+='#( ' + (tab_comm[i].value.trim().substr(2).trim()) + ' )';
                }else{
                    t+='#(' + (tab_comm[i].value.substr(2,tab_comm[i].value.length - 4)) + ')';
                }
            }
        }
        for( var i = commentaires_a_retirer.length - 1 ; i >= 0 ; i-- ){
            tab_comm.splice(commentaires_a_retirer[i],1);
        }
        return t;
    }
    /*
      =============================================================================================================
    */
    #traite_commentaires_debut(element,niveau,parent,tab_comm){
        var t='';
        var position_de_debut=element.loc.start.offset;
        var commentaires_a_retirer=[];
        for( var i=0 ; i < tab_comm.length ; i++ ){
            if(tab_comm[i].loc.end.offset <= position_de_debut){
                commentaires_a_retirer.push(i);
                if(tab_comm[i].kind === 'commentline'){
                    if( (tab_comm[i].value.match(/\(/g)||[]).length === (tab_comm[i].value.match(/\)/g)||[]).length ){
                        t+='#( ' + (tab_comm[i].value.trim().substr(2).trim()) + ' )';
                    }else{
                        t+='#( ' + (tab_comm[i].value.replace(/\(/g,'[').replace(/\)/g,']').trim().substr(2).trim()) + ' )';
                    }

                }else{
                    if( (tab_comm[i].value.match(/\(/g)||[]).length === (tab_comm[i].value.match(/\)/g)||[]).length ){
                        t+='#(' + (tab_comm[i].value.substr(2,tab_comm[i].value.length - 4)) + ')';
                    }else{
                        t+='#(' + (tab_comm[i].value.replace(/\(/g,'[').replace(/\)/g,']').substr(2,tab_comm[i].value.length - 4)) + ')';
                    }
                }
            }
        }
        for( var i = commentaires_a_retirer.length - 1 ; i >= 0 ; i-- ){
            tab_comm.splice(commentaires_a_retirer[i],1);
        }
        return t;
    }
    /*
      =============================================================================================================
    */
    #traite_commentaires_dans_bloc(element,niveau,parent,tab_comm){
        var t='';
        var position_de_debut_bloc=parent.loc.start.offset;
        var position_de_fin_bloc=parent.loc.end.offset;
        var position_de_debut_elem=element.loc.start.offset;
        var commentaires_a_retirer=[];
        for( var i=0 ; i < tab_comm.length ; i++ ){
            if(tab_comm[i].loc.start.offset >= position_de_debut_bloc
             && tab_comm[i].loc.end.offset <= position_de_fin_bloc
             && tab_comm[i].loc.end.offset < position_de_debut_elem
            ){
                commentaires_a_retirer.push(i);
                if(tab_comm[i].kind === 'commentline'){
                    if( (tab_comm[i].value.match(/\(/g)||[]).length === (tab_comm[i].value.match(/\)/g)||[]).length ){
                        t+='#( ' + (tab_comm[i].value.trim().substr(2).trim()) + ' )';
                    }else{
                        t+='#( ' + (tab_comm[i].value.replace(/\(/g,'[').replace(/\)/g,']').trim().substr(2).trim()) + ' )';
                    }
                }else{
                    if( (tab_comm[i].value.match(/\(/g)||[]).length === (tab_comm[i].value.match(/\)/g)||[]).length ){
                        t+='#(' + (tab_comm[i].value.substr(2,tab_comm[i].value.length - 4)) + ')';
                    }else{
                        t+='#(' + (tab_comm[i].value.replace(/\(/g,'[').replace(/\)/g,']').substr(2,tab_comm[i].value.length - 4)) + ')';
                    }
                }
            }
        }
        for( var i = commentaires_a_retirer.length - 1 ; i >= 0 ; i-- ){
            tab_comm.splice(commentaires_a_retirer[i],1);
        }
        return t;
    }
    /*
      =============================================================================================================
    */
    #traite_element(element,niveau,parent,tab_comm){
        if(element===undefined){
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2205 #traite_element element non défini ' , element:parent }));
        }
        let t='';
        let obj=null;
        if(parent.kind === 'if'){
            t+=this.#traite_commentaires_dans_bloc(parent,niveau,parent,tab_comm);
        }else{
            t+=this.#traite_commentaires_debut(element,niveau,parent,tab_comm);
        }
        switch (element.kind){
            case 'magic' : t+=element.raw;
                break;

            case 'nullkeyword' : t+='null';
                break;

            case 'boolean' : t+=element.raw;
                break;

            case 'number' : t+=element.value;
                break;

            case 'name' : t+=element.name;
                break;

            case 'identifier' :
                /* par exemple un nom de fonction à appeler */
                t+=element.name;
                break;
                
            case 'variable' : t+='$' + element.name;
                break;
                
            case 'noop' : t+='';
                break;

            case 'selfreference' :
                t+='self';
                break;

            case 'halt' :
                if(element.after && element.after!==''){
                    t+='__halt_compiler(\''+element.after.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
                }else{
                    t+='__halt_compiler()';
                }
                break;
                
            case 'string' :
                obj=this.#traite_string(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1226 #traite_element string type non prévu "' + (JSON.stringify(element)) + '"' ,"element" : element}));
                }
                break;
                

            case 'offsetlookup' :
                obj=this.#traite_tableau(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_element include' ,"element" : element}));
                }
                break;
                
                
            case 'call' :
                obj=this.#traite_call(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0178 #traite_element call' ,"element" : element}));
                }
                break;
                
            case 'include' :
                obj=this.#traite_include(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_element include' ,"element" : element}));
                }
                break;
                
            case 'print' :
                obj=this.#traite_print(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0132 #traite_element print' ,"element" : element}));
                }
                break;
                
            case 'echo' :
                obj=this.#traite_echo(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0907 #traite_element print' ,"element" : element}));
                }
                break;
                
            case 'call' :
                obj=this.#traite_call(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0166 #traite_element call' ,"element" : element}));
                }
                break;
                
            case 'assign' :
                obj=this.#traite_assign(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0182 #traite_element assign' ,"element" : element}));
                }
                break;
                
            case 'function' :
                obj=this.#traite_function(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1791 #traite_element function' ,"element" : element}));
                }
                break;
                
            case 'unset' :
                obj=this.#traite_unset(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1800 #traite_element unset' ,"element" : element}));
                }
                break;
                
            case 'isset' :
                obj=this.#traite_isset(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1809 #traite_element isset' ,"element" : element}));
                }
                break;
                
            case 'inline' :
                obj=this.#traite_inline(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1818 #traite_element inline' ,"element" : element}));
                }
                break;
                
            case 'bin' :
                obj=this.#traite_bin(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1827 #traite_element bin' ,"element" : element}));
                }
                break;
                
            case 'unary' :
                obj=this.#traite_unary(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1836 #traite_element unary' ,"element" : element}));
                }
                break;
                
            case 'array' :
                obj=this.#traite_deftab(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1845 #traite_element array' ,"element" : element}));
                }
                break;
                
            case 'retif' :
                obj=this.#traite_retif(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1854 #traite_element retif' ,"element" : element}));
                }
                break;
                
            case 'usegroup' :
                obj=this.#traite_usegroup(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1863 #traite_element usegroup' ,"element" : element}));
                }
                break;
                
            case 'propertylookup' :
                obj=this.#traite_propertylookup(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1872 #traite_element propertylookup' ,"element" : element}));
                }
                break;
                
            case 'staticlookup' :
                obj=this.#staticlookup(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2323 #traite_element pre' ,"element" : element}));
                }
                break;
                
            case 'new' :
                obj=this.#traite_new(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1890 #traite_element new' ,"element" : element}));
                }
                break;
                
            case 'try' :
                obj=this.#traite_try(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1899 #traite_element try' ,"element" : element}));
                }
                break;
                
            case 'catch' :
                obj=this.#traite_catch(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1908 #traite_element catch' ,"element" : element}));
                }
                break;
                
            case 'return' :
                obj=this.#traite_return(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1917 #traite_element return' ,"element" : element}));
                }
                break;
                
            case 'exit' :
                obj=this.#traite_exit(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1926 #traite_element return' ,"element" : element}));
                }
                break;
                
            case 'silent' :
                obj=this.#traite_silent(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1935 #traite_element return' ,"element" : element}));
                }
                break;
                
            case 'while' :
                obj=this.#traite_while(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1944 #traite_element while' ,"element" : element}));
                }
                break;
                
            case 'for' :
                obj=this.#traite_for(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1953 #traite_element for' ,"element" : element}));
                }
                break;
                
            case 'foreach' :
                obj=this.#traite_foreach(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1962 #traite_element foreach' ,"element" : element}));
                }
                break;
                
            case 'post' :
                obj=this.#traite_post(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1971 #traite_element post' ,"element" : element}));
                }
                break;
                
            case 'pre' :
                obj=this.#traite_pre(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1980 #traite_element pre' ,"element" : element}));
                }
                break;
                
            case 'encapsed' :
                obj=this.#traite_encapsed(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1989 #traite_element pre' ,"element" : element}));
                }
                break;
                
            case 'cast' :
                obj=this.#traite_cast(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1998 #traite_element pre' ,"element" : element}));
                }
                break;
                
            case 'break' : t+='';
                obj=this.#traite_break(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2341 #traite_element break' ,"element" : element}));
                }
                break;
                break;
                
            case 'if' :
                obj=this.#traite_if(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2010 #traite_element if' ,"element" : element}));
                }
                break;
                
            case 'switch' :
                obj=this.#traite_switch(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2276 #traite_element if' ,"element" : element}));
                }
                break;
                
                
            case 'case' :
                obj=this.#traite_case(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2276 #traite_element if' ,"element" : element}));
                }
                break;
                
                
                
            case 'class' :
                obj=this.#traite_class(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2238 #traite_element if' ,"element" : element}));
                }
                break;
                
            case 'propertystatement' :
                obj=this.#traite_propertystatement(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2247 #traite_element if' ,"element" : element}));
                }
                break;
                
            case 'property' :
                obj=this.#traite_property(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2256 #traite_element if' ,"element" : element}));
                }
                break;
                
                
            case 'method' :
                obj=this.#traite_method(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2266 #traite_element if' ,"element" : element}));
                }
                break;
                
                
            case 'global' :
                obj=this.#traite_global(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2437 #traite_element if' ,"element" : element}));
                }
                break;
                
                
            case 'list' :
                obj=this.#traite_list(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2447 #traite_element list' ,"element" : element}));
                }
                break;
                
                
            case 'continue' :
                obj=this.#traite_continue(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2483 #traite_element #traite_continue' ,"element" : element}));
                }
                break;
                
                
            case 'empty' :
                obj=this.#traite_empty(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2527 #traite_element #traite_empty' ,"element" : element}));
                }
                break;
                
                
            case 'assignref' :
                obj=this.#traite_assignref(element,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2589 #traite_element #traite_assignref' ,"element" : element}));
                }
                break;
                
            default:
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0300 💥💥💥 non prévu dans #traite_element pour kind = "' + element.kind + '"' ,"element" : element}));
                
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ast0(element,niveau,parent,tab_comm){

        let t='';
        let obj=null;
        const espaces = CRLF + '   '.repeat(niveau);
        switch (element.kind){
            case 'program' : 
            case 'body' : 
            case 'block' :
                /* ========================== */
                for( let i=0 ; i < element.children.length ; i++ ){
                    if(element.kind === 'block' || element.kind === 'body'){
                        t+=this.#traite_commentaires_dans_bloc(element.children[i],niveau,parent,tab_comm);
                    }else{
                        t+=this.#traite_commentaires_debut(element.children[i],niveau,parent,tab_comm);
                    }
                    
                    switch (element.children[i].kind){
                        case 'expressionstatement' :
                            obj=this.#traite_element(element.children[i].expression,niveau,element,tab_comm);
                            if(obj.__xst === true){
                                t+=espaces + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 expressionstatement' ,"element" : element}));
                            }
                            break;
                            
                        default:
                            obj=this.#traite_element(element.children[i],niveau,element,tab_comm);
                            if(obj.__xst === true){
                                t+=espaces + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0342 #traite_ast0 default' ,"element" : element}));
                            }
                            break;
                            
                    }
                }
                break;
                
            case 'expressionstatement' :
                /* pour les if($condition) $a=1;, il y a une expression à la place d'un bloc ou d'un body */

                obj=this.#traite_element(element.expression,niveau,element,tab_comm);
                if(obj.__xst === true){
                    t+=espaces + obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 expressionstatement' ,"element" : element.expression}));
                }
                break;
                
            default:
                debugger
                /* ========================== */
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2724 #traite_ast0 default' ,"element" : element}));
                break;
                
        }
        t+=this.#traite_commentaires_fin(element,niveau,parent,tab_comm);
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    traite_ast(ast_de_php,options_traitement){
        if(options_traitement !== undefined){
            this.#options_traitement=options_traitement;
        }
        let t='';
        if(ast_de_php.kind === 'program'){
            let niveau=0;
            var obj = this.#traite_ast0(ast_de_php,niveau,null,ast_de_php.comments);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 expressionstatement' }));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0040 traite_ast ce n\'est pas un programme' }));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
}
export{module_conversion_ast_de_php_parser_vers_rev1};