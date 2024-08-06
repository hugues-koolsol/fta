import('./module_requete_sql.js').then(
    function(Module){
        __module_requete_sql1=new Module.requete_sql('__module_requete_sql1' , 'div_de_travail' );
        __module_requete_sql1.initialisation();
    }
);
