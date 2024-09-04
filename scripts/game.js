import { QueenBee, WorkerBee, DroneBee } from "../classes/models.js";
import {
  QUEEN_COUNT,
  WORKER_COUNT,
  DRONE_COUNT,
  QUEEN_HEALTH,
  WORKER_HEALTH,
  DRONE_HEALTH,
} from "../config.js";

class BeeSwarm {
  constructor() {
    this.queen = new QueenBee();
    this.workers = Array.from({ length: WORKER_COUNT }, () => new WorkerBee());
    this.drones = Array.from({ length: DRONE_COUNT }, () => new DroneBee());
  }

  getAllBees() {
    return [this.queen, ...this.workers, ...this.drones];
  }

  getAliveBees() {
    return this.getAllBees().filter((bee) => bee.isAlive());
  }

  hitRandomBee() {
    const aliveBees = this.getAliveBees();
    const randomIndex = Math.floor(Math.random() * aliveBees.length);
    const hitBee = aliveBees[randomIndex];
    hitBee.hit();
    return hitBee;
  }

  isGameOver() {
    return !this.queen.isAlive() || this.getAliveBees().length === 0;
  }
}

class BeeGame {
  constructor() {
    this.swarm = new BeeSwarm();
    this.playerName = "";

    this.restoreState();
  }

  restoreState() {
    const savedStates = JSON.parse(localStorage.getItem("beeGameStates")) || [];
    const latestState = savedStates[savedStates.length - 1];

    if (latestState) {
      this.playerName = latestState.playerName;

      this.swarm.queen.healthPoints = latestState.queen;
      this.swarm.workers.forEach((worker, index) => {
        worker.healthPoints = latestState.workers[index] || WORKER_HEALTH;
      });
      this.swarm.drones.forEach((drone, index) => {
        drone.healthPoints = latestState.drones[index] || DRONE_HEALTH;
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

    this.updateHitInfo(hitBee);
    this.updateUI();
    this.saveState();

    if (this.swarm.isGameOver()) {
      this.endGame();
    }
  }

  updateHitInfo(hitBee) {
    const hitInfo = document.getElementById("hit-info");
    hitInfo.innerText = `Hit a ${hitBee.type}! Damage: ${hitBee.damage}. Health left: ${hitBee.healthPoints} HP`;
  }

  updateUI() {
    const playerName = localStorage.getItem("playerName");

    const playerNameDisplay = document.getElementById("player-name-display");
    const aliveBeesCount = document.getElementById("alive-bees-count");
    const swarmHealthCount = document.getElementById("swarm-health-count");
    const queenBeeCounter = document.getElementById("queen-bee-counter");
    const workerBeeCounter = document.getElementById("worker-bee-counter");
    const droneBeeCounter = document.getElementById("drone-bee-counter");
    const beeContainer = document.getElementById("bee-container");

    const beesCounter = QUEEN_COUNT + WORKER_COUNT + DRONE_COUNT;

    playerNameDisplay.innerText = `${playerName}`;
    aliveBeesCount.innerText = `${
      this.swarm.getAliveBees().length
    } / ${beesCounter}`;

    const totalHealth =
      QUEEN_COUNT * QUEEN_HEALTH +
      WORKER_COUNT * WORKER_HEALTH +
      DRONE_COUNT * DRONE_HEALTH;
    const currentHealth =
      this.swarm.queen.healthPoints +
      this.swarm.workers.reduce((sum, worker) => sum + worker.healthPoints, 0) +
      this.swarm.drones.reduce((sum, drone) => sum + drone.healthPoints, 0);

    swarmHealthCount.innerText = `${currentHealth} / ${totalHealth}`;

    const swarmHealthPercentage = (currentHealth / totalHealth) * 100;
    let swarmHealthColor;

    if (swarmHealthPercentage > 50) {
      swarmHealthColor = "green";
    } else if (swarmHealthPercentage > 20) {
      swarmHealthColor = "yellow";
    } else {
      swarmHealthColor = "red";
    }

    const swarmHealthBar = `
        <div class="swarm-health-bar-container">
            <div class="swarm-health-bar" style="background-color: ${swarmHealthColor}; width: ${swarmHealthPercentage}%;"></div>
        </div>
    `;

    if (document.getElementById("swarm-health-bar-container")) {
      document.getElementById("swarm-health-bar-container").innerHTML =
        swarmHealthBar;
    } else {
      const swarmHealthContainer = document.createElement("div");
      swarmHealthContainer.id = "swarm-health-bar-container";
      swarmHealthContainer.innerHTML = swarmHealthBar;
      document.getElementById("header").appendChild(swarmHealthContainer);
    }

    queenBeeCounter.innerText = `${
      this.swarm.queen.isAlive() ? 1 : 0
    } / ${QUEEN_COUNT}`;
    workerBeeCounter.innerText = `${
      this.swarm.workers.filter((worker) => worker.isAlive()).length
    } / ${WORKER_COUNT}`;
    droneBeeCounter.innerText = `${
      this.swarm.drones.filter((drone) => drone.isAlive()).length
    } / ${DRONE_COUNT}`;

    beeContainer.innerHTML = "";

    const createHealthBar = (healthPoints, maxHealth) => {
      const healthPercentage = (healthPoints / maxHealth) * 100;
      let healthColor;

      if (healthPercentage > 50) {
        healthColor = "green";
      } else if (healthPercentage > 20) {
        healthColor = "yellow";
      } else {
        healthColor = "red";
      }

      return `
            <div class="health-bar-container">
                <div class="swarm-health-bar" style="background-color: ${healthColor}; width: ${healthPercentage}%;"></div>
            </div>
            <p>${healthPoints} HP</p>
        `;
    };

    const queenHealthBar = createHealthBar(
      this.swarm.queen.healthPoints,
      QUEEN_HEALTH
    );
    const queenContainer = document.createElement("div");
    queenContainer.className = "bee-card";
    queenContainer.innerHTML = `
        <img src="assets/queen-bee.png" alt="Queen Bee" class="bee-image">
        ${queenHealthBar}
    `;
    beeContainer.appendChild(queenContainer);

    this.swarm.workers.forEach((worker, index) => {
      const workerHealthBar = createHealthBar(
        worker.healthPoints,
        WORKER_HEALTH
      );
      const workerContainer = document.createElement("div");
      workerContainer.className = "bee-card";
      workerContainer.innerHTML = `
            <img src="assets/worker-bee.png" alt="Worker Bee ${
              index + 1
            }" class="bee-image">
            ${workerHealthBar}
        `;
      beeContainer.appendChild(workerContainer);
    });

    this.swarm.drones.forEach((drone, index) => {
      const droneHealthBar = createHealthBar(drone.healthPoints, DRONE_HEALTH);
      const droneContainer = document.createElement("div");
      droneContainer.className = "bee-card";
      droneContainer.innerHTML = `
            <img src="assets/drone-bee.png" alt="Drone Bee ${
              index + 1
            }" class="bee-image">
            ${droneHealthBar}
        `;
      beeContainer.appendChild(droneContainer);
    });
  }

  endGame() {
    document.getElementById("game-over").style.display = "block";
    localStorage.removeItem("beeGameState");

    document.getElementById("hit-button").disabled = true;
  }

  saveState() {
    const savedStates = JSON.parse(localStorage.getItem("beeGameStates")) || [];

    const state = {
      playerName: this.playerName,
      queen: this.swarm.queen.healthPoints,
      workers: this.swarm.workers.map((worker) => worker.healthPoints),
      drones: this.swarm.drones.map((drone) => drone.healthPoints),
      timestamp: new Date().toISOString(),
    };

    savedStates.push(state);

    if (savedStates.length > 100) {
      savedStates.shift();
    }

    localStorage.setItem("beeGameStates", JSON.stringify(savedStates));
  }
}

const game = new BeeGame();

document.getElementById("hit-button").addEventListener("click", () => {
  game.hit();
});

document.getElementById("restart-game").addEventListener("click", () => {
  game.startGame(localStorage.getItem("playerName"));

  const gameOverText = document.getElementById("game-over");
  if (gameOverText) {
    gameOverText.style.display = "none";
  }

  const hitButton = document.getElementById("hit-button");
  if (hitButton) {
    hitButton.disabled = false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const playerName = localStorage.getItem("playerName");
  if (playerName) {
    console.log("Player name found in localStorage:", playerName);
    document.getElementById("player-name-display").innerText = `${playerName}`;
    game.updateUI();
  } else {
    console.log("No player name found in localStorage");
    window.location.href = "index.html";
  }
});
document.getElementById("reset-game").addEventListener("click", () => {
  localStorage.removeItem("beeGameStates");

  game.startGame(localStorage.getItem("playerName"));

  const gameOverText = document.getElementById("game-over");
  if (gameOverText) {
    gameOverText.style.display = "none";
  }

  const hitButton = document.getElementById("hit-button");
  if (hitButton) {
    hitButton.disabled = false;
  }
});
