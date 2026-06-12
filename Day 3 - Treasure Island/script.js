const art = `*******************************************************************************
          |                   |                  |                     |
 _________|________________.=""_;=.______________|_____________________|_______
|                   |  ,-"_,=""     \`"=.|                  |
|___________________|__"=._o\`"-._        \`"=.______________|___________________
          |                \`"=._o\`"=._      _\`"=._                     |
 _________|_____________________:=._o "=._."_.-="'"=.__________________|_______
|                   |    __.--" , ; \`"=._o." ,-"""-._ ".   |
|___________________|_._"  ,. .\` \` \`\` ,  \`"-._"-._   ". '__|___________________
          |           |o\`"=._\` , "\` \`; .". ,  "-._"-._; ;              |
 _________|___________| ;\`-.o\`"=._; ." \` '\`."\ \` . "-._ /_______________|_______
|                   | |o ;    \`"-.o\`"=._\`\`  '\` " ,__.--o;   |
|___________________|_| ;     (#) \`-.o \`"=.\`_.--"_o.-; ;___|___________________
____/______/______/___|o;._    "      \`".o|o_.--"    ;o;____/______/______/____
/______/______/______/_"=._o--._        ; | ;        ; ;/______/______/______/_
____/______/______/______/__"=._o--._   ;o|o;     _._;o;____/______/______/____
/______/______/______/______/____"=._o._; | ;_.--"o.--"_/______/______/______/_
____/______/______/______/______/_____"=.o|o_.--""___/______/______/______/____
/______/______/______/______/______/______/______/______/______/______/_____ /
*******************************************************************************`;

const steps = {
  start: {
    prompt: 'You\'re at a crossroad. Where do you want to go?',
    choices: [
      { label: 'Left', value: 'left', next: 'lake' },
      { label: 'Right', value: 'right', outcome: 'You fell into a hole. Game Over.' }
    ]
  },
  lake: {
    prompt: 'You\'ve come to a lake. There is an island in the middle of the lake.',
    choices: [
      { label: 'Wait for a boat', value: 'wait', next: 'doors' },
      { label: 'Swim across', value: 'swim', outcome: 'You got attacked by an angry trout. Game Over.' }
    ]
  },
  doors: {
    prompt: 'You arrive at the island unharmed. There is a house with 3 doors. One red, one yellow and one blue. Which colour do you choose?',
    choices: [
      { label: 'Red', value: 'red', outcome: 'It\'s a room full of fire. Game Over.' },
      { label: 'Yellow', value: 'yellow', outcome: 'You found the treasure. You Win!' },
      { label: 'Blue', value: 'blue', outcome: 'You enter a room of beasts. Game Over.' }
    ]
  }
};

function showStep(stepKey) {
  const step = steps[stepKey];
  document.getElementById('prompt').textContent = step.prompt;
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';

  step.choices.forEach(function (choice) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = choice.label;
    button.onclick = function () {
      if (choice.outcome) {
        endGame(choice.outcome);
      } else {
        showStep(choice.next);
      }
    };
    choicesEl.appendChild(button);
  });
}

function endGame(message) {
  document.getElementById('game').hidden = true;
  const result = document.getElementById('result');
  result.textContent = message;
  result.className = message.includes('You Win') ? 'win' : 'lose';
  document.getElementById('restart').hidden = false;
}

function restartGame() {
  document.getElementById('game').hidden = false;
  document.getElementById('result').textContent = '';
  document.getElementById('result').className = '';
  document.getElementById('restart').hidden = true;
  showStep('start');
}

document.getElementById('art').textContent = art;
showStep('start');
