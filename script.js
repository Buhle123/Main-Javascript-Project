
function computerPlay() {
  const choices = ["Rock", "Paper", "Scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}


function getPlayerSelection() {
  while (true) {
    const answer = prompt(
      "Choose Rock, Paper, or Scissors.\n" +
      "Type your choice below. Press Cancel to stop the game."
    );

    if (answer === null) {
      return null;
    }

    const normalizedAnswer = answer.trim().toLowerCase();

    if (normalizedAnswer === "rock") {
      return "Rock";
    }

    if (normalizedAnswer === "paper") {
      return "Paper";
    }

    if (normalizedAnswer === "scissors") {
      return "Scissors";
    }

    alert("That isn't a valid choice. Please enter Rock, Paper, or Scissors.");
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

  if (playerWins) {
    return "player";
  }

  return "computer";
}


function game() {
  let playerScore = 0;
  let computerScore = 0;
  let cancelled = false;

  alert(
    "WELCOME TO ROCK, PAPER, SCISSORS!\n\n" +
    "The first side to win 3 rounds wins the game. Draws do not award points.\n\n" +
    "You will enter your moves in browser prompts. Round results, scores, and " +
    "the final outcome appear in the browser Console.\n\n" +
    "To open the Console in Chrome on Windows, press Ctrl + Shift + J " +
    "(or F12 and select the Console tab).\n\n" +
    "Press OK to start. You can press Cancel in a move prompt to stop safely."
  );

  console.log("========================================");
  console.log("ROCK, PAPER, SCISSORS: THE FINAL SHOWDOWN");
  console.log("Enter Rock, Paper, or Scissors in each prompt.");
  console.log("Round results and scores will appear here.");
  console.log("First to 3 points wins. Draws award no points.");
  console.log("========================================");

  while (playerScore < 3 && computerScore < 3) {
    const playerSelection = getPlayerSelection();

    if (playerSelection === null) {
      cancelled = true;
      break;
    }

    const computerSelection = computerPlay();
    const roundResult = playRound(
      playerSelection,
      computerSelection
    );

    console.log("\nYour choice: " + playerSelection);
    console.log("Computer's choice: " + computerSelection);

    if (roundResult === "player") {
      playerScore++;
      console.log("You win this round!");
    } else if (roundResult === "computer") {
      computerScore++;
      console.log("The computer wins this round!");
    } else {
      console.log("It's a draw! Nobody gets a point.");
    }

    console.log(
      "Score — You: " + playerScore +
      " | Computer: " + computerScore
    );
  }

  console.log("\n========================================");

  if (cancelled) {
    console.log("Game stopped because you cancelled.");
    console.log(
      "Final score at the time you stopped — You: " +
      playerScore + " | Computer: " + computerScore
    );
  } else if (playerScore === 3) {
    console.log("VICTORY! You defeated the computer. The world is safe!");
    console.log(
      "Final score — You: " +
      playerScore + " | Computer: " + computerScore
    );
  } else {
    console.log("DEFEAT! The computer reached 3 points first.");
    console.log(
      "Final score — You: " +
      playerScore + " | Computer: " + computerScore
    );
  }

  console.log("Thanks for playing!");
  console.log("========================================");
}

game();
