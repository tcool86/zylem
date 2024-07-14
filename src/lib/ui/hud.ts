import { Vector2 } from 'three';
import { Application, Text, Graphics } from 'pixi.js';
import { Mixin } from 'ts-mixer';

import { ZylemBlue } from '../interfaces/utility';
import { HUDLabel } from './hud-label';
import { HUDBar } from './hud-bar';

export interface HUDOptions<T> {
	binding?: string | null;
	bindings?: string[] | null;
	update: null | ((element: T, value: any) => void);
	position?: Vector2;
}

export interface HUDControl {
	_app: Application;
}

export interface HUDBarOptions extends HUDOptions<Text> {
	binding?: string | null;
	bindings?: string[] | null;
	update: null | ((element: Text, value: any) => void);
	position?: Vector2;
	style?: any;
}

export class ZylemHUD extends Mixin(HUDLabel, HUDBar) {
	_app: Application;
	_frame: Graphics;

	constructor() {
		const app = new Application();
		super(app);
		this._app = app;
		this._frame = new Graphics();
	}

	async createUI() {
		const uiStyle = document.createElement('style');
		uiStyle.textContent = `
			.zylem-game-ui {
				position: fixed;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
			}
		`;
		document.head.appendChild(uiStyle);
		const app = this._app;
		await app.init({ backgroundAlpha: 0,resizeTo: window });
		document.body.appendChild(app.canvas);
		app.canvas.classList.add('zylem-game-ui');

		const width = app.canvas.width;
		const height = app.canvas.height;
		const rect = new Graphics();
		this._frame.clear();
		this._frame.setStrokeStyle({ width: 6, color: ZylemBlue });
		rect.rect(0, 0, width, height);
		app.stage.addChild(this._frame);
	}

	updateTextPosition(position: Vector2, text: Text, width: number, height: number) {
		const percentX = position.x;
		const percentY = position.y;

		text.x = width / (100 / percentX);
		text.y = height / (100 / percentY);
	}
}