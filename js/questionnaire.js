window.BNM = window.BNM || {};

BNM.questionnaire = (function(){
  const baseQuestions = [
    {key:"people",label:"Who's coming?",title:"How many people are joining?",options:[["1","Just me"],["2","Me + one"],["4","A small crew"],["7","The whole group"]]},
    {key:"time",label:"Your window",title:"How much time are we working with?",options:[["45","Keep it under 45 minutes"],["75","Around an hour"],["120","Give me a couple hours"],["180","We've got time"]]},
    {key:"setting",label:"The scene",title:"Where sounds better right now?",options:[["indoor","Stay inside"],["outdoor","Get me outside"],["either","Surprise me"]]},
    {key:"cost",label:"The budget",title:"How much are you trying to spend?",options:[["free","Absolutely nothing"],["low","A little is fine"],["medium","Worth spending for"]]},
    {key:"energy",label:"The energy check",title:"Be honest — what's the energy level?",options:[["low","Keep it chill"],["medium","Something balanced"],["high","Let's actually move"]]},
    {key:"mood",label:"The vibe",title:"What kind of fun are you after?",options:[["social","Something social"],["creative","Make something"],["competitive","Bring on a challenge"],["relaxing","Slow it down"],["adventure","Something different"],["food","Food is involved"],["productive","Useful but fun"],["active","Get moving"]]}
  ];
  let questions=[], index=0, answers={};

  function buildPath(){
    questions=[...baseQuestions];
    if(answers.people==="1") questions[5]={...questions[5],title:"What sounds good for a solo reset?",options:questions[5].options.filter(x=>!["social","competitive"].includes(x[0]))};
    if(answers.setting==="outdoor") questions[5]={...questions[5],title:"What kind of outdoor mood are you chasing?"};
    if(answers.setting==="indoor") questions[5]={...questions[5],title:"What kind of indoor night sounds right?"};
  }

  function render(){
    buildPath();
    const q=questions[index];
    const percent=Math.round((index/questions.length)*100);
    document.getElementById("questionPercent").textContent=`${percent}% Complete`;
    document.getElementById("questionLabel").textContent=q.label;
    document.getElementById("progressFill").style.width=`${percent}%`;
    document.getElementById("questionTitle").textContent=q.title;
    document.getElementById("backQuestion").disabled=index===0;
    const holder=document.getElementById("options");
    holder.innerHTML="";
    q.options.forEach(([value,label])=>{
      const button=document.createElement("button");
      button.className="option"+(answers[q.key]===value?" selected":"");
      button.textContent=label;
      button.addEventListener("click",()=>{
        answers[q.key]=value;
        BNM.track("question_answered",{question:q.key,answer:value});
        button.classList.add("selected");
        setTimeout(()=>{
          if(index<questions.length-1){index++;render();}
          else finish();
        },220);
      });
      holder.appendChild(button);
    });
  }

  function start(){ index=0; answers={}; buildPath(); BNM.track("questionnaire_started"); BNM.show("questionnaire"); render(); }
  function back(){ if(index>0){index--;render();} }
  function finish(){
    document.getElementById("progressFill").style.width="100%";
    document.getElementById("questionPercent").textContent="100% Complete";
    BNM.show("loading");
    const messages=[...BNM.copy.loading,"Alright — we've got it."];
    document.querySelectorAll(".check").forEach(x=>x.classList.remove("done"));
    messages.slice(0,5).forEach((m,i)=>setTimeout(()=>document.getElementById("loadingMessage").textContent=m,i*360));
    document.querySelectorAll(".check").forEach((x,i)=>setTimeout(()=>x.classList.add("done"),300+i*270));
    BNM.track("questionnaire_completed");
    setTimeout(()=>BNM.results.show(BNM.rankActivities(answers)),1900);
  }
  return {start,back,getAnswers:()=>({...answers})};
})();
