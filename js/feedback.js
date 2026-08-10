document.addEventListener("DOMContentLoaded",()=>{
 const fab=document.getElementById("feedbackFab"),overlay=document.getElementById("feedbackOverlay"),close=document.getElementById("feedbackClose"),later=document.getElementById("feedbackLater"),go=document.getElementById("feedbackGo");
 const open=()=>{overlay.classList.remove("hidden");overlay.setAttribute("aria-hidden","false");if(window.BNM&&BNM.track)BNM.track("feedback_open")};
 const shut=()=>{overlay.classList.add("hidden");overlay.setAttribute("aria-hidden","true")};
 if(fab)fab.onclick=open;if(close)close.onclick=shut;if(later)later.onclick=shut;if(go)go.onclick=()=>{if(window.BNM&&BNM.track)BNM.track("feedback_form_click")};
 if(overlay)overlay.onclick=e=>{if(e.target===overlay)shut()};document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay&&!overlay.classList.contains("hidden"))shut()});
});