const adventures = {
  dragon: {
    0: {
      text: "You stand before the Dragon’s Lair. Smoke drifts from the entrance. Do you enter?",
      choices: [
        { text: "Enter the lair", next: 1 },
        { text: "Flee to the village", next: 99 }
      ]
    },
    1: {
      text: "You enter cautiously. A massive dragon opens one eye. It growls. Roll the dice to see if you can sneak past.",
      choices: [
        { text: "Roll Dice", next: "roll" }
      ]
    },
    roll: () => {
      const roll = Math.floor(Math.random() * 6) + 1;
      return roll >= 4
        ? { text: "You sneak past the dragon. You find a gold chalice.", next: 2, item: "Gold Chalice" }
        : { text: "The dragon awakens and breathes fire. You perish.", next: 99 };
    },
    2: {
      text: "You exit the lair with treasure in hand. A new adventure awaits!",
      choices: []
    },
    99: {
      text: "Your journey ends here.",
      choices: []
    }
  }
};

let inventory = [];

function startAdventure(name) {
  currentAdventure = adventures[name];
  currentSection = 0;
  inventory = [];
  showSection();
}

function showSection() {
  const section = currentAdventure[currentSection];
  document.getElementById("story").innerHTML = `<p>${section.text}</p>`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  if (section.choices) {
    section.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.onclick = () => {
        if (choice.next === "roll") {
          const outcome = currentAdventure.roll();
          currentSection = outcome.next;
          if (outcome.item) inventory.push(outcome.item);
          document.getElementById("story").innerHTML = `<p>${outcome.text}</p>`;
          updateInventory();
          showSection();
        } else {
          currentSection = choice.next;
          showSection();
        }
      };
      choicesDiv.appendChild(btn);
    });
  }

  updateInventory();
}

function updateInventory() {
  const inv = inventory.length > 0 ? "Inventory: " + inventory.join(", ") : "";
  document.getElementById("inventory").textContent = inv;
}
