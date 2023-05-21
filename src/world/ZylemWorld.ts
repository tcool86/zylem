import { Entity, GameEntity } from '../interfaces/Entity';
import * as CANNON from 'cannon-es';


export class ZylemWorld implements Entity<ZylemWorld> {
	_type = 'World';
	world: CANNON.World;

	constructor() {
		this.world = new CANNON.World({
			// gravity: new CANNON.Vec3(0, -9.82, 0),
			gravity: new CANNON.Vec3(0, 0, 0),
		});
	}

	addEntity(entity: GameEntity<any>) {
		this.world.addBody(entity.body);
	}

	setup() { }

	update(delta: number) {
		if (!this.world) {
			return;
		}
		this.world.fixedStep();
	}

	destroy() { }

}