window.addEventListener('load',function(){
    import('./module_svg_bdd.js').then(
        function(Module){
            __module_svg1=new Module.module_svg_bdd('__module_svg1' , 'div_svg1' , CSS_TAILLE_REFERENCE_BORDER , 'donnees_travail');
        }
    );
});
