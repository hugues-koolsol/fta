/*
  node convertir_un_module.js fichier_en_entree.js fichier_en_sortie.js
*/
let fichier_a_parser='';
process.argv.forEach(function(val,index,array){
        if(index === 2){
            fichier_a_parser=val;
        }
        if(index === 3){
            fichier_ast=val;
        }
        if(index === 4){
            fichier_commentaire=val;
        }
    });
const fs=require('node:fs');
let contenu_du_fichier='';
try{
    contenu_du_fichier=fs.readFileSync(fichier_a_parser,'utf8');
}catch(err){
    console.error(err);
}
let tableau_des_commentaires=[];
let acorn=require("acorn");
let ast=acorn.parse(contenu_du_fichier,{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tableau_des_commentaires});
const contenu_ast=JSON.stringify(ast);
try{
    fs.writeFileSync(fichier_ast,contenu_ast);
}catch(err){
    console.error(err);
}
const contenu_commentaire=JSON.stringify(tableau_des_commentaires);
try{
    fs.writeFileSync(fichier_commentaire,contenu_commentaire);
}catch(err){
    console.error(err);
}