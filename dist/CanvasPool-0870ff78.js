"use strict";const o=require("./main-aa62f8ec.js");class c{constructor(a){this._canvasPool=Object.create(null),this.canvasOptions=a||{},this.enableFullScreen=!1}_createCanvasAndContext(a,t){const s=o.DOMAdapter.get().createCanvas();s.width=a,s.height=t;const e=s.getContext("2d");return{canvas:s,context:e}}getOptimalCanvasAndContext(a,t,s=1){a=Math.ceil(a*s-1e-6),t=Math.ceil(t*s-1e-6),a=o.nextPow2(a),t=o.nextPow2(t);const e=(a<<17)+(t<<1);this._canvasPool[e]||(this._canvasPool[e]=[]);let n=this._canvasPool[e].pop();return n||(n=this._createCanvasAndContext(a,t)),n}returnCanvasAndContext(a){const t=a.canvas,{width:s,height:e}=t,n=(s<<17)+(e<<1);this._canvasPool[n].push(a)}clear(){this._canvasPool={}}}const l=new c;exports.CanvasPool=l;
