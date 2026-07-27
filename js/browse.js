window.BNM = window.BNM || {};

BNM.browse = (function(){
  function render(){
    const search=document.getElementById("searchInput").value.trim().toLowerCase();
    const setting=document.getElementById("settingFilter").value;
    const cost=document.getElementById("costFilter").value;
    const energy=document.getElementById("energyFilter").value;
    const time=document.getElementById("timeFilter").value;

    const filtered=BNM_ACTIVITIES.filter(a=>{
      const text=[a.name,a.description,...a.moods,...a.supplies].join(" ").toLowerCase();
      return (!search || text.includes(search))
        && (setting==="all" || a.setting.includes(setting))
        && (cost==="all" || a.cost===cost)
        && (energy==="all" || a.energy===energy)
        && (time==="all" || a.minutes<=Number(time));
    });

    document.getElementById("resultCount").textContent=`Showing ${filtered.length} of ${BNM_ACTIVITIES.length} activities`;
    const grid=document.getElementById("activityGrid");
    grid.innerHTML="";
    if(!filtered.length){
      grid.innerHTML=`<div class="panel empty" style="grid-column:1/-1">No activities match those filters yet.</div>`;
      return;
    }
    filtered.forEach(a=>grid.appendChild(BNM.createActivityCard(a,{compact:true})));
  }

  function open(){
    BNM.show("browse");
    render();
  }

  function init(){
    ["searchInput","settingFilter","costFilter","energyFilter","timeFilter"].forEach(id=>{
      document.getElementById(id).addEventListener(id==="searchInput"?"input":"change",render);
    });
  }

  return {open,render,init};
})();
