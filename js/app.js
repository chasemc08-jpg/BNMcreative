window.BNM = window.BNM || {};
BNM.sections=["home","questionnaire","loading","results","browse","favorites","departure","complete","gaming","quickSetup"];

BNM.show=function(id){
  BNM.sections.forEach(section=>{
    const el=document.getElementById(section);
    const active=section===id;
    el.classList.toggle("hidden",!active);
    el.classList.toggle("page",active);
  });
  window.scrollTo({top:0,behavior:"smooth"});
};

BNM.results=(function(){
  let ranked=[],index=0,surpriseMode=false;
  function render(){
    const holder=document.getElementById("resultCard");
    holder.innerHTML="";
    holder.appendChild(BNM.createActivityCard(ranked[index],{
      showMatch:!surpriseMode,
      resultCard:true,
      onAnother:()=>{index=(index+1)%ranked.length;render();}
    }));
  }
  function show(list,options={}){
    ranked=list;index=0;surpriseMode=Boolean(options.surprise);
    document.querySelector(".results-head .eyebrow").textContent=surpriseMode?"No overthinking allowed":"Your best match";
    document.querySelector(".results-head h1").textContent=surpriseMode?BNM.copy.pick(["We picked this one for you.","No choices. Just go with it.","Okay — here's your move."]):BNM.copy.pick(BNM.copy.resultHeads);
    document.querySelector(".results-head p").textContent=surpriseMode?"Completely random. Sometimes that's exactly what you need.":"Only the important information is shown first. Open details when you're ready.";
    render();BNM.show("results");
  }
  return {show};
})();


BNM.favorites=(function(){
  function refresh(){
    const grid=document.getElementById("favoriteGrid");
    if(!grid)return;
    const ids=BNM.storage.favorites();
    const activities=ids.map(id=>BNM_ACTIVITIES.find(a=>a.id===id)).filter(Boolean);
    document.getElementById("favoriteCount").textContent=activities.length
      ? BNM.copy.pick([`${activities.length} saved for a better day.`,`${activities.length} adventures waiting on you.`,`You saved ${activities.length}. Good taste.`])
      : "Nothing saved yet.";
    grid.innerHTML="";
    if(!activities.length){
      grid.innerHTML=`<div class="panel empty" style="grid-column:1/-1"><strong>Your favorites are looking lonely.</strong><p>Tap the ♡ on anything that makes you think “I wanna do that.”</p></div>`;
      return;
    }
    activities.forEach(a=>grid.appendChild(BNM.createActivityCard(a,{compact:true})));
  }
  function open(){refresh();BNM.track("favorites_open");BNM.show("favorites");}
  return {open,refresh};
})();

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("startHero").addEventListener("click",BNM.questionnaire.start);
  document.getElementById("startNav").addEventListener("click",BNM.questionnaire.start);
  document.getElementById("browseStart").addEventListener("click",BNM.questionnaire.start);
  document.getElementById("browseHero").addEventListener("click",BNM.browse.open);
  document.getElementById("browseNav").addEventListener("click",BNM.browse.open);
  document.getElementById("gamingHero").addEventListener("click",BNM.gaming.open);
  document.getElementById("gamingRandom").addEventListener("click",BNM.gaming.random);
  document.getElementById("gamingBack").addEventListener("click",()=>BNM.show("home"));
  document.getElementById("quickSetupBack").addEventListener("click",()=>BNM.show("browse"));
  document.getElementById("favoritesNav").addEventListener("click",BNM.favorites.open);
  document.getElementById("surpriseHero").addEventListener("click",BNM.adventure.surprise);
  document.getElementById("surpriseBrowse").addEventListener("click",BNM.adventure.surprise);
  document.getElementById("favoritesMatch").addEventListener("click",BNM.questionnaire.start);
  document.getElementById("cameBackButton").addEventListener("click",BNM.adventure.complete);
  document.getElementById("departureHome").addEventListener("click",()=>BNM.show("home"));
  document.getElementById("finishComplete").addEventListener("click",()=>BNM.show("home"));
  document.querySelectorAll("#ratingStars button").forEach(button=>button.addEventListener("click",()=>BNM.adventure.rate(Number(button.dataset.rating))));
  document.getElementById("logoHome").addEventListener("click",()=>BNM.show("home"));
  document.getElementById("backQuestion").addEventListener("click",BNM.questionnaire.back);
  BNM.browse.init();

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape")BNM.show("home");
    if(event.key==="Enter"&&!document.getElementById("home").classList.contains("hidden"))BNM.questionnaire.start();
  });
});
