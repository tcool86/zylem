// Zylem Stage should combine a world with a scene
import { ZylemWorld } from "../world/ZylemWorld";
import { ZylemScene } from "../scene/ZylemScene";
import { Entity, EntityBlueprint } from "../interfaces/Entity";
import { ZylemBox, ZylemSphere } from "./objects";
import { UpdateOptions } from "@/interfaces/Update";
import { Moveable } from "./objects/Moveable";
import { Interactive } from "./objects/Interactive";

export class ZylemStage implements Entity<ZylemStage> {
	_type = 'Stage';
	world: ZylemWorld | null;
	scene: ZylemScene | null;
	children: Array<Entity<any>> = [];
	blueprints: Array<EntityBlueprint<any>> = [];

	constructor(id: string) {
		this.world = null;
		this.scene = new ZylemScene(id);
	}

	async buildStage(options: any) {
		const physicsWorld = await ZylemWorld.loadPhysics();
		this.world = new ZylemWorld(physicsWorld);
		this.blueprints = options.children() || [];
		await this.setup();
	}

	async setup() {
		if (!this.scene || !this.world) {
			this.logMissingEntities();
			return;
		}
		for (let blueprint of this.blueprints) {
			const BlueprintType = BlueprintMap[blueprint.type];
			const MoveableType = Moveable(BlueprintType);
			const InteractiveType = Interactive(MoveableType);

			const entity = new InteractiveType(blueprint);
			entity.name = blueprint.name;
			if (entity.mesh) {
				this.scene.scene.add(entity.mesh);
			}
			if (entity.body) {
				this.world.addEntity(entity);
			}
			this.children.push(entity);
			if (blueprint.props) {
				entity._props = blueprint.props;
			}
			if (blueprint.collision) {
				entity._collision = blueprint.collision;
			}
			if (typeof blueprint.update !== 'function') {
				console.warn(`Entity ${blueprint.name} is missing an update function.`);
			}
			if (typeof blueprint.setup !== 'function') {
				console.warn(`Entity ${blueprint.name} is missing a setup function.`);
				continue;
			}
			blueprint.setup(entity);
		}
	}

	destroy() {
		this.world?.destroy();
		this.scene?.destroy();
	}

	update(delta: number, options: UpdateOptions<Entity<any>>) {
		if (!this.scene || !this.world) {
			this.logMissingEntities();
			return;
		}
		this.world.update(delta);
		for (let child of this.children) {
			child.update(delta, {
				inputs: options.inputs,
				entity: child,
			});
		}
		this.scene.update(delta);
	}

	logMissingEntities() {
		console.warn("Zylem world or scene is null");
	}
}

const BlueprintMap = {
	'Box': ZylemBox,
	'Sphere': ZylemSphere,
}
