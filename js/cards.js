window.BNM = window.BNM || {};

BNM.createActivityCard = function(activity, options={}){
  const zeroSetupIds=["photo-scavenger-hunt", "backyard-olympics", "trivia-night", "minute-to-win-it-games", "charades-remix"];
  const zeroSetup=zeroSetupIds.includes(activity.id);
  const showMatch = Boolean(options.showMatch);
  const compact = Boolean(options.compact);
  const why = activity.reasons && activity.reasons.length
    ? `We picked this because it ${activity.reasons.join(", ")}.`
    : `A flexible idea that works well for ${activity.people.min}–${activity.people.max} people.`;

  const wrapper = document.createElement("article");
  wrapper.className = "activity-card";
  wrapper.dataset.activityId = activity.id;
  const favorite = BNM.storage ? BNM.storage.isFavorite(activity.id) : false;
  wrapper.innerHTML = `
    <div class="activity-top">
      <div>
        <div class="activity-icon" aria-hidden="true">${activity.emoji}</div>
        <h${compact?"3":"2"}>${activity.name}</h${compact?"3":"2"}>
        <p>${activity.description}</p>
      </div>
      <div class="activity-tools">
        ${showMatch ? `<span class="chip match-chip">${activity.match}% match</span>` : ""}
        <button class="favorite-btn ${favorite?"saved":""}" type="button" aria-label="${favorite?"Remove from":"Save to"} favorites" title="${favorite?"Saved":"Save for later"}">${favorite?"♥":"♡"}</button>
      </div>
    </div>
    <div class="meta-row">
      <span class="chip">👥 ${activity.people.min}–${activity.people.max}</span>
      <span class="chip">⏱ ${BNM.formatMinutes(activity.minutes)}</span>
      <span class="chip">💰 ${BNM.costLabel(activity.cost)}</span>
      <span class="chip">⚡ ${BNM.energyLabel(activity.energy)}</span>
    </div>
    <div class="card-actions">${zeroSetup?`<button class="btn btn-primary zero-setup-btn">Set up my game →</button>`:""}
      ${options.resultCard ? `<button class="btn btn-primary start-adventure-btn">Let's do it →</button><button class="btn btn-ghost another-btn">Show me another</button>` : ""}
      <button class="btn btn-ghost details-btn" aria-expanded="false">View details</button>
    </div>
    <div class="details hidden">
      <div class="detail-grid">
        <div class="why-box"><strong>Why this works:</strong> ${why}</div>
        <section class="detail-section">
          <h4>What you need</h4>
          <ul>${activity.supplies.map(x=>`<li>${x}</li>`).join("")}</ul>
        </section>
        <section class="detail-section">
          <h4>How to do it</h4>
          <ol>${activity.instructions.map(x=>`<li>${x}</li>`).join("")}</ol>
        </section>
        <section class="detail-section" style="grid-column:1/-1">
          <h4>Quick tip</h4>
          <p style="margin:0">${activity.tip}</p>
        </section>
      </div>
    </div>
  `;

  const detailsButton = wrapper.querySelector(".details-btn");
  const details = wrapper.querySelector(".details");
  detailsButton.addEventListener("click",()=>{
    const opening = details.classList.contains("hidden");
    details.classList.toggle("hidden");
    detailsButton.textContent = opening ? "Hide details" : "View details";
    detailsButton.setAttribute("aria-expanded",String(opening));
  });

  const favoriteButton = wrapper.querySelector(".favorite-btn");
  favoriteButton.addEventListener("click",()=>{
    const saved=BNM.storage.toggleFavorite(activity.id);
    favoriteButton.classList.toggle("saved",saved);
    favoriteButton.textContent=saved?"♥":"♡";
    favoriteButton.title=saved?"Saved":"Save for later";
    favoriteButton.setAttribute("aria-label",`${saved?"Remove from":"Save to"} favorites`);
    if(BNM.favorites && BNM.favorites.refresh) BNM.favorites.refresh();
  });

  const zeroButton=wrapper.querySelector(".zero-setup-btn"); if(zeroButton) zeroButton.addEventListener("click",()=>BNM.zeroSetup.open(activity.id));
  const startButton=wrapper.querySelector(".start-adventure-btn");
  if(startButton) startButton.addEventListener("click",()=>BNM.adventure.start(activity));

  if(options.onAnother){
    wrapper.querySelector(".another-btn").addEventListener("click",()=>{
      BNM.track("show_me_another",{activity:activity.id});
      options.onAnother();
    });
  }

  detailsButton.addEventListener("click",()=>BNM.track("details_toggle",{activity:activity.id}));

  return wrapper;
};
