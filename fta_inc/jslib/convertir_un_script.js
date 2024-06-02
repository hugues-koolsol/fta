/*
node convertir_un_script.js fichier_en_entree.js fichier_en_sortie.js
*/

let fichier_a_parser='';
process.argv.forEach(function (val, index, array) {
  if(index===2){
   fichier_a_parser=val;
  }
  if(index===3){
   fichier_en_sortie=val;
  }
});

const fs = require('node:fs');

let contenu_du_fichier='';
try {
  contenu_du_fichier = fs.readFileSync(fichier_a_parser, 'utf8');
} catch (err) {
}

let acorn = require("acorn");
let ast=acorn.parse(contenu_du_fichier, {ecmaVersion: 'latest' , sourceType:'script'});


const contenu = JSON.stringify(ast);
try {
  fs.writeFileSync(fichier_en_sortie, contenu);
} catch (err) {
  console.error(err);
}
