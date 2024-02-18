import { ActiveCollisionTypes, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d-compat";
import { Color, Vector2, Vector3 } from "three";

export interface BoxCollisionInterface {
	createCollision: (params: CreateCollisionParameters) => void;
}

export type CreateCollisionParameters = {
	isDynamicBody?: boolean;
	size?: Vector3 | undefined;
}

export class BaseCollision {
	bodyDescription: RigidBodyDesc | null = null;
	debugCollision: boolean = false;
	debugColor: Color = new Color().setColorName('green');

	createCollision({ isDynamicBody = true }) {
		const type = isDynamicBody ? RigidBodyType.Dynamic : RigidBodyType.Fixed;
		this.bodyDescription = new RigidBodyDesc(type)
			.setTranslation(0, 0, 0)
			.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
			.setGravityScale(1.0)
			.setCanSleep(false)
			.setCcdEnabled(false);
	}
}

export class BoxCollision extends BaseCollision {
	size: Vector3 = new Vector3(1, 1, 1);

	createCollision({ isDynamicBody = true }) {
		const type = isDynamicBody ? RigidBodyType.Dynamic : RigidBodyType.Fixed;
		this.bodyDescription = new RigidBodyDesc(type)
			.setTranslation(0, 0, 0)
			.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
			.setGravityScale(1.0)
			.setCanSleep(false)
			.setCcdEnabled(false);
	}

	createCollider(isSensor: boolean = false) {
		const size = this.size || new Vector3(1, 1, 1);
		const half = { x: size.x / 2, y: size.y / 2, z: size.z / 2 };
		let colliderDesc = ColliderDesc.cuboid(half.x, half.y, half.z);
		colliderDesc.setSensor(isSensor);
		// "KINEMATIC_FIXED" will only sense actors moving through the sensor
		// colliderDesc.setActiveHooks(RAPIER.ActiveHooks.FILTER_INTERSECTION_PAIRS);
		colliderDesc.activeCollisionTypes = (isSensor) ? ActiveCollisionTypes.KINEMATIC_FIXED : ActiveCollisionTypes.DEFAULT;
		return colliderDesc;
	}
}

export class PlaneCollision extends BaseCollision {
	tile: Vector2 = new Vector2(1, 1);

	createCollision({ isDynamicBody = false }) {
		const type = isDynamicBody ? RigidBodyType.Dynamic : RigidBodyType.Fixed;
		this.bodyDescription = new RigidBodyDesc(type)
			.setTranslation(0, 0, 0)
			.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
			.setGravityScale(1.0)
			.setCanSleep(false)
			.setCcdEnabled(false);
	}

	createCollider(isSensor: boolean = false) {
		const tile = this.tile || new Vector2(1, 1);
		// const float32Array: Float32Array = new Float32Array(1);
		// let colliderDesc = ColliderDesc.heightfield(tile.x, tile.y, float32Array, new Vector3(1, 1, 1));
		const half = { x: tile.x / 2, y: 1 / 2, z: tile.y / 2 };
		let colliderDesc = ColliderDesc.cuboid(half.x, half.y, half.z);
		colliderDesc.setSensor(isSensor);
		// "KINEMATIC_FIXED" will only sense actors moving through the sensor
		// colliderDesc.setActiveHooks(RAPIER.ActiveHooks.FILTER_INTERSECTION_PAIRS);
		colliderDesc.activeCollisionTypes = (isSensor) ? ActiveCollisionTypes.KINEMATIC_FIXED : ActiveCollisionTypes.DEFAULT;
		return colliderDesc;
	}
}

export class SphereCollision extends BaseCollision {
	radius: number = 1;

	createCollision({ isDynamicBody = true }) {
		const type = isDynamicBody ? RigidBodyType.Dynamic : RigidBodyType.Fixed;
		this.bodyDescription = new RigidBodyDesc(type)
			.setTranslation(0, 0, 0)
			.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
			.setGravityScale(1.0)
			.setCanSleep(false)
			.setCcdEnabled(false);
	}

	createCollider(isSensor: boolean = false) {
		const radius = this.radius || 1;
		const half = radius / 2;
		let colliderDesc = ColliderDesc.ball(half);
		colliderDesc.setSensor(isSensor);
		colliderDesc.activeCollisionTypes = (isSensor) ? ActiveCollisionTypes.KINEMATIC_FIXED : ActiveCollisionTypes.DEFAULT;
		return colliderDesc;
	}
}

export class SpriteCollision extends BaseCollision {
	collisionSize: Vector3 = new Vector3(1, 1, 1);
	size: Vector3 = new Vector3(1, 1, 1);

	createCollision({ isDynamicBody = true, isSensor = false }) {
		const gravityScale = (isSensor) ? 0.0 : 1.0;
		const type = isDynamicBody ? RigidBodyType.Dynamic : RigidBodyType.Fixed;
		this.bodyDescription = new RigidBodyDesc(type)
			.setTranslation(0, 0, 0)
			.lockRotations()
			.setGravityScale(gravityScale)
			.setCanSleep(false)
			.setCcdEnabled(false);
	}

	createCollider(isSensor: boolean = false) {
		const { x, y, z } = this.collisionSize ?? this.size;
		const size = new Vector3(x, y, z);
		const half = { x: size.x / 2, y: size.y / 2, z: size.z / 2 };
		let colliderDesc = ColliderDesc.cuboid(half.x, half.y, half.z);
		colliderDesc.setSensor(isSensor);
		colliderDesc.activeCollisionTypes = (isSensor) ? ActiveCollisionTypes.KINEMATIC_FIXED : ActiveCollisionTypes.DEFAULT;
		// if (this._debug) {
		// 	this.createDebugMesh(new BoxGeometry(x, y, z));
		// }
		return colliderDesc;
	}
}