window.BNM = window.BNM || {};

BNM.formatMinutes = function(minutes){
  if(minutes < 60) return `${minutes} min`;
  if(minutes === 60) return "1 hr";
  if(minutes % 60 === 0) return `${minutes/60} hrs`;
  return `${Math.floor(minutes/60)} hr ${minutes%60} min`;
};

BNM.costLabel = function(cost){
  return ({free:"Free",low:"Low cost",medium:"Medium cost"})[cost] || cost;
};

BNM.energyLabel = function(energy){
  return energy.charAt(0).toUpperCase()+energy.slice(1);
};

BNM.scoreActivity = function(activity, answers){
  let score = 50;
  const reasons = [];

  if(answers.people){
    const count = Number(answers.people);
    if(count >= activity.people.min && count <= activity.people.max){
      score += 16; reasons.push(`works for ${count} ${count===1?"person":"people"}`);
    } else {
      score -= 14;
    }
  }

  if(answers.time){
    const available = Number(answers.time);
    if(activity.minutes <= available){
      score += 12; reasons.push(`fits your ${BNM.formatMinutes(available)} window`);
      if(activity.minutes >= available * .55) score += 3;
    } else score -= Math.min(20, Math.round((activity.minutes-available)/8));
  }

  if(answers.cost){
    const order = {free:0,low:1,medium:2};
    if(order[activity.cost] <= order[answers.cost]){
      score += 11; reasons.push(activity.cost==="free" ? "costs nothing" : "fits your budget");
    } else score -= 16;
  }

  if(answers.energy){
    if(activity.energy === answers.energy){
      score += 12; reasons.push(`matches your ${answers.energy} energy`);
    } else {
      const e = {low:0,medium:1,high:2};
      score -= Math.abs(e[activity.energy]-e[answers.energy]) * 6;
    }
  }

  if(answers.setting && answers.setting !== "either"){
    if(activity.setting.includes(answers.setting)){
      score += 10; reasons.push(`can be done ${answers.setting}`);
    } else score -= 15;
  }

  if(answers.mood){
    if(activity.moods.includes(answers.mood)){
      score += 14; reasons.push(`fits a ${answers.mood} mood`);
    } else if(activity.moods.some(m=>["social","creative","active","relaxing","competitive","food","adventure","productive"].includes(m))){
      score += 1;
    }
  }

  score = Math.max(54, Math.min(99, score));
  return {score,reasons:reasons.slice(0,4)};
};

BNM.rankActivities = function(answers){
  return BNM_ACTIVITIES
    .map(activity=>{
      const result = BNM.scoreActivity(activity,answers);
      return {...activity,match:result.score,reasons:result.reasons};
    })
    .sort((a,b)=>b.match-a.match || a.minutes-b.minutes);
};
