
/*
  première ligne
*/
/*
  =====================================================================================================================
  supprime les messages de la zone global_messages et efface la zone de texte qui contient les message
  =====================================================================================================================
*/
function clearMessages(nomZone){
    /*
      =====================================================
      on essaie de supprimer la zone message si elle existe
      ===================================================== 
    */
    try{
        document.getElementById(nomZone).innerHTML='';
    }catch(e){
        /*rien*/
    }
    global_messages={'errors':[],'warnings':[],'infos':[],'lines':[],'tabs':[],'ids':[],'calls':'','data':{'matrice':[],'tableau':[],'sourceGenere':''}};
}
/*
  dernière ligne
*/