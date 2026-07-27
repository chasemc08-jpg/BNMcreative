window.BNM = window.BNM || {};

BNM.browse = (function(){
  const state={setting:"all",cost:"all",energy:"all",time:"all"};
  const groups=[
    {key:"setting",label:"Where",items:[["all","Anywhere"],["indoor","Inside"],["outdoor","Outside"]]},
    {key:"cost",label:"Budget",items:[["all","Any budget"],["free","Free"],["low","Low cost"],["medium","Worth spending"]]},
    {key:"energy",label:"Energy",items:[["all","Any energy"],["low","Chill"],["medium","Balanced"],["high","Let's move"]]},
    {key:"time",label:"Time",items:[["all","Any time"],["45","Under 45 min"],["75","Around an hour"],["120","Up to 2 hours"]]}
  ];
  const byId=id=>BNM_ACTIVITIES.find(a=>a.id===id);

  function renderFilters(){
    const wrap=document.getElementById("filterGroups"); wrap.innerHTML="";
    groups.forEach(group=>{
      const box=document.createElement("div"); box.className="filter-group";
      box.innerHTML=`<span class="filter-label">${group.label}</span>`;
      const pills=document.createElement("div"); pills.className="filter-pills";
      group.items.forEach(([value,label])=>{
        const b=document.createElement("button"); b.type="button"; b.className="filter-pill"+(state[group.key]===value?" active":""); b.textContent=label;
        b.onclick=()=>{state[group.key]=value;renderFilters();render();}; pills.appendChild(b);
      }); box.appendChild(pills); wrap.appendChild(box);
    });
  }

  function renderFeatured(){
    const track=document.getElementById("featuredTrack"); track.innerHTML="";
    BNM_FEATURED.picks.slice(0,4).forEach((pick,i)=>{
      const a=byId(pick.id); if(!a)return;
      const card=document.createElement("article"); card.className="featured-card"; card.style.setProperty("--delay",`${i*70}ms`);
      card.innerHTML=`<div class="featured-number">0${i+1}</div><div class="featured-badge">${pick.badge}</div><div class="featured-icon">${a.emoji}</div><h3>${a.name}</h3><p>${pick.kicker}</p><button class="text-link" type="button">Open adventure →</button>`;
      card.querySelector("button").onclick=()=>card.replaceWith(BNM.createActivityCard(a,{compact:false}));
      track.appendChild(card);
    });
    const s=BNM_FEATURED.spotlight,a=byId(s.id);
    document.getElementById("adventureSpotlight").innerHTML=`
      <div class="spotlight-copy"><div class="eyebrow">${s.label}</div><h2>${s.title}</h2><p class="spotlight-intro">${s.intro}</p><div class="spotlight-why"><span>Why it made the cover</span>${s.why}</div><button class="btn btn-primary" id="spotlightStart">See the full adventure →</button></div>
      <aside class="mission-note"><div class="mission-tape"></div><span>Bonus mission</span><strong>${s.bonus}</strong><p>${s.signoff}</p></aside>`;
    document.getElementById("spotlightStart").onclick=()=>{
      const section=document.getElementById("adventureSpotlight");
      section.classList.add("spotlight-expanded");
      section.innerHTML="";
      section.appendChild(BNM.createActivityCard(a,{compact:false}));
      section.scrollIntoView({behavior:"smooth",block:"start"});
    };
  }

  function render(){
    const search=document.getElementById("searchInput").value.trim().toLowerCase();
    const filtered=BNM_ACTIVITIES.filter(a=>{
      const text=[a.name,a.description,...a.moods,...a.supplies].join(" ").toLowerCase();
      return (!search || text.includes(search)) && (state.setting==="all"||a.setting.includes(state.setting)) && (state.cost==="all"||a.cost===state.cost) && (state.energy==="all"||a.energy===state.energy) && (state.time==="all"||a.minutes<=Number(state.time));
    });
    document.getElementById("resultCount").textContent=BNM.copy.counts(filtered.length,BNM_ACTIVITIES.length);
    const grid=document.getElementById("activityGrid"); grid.innerHTML="";
    if(!filtered.length){grid.innerHTML=`<div class="panel empty" style="grid-column:1/-1"><strong>Nothing clicked yet.</strong><p>${BNM.copy.pick(BNM.copy.empty)}</p></div>`;return;}
    filtered.forEach((a,i)=>{const card=BNM.createActivityCard(a,{compact:true});card.style.setProperty("--delay",`${Math.min(i,8)*45}ms`);grid.appendChild(card);});
  }
  function open(){BNM.show("browse");renderFeatured();renderFilters();render();}
  function init(){
    document.getElementById("searchInput").addEventListener("input",render);
    document.getElementById("clearFilters").addEventListener("click",()=>{Object.keys(state).forEach(k=>state[k]="all");document.getElementById("searchInput").value="";renderFilters();render();});
  }
  return {open,render,init};
})();
