import { TOTAL_HEALTH, BEE_TYPES, GAME_SETTINGS } from "../config.js";
import { BeeSwarm } from "../classes/models.js";

class BeeGame {
  constructor() {
    this.swarm = new BeeSwarm();
    this.playerName = "";

    this.restoreState();
    this.initializeStatistics();
  }

  get totalHealth() {
    return TOTAL_HEALTH;
  }

  get beesCounter() {
    return this.swarm.bees.length;
  }

  get currentSwarmHealth() {
    return this.swarm.bees.reduce((sum, bee) => sum + bee.healthPoints, 0);
  }

  initializeStatistics() {
    const container = document.querySelector(".statistics-container");
    container.innerHTML = "";

    BEE_TYPES.forEach((beeType) => {
      const item = document.createElement("div");
      item.className = "statistics-item";
      item.innerHTML = `
        <b>${beeType.type.replace("Bee", "s")}</b>
        <img
          src="${beeType.imagePath}"
          alt="${beeType.type} Image"
          class="bee-image"
        />
        <div id="${beeType.type.toLowerCase()}-bee-counter"></div>
      `;

      container.appendChild(item);
    });

    this.updateBeeCounters();
  }

  restoreState() {
    const savedStates = JSON.parse(localStorage.getItem("beeGameStates")) || [];
    const latestState = savedStates[savedStates.length - 1];

    if (latestState) {
      this.playerName = latestState.playerName;
      this.swarm.bees.forEach((bee, index) => {
        if (latestState.bees[index] !== undefined) {
          bee.healthPoints = latestState.bees[index];
        }
      });
    }
  }

  startGame(playerName) {
    this.playerName = playerName;
    localStorage.setItem("playerName", playerName);
    this.swarm = new BeeSwarm();

    this.updateUI();
    this.saveState();
  }

  hit() {
    const hitBee = this.swarm.hitRandomBee();

    if (hitBee) {
      this.updateHitInfo(hitBee);
      this.updateUI();
      this.saveState();

      if (this.swarm.isGameOver()) {
        this.endGame();
      }
    }
  }

  updateHitInfo(hitBee) {
    const hitInfo = document.getElementById("hit-info");
    hitInfo.innerText = `Hit a ${hitBee.type}! Damage: ${hitBee.damage}. Health left: ${hitBee.healthPoints} HP`;
  }

  updateUI() {
    this.updateBeeCounters();
    this.updateSwarmHealth();
    this.updateBeeDisplay();
  }

  updateBeeCounters() {
    const aliveBeesCount = document.getElementById("alive-bees-count");
    aliveBeesCount.innerText = `${this.swarm.getAliveBees().length} / ${
      this.beesCounter
    }`;

    BEE_TYPES.forEach((beeType) => {
      const count = this.swarm.bees.filter(
        (bee) => bee.type === beeType.type && bee.isAlive()
      ).length;

      const counterElement = document.getElementById(
        `${beeType.type.toLowerCase()}-bee-counter`
      );
      if (counterElement) {
        counterElement.innerText = `${count} / ${beeType.count}`;
      }
    });
  }

  updateSwarmHealth() {
    const currentHealth = this.currentSwarmHealth;
    const swarmHealthCount = document.getElementById("swarm-health-count");

    swarmHealthCount.innerText = `${currentHealth} / ${this.totalHealth}`;
    this.updateSwarmHealthBar(currentHealth, this.totalHealth);
  }

  updateSwarmHealthBar(currentHealth, totalHealth) {
    const swarmHealthPercentage = (currentHealth / totalHealth) * 100;
    const swarmHealthColor = this.getHealthColor(swarmHealthPercentage);

    let healthBarContainer = document.getElementById(
      "swarm-health-bar-container"
    );
    if (!healthBarContainer) {
      healthBarContainer = document.createElement("div");
      healthBarContainer.id = "swarm-health-bar-container";
      document.getElementById("header").appendChild(healthBarContainer);
    }

    healthBarContainer.innerHTML = `
      <div class="swarm-health-bar-container">
          <div class="swarm-health-bar" style="background-color: ${swarmHealthColor}; width: ${swarmHealthPercentage}%;"></div>
      </div>
    `;
  }

  getHealthColor(percentage) {
    if (percentage > 50) return "green";
    if (percentage > 20) return "yellow";
    return "red";
  }

  updateBeeDisplay() {
    const beeContainer = document.getElementById("bee-container");
    beeContainer.innerHTML = "";

    this.swarm.bees.forEach((bee, index) => {
      const beeType = BEE_TYPES.find((type) => type.type === bee.type);
      if (beeType) {
        this.createBeeCard(
          beeType.imagePath,
          `${bee.type} Bee ${index + 1}`,
          bee.healthPoints,
          beeType.health,
          beeContainer
        );
      }
    });
  }

  createBeeCard(imageSrc, altText, healthPoints, maxHealth, container) {
    const healthBar = this.createHealthBar(healthPoints, maxHealth);
    const beeCard = document.createElement("div");
    beeCard.className = "bee-card";
    beeCard.innerHTML = `<img src="assets/${imageSrc}" alt="${altText}" class="bee-image"> ${healthBar}`;
    container.appendChild(beeCard);
  }

  createHealthBar(healthPoints, maxHealth) {
    const healthPercentage = (healthPoints / maxHealth) * 100;
    const healthColor = this.getHealthColor(healthPercentage);

    return `
      <div class="health-bar-container">
          <div class="swarm-health-bar" style="background-color: ${healthColor}; width: ${healthPercentage}%;"></div>
      </div>
      <p>${healthPoints} HP</p>
    `;
  }

  endGame() {
    document.getElementById("game-over").style.display = "block";
    localStorage.removeItem("beeGameStates");
    document.getElementById("hit-button").disabled = true;
  }

  saveState() {
    const savedStates = JSON.parse(localStorage.getItem("beeGameStates")) || [];
    const state = {
      playerName: this.playerName,
      bees: this.swarm.bees.map((bee) => bee.healthPoints),
      timestamp: new Date().toISOString(),
    };

    savedStates.push(state);

    if (savedStates.length > GAME_SETTINGS.maxSavedStates) {
      savedStates.shift();
    }

    localStorage.setItem("beeGameStates", JSON.stringify(savedStates));
  }
}

const game = new BeeGame();

document.getElementById("hit-button").addEventListener("click", () => {
  game.hit();
});

document.addEventListener("DOMContentLoaded", () => {
  const playerName = localStorage.getItem("playerName");
  if (playerName) {
    document.getElementById("player-name-display").innerText = `${playerName}`;
    game.updateUI();
  } else {
    window.location.href = "index.html";
  }
});

document.getElementById("reset-game").addEventListener("click", () => {
  localStorage.removeItem("beeGameStates");
  game.startGame(localStorage.getItem("playerName"));

  document.getElementById("game-over").style.display = "none";
  document.getElementById("hit-button").disabled = false;
});
