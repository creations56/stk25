// initialisation des variables

let titreBouton='',
  entreeEnCours=false,
	position=1, // position entree d'un nombre
  dern='', // dernier caractere entré
  avDern='' // avant dernier caractere entré
  numerique='1234567890', // les caracteres numeriques
  bigNumber=1E10, // gestion imprecision calcul Math.tan
  maxNumber=9.99999999E99 // chiffre max affiché
  espace=String.fromCharCode(160), //&nsp
  fleche=String.fromCharCode(8594),
  retLigne=String.fromCharCode(10),
  pile0=0, // valeurs numerique pile et mem
  pile1=0,
  pile2=0,
  mem=0,
  fixsci='FIX', // pour affichage des nombres
  decimales=2 ,
  degrad='DEG',
  warning='',
  results='\n', // ?
  listOpe=[], // ?
  ope=[], // ?
  posentree='vide',
  entree='',// affichage de l'entree
  listWarning=['large number, SCI mode set','unvalid operation','unvalid operation'];

// lecture des affichages et des boutons

aInput = document.getElementById('ainput'); 
aInfo = document.getElementById('ainfo'); 
aResults=document.getElementById('aresults'); // ?
aPile0 = document.getElementById('apile0'); 
aPile1 = document.getElementById('apile1'); 
aPile2 = document.getElementById('apile2'); 
aMem = document.getElementById('amem'); 
eInfo = document.getElementById('einfo');

document.querySelectorAll('.bblanc').forEach(item => {
  item.addEventListener('click', event => {    
    const {target} = event;
	titreBouton=target.textContent;
	boutonBlanc(titreBouton);
  })
});

document.querySelectorAll('.bgris').forEach(item => {
  item.addEventListener('click', event => {    
    const {target} = event;
	titreBouton=target.textContent;
	boutonGris(titreBouton);
  })
});

document.querySelectorAll('.bbleu').forEach(item => {
  item.addEventListener('click', event => {    
    const {target} = event;
	titreBouton=target.textContent;
	boutonBleu(titreBouton);
  })
});

// fonctions

function fUp(){ // decale pile vers le haut
  pile2=pile1;
  pile1=pile0;
  pile0=0;
} // fin function fUp

function fDown(){ //decale pile vers le bas
  pile0=pile1;
  pile1=pile2;
  pile2=0;
}

function fEnter(){ // si entree = '' la touche ENTER est inactive
  if (entree!==''){ pile0=parseFloat(entree);entree='';}
  else {return}
}

function affichageInfo(){
  // mise a jour affichage info
  // le texte est affiche en rouge si warning
  adegrad.textContent=degrad;
  afixsci.textContent=fixsci;
  adplusmoins.textContent=decimales;
  aInfo.textContent=warning;
  if (warning!==''){warning='';}
}

function affichageResults(x){
  // fonction desactivee pour cette version
}

function affichagePile(){
  l0=pile0.toFixed(decimales).length;// eval longueur max affichage
  l1=pile1.toFixed(decimales).length;// si sup 16 caracteres
  l2=pile2.toFixed(decimales).length;// passage
  lmem=mem.toFixed(decimales).length;// en SCI
  lmax=Math.max(l0,l1,l2,lmem);
  if ((fixsci==='FIX')&&(lmax>16)) {fixsci='SCI';warning=listWarning[0]}
  
  if (fixsci==='FIX'){
    aPile0.textContent=pile0.toFixed(decimales);
    aPile1.textContent=pile1.toFixed(decimales);
    aPile2.textContent=pile2.toFixed(decimales);
    aMem.textContent=mem.toFixed(decimales);
  }
  else{
    aPile0.textContent=pile0.toExponential(decimales);
    aPile1.textContent=pile1.toExponential(decimales);
    aPile2.textContent=pile2.toExponential(decimales);
    aMem.textContent=mem.toExponential(decimales);
  }
  affichageInfo();
}

function affichageInput(z){
  // afficha de x en mode entree
  if (z===''){fDown();affichagePile()} // si entree '' sortie mode entree
  else {apile0.textContent=z+'_';}
}

function testposentree(z){ // evalue posentree en fonction de entree
  dern=z.substr(-1,1); // dernier caractere
  avDern=z.substr(-2,1); // avant dernier caractere
  if (z.includes('E')===true){posentree='exp'}
  else if (z.includes('.')===true) {posentree='dec'}
  else if (z.length===0) {posentree='vide'}
  else {posentree='ent'}
  if (posentree==='ent') {
    if (dern==='-') {posentree='ent1'}
    else {posentree='ent2'}
  }
  if (posentree==='exp'){
    if (dern==='E') {posentree='exp1'}
    else if (dern==='-') {posentree='exp2'}
    else if (numerique.includes(avDern)===true){posentree='full'}
    else {posentree='exp3'}
  }
  if (z.length>14) {posentree='full'} // 15 caracteres 
}

function boutonBlanc(x) {
  // gestion des touches blanches , entree d'un nombre
  //affichageInfo(); // mise a jour des messages si touche appuyee
  testposentree(entree); // valeur de posentree
  xde0a9=numerique.includes(x); // x est un nombre si true
  
  if (posentree==='full'){// nombre digits plein seuls AC et C sont possibles
    if (x==='AC'){entree=''}
    if (x==='C'){entree=entree.substr(0,entree.length-1)}
    affichageInput(entree);
    return;}
  if (posentree==='vide'){ // premier digit, C et AC interdits
    if (xde0a9===true) {entree=x}
    if (x==='-') {entree=x}
    if (x==='.') {entree='0.'}
    if (x==='E') {entree='1.0E'}
    if (entree!==''){fUp();affichagePile()}// decalage de pile
    affichageInput(entree);
    return;} 
  if (posentree==='ent1') { // partie entiere apres signe -
    if (x==='AC'){entree=''}
    if (x==='C'){entree=entree.substr(0,entree.length-1)}
    if (x==='-') {return} // signe - uniquement en premiere position
    if (x==='.') {entree=entree+'0.'}
    if (x==='E') {entree=entree+'1.0E'}
    if (xde0a9===true) {entree=entree+x}
    affichageInput(entree);
    return;}
  if (posentree==='ent2') { // partie entiere apres signe -
    if (x==='AC'){entree=''}
    if (x==='C'){entree=entree.substr(0,entree.length-1)}
    if (x==='-') {return} // signe - uniquement en premiere position
    if (x==='.') {entree=entree+x}
    if (x==='E') {entree=entree+x}
    if (xde0a9===true) {entree=entree+x}
    affichageInput(entree);
    return;}
  if (posentree==='dec'){ // partie decimale
    if (x==='AC'){entree=''}
    if (x==='C'){entree=entree.substr(0,entree.length-1)}
    if (x==='-') {return} // signe - uniquement en premiere position
    if (x==='.') {return}
    if (x==='E') {entree=entree+x}
    if (xde0a9===true) {entree=entree+x}
    affichageInput(entree);
    return;}
  if (posentree==='exp1') { // premier digit de l exposant
    if (x==='AC'){entree=''}
    if (x==='C'){entree=entree.substr(0,entree.length-1)}
    if (x==='-') {entree=entree+x}
    if (x==='.') {return}
    if (x==='E') {return}
    if (xde0a9===true) {entree=entree+x}
    affichageInput(entree);
    return;}
  if (posentree==='exp2') { // deuxieme digit de l exposant
    if (x==='AC'){entree=''}
    if (x==='C'){entree=entree.substr(0,entree.length-1)}
    if (x==='-') {return}
    if (x==='.') {return}
    if (x==='E') {return}
    if (xde0a9===true) {entree=entree+x}
    affichageInput(entree);
    return;}
  if (posentree==='exp3'){ // troisieme digit de l exposant
    if (x==='AC'){entree=''}
    if (x==='C'){entree=entree.substr(0,entree.length-1)}
    if (x==='-') {return}
    if (x==='.') {return}
    if (x==='E') {return}
    if (xde0a9===true) {entree=entree+x}
    affichageInput(entree);
    return;}
  else {return}
} // fin de boutonBlanc
 
function boutonGris(x){
  // gestion des boutons gris, gestion pile et autres
  let flagR=true; // affichageResults
  let r=0;
  if (x==='ENTER'){fEnter();flagR=false};// fEnter affiche deja results
  if (x==='PI'){fEnter();fUp();pile0=Math.PI}
  if (x==='DROP'){fDown()}
  if (x==='DUP'){fUp();pile0=pile1}
  if (x==='STO'){fEnter();mem=pile0}
  //if (x==='RCL'){affichageInput('');fUp();pile0=mem}
  if (x==='RCL'){fEnter();fUp();pile0=mem}
  if (x==='SWAP'){r=pile0;pile0=pile1;pile1=r}
  if (x==='CSTK'){pile0=0;pile1=0;pile2=0;mem=0} 
  if (x==='DEG'){degrad='DEG'} 
  if (x==='RAD'){degrad='RAD'} 
  if (x==='FIX'){fixsci='FIX';flagR=false} 
  if (x==='SCI'){fixsci='SCI';flagR=false} 
  if (x==='D+'){if (decimales<8){decimales +=1};flagR=false} 
  if (x==='D-'){if (decimales>0){decimales -=1};flagR=false} 
  if (x==='CRST'){listOpe=[]} 
  affichagePile(); // attention affichage doit etre avant fResults cause fixsci
  if (flagR===true){affichageResults(x);}
} // fin de boutonGris

function boutonBleu(x){
  // gestion des touches bleus, calculs
  let flagR=true; // affichageResults
  let r=0; // valeur intermediaire
  if (x==='/'){
    fEnter();
    r=pile1/pile0;
    if (isNaN(r)) {warning=listWarning[1];flagR=false}
    else if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile1=r;fDown()}
    }
  if (x==='x'){fEnter();pile1=pile1*pile0;fDown()}
  if (x==='-'){fEnter();pile1=pile1-pile0;fDown()}
  if (x==='+'){fEnter();pile1=pile1+pile0;fDown()}
  if (x==='CHS'){fEnter();pile0=-pile0}
  if (x==='INV'){
    fEnter();
    r=1/pile0;
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile0=r}
  }
  if (x==='ASIN'){
    fEnter();
    r=Math.asin(pile0); // en radians
    if (isNaN(r)) {warning=listWarning[2];flagR=false} // val sup a 1 ou inf a -1
    else {if (degrad==='DEG'){r=r/Math.PI*180}; pile0=r}
    }
  if (x==='ACOS'){
    fEnter();
    r=Math.acos(pile0); // en radians
    if (isNaN(r)) {warning=listWarning[1];flagR=false} // val sup a 1 ou inf a -1
    else {if (degrad==='DEG'){r=r/Math.PI*180}; pile0=r}
  }
  if (x==='ATAN'){
    fEnter();
    r=Math.atan(pile0); // en radians
    if (degrad==='DEG'){r=r/Math.PI*180};
    pile0=r;
  }
  if (x==='SIN'){
    fEnter();
    if (degrad==='DEG'){r=pile0/180*Math.PI}
    else {r=pile0}
    pile0=Math.sin(r); //  r en radians
  }
  if (x==='COS'){
    fEnter();
    if (degrad==='DEG'){r=pile0/180*Math.PI}
    else {r=pile0}
    pile0=Math.cos(r); //  r en radians
  }
  if (x==='TAN'){
    fEnter();
    if (degrad==='DEG'){r=pile0/180*Math.PI}
    else {r=pile0} 
    r=Math.tan(r);
    if ((Math.abs(r)>maxNumber)||(Math.abs(r)>bigNumber)) {warning=listWarning[2];flagR=false} // gestion imprecision Math.tan
    else {pile0=r}
  }
  if (x==='PWR'){
    fEnter();
    r=Math.pow(pile0,pile1);
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile1=r;fDown()}
  }
  if (x==='EXP'){
    fEnter();
    r=Math.exp(pile0);
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile0=r}
  }
  if (x==='X2'){
    fEnter();
    r=pile0*pile0;
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false}
    else {pile0=r}
  }
  if (x==='LOG'){
    fEnter();
    r=Math.log10(pile0);
    if (isNaN(r)) {warning=listWarning[1];flagR=false} // val negative
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false} // val 0
    else {pile0=r}
  }
  if (x==='LN'){
    fEnter();
    r=Math.log(pile0);
    if (isNaN(r)) {warning=listWarning[1];flagR=false} // val negative
    if (Math.abs(r)>maxNumber) {warning=listWarning[2];flagR=false} // val 0
    else {pile0=r}
  }
  if (x==='SQRT'){
    fEnter();
    r=Math.sqrt(pile0);
    if (isNaN(r)) {warning=listWarning[1];flagR=false} // val negative
    else {pile0=r}
  }
  
  affichagePile(); // attention affichage doit etre avant fResults cause fixsci
  if (flagR===true){affichageResults(x);}
} // fin de boutonGris

// lancement du script

affichagePile();
// affichageResults('INIT');
  
