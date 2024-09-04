import { QUEEN_HEALTH, QUEEN_DAMAGE, WORKER_HEALTH, WORKER_DAMAGE, DRONE_HEALTH, DRONE_DAMAGE } from '../config.js';

export class Bee {
    constructor(type, healthPoints, damage) {
        this.type = type;
        this.healthPoints = healthPoints;
        this.damage = damage;
    }

    hit() {
        this.healthPoints -= this.damage;
        if (this.healthPoints < 0) this.healthPoints = 0;
        return this.healthPoints;
    }

    isAlive() {
        return this.healthPoints > 0;
    }
}

export class QueenBee extends Bee {
    constructor() {
        super('Queen', QUEEN_HEALTH, QUEEN_DAMAGE);
    }
}

export class WorkerBee extends Bee {
    constructor() {
        super('Worker', WORKER_HEALTH, WORKER_DAMAGE);
    }
}

export class DroneBee extends Bee {
    constructor() {
        super('Drone', DRONE_HEALTH, DRONE_DAMAGE);
    }
}