<script>
function factorielle(nombre){
  var a=0;
  var b=0;
  if((nombre == 0)){
     a=1;
     return a;
  }else{
     b=factorielle(nombre-1);
     a=nombre*b;
     return a;
  }
}
var valeur=5;
valeur=factorielle(valeur);
alert(valeur);
</script>