import { Color, Vector3 } from 'three';
import { gameState } from '../state/index';
import SpriteText from 'three-spritetext';
import { Application, TextStyle, Text, Graphics, Color as PColor, utils } from 'pixi.js';
import { ZylemCamera } from '~/lib/rendering/camera';
import { World } from '@dimforge/rapier3d-compat';

export interface HUDTextOptions {
	text: string;
	binding: string;
	position: Vector3;
}

export interface HUDText {
	sprite: SpriteText;
	binding: string;
	position: Vector3;
}

export class ZylemHUD {
	_app: Application | null = null;
	_hudText: HUDText[];

	constructor() {
		this._hudText = [];
		// this.cameraRef = zylemCamera;
	}

	createText({ text, binding, position }: HUDTextOptions) {
		const spriteText = new SpriteText(text);
		spriteText.textHeight = 2;
		const hudText = {
			sprite: spriteText,
			binding,
			position
		}
		this._hudText.push(hudText);
	}

	createUI() {
		const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement;
		canvas.classList.add('zylem-game-ui');
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
		const app = new Application({
			backgroundAlpha: 0,
			resizeTo: window,
			view: canvas
		});
		this._app = app;
		document.body.appendChild(canvas);
		const style = new TextStyle({
			fontFamily: 'Tahoma',
			fontSize: 36,
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: ['#ffffff', '#00ff99'], // gradient
			stroke: '#4a1850',
			strokeThickness: 5,
			dropShadow: true,
			dropShadowColor: '#000000',
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6,
			wordWrap: true,
			wordWrapWidth: 440,
			lineJoin: 'round',
		});

		const richText = new Text('Rich text with a lot of options and across multiple lines', style);

		richText.x = 100;
		richText.y = 220;

		app.stage.addChild(richText);
	}

	update() {
		if (!this._hudText) {
			return;
		}
		// const { x: camX, y: camY, z: camZ } = this.cameraRef.cameraRig.position;
		// this._hudText.forEach(hud => {
		// 	const { binding } = hud;
		// 	if (!binding) {
		// 		return;
		// 	}
		// 	const globals = gameState.globals;
		// 	const value = `${globals[binding]}`;
		// 	if (value) {
		// 		const { x, y, z } = hud.position;
		// 		hud.sprite.position.set(x + camX, y + camY, z + camZ);
		// 		hud.sprite.text = value;
		// 	}
		// })
	}
}