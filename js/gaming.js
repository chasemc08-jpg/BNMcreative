window.BNM=window.BNM||{};
BNM.gaming=(function(){
  let selected=null;

  const $=id=>document.getElementById(id);

  function open(){
    BNM.track("gaming_open");
    BNM.show("gaming");
    drawGames();
    $("gamingResult").innerHTML="";
    $("gamingToolbar").classList.add("hidden");
    $("gamingAll").classList.add("hidden");
  }

  function drawGames(){
    const picker=$("gamePicker");
    picker.innerHTML="";
    Object.entries(BNM_GAME_CHALLENGES).forEach(([id,g])=>{
      const b=document.createElement("button");
      b.className="game-tile"+(selected===id?" active":"");
      b.innerHTML=`<span>${g.emoji}</span><strong>${g.name}</strong><small>${g.challenges.length} challenges</small>`;
      b.addEventListener("click",()=>{
        selected=id;
        drawGames();
        $("gamingToolbar").classList.remove("hidden");
        $("gamingAll").classList.add("hidden");
        generate();
      });
      picker.appendChild(b);
    });
  }

  function cardHTML(c,g,compact=false){
    return `<article class="panel game-card${compact?" compact-game-card":""}">
      <div class="eyebrow">${g.emoji} ${g.name} challenge</div>
      <h2>${c.title}</h2>
      <p class="challenge-brief">${c.brief}</p>
      <div class="bonus-box"><small>🔥 BONUS</small><strong>${c.bonus}</strong></div>
      <div class="card-actions">
        <button class="btn btn-primary accept-game-btn">Accept challenge →</button>
        <button class="btn btn-ghost details-game-btn">More details</button>
        ${compact?"":'<button class="btn btn-ghost another-game-btn">Give us another</button>'}
      </div>
      <div class="challenge-details hidden">
        <div class="challenge-detail-block"><h4>How it works</h4><ol>${c.rules.map(r=>`<li>${r}</li>`).join("")}</ol></div>
        <div class="challenge-detail-grid">
          <div><small>WHY IT'S FUN</small><p>${c.why}</p></div>
          <div><small>QUICK TIP</small><p>${c.tip}</p></div>
        </div>
      </div>
    </article>`;
  }

  function wire(card,c,g,allowAnother){
    const accept=card.querySelector(".accept-game-btn");
    const details=card.querySelector(".details-game-btn");
    const detailBox=card.querySelector(".challenge-details");
    const another=card.querySelector(".another-game-btn");

    accept.addEventListener("click",()=>BNM.adventure.start({
      id:"game-"+selected+"-"+c.title.toLowerCase().replace(/[^a-z0-9]+/g,"-"),
      name:c.title,emoji:g.emoji,minutes:45,cost:"free"
    }));

    details.addEventListener("click",()=>{
      const opening=detailBox.classList.contains("hidden");
      detailBox.classList.toggle("hidden");
      details.textContent=opening?"Hide details":"More details";
    });

    if(allowAnother && another) another.addEventListener("click",generate);
  }

  function generate(){
    if(!selected) return;
    const g=BNM_GAME_CHALLENGES[selected];
    const c=g.challenges[Math.floor(Math.random()*g.challenges.length)];
    BNM.track("gaming_challenge",{game:selected,challenge:c.title});
    const holder=$("gamingResult");
    holder.innerHTML=cardHTML(c,g,false);
    wire(holder.firstElementChild,c,g,true);
  }

  function random(){
    const ids=Object.keys(BNM_GAME_CHALLENGES);
    selected=ids[Math.floor(Math.random()*ids.length)];
    BNM.show("gaming");
    drawGames();
    $("gamingToolbar").classList.remove("hidden");
    $("gamingAll").classList.add("hidden");
    generate();
  }

  function browseAll(){
    if(!selected) return;
    const g=BNM_GAME_CHALLENGES[selected];
    $("gamingAllTitle").textContent=`All ${g.name} challenges`;
    const grid=$("gamingAllGrid");
    grid.innerHTML="";
    g.challenges.forEach(c=>{
      const holder=document.createElement("div");
      holder.innerHTML=cardHTML(c,g,true);
      const card=holder.firstElementChild;
      grid.appendChild(card);
      wire(card,c,g,false);
    });
    $("gamingAll").classList.remove("hidden");
    $("gamingAll").scrollIntoView({behavior:"smooth",block:"start"});
    BNM.track("gaming_browse_all",{game:selected});
  }

  function init(){
    $("gamingBrowseAll").addEventListener("click",browseAll);
    $("gamingAllClose").addEventListener("click",()=>$("gamingAll").classList.add("hidden"));
  }

  document.addEventListener("DOMContentLoaded",init);
  return {open,random};
})();