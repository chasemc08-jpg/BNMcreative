window.BNM = window.BNM || {};

BNM.createActivityCard = function(activity, options={}){
  const showMatch = Boolean(options.showMatch);
  const compact = Boolean(options.compact);
  const why = activity.reasons && activity.reasons.length
    ? `We picked this because it ${activity.reasons.join(", ")}.`
    : `A flexible idea that works well for ${activity.people.min}–${activity.people.max} people.`;

  const wrapper = document.createElement("article");
  wrapper.className = "activity-card";
  wrapper.innerHTML = `
    <div class="activity-top">
      <div>
        <div class="activity-icon" aria-hidden="true">${activity.emoji}</div>
        <h${compact?"3":"2"}>${activity.name}</h${compact?"3":"2"}>
        <p>${activity.description}</p>
      </div>
      ${showMatch ? `<span class="chip match-chip">${activity.match}% match</span>` : ""}
    </div>
    <div class="meta-row">
      <span class="chip">👥 ${activity.people.min}–${activity.people.max}</span>
      <span class="chip">⏱ ${BNM.formatMinutes(activity.minutes)}</span>
      <span class="chip">💰 ${BNM.costLabel(activity.cost)}</span>
      <span class="chip">⚡ ${BNM.energyLabel(activity.energy)}</span>
    </div>
    <div class="card-actions">
      ${options.resultCard ? `<button class="btn btn-primary another-btn">Show me another</button>` : ""}
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

  if(options.onAnother){
    wrapper.querySelector(".another-btn").addEventListener("click",options.onAnother);
  }
  return wrapper;
};
