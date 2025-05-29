// --- Adventure Definitions ---
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
      text: "Inside, it's dark and hot. You see three paths: left toward a glowing gem, right toward bones, or forward deeper into the lair.",
      choices: [
        { text: "Go left", next: 2 },
        { text: "Go right", next: 3 },
        { text: "Go forward", next: 4 }
      ]
    },
    2: {
      text: "You find a small magical gem pulsing with light. It hums in your hand.",
      choices: [
        { text: "Take the gem", next: 5, item: "Glowing Gem" },
        { text: "Leave it", next: 1 }
      ]
    },
    3: {
      text: "Bones rattle as you step closer. A skeleton rises! It attacks.",
      choices: [
        { text: "Fight", next: "skeletonFight" },
        { text: "Run back", next: 1 }
      ]
    },
    skeletonFight: () => {
      const roll = Math.floor(Math.random() * 6) + 1;
      return roll >= 4
        ? { text: "You smash the skeleton into dust. Among the bones, you find a healing potion.", next: 1, item: "Healing Potion" }
        : { text: "The skeleton cuts you badly. You stagger back.", next: 1 };
    },
    4: {
      text: "You find the dragon resting atop a pile of gold. It's asleep… for now.",
      choices: [
        { text: "Sneak past it", next: "dragonSneak" },
        { text: "Attack it", next: "dragonFight" },
        { text: "Use Glowing Gem", next: "useGem" }
      ]
    },
    dragonSneak: () => {
      const roll = Math.floor(Math.random() * 6) + 1;
      return roll >= 5
        ? { text: "You silently pass by the dragon and grab a ruby-encrusted crown.", next: 6, item: "Crown of Fire" }
        : { text: "The dragon sniffs the air and awakens! Flames roar toward you.", next: 99 };
    },
    dragonFight: () => {
      const roll = Math.floor(Math.random() * 6) + 1;
      return roll === 6
        ? { text: "Against all odds, you slay the dragon and claim its hoard.", next: 6, item: "Dragon Fang" }
        : { text: "The dragon overpowers you. Your tale ends here.", next: 99 };
    },
    useGem: () => {
      if (player.inventory.includes("Glowing Gem")) {
        return { text: "The gem bursts into light, stunning the dragon. You escape with treasure.", next: 6, item: "Stolen Gold" };
      } else {
        return { text: "You have no gem to use. The dragon stirs...", next: 4 };
      }
    },
    5: {
      text: "You pocket the gem and head back to the main chamber.",
      choices: [{ text: "Return to crossroads", next: 1 }]
    },
    6: {
      text: "You escape the lair with treasure and tales of glory. Well done, adventurer.",
      choices: []
    },
    99: {
      text: "Your journey ends here.",
      choices: []
    }
  }
};

// --- Player Character System ---
let player = {
  name: "",
  stats: {
    strength: 0,
    agility: 0,
    magic: 0,
    health: 10
  },
  inventory: []
};

function createCharacter(settings) {
  player = {
    name: settings.name || "Adventurer",
    stats: settings.stats,
    inventory: []
  };
}

// --- Utility to display player stats ---
function updateStats() {
  document.getElementById("stats").innerHTML = `
    <strong>${player.name}</strong><br>
    HP: ${player.stats.health} | STR: ${player.stats.strength} | AGI: ${player.stats.agility} | MAG: ${player.stats.magic}
  `;
}

// --- Adventure Loader ---
function startAdventure(name) {
  switch (name) {
    case "dragon":
      createCharacter({
        name: "Aelar Flameborn",
        stats: { strength: 2, agility: 1, magic: 1, health: 12 }
      });
      currentAdventure = adventures.dragon;
      currentSection = 0;
      break;

    case "crypt":
      createCharacter({
        name: "Nyssa Moonshade",
        stats: { strength: 0, agility: 2, magic: 3, health: 8 }
      });
      currentAdventure = adventures.crypt;
      currentSection = 0;
      break;

    default:
      createCharacter({
        name: "Unknown Wanderer",
        stats: { strength: 1, agility: 1, magic: 1, health: 10 }
      });
      currentAdventure = adventures.dragon;
      currentSection = 0;
      break;
  }

  showSection();
}

// --- UI Update Functions ---
function updateInventory() {
  const inv = player.inventory.length > 0 ? "Inventory: " + player.inventory.join(", ") : "";
  document.getElementById("inventory").textContent = inv;
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
        if (typeof choice.next === "string" && typeof currentAdventure[choice.next] === "function") {
          const result = currentAdventure[choice.next]();
          currentSection = result.next;
          if (result.item) player.inventory.push(result.item);
          document.getElementById("story").innerHTML = `<p>${result.text}</p>`;
          updateInventory();
          showSection();
        } else {
          if (choice.item) player.inventory.push(choice.item);
          currentSection = choice.next;
          showSection();
        }
      };
      choicesDiv.appendChild(btn);
    });
  }

  updateInventory();
  updateStats();
}

let currentAdventure = null;
let currentSection = 0;
}
