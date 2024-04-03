
/*
  f(y,z(i,j).k,w).g.h(a,b)
*/
function concat(){
    var t='';
    var a={};
    for(a in arguments){
        t+=String(arguments[a]);
    }
    return t;
}
/*
  affectop('+=' , i , 1),
  affectop('+=' , a , appelf(n(d.g) , p(a) , prop(v)))
  affectop('+=' , appelf(n(d.g) , p(a) , prop(v)) , a),
  affectop('+=' , appelf(n(d.g) , p(a) , prop(v)) , 0)
  affectop('+=' , appelf(n(d.g) , p(a) , prop(v)) , appelf(n(d.g) , p(a) , prop(v)))
*/
a+=a < 1;