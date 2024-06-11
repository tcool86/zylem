import { ZylemWorld } from "../collision/world";
import { ZylemScene } from "../rendering/scene";
import { EntityBlueprint, GameEntityOptions } from "../interfaces/entity";
import { Conditions } from "../interfaces/game";
import { Color, LineSegments, Vector3 } from "three";
import { ZylemHUD } from "../ui/hud";
import { EntityParameters, GameEntity } from "./";
import { World } from "@dimforge/rapier3d-compat";
import { PerspectiveType } from "../interfaces/perspective";
import { BaseEntity } from "./base-entity";
type ZylemStageOptions = {
    perspective: PerspectiveType;
    backgroundColor: Color;
    backgroundImage: String;
    gravity: Vector3;
    conditions: Conditions<any>[];
    children: ({ globals }: any) => GameEntity<any>[];
};
type StageOptions = GameEntityOptions<ZylemStageOptions, ZylemStage>;
declare const ZylemStage_base: import("ts-mixer/dist/types/types").Class<any[], BaseEntity<unknown>, new (options: import("../interfaces/entity").BaseEntityOptions<unknown>) => BaseEntity<unknown>>;
export declare class ZylemStage extends ZylemStage_base {
    protected type: string;
    perspective: PerspectiveType;
    backgroundColor: Color;
    backgroundImage: String;
    gravity: Vector3;
    world: ZylemWorld | null;
    scene: ZylemScene | null;
    HUD: ZylemHUD;
    conditions: Conditions<any>[];
    children: Array<GameEntity<any>>;
    _childrenMap: Map<string, GameEntity<any>>;
    _removalMap: Map<string, GameEntity<any>>;
    blueprints: Array<EntityBlueprint<any>>;
    _debugLines: LineSegments | null;
    constructor(options: StageOptions);
    createFromBlueprint(): Promise<ZylemStage>;
    buildStage(id: string): Promise<void>;
    setup(params: EntityParameters<ZylemStage>): Promise<void>;
    update(params: EntityParameters<ZylemStage>): void;
    destroy(params: EntityParameters<ZylemStage>): void;
    spawnEntity(child: GameEntity<any>): Promise<void>;
    setForRemoval(entity: GameEntity<any>): void;
    debugStage(world: World): void;
    getEntityByName(name: string): GameEntity<any> | null;
    logMissingEntities(): void;
    resize(width: number, height: number): void;
}
export declare function stage(options: StageOptions, ...acts: Function[]): ZylemStage;
export {};
