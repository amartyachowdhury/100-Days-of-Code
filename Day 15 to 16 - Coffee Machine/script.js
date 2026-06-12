const MENU = {
    espresso: {
        ingredients: { water: 50, coffee: 18 },
        cost: 1.5,
    },
    latte: {
        ingredients: { water: 200, milk: 150, coffee: 24 },
        cost: 2.5,
    },
    cappuccino: {
        ingredients: { water: 250, milk: 100, coffee: 24 },
        cost: 3.0,
    },
};

const state = {
    resources: { water: 300, milk: 200, coffee: 100 },
    profit: 0,
    isOn: true,
    selectedDrink: null,
};

function isResourceSufficient(orderIngredients) {
    for (const item in orderIngredients) {
        if (orderIngredients[item] > state.resources[item]) {
            return `Sorry there is not enough ${item}.`;
        }
    }
    return null;
}

function processCoins() {
    const quarters = parseInt(document.getElementById("quarters").value, 10) || 0;
    const dimes = parseInt(document.getElementById("dimes").value, 10) || 0;
    const nickels = parseInt(document.getElementById("nickels").value, 10) || 0;
    const pennies = parseInt(document.getElementById("pennies").value, 10) || 0;

    if (quarters < 0 || dimes < 0 || nickels < 0 || pennies < 0) {
        return null;
    }

    return quarters * 0.25 + dimes * 0.1 + nickels * 0.05 + pennies * 0.01;
}

function isTransactionSuccessful(moneyReceived, drinkCost) {
    if (moneyReceived >= drinkCost) {
        const change = Math.round((moneyReceived - drinkCost) * 100) / 100;
        state.profit += drinkCost;
        return { success: true, change };
    }
    return { success: false };
}

function makeCoffee(drinkName, orderIngredients) {
    for (const item in orderIngredients) {
        state.resources[item] -= orderIngredients[item];
    }
    return `Here is your ${drinkName} ☕️. Enjoy!`;
}

function updateReport() {
    document.getElementById("reportWater").textContent =
        `Water: ${state.resources.water}ml`;
    document.getElementById("reportMilk").textContent =
        `Milk: ${state.resources.milk}ml`;
    document.getElementById("reportCoffee").textContent =
        `Coffee: ${state.resources.coffee}g`;
    document.getElementById("reportMoney").textContent =
        `Money: $${state.profit.toFixed(2)}`;
}

function setMessage(text, isError) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = isError ? "message error" : "message success";
}

function clearCoinInputs() {
    document.getElementById("quarters").value = "0";
    document.getElementById("dimes").value = "0";
    document.getElementById("nickels").value = "0";
    document.getElementById("pennies").value = "0";
}

function selectDrink(drinkName) {
    if (!state.isOn) {
        return;
    }

    const drink = MENU[drinkName];
    const resourceError = isResourceSufficient(drink.ingredients);

    if (resourceError) {
        setMessage(resourceError, true);
        document.getElementById("payment").hidden = true;
        state.selectedDrink = null;
        return;
    }

    state.selectedDrink = drinkName;
    document.getElementById("paymentTitle").textContent =
        `Insert coins for ${drinkName} ($${drink.cost.toFixed(2)})`;
    document.getElementById("payment").hidden = false;
    setMessage("", false);
    clearCoinInputs();
}

function cancelPayment() {
    state.selectedDrink = null;
    document.getElementById("payment").hidden = true;
    setMessage("Order cancelled.", false);
}

function processPayment() {
    if (!state.selectedDrink) {
        return;
    }

    const drink = MENU[state.selectedDrink];
    const payment = processCoins();

    if (payment === null) {
        setMessage("Please enter valid coin amounts.", true);
        return;
    }

    const result = isTransactionSuccessful(payment, drink.cost);

    if (!result.success) {
        setMessage("Sorry that's not enough money. Money refunded.", true);
        cancelPayment();
        return;
    }

    const drinkMessage = makeCoffee(state.selectedDrink, drink.ingredients);
    setMessage(`${drinkMessage} Here is $${result.change.toFixed(2)} in change.`, false);
    document.getElementById("payment").hidden = true;
    state.selectedDrink = null;
    clearCoinInputs();
    updateReport();
}

function showReport() {
    updateReport();
    setMessage("Report updated.", false);
}

function turnOff() {
    state.isOn = false;
    state.selectedDrink = null;
    document.getElementById("machine").hidden = true;
    document.getElementById("offScreen").hidden = false;
    document.getElementById("payment").hidden = true;
}

function turnOn() {
    state.isOn = true;
    document.getElementById("machine").hidden = false;
    document.getElementById("offScreen").hidden = true;
    setMessage("Machine is ready.", false);
}

updateReport();
