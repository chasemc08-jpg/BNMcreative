window.BNM = window.BNM || {};

BNM.track = function(eventName, details={}){
  try{
    if(typeof window.clarity === "function"){
      window.clarity("event", eventName);
      Object.entries(details).forEach(([key,value])=>{
        window.clarity("set", `bnm_${key}`, String(value));
      });
    }
  }catch(e){}
};

BNM.adventure = (function(){
  let current=null;

  const departureTitles = [
    "Go make a memory.",
    "Alright. Phone down — you're up.",
    "This is your sign to actually go do it.",
    "Your next story starts now."
  ];

  const departureCopies = [
    "We'll be right here when you get back.",
    "No more browsing. Go have the fun part.",
    "Your phone did its job. The rest is up to you.",
    "Close the tab when you're ready. BNM isn't going anywhere."
  ];

  const ratingResponses = {
    1:["Fair enough 😭 We'll do better next time.","Okay... definitely not making the favorites list."],
    2:["Not every adventure is a winner. We respect it.","Could've been better. Noted."],
    3:["Solid. Not life-changing, but solid.","A respectable little adventure."],
    4:["Okayyy, now we're talking.","That's the kind of rating we like to see."],
    5:["YES. That's what BNM is for.","Now that's a memory worth making."]
  };

  function pick(list){ return list[Math.floor(Math.random()*list.length)]; }

  function start(activity){
    current=activity;
    BNM.storage.setCurrentAdventure(activity);
    document.getElementById("departureTitle").textContent=pick(departureTitles);
    document.getElementById("departureCopy").textContent=pick(departureCopies);
    document.getElementById("departureActivity").innerHTML=`<span>${activity.emoji}</span><strong>${activity.name}</strong><small>${BNM.formatMinutes(activity.minutes)} · ${BNM.costLabel(activity.cost)}</small>`;
    BNM.track("adventure_started",{activity:activity.id});
    BNM.show("departure");
  }

  function complete(){
    if(!current)return;
    document.getElementById("completeTitle").textContent=`How was ${current.name}?`;
    document.getElementById("ratingResponse").textContent="";
    document.getElementById("finishComplete").classList.add("hidden");
    document.querySelectorAll("#ratingStars button").forEach(btn=>btn.classList.remove("selected"));
    BNM.track("adventure_completed",{activity:current.id});
    BNM.show("complete");
  }

  function rate(rating){
    if(!current)return;
    BNM.storage.saveRating(current.id,rating);
    document.querySelectorAll("#ratingStars button").forEach(btn=>{
      btn.classList.toggle("selected",Number(btn.dataset.rating)<=rating);
    });
    document.getElementById("ratingResponse").textContent=pick(ratingResponses[rating]);
    document.getElementById("finishComplete").classList.remove("hidden");
    BNM.storage.clearCurrentAdventure();
  }

  function surprise(){
    const shuffled=[...BNM_ACTIVITIES].sort(()=>Math.random()-.5);
    const pool=shuffled.map(activity=>({...activity,match:Math.floor(Math.random()*8)+90,reasons:["was chosen completely at random"]}));
    BNM.track("surprise_me",{activity:pool[0].id});
    BNM.results.show(pool,{surprise:true});
  }

  return {start,complete,rate,surprise};
})();
