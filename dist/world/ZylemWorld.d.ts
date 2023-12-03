import { Entity, GameEntity } from '../interfaces/Entity';
import RAPIER from '@dimforge/rapier3d-compat';
export declare class ZylemWorld implements Entity<ZylemWorld> {
    _type: string;
    world: RAPIER.World;
    collisionDictionary: Map<number, Entity<any>>;
    static loadPhysics(): Promise<RAPIER.World>;
    constructor(world: RAPIER.World);
    addEntity(entity: GameEntity<any>): void;
    setup(): void;
    update(delta: number): void;
    updateColliders(): void;
    destroy(): void;
}