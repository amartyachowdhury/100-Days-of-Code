const logo = `
 _____________________
|  _________________  |
| | Pythonista   0. | |  .----------------.  .----------------.  .----------------.  .----------------.
| |_________________| | | .--------------. || .--------------. || .--------------. || .--------------. |
|  ___ ___ ___   ___  | | |     ______   | || |      __      | || |   _____      | || |     ______   | |
| | 7 | 8 | 9 | | + | | | |   .' ___  |  | || |     /  \\     | || |  |_   _|     | || |   .' ___  |  | |
| |___|___|___| |___| | | |  / .'   \\_|  | || |    / /\\ \\    | || |    | |       | || |  / .'   \\_|  | |
| | 4 | 5 | 6 | | - | | | |  | |         | || |   / ____ \\   | || |    | |   _   | || |  | |         | |
| |___|___|___| |___| | | |  \\ \`.___.'\\  | || | _/ /    \\ \\_ | || |   _| |__/ |  | || |  \\ \`.___.'\\  | |
| | 1 | 2 | 3 | | x | | | |   \`._____.'  | || ||____|  |____|| || |  |________|  | || |   \`._____.'  | |
| |___|___|___| |___| | | |              | || |              | || |              | || |              | |
| | . | 0 | = | | / | | | '--------------' || '--------------' || '--------------' || '--------------' |
| |___|___|___| |___| |  '----------------'  '----------------'  '----------------'  '----------------'
|_____________________|
`;

const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => {
        if (b === 0) {
            throw new Error("Cannot divide by zero.");
        }
        return a / b;
    },
};

const state = {
    display: "0",
    firstOperand: null,
    operator: null,
    waitingForSecond: false,
    history: "",
};

function updateDisplay() {
    document.getElementById("display").textContent = state.display;
    document.getElementById("history").textContent = state.history;
}

function setMessage(text, isError) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = isError ? "message error" : "message";
}

function inputDigit(digit) {
    setMessage("");

    if (state.waitingForSecond) {
        state.display = digit === "." ? "0." : digit;
        state.waitingForSecond = false;
    } else if (digit === ".") {
        if (!state.display.includes(".")) {
            state.display += ".";
        }
    } else if (state.display === "0") {
        state.display = digit;
    } else {
        state.display += digit;
    }

    updateDisplay();
}

function inputOperation(symbol) {
    setMessage("");
    const current = parseFloat(state.display);

    if (state.firstOperand !== null && state.operator && !state.waitingForSecond) {
        try {
            const result = operations[state.operator](state.firstOperand, current);
            state.firstOperand = result;
            state.display = String(result);
            state.history = `${state.firstOperand} ${symbol}`;
        } catch (error) {
            setMessage(error.message, true);
            return;
        }
    } else {
        state.firstOperand = current;
        state.history = `${current} ${symbol}`;
    }

    state.operator = symbol;
    state.waitingForSecond = true;
    updateDisplay();
}

function calculate() {
    if (state.firstOperand === null || !state.operator) {
        setMessage("Enter a full calculation first.", true);
        return;
    }

    if (state.waitingForSecond) {
        setMessage("Enter the second number.", true);
        return;
    }

    const current = parseFloat(state.display);

    try {
        const result = operations[state.operator](state.firstOperand, current);
        state.history = `${state.firstOperand} ${state.operator} ${current} =`;
        state.display = String(result);
        state.firstOperand = result;
        state.waitingForSecond = true;
        setMessage(`Continue with ${result}, or start a new calculation.`);
        updateDisplay();
    } catch (error) {
        setMessage(error.message, true);
    }
}

function newCalculation() {
    state.display = "0";
    state.firstOperand = null;
    state.operator = null;
    state.waitingForSecond = false;
    state.history = "";
    setMessage("");
    updateDisplay();
}

document.getElementById("logo").textContent = logo;
updateDisplay();
