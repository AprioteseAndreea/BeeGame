export const QUEEN_COUNT = 1;
export const WORKER_COUNT = 10;
export const DRONE_COUNT = 5;

export const QUEEN_HEALTH = 100;
export const WORKER_HEALTH = 50;
export const DRONE_HEALTH = 40;

export const QUEEN_DAMAGE = 20;
export const WORKER_DAMAGE = 10;
export const DRONE_DAMAGE = 15;

export const QUEEN_IMAGE_PATH = "../assets/queen-bee.png";
export const WORKER_IMAGE_PATH = "../assets/worker-bee.png";
export const DRONE_IMAGE_PATH = "../assets/drone-bee.png";

export const BEE_TYPES = [
  {
    type: "QueenBee",
    count: QUEEN_COUNT,
    health: QUEEN_HEALTH,
    damage: QUEEN_DAMAGE,
    imagePath: QUEEN_IMAGE_PATH,
  },
  {
    type: "WorkerBee",
    count: WORKER_COUNT,
    health: WORKER_HEALTH,
    damage: WORKER_DAMAGE,
    imagePath: WORKER_IMAGE_PATH,
  },
  {
    type: "DroneBee",
    count: DRONE_COUNT,
    health: DRONE_HEALTH,
    damage: DRONE_DAMAGE,
    imagePath: DRONE_IMAGE_PATH,
  },
];

export const TOTAL_HEALTH = BEE_TYPES.reduce(
  (total, beeType) => total + beeType.count * beeType.health,
  0
);

export const GAME_SETTINGS = {
  maxSavedStates: 100,
};
