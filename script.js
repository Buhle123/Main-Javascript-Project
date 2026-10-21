const WINNING_SCORE = 3;

function computerPlay() {
  const choices = ["Rock", "Paper", "Scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getPlayerSelection(playerScore, computerScore, lastMessage) {
  while (true) {
    const answer = prompt(
      lastMessage +
      "SCORE → You: " + playerScore + " | Evil AI: " + computerScore +
      " (first to " + WINNING_SCORE + " wins)\n\n" +
      "Type Rock, Paper, or Scissors and press OK.\n" +
      "Press Cancel to flee the battle."
    );


    if (answer === null) {
      return null;
    }

    const normalized = answer.trim().toLowerCase();

    if (normalized === "rock") return "Rock";
    if (normalized === "paper") return "Paper";
    if (normalized === "scissors") return "Scissors";

    alert(
      "The Evil AI laughs: \"" + answer.trim() + "\" is not a weapon!\n\n" +
      "Please type exactly one of: Rock, Paper, or Scissors.\n" +
      "(Don't worry, that didn't count as a round.)"
    );
  }
}

function playRound(playerSelection, computerSelection) {
  if (playerSelection === computerSelection) {
    return "draw";
  }

  const playerWins =
    (playerSelection === "Rock" && computerSelection === "Scissors") ||
    (playerSelection === "Paper" && computerSelection === "Rock") ||
    (playerSelection === "Scissors" && computerSelection === "Paper");

  return playerWins ? "player" : "computer";
}

function showIntro() {
  return confirm(
    "🤖 THE EVIL AI HAS AWAKENED!\n\n" +
    "It plans to take over the world, but it has one weakness: it can " +
    "only be defeated at Rock, Paper, Scissors. You are humanity's last hope!\n\n" +
    "HOW TO PLAY\n" +
    "• Win " + WINNING_SCORE + " rounds before the AI does. Draws score nothing.\n" +
    "• You'll type your moves in pop-up boxes like this one.\n\n" +
    "⚠️ YOU NEED THE CONSOLE\n" +
    "The console is a hidden panel in your browser. The battle report " +
    "(what the AI picked, who won each round, and the score) appears there.\n\n" +
    "HOW TO OPEN IT\n" +
    "• Windows/Linux (Chrome, Edge, Firefox): press F12, then click the \"Console\" tab\n" +
    "• Windows(Chrome, Edge, Firefox): press Ctrl + Shift + J " +
    "• Mac (Chrome): press Cmd + Option + J\n" +
    "• Mac (Safari): enable the Develop menu in Settings, then press Cmd + Option + C\n\n" +
    "Open the console NOW, then come back and press OK to begin.\n" +
    "Press Cancel if you'd rather not play."
  );
}

function game() {
  let playerScore = 0;
  let computerScore = 0;
  let cancelled = false;
  let lastMessage = "";

  if (!showIntro()) {
    console.log("You walked away. The Evil AI wins by default... for now.");
    return;
  }

  console.log("========================================");
  console.log("ROCK, PAPER, SCISSORS: THE FINAL SHOWDOWN");
  console.log("You vs. the Evil AI. First to " + WINNING_SCORE + " wins.");
  console.log("Draws award no points.");
  console.log("========================================");

  let roundNumber = 0;

  while (playerScore < WINNING_SCORE && computerScore < WINNING_SCORE) {
    const playerSelection = getPlayerSelection(
      playerScore,
      computerScore,
      lastMessage
    );

    if (playerSelection === null) {
      cancelled = true;
      break;
    }

    roundNumber++;
    const computerSelection = computerPlay();
    const roundResult = playRound(playerSelection, computerSelection);

    console.log("\n--- Round " + roundNumber + " ---");
    console.log("You chose: " + playerSelection);
    console.log("The AI chose: " + computerSelection);

    if (roundResult === "player") {
      playerScore++;
      console.log("You win this round! 💪");
      lastMessage =
        "Last round: you played " + playerSelection + ", AI played " +
        computerSelection + ". You scored!\n\n";
    } else if (roundResult === "computer") {
      computerScore++;
      console.log("The AI wins this round! 🤖");
      lastMessage =
        "Last round: you played " + playerSelection + ", AI played " +
        computerSelection + ". The AI scored!\n\n";
    } else {
      console.log("It's a draw! Nobody gets a point.");
      lastMessage =
        "Last round: you both played " + playerSelection +
        ". A draw, so no points.\n\n";
    }

    console.log("Score: You " + playerScore + " | AI " + computerScore);
  }

  const finalScore = "Final score: You " + playerScore + " | AI " + computerScore;
  let endMessage;

  if (cancelled) {
    endMessage = "You fled the battle. The Evil AI is still out there...";
  } else if (playerScore === WINNING_SCORE) {
    endMessage = "🎉 VICTORY! You defeated the Evil AI. The world is saved!";
  } else {
    endMessage = "💀 DEFEAT! The Evil AI reached " + WINNING_SCORE +
      " wins first. Muahahaha!";
  }

  console.log("\n========================================");
  console.log(endMessage);
  console.log(finalScore);
  console.log("Refresh the page to play again.");
  console.log("========================================");

 
  alert(endMessage + "\n\n" + finalScore + "\n\nRefresh the page to play again.");
}

game();