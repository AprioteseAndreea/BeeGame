import { BEE_TYPES } from "../config.js";

export class Bee {
  constructor(type, healthPoints, damage, imagePath) {
    this.type = type;
    this.healthPoints = healthPoints;
    this.damage = damage;
    this.imagePath = imagePath
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

export class BeeSwarm {
  constructor() {
    this.bees = [];

    BEE_TYPES.forEach(beeType => {
      for (let i = 0; i < beeType.count; i++) {
        this.bees.push(new Bee(beeType.type, beeType.health, beeType.damage, beeType.imagePath));
      }
    });
  }

  hitRandomBee() {
    const aliveBees = this.getAliveBees();
    if (aliveBees.length > 0) {
      const randomIndex = Math.floor(Math.random() * aliveBees.length);
      const hitBee = aliveBees[randomIndex];
      hitBee.hit(Math.floor(Math.random() * hitBee.damage));
      return hitBee;
    }
    return null;
  }

  getAliveBees() {
    return this.bees.filter((bee) => bee.isAlive());
  }

  isGameOver() {
    const queenBee = this.bees.find(bee => bee.type === 'QueenBee');
    const isQueenAlive = queenBee ? queenBee.isAlive() : true;
    
    return this.bees.every((bee) => !bee.isAlive()) || !isQueenAlive;
  }
}
