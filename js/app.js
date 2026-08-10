window.BNM = window.BNM || {};
BNM.sections=["home","questionnaire","loading","results","browse"];

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
  let ranked=[],index=0;
  function render(){
    const holder=document.getElementById("resultCard");
    holder.innerHTML="";
    holder.appendChild(BNM.createActivityCard(ranked[index],{
      showMatch:true,
      resultCard:true,
      onAnother:()=>{index=(index+1)%ranked.length;render();}
    }));
  }
  function show(list){
    ranked=list;index=0;document.querySelector(".results-head h1").textContent=BNM.copy.pick(BNM.copy.resultHeads);render();BNM.show("results");
  }
  return {show};
})();

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("startHero").addEventListener("click",BNM.questionnaire.start);
  document.getElementById("startNav").addEventListener("click",BNM.questionnaire.start);
  document.getElementById("browseStart").addEventListener("click",BNM.questionnaire.start);
  document.getElementById("browseHero").addEventListener("click",BNM.browse.open);
  document.getElementById("browseNav").addEventListener("click",BNM.browse.open);
  document.getElementById("logoHome").addEventListener("click",()=>BNM.show("home"));
  document.getElementById("backQuestion").addEventListener("click",BNM.questionnaire.back);
  BNM.browse.init();

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape")BNM.show("home");
    if(event.key==="Enter"&&!document.getElementById("home").classList.contains("hidden"))BNM.questionnaire.start();
  });
});
