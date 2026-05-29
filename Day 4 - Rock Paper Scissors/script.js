const rock = `
    _______
---'   ____)
      (_____)
      (_____)
      (____)
---.__(___)
`;

const paper = `
    _______
---'   ____)____
          ______)
          _______)
         _______)
---.__________)
`;

const scissors = `
    _______
---'   ____)____
          ______)
       __________)
      (____)
---.__(___)
`;

const gameImages = [rock, paper, scissors];

function getResult(userChoice, computerChoice) {
    if (userChoice === 0 && computerChoice === 2) {
        return "You win!";
    }
    if (computerChoice === 0 && userChoice === 2) {
        return "You lose!";
    }
    if (computerChoice > userChoice) {
        return "You lose!";
    }
    if (userChoice > computerChoice) {
        return "You win!";
    }
    if (computerChoice === userChoice) {
        return "It's a draw!";
    }
    return "";
}

function play(userChoice) {
    const computerChoice = Math.floor(Math.random() * 3);

    document.getElementById("userArt").textContent = gameImages[userChoice];
    document.getElementById("computerArt").textContent = gameImages[computerChoice];

    const result = getResult(userChoice, computerChoice);
    const resultEl = document.getElementById("result");
    resultEl.textContent = result;

    if (result === "You win!") {
        resultEl.className = "win";
    } else if (result === "You lose!") {
        resultEl.className = "lose";
    } else {
        resultEl.className = "draw";
    }

    document.getElementById("choices").hidden = true;
    document.getElementById("restart").hidden = false;
}

function restartGame() {
    document.getElementById("userArt").textContent = "";
    document.getElementById("computerArt").textContent = "";
    document.getElementById("result").textContent = "";
    document.getElementById("result").className = "";
    document.getElementById("choices").hidden = false;
    document.getElementById("restart").hidden = true;
}
