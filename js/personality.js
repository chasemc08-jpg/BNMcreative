window.BNM = window.BNM || {  complete:[
    "That's one less boring day.",
    "You actually went and did it. Respect.",
    "See? Leaving the scroll was worth it.",
    "Memory made. Mission accomplished."
  ]
};
BNM.copy = {
  pick(list){ return list[Math.floor(Math.random()*list.length)]; },
  loading:[
    "Looking for something worth getting off the couch for...",
    "Okay, give us a second — this one's gotta be good.",
    "Matching the vibe, the budget, and your energy...",
    "Digging through the good stuff...",
    "You said you're bored. We're fixing that now."
  ],
  resultHeads:[
    "Okay... this one stood out.",
    "Hear us out — this could be a really good time.",
    "Yeah, we'd pick this one too.",
    "This feels like your move.",
    "We might've found the one."
  ],
  empty:[
    "That combo stumped us. Loosen one filter and we'll find something good.",
    "Nothing perfect showed up yet — try switching the vibe a little.",
    "Okay, that was oddly specific. Change one filter and let's run it back.",
    "No luck on that mix, but your next adventure is definitely still in here."
  ],
  counts(n,total){
    return this.pick([
      `${n} adventures ready when you are.`,
      `${n} solid ways to stop scrolling.`,
      `${n} ideas made the cut.`,
      n===total ? `All ${total} adventures are on the table.` : `${n} of ${total} adventures match the vibe.`
    ]);
  }
};
