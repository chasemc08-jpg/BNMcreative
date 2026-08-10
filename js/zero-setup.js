window.BNM=window.BNM||{};BNM.zeroSetup=(function(){
const packs={
"minute-to-win-it-games":{name:"Minute to Win It",emoji:"⏱️",items:[
["Gravity Is Optional","Build the tallest freestanding tower you can using only 10 random safe objects.","You have 60 seconds. The tower has to stand by itself for 3 seconds."],
["Sock Sniper","Land 3 rolled-up socks in a basket from progressively farther lines.","Move back one step after every successful shot."],
["Coin Surgery","Move 8 coins from one plate/spot to another using only a spoon held in your non-dominant hand.","Drop one and you have to put it back before continuing."],
["Paper Airplane Emergency","Build a plane in 45 seconds, then try to fly it through a doorway.","One build. Three throws."],
["Final Gauntlet","Complete mini versions of the first three challenges without stopping.","Fastest clean run wins."]
],bonus:"1st = 3 points · 2nd = 2 · 3rd = 1"},
"photo-scavenger-hunt":{name:"Photo Scavenger Hunt",emoji:"📸",items:[
["Main Character Shot","Take a photo that looks like a movie poster.","Use framing, lighting, or a dramatic pose—don't just take a normal group picture."],
["Tiny World","Photograph something small so it looks enormous.","Get your camera very low/close and use perspective."],
["One-Color Takeover","Find a scene where one unexpected color completely dominates the frame.","Pick whatever color the environment gives you—don't choose it ahead of time."],
["Album Cover","Create a photo your group could genuinely use as an album cover.","No explanation allowed when you show it later."],
["Wrong Place","Find something that looks like it absolutely does not belong where it is.","The stranger the context, the better."],
["Human Optical Illusion","Use perspective to make someone look tiny, giant, or like they're holding a building.","Line up the shot carefully."],
["Accidental Art","Find a shadow, reflection, stain, crack, or random object arrangement that looks like art.","No moving objects to create it."]
],bonus:"🔥 Rare bonus: capture a perfectly timed coincidence—two strangers matching, a weird reflection, an accidental visual illusion, or something equally unlikely."},
"backyard-olympics":{name:"Backyard Olympics",emoji:"🏅",items:[
["Reverse Target Toss","Stand facing away from a bucket/target and toss over your shoulder.","Three attempts each."],
["Slowest Race","Race to the finish line—but the LAST person to cross wins. You must keep moving forward.","Stopping or moving backward = disqualification."],
["One-Hand Relay","Carry a safe object through a short course using only your non-dominant hand.","Drop it and return to the last checkpoint."],
["Mystery Distance","Everyone secretly predicts how far they can throw a safe object, then tries to land closest to their prediction.","Accuracy beats raw distance."],
["Trick-Shot Final","Each player invents ONE safe trick shot, then everyone has to attempt all of them.","Hardest successful shot wins bonus points."]
],bonus:"Gold = 3 · Silver = 2 · Bronze = 1"},
"trivia-night":{name:"Trivia Night",emoji:"🧠",items:[
["Impossible-Sounding Animal Fact","How many hearts does an octopus have? — 3","Reveal the answer only after everyone locks in."],
["Gaming","What material forms the main frame of a Nether portal? — Obsidian","Accept 'obsidian' only."],
["Ridiculous Number","How many seconds are in one day? — 86,400","Closest guess gets the point if nobody is exact."],
["Movie/TV","What fictional city does Batman protect? — Gotham City","One answer per team."],
["Space","Which planet has the shortest day in our solar system? — Jupiter","Jupiter rotates in roughly 10 hours."]
],bonus:"Last question is worth 2 points."},
"drawing-challenge":{name:"Drawing Battle",emoji:"✏️",items:[
["The Worst Superhero Ever","Design a superhero with an incredibly useless power.","Examples: always knows when toast is ready, can summon one sock, talks to parking meters."],
["Alien Convenience Store","Draw what an alien species thinks a human convenience store looks like.","The more incorrectly human, the better."],
["Luxury Item for Cavemen","Invent a ridiculous luxury product for prehistoric humans.","Give it a brand name too."],
["Boss Battle: Grandma","Design the final boss version of a completely normal grandma.","Include at least one absurd weapon or special ability."],
["Cursed Theme Park Ride","Invent an amusement-park ride that nobody sane would approve.","Name it and add one warning sign."],
["Future Pet","Draw the pet people will supposedly own in the year 2300.","Explain one completely bizarre feature."]
],bonus:"Final round: 90 seconds using your non-dominant hand."},
"charades-remix":{name:"Charades",emoji:"🎭",items:[
["A penguin getting fired from an office job","Act out both the penguin AND the firing situation."],
["Someone stepping on a LEGO but trying not to wake a baby","No sound, obviously."],
["A magician realizing the rabbit escaped","Make the panic obvious."],
["A dinosaur trying to use a drive-thru","You are both dinosaur and customer."],
["An influencer taking selfies during an alien invasion","Commit to the selfie poses."],
["A grandma winning a professional wrestling match","There must be a victory celebration."],
["A cat discovering a cucumber","Overreact appropriately."],
["Someone fighting an invisible ghost in a grocery store","Use the imaginary shelves too."]
],bonus:"60 seconds each. Final prompt is worth double."}};
function open(id){let p=packs[id];if(!p)return;quickSetupTitle.textContent=p.emoji+" "+p.name+" — ready.";quickSetupCard.innerHTML=`<article class="panel setup-card"><div class="eyebrow">✦ BNM BUILT THIS FOR YOU</div><div class="setup-list">${p.items.map((x,i)=>`<div class="setup-row"><span>${i+1}</span><div><strong>${x[0]}</strong><p>${x[1]}</p><button class="mini-detail-btn" type="button">Explain it</button><div class="mini-explanation hidden">${x[2]}</div></div></div>`).join("")}</div><div class="bonus-box"><small>RULE / BONUS</small><strong>${p.bonus}</strong></div><button class="btn btn-primary" id="setupGo">We're doing this →</button></article>`;document.querySelectorAll(".mini-detail-btn").forEach(b=>b.onclick=()=>{let d=b.nextElementSibling,open=d.classList.contains("hidden");d.classList.toggle("hidden");b.textContent=open?"Got it":"Explain it"});setupGo.onclick=()=>BNM.adventure.start({id:"setup-"+id,name:p.name,emoji:p.emoji,minutes:30,cost:"free"});BNM.track("zero_setup_open",{activity:id});BNM.show("quickSetup")}return{open}})();