const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const logo = `
 ,adPPYba, ,adPPYYba,  ,adPPYba, ,adPPYba, ,adPPYYba, 8b,dPPYba,
a8"     "" ""     \`Y8 a8P_____88 I8[    "" ""     \`Y8 88P'   "Y8
8b         ,adPPPPP88 8PP"""""""  \`"Y8ba,  ,adPPPPP88 88
"8a,   ,aa 88,    ,88 "8b,   ,aa aa    ]8I 88,    ,88 88
 \`"Ybbd8"' \`"8bbdP"Y8  \`"Ybbd8"' \`"YbbdP"' \`"8bbdP"Y8 88
            88             88
           ""             88
                          88
 ,adPPYba, 88 8b,dPPYba,  88,dPPYba,   ,adPPYba, 8b,dPPYba,
a8"     "" 88 88P'    "8a 88P'    "8a a8P_____88 88P'   "Y8
8b         88 88       d8 88       88 8PP""""""" 88
"8a,   ,aa 88 88b,   ,a8" 88       88 "8b,   ,aa 88
 \`"Ybbd8"' 88 88\`YbbdP"'  88       88  \`"Ybbd8"' 88
              88
              88
`;

function caesar(originalText, shiftAmount, encodeOrDecode) {
    let shift = shiftAmount % alphabet.length;
    if (encodeOrDecode === "decode") {
        shift *= -1;
    }

    let outputText = "";
    const text = originalText.toLowerCase();

    for (const letter of text) {
        const index = alphabet.indexOf(letter);
        if (index === -1) {
            outputText += letter;
        } else {
            const shiftedPosition = (index + shift + alphabet.length) % alphabet.length;
            outputText += alphabet[shiftedPosition];
        }
    }
    return outputText;
}

function runCipher() {
    const direction = document.getElementById("direction").value;
    const message = document.getElementById("message").value;
    const shiftValue = document.getElementById("shift").value;
    const errorEl = document.getElementById("error");
    const outputEl = document.getElementById("output");

    if (message.trim() === "") {
        errorEl.textContent = "Please enter a message.";
        errorEl.hidden = false;
        outputEl.hidden = true;
        return;
    }

    const shift = parseInt(shiftValue, 10);
    if (Number.isNaN(shift)) {
        errorEl.textContent = "Please enter a valid number for the shift.";
        errorEl.hidden = false;
        outputEl.hidden = true;
        return;
    }

    errorEl.hidden = true;
    const result = caesar(message, shift, direction);
    document.getElementById("resultLabel").textContent = `Here is the ${direction}d result:`;
    document.getElementById("result").textContent = result;
    outputEl.hidden = false;
}

function resetForm() {
    document.getElementById("message").value = "";
    document.getElementById("shift").value = "3";
    document.getElementById("direction").value = "encode";
    document.getElementById("error").hidden = true;
    document.getElementById("output").hidden = true;
    document.getElementById("message").focus();
}

document.getElementById("logo").textContent = logo;
