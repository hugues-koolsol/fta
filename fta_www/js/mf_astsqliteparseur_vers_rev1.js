"use strict";
/*
  =====================================================================================================================
  conversion d'un ast produit par 
  * sqlite-parser - v1.0.1
  * @copyright 2015-2017 Code School (http://codeschool.com)
  * @author Nick Wronski <nick@javascript.com>
  * https://github.com/codeschool/sqlite-parser
  point d'entrée = traite_ast_de_sqliteparseur
  =====================================================================================================================
*/
class c_astsqliteparseur_vers_rev1{
    #nom_de_la_variable='';
    #options_traitement=null;
    /*
      =============================================================================================================
      le seul argument est pour l'instant le nom de la variable qui est déclarée
    */
    constructor( nom_de_la_variable ){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    /*
      =============================================================================================================
    */
    #astsql_le( o ){
        /*#
          if(o.hasOwnProperty('element') && o.element && o.element.hasOwnProperty('loc') && o.element.loc.hasOwnProperty('start')){
              o.plage=[o.element.loc.start.offset,o.element.loc.end.offset];
          }
        */
        __m_rev1.empiler_erreur( o );
        return o;
    }
    /*
      =============================================================================================================
    */
    #recupere_element_de_ast_sql( element , niveau , parent , options ){
        var t='';
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        if(!element){
            /* .hasOwnProperty['type']]{ */
            debugger;
        }
        if(element.type && 'literal' === element.type){
            if(element.variant === 'decimal'){
                t+=element.value;
            }else if(element.variant === 'text'){
                t+='\'' + element.value.replace( /\\/g , '\\\\' ).replace( /\'/g , '\\\'' ) + '\'';
            }else if(element.variant === 'null'){
                t+='NULL';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'variant non traite : "' + element.variant + '"'} ));
            }
        }else if(element.type && 'join' === element.type){
            if(element.variant === 'cross join'){
                t+='jointure_croisée(';
            }else if(element.variant === 'left join'){
                t+='jointure_gauche(';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'variant non traite : "' + element.variant + '"'} ));
            }
            if(element.source){
                var obj1=this.#recupere_element_de_ast_sql( element.source , niveau + 1 , parent , options );
                if(obj1.__xst === __xsu){
                    t+='\n' + esp0 + esp1 + esp1 + esp1 + 'source(' + obj1.__xva;
                    t+='\n' + esp0 + esp1 + esp1 + esp1 + ')';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'source'} ));
            }
            if(element.constraint){
                if(element.constraint.format && element.constraint.format === "on" && element.constraint.on){
                    var obj1=this.#recupere_element_de_ast_sql( element.constraint.on , niveau , parent , options );
                    if(obj1.__xst === __xsu){
                        t+=',contrainte(' + obj1.__xva + ')';
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'constraint'} ));
                    }
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'constraint'} ));
                }
            }
            t+=')';
        }else if(element.type && 'identifier' === element.type){
            if(element.variant === 'column'){
                if(element.hasOwnProperty( 'alias' )){
                    if(element.name.indexOf( '.' ) >= 1){
                        t+='champ(`' + element.name.substr( 0 , element.name.indexOf( '.' ) ) + '`,`' + element.name.substr( element.name.indexOf( '.' ) + 1 ) + '` , alias_champ(`' + element.alias + '`))';
                    }else{
                        t+='champ(' + element.name + ' , alias_champ(`' + element.alias + '`))';
                    }
                }else{
                    if(element.name.indexOf( '.' ) >= 1){
                        t+='champ(`' + element.name.substr( 0 , element.name.indexOf( '.' ) ) + '`,`' + element.name.substr( element.name.indexOf( '.' ) + 1 ) + '`)';
                    }else{
                        t+='champ(' + element.name + ')';
                    }
                }
            }else if(element.variant === 'function'){
                if(element.name === 'count'){
                    t+='compter';
                }else{
                    t+=element.name;
                }
            }else if(element.variant === 'star'){
                t+='tous_les_champs()';
            }else if(element.variant === 'table'){
                var nom_de_la_table='';
                var nom_de_la_base='';
                var nom_de_l_alias='';
                if(element.name.indexOf( '.' ) >= 1){
                    nom_de_la_table=element.name.substr( element.name.indexOf( '.' ) + 1 );
                    nom_de_la_base=element.name.substr( 0 , element.name.indexOf( '.' ) );
                }else{
                    nom_de_la_table=element.name;
                }
                if(element.alias){
                    nom_de_l_alias=element.alias;
                }
                if(nom_de_la_table === ''){
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'identifiant table'} ));
                }
                t+='nom_de_la_table(' + nom_de_la_table + '' + (nom_de_l_alias !== '' ? ( ',alias(' + nom_de_l_alias + ')' ) : ( '' )) + '' + (nom_de_la_base !== '' ? ( ',base(' + nom_de_la_base + ')' ) : ( '' )) + ')';
            }else if(element.variant === 'expression'){
                if(element.format && element.format === 'table'){
                    t+='nom_de_la_table(' + element.name + ')';
                    if(element.columns){
                        t+=',champs(';
                        for( var i=0 ; i < element.columns.length ; i++ ){
                            if(i > 0){
                                t+=',';
                            }
                            t+='`' + element.columns[i].name + '`';
                        }
                        t+=')';
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'identifiant expression'} ));
                    }
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'identifiant expression'} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
            }
        }else if(element.type && 'expression' === element.type && element.variant === 'order'){
            var obj1=this.#recupere_element_de_ast_sql( element.expression , niveau , parent , options );
            if(obj1.__xst === __xsu){
                t+='(' + obj1.__xva;
                if(element.direction){
                    if(element.direction === 'desc'){
                        t+=',décroissant()';
                    }else{
                        t+=',croissant()';
                    }
                }else{
                    t+=',croissant()';
                }
                t+=')';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'order'} ));
            }
        }else if(element.type && 'expression' === element.type && element.format && element.format === 'binary'){
            var obj1=this.#traite_operation_dans_ast_sql( element , niveau , parent , options );
            if(obj1.__xst === __xsu){
                t+=obj1.__xva;
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'expression binaire'} ));
            }
        }else if(element.type && 'expression' === element.type && 'list' === element.variant){
            if(element.expression && element.expression.length > 0){
                t+='(';
                for( var i=0 ; i < element.expression.length ; i++ ){
                    if(i > 0){
                        t+=',';
                    }
                    var obj1=this.#recupere_element_de_ast_sql( element.expression[i] , niveau , parent , options );
                    if(obj1.__xst === __xsu){
                        t+=obj1.__xva;
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'expression list'} ));
                    }
                }
                t+=')';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'expression list'} ));
            }
        }else if(element.type && 'expression' === element.type && 'operation' === element.variant && element.format === "unary"){
            if(element.operator === '-' && element.expression.type === 'literal'){
                t+='moins(' + element.expression.value + ')';
            }else if(element.operator === '+' && element.expression.type === 'literal'){
                t+='plus(' + element.expression.value + ')';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'expression unaire'} ));
            }
        }else if(element.type && 'function' === element.type){
            var obj1=this.#traite_fonction_dans_ast_sql( element , niveau , null , options );
            if(obj1.__xst === __xsu){
                t+=obj1.__xva;
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'fonction'} ));
            }
        }else if(element.type && 'assignment' === element.type){
            var cible='';
            var valeur='';
            if(element.target){
                var obj1=this.#recupere_element_de_ast_sql( element.target , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    cible=obj1.__xva;
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'assignment'} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'assignment'} ));
            }
            if(element.value){
                var obj1=this.#recupere_element_de_ast_sql( element.value , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    valeur=obj1.__xva;
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'assignment'} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'assignment'} ));
            }
            t+='affecte(' + cible + ',' + valeur + ')';
        }else if(element.type && 'variable' === element.type){
            if(element.format === 'tcl'){
                t+=element.name;
            }else if(element.format === 'named'){
                t+=element.name;
            }else if(element.format === 'numbered'){
                t+=element.name;
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'variable'} ));
            }
        }else if(element.type && 'statement' === element.type){
            var obj=this.#traite_ast( element , niveau , parent , options );
            if(obj.__xst === __xsu){
                t+='sql(' + obj.__xva + ')';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'déclaration'} ));
            }
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'type non traite : "' + element.type + '"'} ));
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #recupere_operateur_dans_sql_ast( nom_de_l_operateur ){
        if(nom_de_l_operateur === '+'){
            return 'plus';
        }else if(nom_de_l_operateur === '-'){
            return 'moins';
        }else if(nom_de_l_operateur === '*'){
            return 'mult';
        }else if(nom_de_l_operateur === '/'){
            return 'divi';
        }else if(nom_de_l_operateur === '<>'){
            return 'diff';
        }else if(nom_de_l_operateur === 'not like'){
            return 'pas_comme';
        }else if(nom_de_l_operateur === 'like'){
            return 'comme';
        }else if(nom_de_l_operateur === '='){
            return 'egal';
        }else if(nom_de_l_operateur === 'and'){
            return 'et';
        }else if(nom_de_l_operateur === 'or'){
            return 'ou';
        }else if(nom_de_l_operateur === 'in'){
            return 'dans';
        }else if(nom_de_l_operateur === '>='){
            return 'supegal';
        }else if(nom_de_l_operateur === '<='){
            return 'infegal';
        }else if(nom_de_l_operateur === '>'){
            return 'sup';
        }else if(nom_de_l_operateur === '<'){
            return 'inf';
        }else if(nom_de_l_operateur === 'is'){
            return 'est';
        }else{
            this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'operateur non trouvé : "' + nom_de_l_operateur + '"'} );
        }
    }
    /*
      =============================================================================================================
    */
    #traite_fonction_dans_ast_sql( element , niveau , parent , options ){
        var t='';
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        var les_arguments='';
        var nom_de_la_fonction='';
        if(element.name){
            var obj1=this.#recupere_element_de_ast_sql( element.name , niveau , parent , options );
            if(obj1.__xst === __xsu){
                nom_de_la_fonction=obj1.__xva;
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'nom de fonction'} ));
            }
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'nom de fonction trouvé'} ));
        }
        if(element.args){
            if(element.args.type === 'expression' && element.args.variant === 'list'){
                for( var i=0 ; i < element.args.expression.length ; i++ ){
                    var obj1=this.#recupere_element_de_ast_sql( element.args.expression[i] , niveau , parent , options );
                    if(obj1.__xst === __xsu){
                        les_arguments+=',' + obj1.__xva;
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'argument'} ));
                    }
                }
            }else if(element.args.type === 'function'){
                var obj1=this.#traite_fonction_dans_ast_sql( element.args , niveau , null , options );
                if(obj1.__xst === __xsu){
                    les_arguments+=',' + obj1.__xva;
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'fonction'} ));
                }
            }else if(element.args.type === 'identifier'){
                var obj1=this.#recupere_element_de_ast_sql( element.args , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    les_arguments+=',' + obj1.__xva;
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
            }
            if(les_arguments.length > 0){
                les_arguments=les_arguments.substr( 1 );
            }
        }
        t+=nom_de_la_fonction + '(' + les_arguments + ')';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_operation_dans_ast_sql( element , niveau , parent , options ){
        var t='';
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        if(element.format && element.format === 'binary'){
            if(element.operation){
                var operation=this.#recupere_operateur_dans_sql_ast( element.operation );
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
            }
            if(element.left){
                var obj_gauche=this.#recupere_element_de_ast_sql( element.left , niveau , parent , options );
                if(obj_gauche.__xst === __xsu){
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'left'} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'left absent'} ));
            }
            if(element.right){
                var obj_droite=this.#recupere_element_de_ast_sql( element.right , niveau , parent , options );
                if(obj_droite.__xst === __xsu){
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'right'} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'right absent'} ));
            }
            t+=operation + '(' + obj_gauche.__xva + ' , ' + obj_droite.__xva + ')';
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #convertit_sql_update_sqlite_de_ast_vers_rev( element , niveau , parent , options ){
        var t='';
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        /* console.log('element ast select=' , element ); */
        t+='\n' + esp0 + 'modifier(';
        if(element.into){
            var obj1=this.#recupere_element_de_ast_sql( element.into , niveau , parent , options );
            if(obj1.__xst === __xsu){
                t+='\n' + esp0 + esp1 + esp1 + obj1.__xva + '';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
            }
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'into'} ));
        }
        if(element.set && element.set.length > 0){
            t+='\n' + esp0 + esp1 + esp1 + ',valeurs(';
            for( var i=0 ; i < element.set.length ; i++ ){
                if(i > 0){
                    t+=',';
                }
                var obj1=this.#recupere_element_de_ast_sql( element.set[i] , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='\n' + esp0 + esp1 + esp1 + esp1 + obj1.__xva + '';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
                }
            }
            t+='\n' + esp0 + esp1 + esp1 + ')';
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'set'} ));
        }
        if(element.where && element.where.length > 0){
            t+='\n' + esp0 + esp1 + ',conditions(';
            for( var i=0 ; i < element.where.length ; i++ ){
                var obj1=this.#recupere_element_de_ast_sql( element.where[i] , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='\n' + esp0 + esp1 + esp1 + '' + obj1.__xva + ',';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'where'} ));
                }
            }
            t+='\n' + esp0 + esp1 + ')';
        }
        t+='\n' + esp0 + ')';
        console.log( 'modifier element=' , element );
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #convertit_sql_delete_sqlite_de_ast_vers_rev( element , niveau , parent , options ){
        var t='';
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        t+='\n' + esp0 + 'supprimer(';
        if(element.from){
            if(element.from.type === 'identifier'){
                if(element.from.variant && element.from.variant === 'table'){
                    t+=CRLF + '    nom_de_la_table(' + element.from.name + ')';
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'identifier'} ));
            }
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'pas de from'} ));
        }
        if(element.where && element.where.length > 0){
            t+='\n' + esp0 + esp1 + ',conditions(';
            for( var i=0 ; i < element.where.length ; i++ ){
                var obj1=this.#recupere_element_de_ast_sql( element.where[i] , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='\n' + esp0 + esp1 + esp1 + '' + obj1.__xva + ',';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
                }
            }
            t+='\n' + esp0 + esp1 + ')';
        }
        t+=(CRLF + esp0) + ')';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #convertit_sql_insert_sqlite_de_ast_vers_rev( element , niveau , parent , options ){
        var t='';
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        var tableau_des_champs=[];
        /* console.log('element ast select=' , element ); */
        t+='\n' + esp0 + 'insérer(';
        if(element.into){
            if(element.into.type === 'identifier'){
                if(element.into.format && element.into.format === 'table'){
                    t+='nom_de_la_table(' + element.into.name + ')';
                    if(element.into.columns){
                        for( var i=0 ; i < element.into.columns.length ; i++ ){
                            tableau_des_champs.push( element.into.columns[i].name );
                        }
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'table'} ));
                    }
                }else if(element.into.variant === 'table' && element.into.type === 'identifier'){
                    t+='nom_de_la_table(' + element.into.name + ')';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'into'} ));
            }
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + ' pas de into'} ));
        }
        if(element.or){
            if(element.or === 'ignore'){
                t+=',ignorer()';
            }
        }
        if(element.result && element.result.length > 0){
            t+='\n' + esp0 + esp1 + esp1 + ',valeurs(';
            /*
              on ne prend que la première valeur
            */
            if(element.result[0].type === 'expression' && 'list' === element.result[0].variant){
                if(element.result[0].expression && element.result[0].expression.length > 0){
                    for( var i=0 ; i < element.result[0].expression.length ; i++ ){
                        if(i > 0){
                            t+=',';
                        }
                        var obj1=this.#recupere_element_de_ast_sql( element.result[0].expression[i] , niveau , parent , options );
                        if(obj1.__xst === __xsu){
                            t+=CRLF + '        affecte(champ(`' + tableau_des_champs[i] + '`) , ' + obj1.__xva + ')';
                        }else{
                            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'result'} ));
                }
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'result'} ));
            }
            t+='\n' + esp0 + esp1 + esp1 + ')';
        }else if(element.result && element.result.type === 'statement'){
            if(tableau_des_champs.length > 0){
                t+=',valeurs(';
                for( var j=0 ; j < tableau_des_champs.length ; j++ ){
                    t+=CRLF + '        champ(`' + tableau_des_champs[j] + '`)';
                }
                t+=')';
            }
            var obj=this.#traite_ast( element.result , niveau , parent , options );
            if(obj.__xst === __xsu){
                t+=',sql(' + obj.__xva + ')';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'déclaration'} ));
            }
        }
        t+='\n' + esp0 + ')';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #convertit_sql_select_sqlite_de_ast_vers_rev( element , niveau , parent , options ){
        var t='';
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        /* console.log('element ast select=' , element ); */
        t+='\n' + esp0 + 'sélectionner(';
        if(element.result && element.result.length > 0){
            t+='\n' + esp0 + esp1 + 'valeurs(';
            for( var i=0 ; i < element.result.length ; i++ ){
                /* console.log(element.result[i]) */
                var obj1=this.#recupere_element_de_ast_sql( element.result[i] , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='\n' + esp0 + esp1 + esp1 + obj1.__xva + ',';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
                }
            }
            t+='\n' + esp0 + esp1 + ')';
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'pas de result'} ));
        }
        if(element.from){
            t+='\n' + esp0 + esp1 + ',provenance(';
            if(element.from.source){
                var obj1=this.#recupere_element_de_ast_sql( element.from.source , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='\n' + esp0 + esp1 + esp1 + 'table_reference(source(' + obj1.__xva + ')),';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
                }
            }else{
                var obj1=this.#recupere_element_de_ast_sql( element.from , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='\n' + esp0 + esp1 + esp1 + 'table_reference(source(' + obj1.__xva + ')),';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'from'} ));
                }
            }
            if(element.from.map && element.from.map.length > 0){
                for( var i=0 ; i < element.from.map.length ; i++ ){
                    var obj1=this.#recupere_element_de_ast_sql( element.from.map[i] , niveau , parent , options );
                    if(obj1.__xst === __xsu){
                        t+='\n' + esp0 + esp1 + esp1 + '' + obj1.__xva + ',';
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'from'} ));
                    }
                }
            }
            t+='\n' + esp0 + esp1 + ')';
        }
        if(element.where && element.where.length > 0){
            t+='\n' + esp0 + esp1 + ',conditions(';
            for( var i=0 ; i < element.where.length ; i++ ){
                var obj1=this.#recupere_element_de_ast_sql( element.where[i] , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='\n' + esp0 + esp1 + esp1 + '' + obj1.__xva + ',';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'where'} ));
                }
            }
            t+='\n' + esp0 + esp1 + ')';
        }
        if(element.order && element.order.length > 0){
            t+='\n' + esp0 + esp1 + ',trier_par(';
            for( var i=0 ; i < element.order.length ; i++ ){
                var obj1=this.#recupere_element_de_ast_sql( element.order[i] , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+=obj1.__xva + ',';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'order'} ));
                }
            }
            t+=')';
        }
        if(element.limit){
            t+='\n' + esp0 + esp1 + ',limité_à(';
            if(element.limit.start){
                var obj1=this.#recupere_element_de_ast_sql( element.limit.start , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='quantité(' + obj1.__xva + '),';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'limit'} ));
                }
            }
            if(element.limit.offset){
                var obj1=this.#recupere_element_de_ast_sql( element.limit.offset , niveau , parent , options );
                if(obj1.__xst === __xsu){
                    t+='début(' + obj1.__xva + ')';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'limit'} ));
                }
            }
            t+=')';
        }
        t+='\n' + esp0 + '),';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #convertit_sql_create_table_sqlite_de_ast_vers_rev( element , niveau , parent , options ){
        let t='';
        let obj=null;
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        t+='\n' + esp0 + 'créer_table(';
        if(element.name){
            if(element.name.type === "identifier"){
                t+='\n' + esp0 + esp1 + 'nom_de_la_table(' + element.name.name + ')';
            }else{
                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'nom'} ));
            }
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'nom'} ));
        }
        if(element.definition && element.definition.length > 0){
            t+='\n' + esp0 + esp1 + 'champs(#()';
            for( var i=0 ; i < element.definition.length ; i++ ){
                t+='\n' + esp0 + esp1 + esp1 + 'field(';
                if(element.definition[i].definition){
                    if(element.definition[i].type === 'definition' && element.definition[i].variant === "column"){
                        t+='nom_du_champ(`' + element.definition[i].name + '`)';
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'definition'} ));
                    }
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'definition'} ));
                }
                if(element.definition[i].datatype){
                    t+=' , type(' + element.definition[i].datatype.variant;
                    if(element.definition[i].datatype.args){
                        t+=',';
                        for( var j=0 ; j < element.definition[i].datatype.args.expression.length ; j++ ){
                            if(j > 0){
                                t+=',';
                            }
                            if(element.definition[i].datatype.args.expression[j].type === 'literal'){
                                t+=element.definition[i].datatype.args.expression[j].value;
                            }else{
                                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'définition type'} ));
                            }
                        }
                        t+='';
                    }
                    t+=')';
                }else{
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'définition type'} ));
                }
                if(element.definition[i].definition && element.definition[i].definition.length >= 1){
                    for( var j=0 ; j < element.definition[i].definition.length ; j++ ){
                        if(element.definition[i].definition[j].type === "constraint"
                               && element.definition[i].definition[j].variant === "primary key"
                        ){
                            t+=' , primary_key()';
                        }
                        if(element.definition[i].definition[j].type === "constraint"
                               && element.definition[i].definition[j].hasOwnProperty( 'autoIncrement' )
                               && element.definition[i].definition[j].autoIncrement === true
                        ){
                            t+=' , auto_increment()';
                        }
                        if(element.definition[i].definition[j].type === "constraint" && element.definition[i].definition[j].variant === "not null"){
                            t+=' , not_null()';
                        }
                        if(element.definition[i].definition[j].type === "constraint"
                               && element.definition[i].definition[j].variant === "default"
                               && element.definition[i].definition[j].value
                        ){
                            if(element.definition[i].definition[j].value.type === 'literal'){
                                t+=' , default(\'' + element.definition[i].definition[j].value.value.replace( /\\/g , '\\\\' ).replace( /\'/g , '\\\'' ) + '\')';
                            }else{
                                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'valeur par défaut'} ));
                            }
                        }
                        if(element.definition[i].definition[j].type === "constraint"
                               && element.definition[i].definition[j].variant === "foreign key"
                               && element.definition[i].definition[j].references
                        ){
                            t+=' , references(';
                            if(element.definition[i].definition[j].references.name){
                                t+='`' + element.definition[i].definition[j].references.name + '`,';
                                if(element.definition[i].definition[j].references.columns
                                       && element.definition[i].definition[j].references.columns.length === 1
                                ){
                                    t+='`' + element.definition[i].definition[j].references.columns[0].name + '`';
                                }else{
                                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'clé étrangère'} ));
                                }
                            }else{
                            }
                            t+=')';
                        }
                    }
                }
                t+=')';
            }
            t+='\n' + esp0 + esp1 + ')';
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
        }
        /* debugger; */
        t+='\n' + esp0 + ')';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #convertit_sql_create_index_sqlite_de_ast_vers_rev( element , niveau , parent , options ){
        let t='';
        let obj=null;
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        t+='\n' + esp0 + 'ajouter_index(';
        if(element.on && element.on.name){
            t+='sur_table(`' + element.on.name + '`)';
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : (__m_rev1.nl2() + __m_rev1.nl2()) + 'nom de la table de l\'index nn trouvé'} ));
        }
        if(element.unique && element.unique === true){
            t+=',unique()';
        }
        if(element.target && element.target.name){
            t+=',index_name(`' + element.target.name + '`)';
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : (__m_rev1.nl2() + __m_rev1.nl2()) + 'nom de l\'index nn trouvé'} ));
        }
        if(element.on && element.on.columns && element.on.columns.length > 0){
            t+=',champs(';
            for( var i=0 ; i < element.on.columns.length ; i++ ){
                if(i > 0){
                    t+=',';
                }
                t+='`' + element.on.columns[i].name + '`';
            }
            t+=')';
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + ' champs de l\'index nn trouvé'} ));
        }
        t+=')';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #json_partiel( json_obj ){
        /*#
          var a={};
          for(var i in json_obj){
              if( typeof json_obj[i] === 'string'){
                  a[i]=json_obj[i];
              }else if( typeof json_obj[i] === 'object'){
                  if(json_obj[i] instanceof Array){
                      a[i]=[];
                  }else if(json_obj[i] === true){
                      a[i]='true';
                  }else if(json_obj[i] === false){
                      a[i]='false';
                  }else{
                      a[i]={};
                      for(var j in json_obj[i]){
                          if( typeof json_obj[i][j] === 'string'){
                              a[i][j]=json_obj[i][j];
                          }else{
                              a[i][j]='...';
                          }
                      }
                  }
              }else{
                  a[i]='...';
              }
          }
          return(JSON.stringify(a));
        */
        return '';
    }
    /*
      =============================================================================================================
    */
    #traite_ast( element , niveau , parent , options={} ){
        let t='';
        let obj=null;
        var esp0=' '.repeat( NBESPACESREV * niveau );
        var esp1=' '.repeat( NBESPACESREV );
        if(element === null){
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'null'} ));
        }
        element.en_cours_de_traitement=true;
        if(element.traite && element.traite === true){
            return({"__xst" : __xsu ,"__xva" : ''});
        }
        element.traite=false;
        if(element.type === 'statement'){
            switch (element.variant){
                case 'list' :
                    for( var i=0 ; i < element.statement.length ; i++ ){
                        var obj1=this.#traite_ast( element.statement[i] , niveau , element , {} );
                        if(obj1.__xst === __xsu){
                            t+=obj1.__xva;
                        }else{
                            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'list'} ));
                        }
                    }
                    element.traite=true;
                    element.en_cours_de_traitement=false;
                    break;
                    
                case 'update' :
                    /*
                      =============================================================================
                      UPDATE
                      =============================================================================
                    */
                    obj=this.#convertit_sql_update_sqlite_de_ast_vers_rev( element , niveau , null , options );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'update'} ));
                    }
                    break;
                    
                case 'insert' :
                    /*
                      =============================================================================
                      INSERT
                      =============================================================================
                    */
                    obj=this.#convertit_sql_insert_sqlite_de_ast_vers_rev( element , niveau , null , options );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'insert'} ));
                    }
                    break;
                    
                case 'delete' :
                    /*
                      =============================================================================
                      DELETE
                      =============================================================================
                    */
                    obj=this.#convertit_sql_delete_sqlite_de_ast_vers_rev( element , niveau , null , options );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'delete'} ));
                    }
                    break;
                    
                case 'create' :
                    switch (element.format){
                        case 'index' :
                            /*
                              =============================================================
                              CREATE index
                              =============================================================
                            */
                            obj=this.#convertit_sql_create_index_sqlite_de_ast_vers_rev( element , niveau , parent , options );
                            if(obj.__xst === __xsu){
                                t+=obj.__xva;
                            }else{
                                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'create index'} ));
                            }
                            break;
                            
                        case 'table' :
                            /*
                              =============================================================
                              CREATE table
                              =============================================================
                            */
                            obj=this.#convertit_sql_create_table_sqlite_de_ast_vers_rev( element , niveau , parent , options );
                            if(obj.__xst === __xsu){
                                t+=obj.__xva;
                            }else{
                                return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'create table'} ));
                            }
                            break;
                            
                        default:
                            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'create = "' + element.format + '" non traité '} ));
                            
                    }
                    break;
                    
                case 'select' :
                    /*
                      =============================================================================
                      SELECT
                      =============================================================================
                    */
                    obj=this.#convertit_sql_select_sqlite_de_ast_vers_rev( element , niveau , null , options );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'select'} ));
                    }
                    break;
                    
                case 'transaction' :
                    switch (element.action){
                        case 'begin' :
                            t+='\ntransaction(';
                            if(parent && parent.type === 'statement' && parent.variant === 'list'){
                                element.transaction_en_cours=true;
                                for( var i=0 ; i < parent.statement.length ; i++ ){
                                    if(parent.statement[i].en_cours_de_traitement && parent.statement[i].en_cours_de_traitement === true){
                                        continue;
                                    }else if(parent.statement[i].traite && parent.statement[i].traite === true){
                                        continue;
                                    }else if(parent.statement[i].type === 'statement'
                                           && parent.statement[i].variant === 'transaction'
                                           && parent.statement[i].action === 'commit'
                                    ){
                                        /*
                                          fin de transaction par un commit
                                        */
                                        t+='\n' + esp0 + ')';
                                        t+='\n' + esp0 + 'commit()';
                                        parent.statement[i].en_cours_de_traitement=false;
                                        parent.statement[i].traite=true;
                                        return({"__xst" : __xsu ,"__xva" : t});
                                    }else if(parent.statement[i].type === 'statement'
                                           && parent.statement[i].variant === 'transaction'
                                           && parent.statement[i].action === 'rollback'
                                    ){
                                        /*
                                          fin de transaction par un rollback
                                        */
                                        t+='\n' + esp0 + ')';
                                        t+='\n' + esp0 + 'rollback()';
                                        parent.statement[i].en_cours_de_traitement=false;
                                        parent.statement[i].traite=true;
                                        return({"__xst" : __xsu ,"__xva" : t});
                                    }else{
                                        /*
                                          autres éléments, on continue
                                        */
                                        var obj1=this.#traite_ast( parent.statement[i] , niveau + 1 , parent , {} );
                                        parent.statement[i].en_cours_de_traitement=false;
                                        parent.statement[i].traite=true;
                                        if(obj1.__xst === __xsu){
                                            t+=obj1.__xva;
                                        }else{
                                            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'transaction'} ));
                                        }
                                    }
                                }
                            }
                            t+='\n' + esp0 + ')';
                            break;
                            
                        case 'commit' : t+='\ncommit()';
                            break;
                        case 'rollback' : t+='\nrollback()';
                            break;
                        default:
                            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'transaction action inconnue = "' + element.action + '" '} ));
                            
                    }
                    break;
                    
                default:
                    return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'variant = "' + element.variant + '" non traité ' ,"element" : element} ));
                    
            }
        }else{
            return(this.#astsql_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'element.type = "' + element.type + '" non traité '} ));
        }
        element.en_cours_de_traitement=false;
        element.traite=true;
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    traite_ast_de_sqliteparseur( ast_de_sqlite , options_traitement ){
        let t='';
        let obj=this.#traite_ast( ast_de_sqlite , 0 , options_traitement );
        if(obj.__xst === __xsu){
            t=obj.__xva;
            return({"__xst" : __xsu ,"__xva" : t});
        }else{
            return(this.#astsql_le( {"__xst" : __xsu ,"__me" : __m_rev1.nl2() + 'erreur de convertion'} ));
        }
    }
    /*
      =============================================================================================================
    */
}
export{c_astsqliteparseur_vers_rev1 as c_astsqliteparseur_vers_rev1};