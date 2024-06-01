
class classe_locale {
 
 affiche_un_message(le_message){
  console.log('dans module_cercle.js, message=',le_message);
 }
 
}


class Cercle {
 
  #rayon=0;
  constructor(rayon){
    this.#rayon = rayon;
    var a=new classe_locale();
    a.affiche_un_message('on définit un cercle qui n\'est certainement pas un carré');
  }

  get rayon() {
    return this.#rayon;
  }

  set rayon(nouveau_rayon){
   this.#rayon=nouveau_rayon;
  }

  get surface() {
    return this.#calcul_de_la_surface();
  }


  #calcul_de_la_surface() {
    return this.#rayon * this.#rayon * Math.PI;
  }
}

export { Cercle };
