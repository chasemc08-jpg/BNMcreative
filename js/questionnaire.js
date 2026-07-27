window.BNM = window.BNM || {};

BNM.questionnaire = (function(){
  const questions = [
    {key:"people",label:"Group size",title:"How many people are joining?",options:[["1","Just me"],["2","2 people"],["4","3–5 people"],["7","6+ people"]]},
    {key:"time",label:"Time available",title:"How much time do you have?",options:[["45","45 minutes or less"],["75","Around an hour"],["120","Around two hours"],["180","A few hours"]]},
    {key:"setting",label:"Setting",title:"Where do you want to be?",options:[["indoor","Indoors"],["outdoor","Outdoors"],["either","Either works"]]},
    {key:"cost",label:"Budget",title:"How much do you want to spend?",options:[["free","Nothing"],["low","A little"],["medium","A moderate amount"]]},
    {key:"energy",label:"Energy",title:"How much energy do you have?",options:[["low","Keep it chill"],["medium","Something balanced"],["high","Let's move"]]},
    {key:"mood",label:"Mood",title:"What kind of activity sounds best?",options:[["social","Social"],["creative","Creative"],["competitive","Competitive"],["relaxing","Relaxing"],["adventure","Adventurous"],["food","Food-related"],["productive","Productive"],["active","Active"]]}
  ];
  let index=0;
  const answers={};

  function render(){
    const q=questions[index];
    document.getElementById("questionNumber").textContent=`Question ${index+1} of ${questions.length}`;
    document.getElementById("questionLabel").textContent=q.label;
    document.getElementById("progressFill").style.width=`${((index+1)/questions.length)*100}%`;
    document.getElementById("questionTitle").textContent=q.title;
    document.getElementById("backQuestion").disabled=index===0;
    document.getElementById("nextQuestion").textContent=index===questions.length-1?"Find my match →":"Next →";
    document.getElementById("nextQuestion").disabled=!answers[q.key];

    const holder=document.getElementById("options");
    holder.innerHTML="";
    q.options.forEach(([value,label])=>{
      const button=document.createElement("button");
      button.className="option"+(answers[q.key]===value?" selected":"");
      button.textContent=label;
      button.addEventListener("click",()=>{
        answers[q.key]=value;
        render();
        setTimeout(()=>{
          if(index<questions.length-1){index++;render();}
          else finish();
        },190);
      });
      holder.appendChild(button);
    });
  }

  function start(){
    index=0;
    BNM.show("questionnaire");
    render();
  }

  function next(){
    if(!answers[questions[index].key])return;
    if(index<questions.length-1){index++;render();}
    else finish();
  }

  function back(){
    if(index>0){index--;render();}
  }

  function finish(){
    BNM.show("loading");
    const messages=["Reading your answers...","Comparing activity styles...","Checking time and budget...","Ranking the best matches...","Your adventure is ready."];
    document.querySelectorAll(".check").forEach(x=>x.classList.remove("done"));
    messages.forEach((m,i)=>setTimeout(()=>document.getElementById("loadingMessage").textContent=m,i*360));
    document.querySelectorAll(".check").forEach((x,i)=>setTimeout(()=>x.classList.add("done"),300+i*270));
    setTimeout(()=>BNM.results.show(BNM.rankActivities(answers)),1900);
  }

  return {start,next,back,getAnswers:()=>({...answers})};
})();
