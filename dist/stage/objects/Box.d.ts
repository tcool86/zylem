import { EntityOptions, GameEntity } from '../../interfaces/Entity';
import { ColliderDesc, RigidBody, RigidBodyDesc } from '@dimforge/rapier3d-compat';
import { Group, Mesh, Vector3, Color } from 'three';
export declare class ZylemBox implements GameEntity<ZylemBox> {
    _type: string;
    group: Group;
    mesh: Mesh;
    body?: RigidBody;
    size?: Vector3;
    static: boolean;
    color: Color;
    bodyDescription: RigidBodyDesc;
    _update: (delta: number, options: any) => void;
    _setup: (entity: ZylemBox) => void;
    constructor(options: EntityOptions);
    setup(): void;
    destroy(): void;
    update(delta: number, { inputs }: any): void;
    createMesh(vector3?: Vector3 | undefined): Mesh<import("three").BufferGeometry, import("three").Material | import("three").Material[]>;
    createBodyDescription(): RigidBodyDesc;
    createCollider(isSensor?: boolean): ColliderDesc;
}
