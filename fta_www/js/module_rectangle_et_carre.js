
class classe_locale {
    affiche_un_message(le_message){
        console.log('dans module_rectangle_et_carre.js, message=',le_message);
    } 
}
class Rectangle {
    #hauteur=0;
    #largeur=0;
    constructor(hauteur, largeur){
        this.#hauteur = hauteur;
        this.#largeur = largeur;
        var a=new classe_locale();
        a.affiche_un_message('on définit un rectangle qui est peut être un carré');
    }
    get hauteur() {
        return this.#hauteur;
    }
    get largeur() {
        return this.#largeur;
    }
    set hauteur(nouvelle_hauteur){
        this.#hauteur=nouvelle_hauteur;
    }
    get surface() {
        return this.#calcul_de_la_surface();
    }
    transforme_en_carre() {
        var nouvelle_taille=(this.#hauteur+this.#largeur)/2;
        this.#hauteur=nouvelle_taille;
        this.#largeur=nouvelle_taille;
    }
    #calcul_de_la_surface() {
        return this.#largeur * this.#hauteur;
    }
}

class Carre extends Rectangle {
 
  constructor(hauteur_et_largeur){
    if(hauteur_et_largeur === undefined){
     throw new Error('vous devez donner une taille pour un carré');
    }
    console.log('hauteur_et_largeur=',hauteur_et_largeur);
    super(hauteur_et_largeur , hauteur_et_largeur );
  }
  set changet_la_taille(hauteur_et_largeur){
   super.transforme_en_carre();
  }
  get hauteur() {
    return 'c\'est un carré de '+super.hauteur+'x'+super.largeur;
  }
  
  get taille() {
    return 'la taille du carré est '+super.hauteur;
  }
  
}
export {Rectangle , Carre };
