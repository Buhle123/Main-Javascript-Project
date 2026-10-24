
const ROOMS = {
  "cell": {
    title: "PRISON CELL",
    actions: [{ key: "inspect", label: "look around the cell" }],
    describe() {
      return [
        "A dark cell. A message flickers on the wall:",
        '"WELCOME, HUMAN. YOU WILL NEVER ESCAPE!"'
      ];
    }
  },
  "control room": {
    title: "CONTROL ROOM",
    actions: [
      { key: "search", label: "search the security console" },
      { key: "disable", label: "try to shut down the AI's security system" }
    ],
    describe(state) {
      return [
        "Glowing monitors fill the room.",
        state.hasAccessCard
          ? "The console drawer is empty. You already took the card."
          : "Something that looks like an access card is tucked under the console.",
        state.securityOffline
          ? "The AI's security system is OFFLINE."
          : "The AI's security system is ACTIVE."
      ];
    }
  },
  "security gate": {
    title: "SECURITY GATE",
    actions: [{ key: "escape", label: "try to open the gate" }],
    describe(state) {
      return [
        "A massive steel door blocks the way out.",
        state.hasAccessCard
          ? "Your access card fits the scanner."
          : "The scanner flashes: ACCESS CARD REQUIRED.",
        state.securityOffline
          ? "The AI's security system is OFFLINE."
          : "The AI's security system is ACTIVE. Opening the gate would trigger an alarm."
      ];
    }
  }
};


function createState() {
  return {
    room: "cell",
    hasAccessCard: false,
    securityOffline: false,
    ended: false,
    cancelled: false,
    ending: null,   
    notice: ""      
  };
}


function report(state, text) {
  console.log(text);
  state.notice += text + "\n";
}


function getChoice(message, validChoices) {
  while (true) {
    const answer = prompt(message);

    if (answer === null) {
      return null; 
    }

    const choice = answer.trim().toLowerCase().replace(/\s+/g, " ");

    if (validChoices.includes(choice)) {
      return choice;
    }

    alert(
      "\"" + answer.trim() + "\" is not a valid choice.\n\n" +
      "Please type one of:\n- " + validChoices.join("\n- ") +
      "\n\n(Nothing changed in the game.)"
    );
  }
}


function getOptions(state) {
  const actions = ROOMS[state.room].actions;
  const exits = Object.keys(ROOMS)
    .filter(name => name !== state.room)
    .map(name => ({ key: name, label: "go to the " + name }));
  return actions.concat(exits);
}

function showRoom(state) {
  const room = ROOMS[state.room];
  console.log("\n--- " + room.title + " ---");
  room.describe(state).forEach(line => console.log(line));
  console.log("Your choices:");
  getOptions(state).forEach(o => console.log("  " + o.key + " : " + o.label));
}

function buildPrompt(state) {
  const room = ROOMS[state.room];
  const inventory = state.hasAccessCard ? "Access Card" : "(empty)";
  const options = getOptions(state)
    .map(o => "  " + o.key + "  -  " + o.label)
    .join("\n");

  return (
    (state.notice ? state.notice + "\n" : "") +
    "📍 " + room.title + "\n" +
    room.describe(state).join("\n") + "\n\n" +
    "Inventory: " + inventory + "\n\n" +
    "What do you do? Type one of:\n" + options + "\n\n" +
    "(Cancel quits the game.)"
  );
}


function doAction(state, action) {
  if (action === "inspect") {
    report(state, "You find a ventilation panel, but it's far too small to crawl through. " +
      "A blinking arrow points toward the control room.");
  } else if (action === "search") {
    if (state.hasAccessCard) {
      report(state, "You search again, but there's nothing left to take.");
    } else {
      state.hasAccessCard = true;
      report(state, "You found an ACCESS CARD! (Item collected)");
    }
  } else if (action === "disable") {
    disableSecurity(state);
  } else if (action === "escape") {
    tryEscape(state);
  }
}

function disableSecurity(state) {
  if (state.securityOffline) {
    report(state, "The security system is already offline.");
    return;
  }
  const sure = confirm(
    "This will try to shut down the AI's security system.\n\n" +
    "OK = go ahead\nCancel = leave it alone"
  );
  if (sure) {
    state.securityOffline = true;
    report(state, "The monitors go dark. The AI's security system is OFFLINE!");
  } else {
    report(state, "You step away from the console.");
  }
}

function tryEscape(state) {

  if (state.hasAccessCard && state.securityOffline) {
    report(state, "You swipe the card. ACCESS GRANTED! With the AI blind, you slip outside unseen.");
    state.ending = "escape";
    state.ended = true;
    return;
  }

  
  if (!state.hasAccessCard && state.securityOffline) {
    report(state, "The gate stays locked. Turning off security wasn't enough. " +
      "You still need an access card.");
    return;
  }

  
  const risk = confirm(
    "⚠️ WARNING\n\n" +
    "The AI's security system is still ACTIVE. " +
    "Opening the gate now will set off the alarm" +
    (state.hasAccessCard ? "." : ", and you have no access card.") +
    "\n\nOK = risk it\nCancel = step back"
  );

  if (!risk) {
    report(state, "You step back from the gate. That felt too risky.");
    return;
  }

  report(state, state.hasAccessCard
    ? "The gate starts to open, but the alarm blares and the AI's guards seal it shut."
    : "You force the gate. The alarm blares and the AI's guards swarm you.");
  state.ending = "captured";
  state.ended = true;
}


function playOnce() {
  const state = createState();

  console.clear();
  console.log("======================================");
  console.log("   ESCAPE THE DIGITAL FORTRESS");
  console.log("======================================");
  console.log("Find a way out before the evil AI finds you.");

  while (!state.ended) {
    showRoom(state);

    const options = getOptions(state);
    const choice = getChoice(buildPrompt(state), options.map(o => o.key));
    state.notice = ""; // old news is cleared once the player has seen it

    if (choice === null) {
      state.cancelled = true;
      state.ended = true;
    } else if (ROOMS[choice]) {
      state.room = choice;
      state.notice = "You walk to the " + choice + ".\n";
      console.log("You walk to the " + choice + ".");
    } else {
      doAction(state, choice);
    }
  }

  return state;
}


function main() {
  const start = confirm(
    "🤖 WELCOME TO THE DIGITAL FORTRESS\n\n" +
    "The evil AI has trapped you inside. Explore the rooms, find what you " +
    "need, and escape. Your choices decide how it ends!\n\n" +
    "HOW TO PLAY\n" +
    "• Type your choice in the pop-up boxes. Capitals and extra spaces don't matter.\n" +
    "• Cancel in a pop-up box quits the game.\n\n" +
    "THE CONSOLE\n" +
    "The console is a hidden browser panel where the full story log appears. " +
    "The pop-ups also show the key information, but the console gives the full story.\n" +
    "• Windows/Linux, Chrome or Edge: Ctrl + Shift + J\n" +
    "• Windows/Linux, Firefox: Ctrl + Shift + K\n" +
    "• Any browser on Windows: F12, then click the \"Console\" tab\n" +
    "• Mac, Chrome or Edge: Cmd + Option + J\n" +
    "• Mac, Firefox: Cmd + Option + K\n" +
    "• Mac, Safari: tick Settings > Advanced > \"Show features for web developers\", then Cmd + Option + C\n\n" +
    "OK = start the game\nCancel = leave"
  );

  if (!start) {
    return;
  }

  let playAgain = true;

  while (playAgain) {
    const result = playOnce();

    if (result.cancelled) {
      console.log("\nYou left the fortress. The AI is still waiting...");
      alert("You left the game. The AI is still waiting...");
      return;
    }

    if (result.ending === "escape") {
      console.log("\n***** YOU ESCAPED! *****");
      alert("🎉 YOU ESCAPED!\n\nWith the card in hand and the AI's security offline, " +
        "you walk out into the daylight. Well done, human!");
    } else {
      console.log("\n***** YOU WERE CAPTURED! *****");
      alert("🚨 CAPTURED!\n\nThe AI's guards drag you back to your cell. " +
        "Next time, disable the security system first!");
    }

    playAgain = confirm(
      "Play again?\n\nOK = new game (everything resets)\nCancel = finish"
    );
  }

  console.log("Thanks for playing!");
  alert("Thanks for playing!");
}

// Wait one frame so the page is painted behind the first pop-up.
requestAnimationFrame(() => setTimeout(main));