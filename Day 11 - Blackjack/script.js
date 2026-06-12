const logo = `
.------.            _     _            _    _            _
|A_  _ |.          | |   | |          | |  (_)          | |
|( \\/ ).-----.     | |__ | | __ _  ___| | ___  __ _  ___| | __
| \\  /|K /\\  |     | '_ \\| |/ _\` |/ __| |/ / |/ _\` |/ __| |/ /
|  \\/ | /  \\ |     | |_) | | (_| | (__|   <| | (_| | (__|   <
\`-----| \\  / |     |_.__/|_|\\__,_|\\___|_|\\_\\ |\\__,_|\\___|_|\\_\\
      |  \\/ K|                            _/ |
      \`------'                           |__/
`;

const state = {
    userCards: [],
    dealerCards: [],
    gameOver: false,
    dealerRevealed: false,
};

function dealCard() {
    const cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    return cards[Math.floor(Math.random() * cards.length)];
}

function calculateScore(cards) {
    const cardsCopy = [...cards];

    if (cardsCopy.reduce((a, b) => a + b, 0) === 21 && cardsCopy.length === 2) {
        return 0;
    }

    while (cardsCopy.includes(11) && cardsCopy.reduce((a, b) => a + b, 0) > 21) {
        const aceIndex = cardsCopy.indexOf(11);
        cardsCopy[aceIndex] = 1;
    }

    return cardsCopy.reduce((a, b) => a + b, 0);
}

function compare(userScore, dealerScore) {
    if (userScore === dealerScore) {
        return "Draw 🙃";
    }
    if (dealerScore === 0) {
        return "Lose, opponent has Blackjack 😱";
    }
    if (userScore === 0) {
        return "Win with a Blackjack 😎";
    }
    if (userScore > 21) {
        return "You went over. You lose 😭";
    }
    if (dealerScore > 21) {
        return "Opponent went over. You win 😁";
    }
    if (userScore > dealerScore) {
        return "You win 😃";
    }
    return "You lose 😤";
}

function formatCard(card, hidden) {
    if (hidden) {
        return "🂠";
    }
    if (card === 11) {
        return "A";
    }
    return String(card);
}

function formatHand(cards, hideSecond) {
    return cards
        .map((card, index) => formatCard(card, hideSecond && index === 1))
        .join("  ");
}

function updateDisplay() {
    const userScore = calculateScore(state.userCards);
    const dealerScore = calculateScore(state.dealerCards);

    document.getElementById("userCards").textContent = formatHand(state.userCards, false);
    document.getElementById("userScore").textContent = `Score: ${userScore}`;

    document.getElementById("dealerCards").textContent = formatHand(
        state.dealerCards,
        !state.dealerRevealed
    );

    if (state.dealerRevealed) {
        document.getElementById("dealerScore").textContent = `Score: ${dealerScore}`;
    } else if (state.dealerCards.length > 0) {
        document.getElementById("dealerScore").textContent =
            `Showing: ${formatCard(state.dealerCards[0], false)}`;
    } else {
        document.getElementById("dealerScore").textContent = "";
    }
}

function endPlayerTurn() {
    state.gameOver = true;
    state.dealerRevealed = true;

    let dealerScore = calculateScore(state.dealerCards);
    while (dealerScore !== 0 && dealerScore < 17) {
        state.dealerCards.push(dealCard());
        dealerScore = calculateScore(state.dealerCards);
    }

    const userScore = calculateScore(state.userCards);
    dealerScore = calculateScore(state.dealerCards);

    updateDisplay();
    document.getElementById("result").textContent = compare(userScore, dealerScore);
    document.getElementById("controls").hidden = true;
    document.getElementById("newGame").hidden = false;
}

function checkInstantEnd() {
    const userScore = calculateScore(state.userCards);
    const dealerScore = calculateScore(state.dealerCards);

    if (userScore === 0 || dealerScore === 0 || userScore > 21) {
        endPlayerTurn();
        return true;
    }
    return false;
}

function hit() {
    if (state.gameOver) {
        return;
    }

    state.userCards.push(dealCard());
    updateDisplay();

    if (!checkInstantEnd()) {
        document.getElementById("result").textContent = "";
    }
}

function stand() {
    if (state.gameOver) {
        return;
    }
    endPlayerTurn();
}

function startGame() {
    state.userCards = [dealCard(), dealCard()];
    state.dealerCards = [dealCard(), dealCard()];
    state.gameOver = false;
    state.dealerRevealed = false;

    document.getElementById("result").textContent = "";
    document.getElementById("controls").hidden = false;
    document.getElementById("newGame").hidden = true;

    updateDisplay();
    checkInstantEnd();
}

document.getElementById("logo").textContent = logo;
startGame();
