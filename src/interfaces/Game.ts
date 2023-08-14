import { ZylemDebug } from '@/game/ZylemDebug';
import { ZylemStage } from '@/stage/ZylemStage';
import { Entity } from './Entity';
import { PerspectiveType } from './Perspective';
import ZylemGame from '@/game/ZylemGame';

export interface GameOptions {
	id: string;
	perspective: PerspectiveType;
	globals: Record<string, any>;
	stage: StageOptions;
	// TODO: use stage interface
	stages?: Record<string, Entity<ZylemStage>>;
	debug?: ZylemDebug;
}

type Concrete<Type> = {
	[Property in keyof Type]-?: Type[Property];
};

// TODO: find a way to dynamically get type from actual GameObject
// i.e. in the stage creation
// I want the "globals" variable to have proper type checking against
// the object literal that was just created above
export type Conditions<T> = (globals: Concrete<T>, game: ZylemGame) => void;

export interface StageOptions {
	backgroundColor: number;
	children: () => any[];
	conditions: Array<Conditions<GameOptions["globals"]>>;
}