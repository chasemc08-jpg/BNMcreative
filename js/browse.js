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
      card.querySelector("button").onclick=()=>{BNM.track("featured_open",{activity:a.id});card.replaceWith(BNM.createActivityCard(a,{compact:false}));};
      track.appendChild(card);
    });
    const s=BNM_FEATURED.spotlight,a=byId(s.id);
    document.getElementById("adventureSpotlight").innerHTML=`
      <div class="spotlight-copy"><div class="eyebrow">${s.label}</div><h2>${s.title}</h2><p class="spotlight-subtitle">${s.subtitle||""}</p><p class="spotlight-intro">${s.intro}</p><div class="spotlight-why"><span>Why it made the cover</span>${s.why}</div><button class="btn btn-primary spotlight-open-btn" id="spotlightStart">See the full adventure <span>→</span></button></div>
      <aside class="mission-note"><div class="mission-tape"></div><span>Rare encounter</span><strong>${s.rare||s.bonus}</strong><p>${s.rareText||s.signoff}</p></aside>`;
    document.getElementById("spotlightStart").onclick=()=>{BNM.track("spotlight_open",{activity:a.id});
      const section=document.getElementById("adventureSpotlight");
      section.classList.add("spotlight-opening");
      setTimeout(()=>{
        section.className="spotlight spotlight-expanded spotlight-feature";
        section.innerHTML=`<div class="spotlight-feature-top"><button class="spotlight-close" id="spotlightClose">← Back to the issue</button><div class="spotlight-issue">${s.label}</div></div>
          <header class="spotlight-hero-reveal"><div class="spotlight-kicker">THIS WEEK'S COVER MISSION</div><h2>${s.title}</h2><p>${s.subtitle}</p><div class="spotlight-meta"><span>◷ ${s.duration}</span><span>◎ ${s.crew}</span><span>◇ ${s.cost}</span></div></header>
          <div class="spotlight-feature-intro"><p>${s.intro}</p><div><small>WHY THIS ONE</small><strong>${s.why}</strong></div></div>
          <div class="spotlight-mission-heading"><span>THE SHOT LIST</span><strong>5 missions. Don't overthink them.</strong></div>
          <div class="spotlight-missions">${s.missions.map((m,i)=>`<article class="spotlight-mission" style="--mission-delay:${i*75}ms"><div class="mission-index">${m[0]}</div><div><h3>${m[1]}</h3><p>${m[2]}</p><button class="spotlight-explain" type="button">What counts?</button><div class="spotlight-explanation hidden">${m[3]}</div></div></article>`).join("")}</div>
          <aside class="rare-mission"><div class="rare-glow"></div><div class="rare-label">✦ RARE ENCOUNTER</div><h3>${s.rare}</h3><p>${s.rareText}</p><div class="rare-reward"><small>IF YOU FIND IT</small><strong>${s.rareReward}</strong></div></aside>
          <section class="spotlight-finale"><div><small>THE FINALE</small><h3>Pick the cover.</h3><p>${s.finale}</p></div><div class="cover-stamp">BNM<br>WEEKLY<br><span>ISSUE 01</span></div></section>
          <footer class="spotlight-signoff"><p>${s.signoff}</p><button class="btn btn-primary" id="spotlightAccept">Accept CITY FRAME →</button></footer>`;
        section.querySelectorAll(".spotlight-explain").forEach(b=>b.onclick=()=>{const d=b.nextElementSibling;const opening=d.classList.contains("hidden");d.classList.toggle("hidden");b.textContent=opening?"Got it":"What counts?";});
        document.getElementById("spotlightClose").onclick=()=>{
          const section=document.getElementById("adventureSpotlight");
          section.className="spotlight";
          section.removeAttribute("style");
          renderFeatured();
          section.scrollIntoView({behavior:"smooth",block:"center"});
        };
        document.getElementById("spotlightAccept").onclick=()=>{BNM.track("spotlight_accept",{activity:a.id});BNM.adventure.start({id:"spotlight-city-frame",name:"CITY FRAME",emoji:"📸",minutes:45,cost:"free"})};
        section.scrollIntoView({behavior:"smooth",block:"start"});
      },280);
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
  function open(){BNM.track("browse_open");BNM.show("browse");renderFeatured();renderFilters();render();}
  function init(){
    document.getElementById("searchInput").addEventListener("input",render);
    document.getElementById("clearFilters").addEventListener("click",()=>{Object.keys(state).forEach(k=>state[k]="all");document.getElementById("searchInput").value="";renderFilters();render();});
  }
  return {open,render,init};
})();
