
/*
  première ligne
*/
"use strict";
var global_editeur_derniere_valeur_selecStart=0;
var global_editeur_derniere_valeur_selectEnd=0;
var global_editeur_debut_texte='';
var global_editeur_fin_texte='';
var global_editeur_debut_texte_tab=[];
var global_editeur_scrolltop=0;
function sauvegardeTexteSource(){
    var i=0;
    var c='';
    var obj={};
    if((document.getElementById('sauvegarderLeNormalise').getAttribute('data-fichiertexte') != '')){
        var nomDuSource= document.getElementById('nomDuSource').value;
        for(i=0;(i < nomDuSource.length);i=i+1){
            c=nomDuSource.substr(i,1);
            if((c == '/') || c == '\\' || c == ':' || c == '*' || c == '?' || c == '"' || c == '<' || c == '>' || c == '|'){
                alert('Le caractère "'+c+'" n\'est pas autorisé ( tout comme /\\:*?"<>|');
                return;
            }else{
                if( !((c.charCodeAt(0) >= 32) && c.charCodeAt(0) < 127)){
                    alert('Le caractère "'+c+'" n\'est pas autorisé ( tout comme /\\:*?"<>|');
                    return;
                }
            }
        }
        obj=writeRevFile(nomDuSource,document.getElementById('normalise').value);
    }
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    document.getElementById('nomDuSource').disabled=true;
}
function decaler(direction){
    parentheses();
    if((global_editeur_derniere_valeur_selecStart < global_editeur_derniere_valeur_selectEnd)){
        console.log(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd);
        var zoneSource= document.getElementById('zonesource');
        var texteDebut= zoneSource[value].substr(0,global_editeur_derniere_valeur_selecStart);
        console.log('"'+texteDebut+'"');
        var texteFin= zoneSource[value].substr(global_editeur_derniere_valeur_selectEnd);
        console.log('"'+texteFin+'"');
        var texteSelectionne= zoneSource[value].substr(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd-global_editeur_derniere_valeur_selecStart);
        var tab= texteSelectionne.split('\n');
        var i=0;
        for(i=0;(i < tab.length);i=i+1){
            if((tab[i].length > 0)){
                tab[i]='  '+tab[i];
            }
        }
        var nouveauTexteDecale= tab.join('\n');
        texteDebut+nouveauTexteDecale+texteFin;
        zoneSource.value=nouveauTexte;
        zoneSource.select();
        zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
    }
}
/*
  dernière ligne
*/