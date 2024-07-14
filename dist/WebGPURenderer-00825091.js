"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const u=require("./main-aa62f8ec.js"),l=require("./colorToUniform-4aa8a72e.js"),b=require("./SharedSystems-60b106dd.js"),P=require("./CanvasPool-0870ff78.js"),y=l.State.for2d();class T{init(){const e=l.compileHighShaderGpuProgram({name:"batch",bits:[l.colorBit,l.generateTextureBatchBit(u.getMaxTexturesPerBatch()),l.roundPixelsBit]});this._shader=new l.Shader({gpuProgram:e,groups:{}})}start(e,t){const r=e.renderer,s=r.encoder,i=this._shader.gpuProgram;this._geometry=t,s.setGeometry(t),y.blendMode="normal",r.pipeline.getPipeline(t,i,y);const n=r.globalUniforms.bindGroup;s.resetBindGroup(1),s.setBindGroup(0,n,i)}execute(e,t){const r=this._shader.gpuProgram,s=e.renderer,i=s.encoder;if(!t.bindGroup){const c=t.textures;t.bindGroup=u.getTextureBatchBindGroup(c.textures,c.count)}y.blendMode=t.blendMode;const n=s.bindGroup.getBindGroup(t.bindGroup,r,1),o=s.pipeline.getPipeline(this._geometry,r,y);t.bindGroup._touch(s.textureGC.count),i.setPipeline(o),i.renderPassEncoder.setBindGroup(1,n),i.renderPassEncoder.drawIndexed(t.size,1,t.start)}destroy(){this._shader.destroy(!0),this._shader=null}}T.extension={type:[u.ExtensionType.WebGPUPipesAdaptor],name:"batch"};class C{constructor(e){this._hash=Object.create(null),this._renderer=e}contextChange(e){this._gpu=e}getBindGroup(e,t,r){return e._updateKey(),this._hash[e._key]||this._createBindGroup(e,t,r)}_createBindGroup(e,t,r){const s=this._gpu.device,i=t.layout[r],n=[],o=this._renderer;for(const g in i){const p=e.resources[g]??e.resources[i[g]];let f;if(p._resourceType==="uniformGroup"){const h=p;o.ubo.updateUniformGroup(h);const m=h.buffer;f={buffer:o.buffer.getGPUBuffer(m),offset:0,size:m.descriptor.size}}else if(p._resourceType==="buffer"){const h=p;f={buffer:o.buffer.getGPUBuffer(h),offset:0,size:h.descriptor.size}}else if(p._resourceType==="bufferResource"){const h=p;f={buffer:o.buffer.getGPUBuffer(h.buffer),offset:h.offset,size:h.size}}else if(p._resourceType==="textureSampler"){const h=p;f=o.texture.getGpuSampler(h)}else if(p._resourceType==="textureSource"){const h=p;f=o.texture.getGpuSource(h).createView({})}n.push({binding:i[g],resource:f})}const c=o.shader.getProgramData(t).bindGroups[r],d=s.createBindGroup({layout:c,entries:n});return this._hash[e._key]=d,d}destroy(){for(const e of Object.keys(this._hash))this._hash[e]=null;this._hash=null,this._renderer=null}}C.extension={type:[u.ExtensionType.WebGPUSystem],name:"bindGroup"};class v{constructor(){this._gpuBuffers=Object.create(null),this._managedBuffers=[]}contextChange(e){this._gpu=e}getGPUBuffer(e){return this._gpuBuffers[e.uid]||this.createGPUBuffer(e)}updateBuffer(e){const t=this._gpuBuffers[e.uid]||this.createGPUBuffer(e),r=e.data;return e._updateID&&r&&(e._updateID=0,this._gpu.device.queue.writeBuffer(t,0,r.buffer,0,(e._updateSize||r.byteLength)+3&-4)),t}destroyAll(){for(const e in this._gpuBuffers)this._gpuBuffers[e].destroy();this._gpuBuffers={}}createGPUBuffer(e){this._gpuBuffers[e.uid]||(e.on("update",this.updateBuffer,this),e.on("change",this.onBufferChange,this),e.on("destroy",this.onBufferDestroy,this),this._managedBuffers.push(e));const t=this._gpu.device.createBuffer(e.descriptor);return e._updateID=0,e.data&&(u.fastCopy(e.data.buffer,t.getMappedRange()),t.unmap()),this._gpuBuffers[e.uid]=t,t}onBufferChange(e){this._gpuBuffers[e.uid].destroy(),e._updateID=0,this._gpuBuffers[e.uid]=this.createGPUBuffer(e)}onBufferDestroy(e){this._managedBuffers.splice(this._managedBuffers.indexOf(e),1),this._destroyBuffer(e)}destroy(){this._managedBuffers.forEach(e=>this._destroyBuffer(e)),this._managedBuffers=null,this._gpuBuffers=null}_destroyBuffer(e){this._gpuBuffers[e.uid].destroy(),e.off("update",this.updateBuffer,this),e.off("change",this.onBufferChange,this),e.off("destroy",this.onBufferDestroy,this),this._gpuBuffers[e.uid]=null}}v.extension={type:[u.ExtensionType.WebGPUSystem],name:"buffer"};class j{constructor({minUniformOffsetAlignment:e}){this._minUniformOffsetAlignment=256,this.byteIndex=0,this._minUniformOffsetAlignment=e,this.data=new Float32Array(65535)}clear(){this.byteIndex=0}addEmptyGroup(e){if(e>this._minUniformOffsetAlignment/4)throw new Error(`UniformBufferBatch: array is too large: ${e*4}`);const t=this.byteIndex;let r=t+e*4;if(r=Math.ceil(r/this._minUniformOffsetAlignment)*this._minUniformOffsetAlignment,r>this.data.length*4)throw new Error("UniformBufferBatch: ubo batch got too big");return this.byteIndex=r,t}addGroup(e){const t=this.addEmptyGroup(e.length);for(let r=0;r<e.length;r++)this.data[t/4+r]=e[r];return t}destroy(){this._buffer.destroy(),this._buffer=null,this.data=null}}class U{constructor(e){this._colorMaskCache=15,this._renderer=e}setMask(e){this._colorMaskCache!==e&&(this._colorMaskCache=e,this._renderer.pipeline.setColorMask(e))}destroy(){this._renderer=null,this._colorMaskCache=null}}U.extension={type:[u.ExtensionType.WebGPUSystem],name:"colorMask"};class S{constructor(e){this._renderer=e}async init(e){return this._initPromise?this._initPromise:(this._initPromise=this._createDeviceAndAdaptor(e).then(t=>{this.gpu=t,this._renderer.runners.contextChange.emit(this.gpu)}),this._initPromise)}contextChange(e){this._renderer.gpu=e}async _createDeviceAndAdaptor(e){const t=await navigator.gpu.requestAdapter({powerPreference:e.powerPreference,forceFallbackAdapter:e.forceFallbackAdapter}),r=["texture-compression-bc","texture-compression-astc","texture-compression-etc2"].filter(i=>t.features.has(i)),s=await t.requestDevice({requiredFeatures:r});return{adapter:t,device:s}}destroy(){this.gpu=null,this._renderer=null}}S.extension={type:[u.ExtensionType.WebGPUSystem],name:"device"};S.defaultOptions={powerPreference:void 0,forceFallbackAdapter:!1};class E{constructor(e){this._boundBindGroup=Object.create(null),this._boundVertexBuffer=Object.create(null),this._renderer=e}renderStart(){this.commandFinished=new Promise(e=>{this._resolveCommandFinished=e}),this.commandEncoder=this._renderer.gpu.device.createCommandEncoder()}beginRenderPass(e){this.endRenderPass(),this._clearCache(),this.renderPassEncoder=this.commandEncoder.beginRenderPass(e.descriptor)}endRenderPass(){this.renderPassEncoder&&this.renderPassEncoder.end(),this.renderPassEncoder=null}setViewport(e){this.renderPassEncoder.setViewport(e.x,e.y,e.width,e.height,0,1)}setPipelineFromGeometryProgramAndState(e,t,r,s){const i=this._renderer.pipeline.getPipeline(e,t,r,s);this.setPipeline(i)}setPipeline(e){this._boundPipeline!==e&&(this._boundPipeline=e,this.renderPassEncoder.setPipeline(e))}_setVertexBuffer(e,t){this._boundVertexBuffer[e]!==t&&(this._boundVertexBuffer[e]=t,this.renderPassEncoder.setVertexBuffer(e,this._renderer.buffer.updateBuffer(t)))}_setIndexBuffer(e){if(this._boundIndexBuffer===e)return;this._boundIndexBuffer=e;const t=e.data.BYTES_PER_ELEMENT===2?"uint16":"uint32";this.renderPassEncoder.setIndexBuffer(this._renderer.buffer.updateBuffer(e),t)}resetBindGroup(e){this._boundBindGroup[e]=null}setBindGroup(e,t,r){if(this._boundBindGroup[e]===t)return;this._boundBindGroup[e]=t,t._touch(this._renderer.textureGC.count);const s=this._renderer.bindGroup.getBindGroup(t,r,e);this.renderPassEncoder.setBindGroup(e,s)}setGeometry(e){for(const t in e.attributes){const r=e.attributes[t];this._setVertexBuffer(r.location,r.buffer)}e.indexBuffer&&this._setIndexBuffer(e.indexBuffer)}_setShaderBindGroups(e,t){for(const r in e.groups){const s=e.groups[r];t||this._syncBindGroup(s),this.setBindGroup(r,s,e.gpuProgram)}}_syncBindGroup(e){for(const t in e.resources){const r=e.resources[t];r.isUniformGroup&&this._renderer.ubo.updateUniformGroup(r)}}draw(e){const{geometry:t,shader:r,state:s,topology:i,size:n,start:o,instanceCount:c,skipSync:d}=e;this.setPipelineFromGeometryProgramAndState(t,r.gpuProgram,s,i),this.setGeometry(t),this._setShaderBindGroups(r,d),t.indexBuffer?this.renderPassEncoder.drawIndexed(n||t.indexBuffer.data.length,c||t.instanceCount,o||0):this.renderPassEncoder.draw(n||t.getSize(),c||t.instanceCount,o||0)}finishRenderPass(){this.renderPassEncoder&&(this.renderPassEncoder.end(),this.renderPassEncoder=null)}postrender(){this.finishRenderPass(),this._gpu.device.queue.submit([this.commandEncoder.finish()]),this._resolveCommandFinished(),this.commandEncoder=null}restoreRenderPass(){const e=this._renderer.renderTarget.adaptor.getDescriptor(this._renderer.renderTarget.renderTarget,!1,[0,0,0,1]);this.renderPassEncoder=this.commandEncoder.beginRenderPass(e);const t=this._boundPipeline,r={...this._boundVertexBuffer},s=this._boundIndexBuffer,i={...this._boundBindGroup};this._clearCache();const n=this._renderer.renderTarget.viewport;this.renderPassEncoder.setViewport(n.x,n.y,n.width,n.height,0,1),this.setPipeline(t);for(const o in r)this._setVertexBuffer(o,r[o]);for(const o in i)this.setBindGroup(o,i[o],null);this._setIndexBuffer(s)}_clearCache(){for(let e=0;e<16;e++)this._boundBindGroup[e]=null,this._boundVertexBuffer[e]=null;this._boundIndexBuffer=null,this._boundPipeline=null}destroy(){this._renderer=null,this._gpu=null,this._boundBindGroup=null,this._boundVertexBuffer=null,this._boundIndexBuffer=null,this._boundPipeline=null}contextChange(e){this._gpu=e}}E.extension={type:[u.ExtensionType.WebGPUSystem],name:"encoder",priority:1};class M{constructor(e){this._renderTargetStencilState=Object.create(null),this._renderer=e,e.renderTarget.onRenderTargetChange.add(this)}onRenderTargetChange(e){let t=this._renderTargetStencilState[e.uid];t||(t=this._renderTargetStencilState[e.uid]={stencilMode:u.STENCIL_MODES.DISABLED,stencilReference:0}),this._activeRenderTarget=e,this.setStencilMode(t.stencilMode,t.stencilReference)}setStencilMode(e,t){const r=this._renderTargetStencilState[this._activeRenderTarget.uid];r.stencilMode=e,r.stencilReference=t;const s=this._renderer;s.pipeline.setStencilMode(e),s.encoder.renderPassEncoder.setStencilReference(t)}destroy(){this._renderer.renderTarget.onRenderTargetChange.remove(this),this._renderer=null,this._activeRenderTarget=null,this._renderTargetStencilState=null}}M.extension={type:[u.ExtensionType.WebGPUSystem],name:"stencil"};const G={i32:{align:4,size:4},u32:{align:4,size:4},f32:{align:4,size:4},f16:{align:2,size:2},"vec2<i32>":{align:8,size:8},"vec2<u32>":{align:8,size:8},"vec2<f32>":{align:8,size:8},"vec2<f16>":{align:4,size:4},"vec3<i32>":{align:16,size:12},"vec3<u32>":{align:16,size:12},"vec3<f32>":{align:16,size:12},"vec3<f16>":{align:8,size:6},"vec4<i32>":{align:16,size:16},"vec4<u32>":{align:16,size:16},"vec4<f32>":{align:16,size:16},"vec4<f16>":{align:8,size:8},"mat2x2<f32>":{align:8,size:16},"mat2x2<f16>":{align:4,size:8},"mat3x2<f32>":{align:8,size:24},"mat3x2<f16>":{align:4,size:12},"mat4x2<f32>":{align:8,size:32},"mat4x2<f16>":{align:4,size:16},"mat2x3<f32>":{align:16,size:32},"mat2x3<f16>":{align:8,size:16},"mat3x3<f32>":{align:16,size:48},"mat3x3<f16>":{align:8,size:24},"mat4x3<f32>":{align:16,size:64},"mat4x3<f16>":{align:8,size:32},"mat2x4<f32>":{align:16,size:32},"mat2x4<f16>":{align:8,size:16},"mat3x4<f32>":{align:16,size:48},"mat3x4<f16>":{align:8,size:24},"mat4x4<f32>":{align:16,size:64},"mat4x4<f16>":{align:8,size:32}};function K(a){const e=a.map(r=>({data:r,offset:0,size:0}));let t=0;for(let r=0;r<e.length;r++){const s=e[r];let i=G[s.data.type].size;const n=G[s.data.type].align;if(!G[s.data.type])throw new Error(`[Pixi.js] WebGPU UniformBuffer: Unknown type ${s.data.type}`);s.data.size>1&&(i=Math.max(i,n)*s.data.size),t=Math.ceil(t/n)*n,s.size=i,s.offset=t,t+=i}return t=Math.ceil(t/16)*16,{uboElements:e,size:t}}function q(a,e){const{size:t,align:r}=G[a.data.type],s=(r-t)/4;return`
         v = uv.${a.data.name};
         ${e!==0?`offset += ${e};`:""}

         arrayOffset = offset;

         t = 0;

         for(var i=0; i < ${a.data.size*(t/4)}; i++)
         {
             for(var j = 0; j < ${t/4}; j++)
             {
                 data[arrayOffset++] = v[t++];
             }
             ${s!==0?`arrayOffset += ${s};`:""}
         }
     `}function Y(a){return b.createUboSyncFunction(a,"uboWgsl",q,b.uboSyncFunctionsWGSL)}class w extends b.UboSystem{constructor(){super({createUboElements:K,generateUboSync:Y})}}w.extension={type:[u.ExtensionType.WebGPUSystem],name:"ubo"};const x=128;class R{constructor(e){this._bindGroupHash=Object.create(null),this._buffers=[],this._bindGroups=[],this._bufferResources=[],this._renderer=e,this._batchBuffer=new j({minUniformOffsetAlignment:x});const t=256/x;for(let r=0;r<t;r++){let s=u.BufferUsage.UNIFORM|u.BufferUsage.COPY_DST;r===0&&(s|=u.BufferUsage.COPY_SRC),this._buffers.push(new u.Buffer({data:this._batchBuffer.data,usage:s}))}}renderEnd(){this._uploadBindGroups(),this._resetBindGroups()}_resetBindGroups(){for(const e in this._bindGroupHash)this._bindGroupHash[e]=null;this._batchBuffer.clear()}getUniformBindGroup(e,t){if(!t&&this._bindGroupHash[e.uid])return this._bindGroupHash[e.uid];this._renderer.ubo.ensureUniformGroup(e);const r=e.buffer.data,s=this._batchBuffer.addEmptyGroup(r.length);return this._renderer.ubo.syncUniformGroup(e,this._batchBuffer.data,s/4),this._bindGroupHash[e.uid]=this._getBindGroup(s/x),this._bindGroupHash[e.uid]}getUboResource(e){this._renderer.ubo.updateUniformGroup(e);const t=e.buffer.data,r=this._batchBuffer.addGroup(t);return this._getBufferResource(r/x)}getArrayBindGroup(e){const t=this._batchBuffer.addGroup(e);return this._getBindGroup(t/x)}getArrayBufferResource(e){const r=this._batchBuffer.addGroup(e)/x;return this._getBufferResource(r)}_getBufferResource(e){if(!this._bufferResources[e]){const t=this._buffers[e%2];this._bufferResources[e]=new b.BufferResource({buffer:t,offset:(e/2|0)*256,size:x})}return this._bufferResources[e]}_getBindGroup(e){if(!this._bindGroups[e]){const t=new u.BindGroup({0:this._getBufferResource(e)});this._bindGroups[e]=t}return this._bindGroups[e]}_uploadBindGroups(){const e=this._renderer.buffer,t=this._buffers[0];t.update(this._batchBuffer.byteIndex),e.updateBuffer(t);const r=this._renderer.gpu.device.createCommandEncoder();for(let s=1;s<this._buffers.length;s++){const i=this._buffers[s];r.copyBufferToBuffer(e.getGPUBuffer(t),x,e.getGPUBuffer(i),0,this._batchBuffer.byteIndex)}this._renderer.gpu.device.queue.submit([r.finish()])}destroy(){for(let e=0;e<this._bindGroups.length;e++)this._bindGroups[e].destroy();this._bindGroups=null,this._bindGroupHash=null;for(let e=0;e<this._buffers.length;e++)this._buffers[e].destroy();this._buffers=null;for(let e=0;e<this._bufferResources.length;e++)this._bufferResources[e].destroy();this._bufferResources=null,this._batchBuffer.destroy(),this._bindGroupHash=null,this._renderer=null}}R.extension={type:[u.ExtensionType.WebGPUPipes],name:"uniformBatch"};const $={"point-list":0,"line-list":1,"line-strip":2,"triangle-list":3,"triangle-strip":4};function X(a,e,t,r,s){return a<<24|e<<16|t<<10|r<<5|s}function Z(a,e,t,r){return t<<6|a<<3|r<<1|e}class A{constructor(e){this._moduleCache=Object.create(null),this._bufferLayoutsCache=Object.create(null),this._pipeCache=Object.create(null),this._pipeStateCaches=Object.create(null),this._colorMask=15,this._multisampleCount=1,this._renderer=e}contextChange(e){this._gpu=e,this.setStencilMode(u.STENCIL_MODES.DISABLED),this._updatePipeHash()}setMultisampleCount(e){this._multisampleCount!==e&&(this._multisampleCount=e,this._updatePipeHash())}setRenderTarget(e){this._multisampleCount=e.msaaSamples,this._depthStencilAttachment=e.descriptor.depthStencilAttachment?1:0,this._updatePipeHash()}setColorMask(e){this._colorMask!==e&&(this._colorMask=e,this._updatePipeHash())}setStencilMode(e){this._stencilMode!==e&&(this._stencilMode=e,this._stencilState=b.GpuStencilModesToPixi[e],this._updatePipeHash())}setPipeline(e,t,r,s){const i=this.getPipeline(e,t,r);s.setPipeline(i)}getPipeline(e,t,r,s){e._layoutKey||(b.ensureAttributes(e,t.attributeData),this._generateBufferKey(e)),s=s||e.topology;const i=X(e._layoutKey,t._layoutKey,r.data,r._blendModeId,$[s]);return this._pipeCache[i]?this._pipeCache[i]:(this._pipeCache[i]=this._createPipeline(e,t,r,s),this._pipeCache[i])}_createPipeline(e,t,r,s){const i=this._gpu.device,n=this._createVertexBufferLayouts(e),o=this._renderer.state.getColorTargets(r);o[0].writeMask=this._stencilMode===u.STENCIL_MODES.RENDERING_MASK_ADD?0:this._colorMask;const c=this._renderer.shader.getProgramData(t).pipeline,d={vertex:{module:this._getModule(t.vertex.source),entryPoint:t.vertex.entryPoint,buffers:n},fragment:{module:this._getModule(t.fragment.source),entryPoint:t.fragment.entryPoint,targets:o},primitive:{topology:s,cullMode:r.cullMode},layout:c,multisample:{count:this._multisampleCount},label:"PIXI Pipeline"};return this._depthStencilAttachment&&(d.depthStencil={...this._stencilState,format:"depth24plus-stencil8",depthWriteEnabled:r.depthTest,depthCompare:r.depthTest?"less":"always"}),i.createRenderPipeline(d)}_getModule(e){return this._moduleCache[e]||this._createModule(e)}_createModule(e){const t=this._gpu.device;return this._moduleCache[e]=t.createShaderModule({code:e}),this._moduleCache[e]}_generateBufferKey(e){const t=[];let r=0;const s=Object.keys(e.attributes).sort();for(let n=0;n<s.length;n++){const o=e.attributes[s[n]];t[r++]=o.location,t[r++]=o.offset,t[r++]=o.format,t[r++]=o.stride}const i=t.join("");return e._layoutKey=l.createIdFromString(i,"geometry"),e._layoutKey}_createVertexBufferLayouts(e){if(this._bufferLayoutsCache[e._layoutKey])return this._bufferLayoutsCache[e._layoutKey];const t=[];return e.buffers.forEach(r=>{const s={arrayStride:0,stepMode:"vertex",attributes:[]},i=s.attributes;for(const n in e.attributes){const o=e.attributes[n];(o.divisor??1)!==1&&u.warn(`Attribute ${n} has an invalid divisor value of '${o.divisor}'. WebGPU only supports a divisor value of 1`),o.buffer===r&&(s.arrayStride=o.stride,s.stepMode=o.instance?"instance":"vertex",i.push({shaderLocation:o.location,offset:o.offset,format:o.format}))}i.length&&t.push(s)}),this._bufferLayoutsCache[e._layoutKey]=t,t}_updatePipeHash(){const e=Z(this._stencilMode,this._multisampleCount,this._colorMask,this._depthStencilAttachment);this._pipeStateCaches[e]||(this._pipeStateCaches[e]=Object.create(null)),this._pipeCache=this._pipeStateCaches[e]}destroy(){this._renderer=null,this._bufferLayoutsCache=null}}A.extension={type:[u.ExtensionType.WebGPUSystem],name:"pipeline"};class J{constructor(){this.contexts=[],this.msaaTextures=[],this.msaaSamples=1}}class Q{init(e,t){this._renderer=e,this._renderTargetSystem=t}copyToTexture(e,t,r,s,i){const n=this._renderer,o=this._getGpuColorTexture(e),c=n.texture.getGpuSource(t.source);return n.encoder.commandEncoder.copyTextureToTexture({texture:o,origin:r},{texture:c,origin:i},s),t}startRenderPass(e,t=!0,r,s){const n=this._renderTargetSystem.getGpuRenderTarget(e),o=this.getDescriptor(e,t,r);n.descriptor=o,this._renderer.pipeline.setRenderTarget(n),this._renderer.encoder.beginRenderPass(n),this._renderer.encoder.setViewport(s)}finishRenderPass(){this._renderer.encoder.endRenderPass()}_getGpuColorTexture(e){const t=this._renderTargetSystem.getGpuRenderTarget(e);return t.contexts[0]?t.contexts[0].getCurrentTexture():this._renderer.texture.getGpuSource(e.colorTextures[0].source)}getDescriptor(e,t,r){typeof t=="boolean"&&(t=t?u.CLEAR.ALL:u.CLEAR.NONE);const s=this._renderTargetSystem,i=s.getGpuRenderTarget(e),n=e.colorTextures.map((d,g)=>{const p=i.contexts[g];let f,h;p?f=p.getCurrentTexture().createView():f=this._renderer.texture.getGpuSource(d).createView({mipLevelCount:1}),i.msaaTextures[g]&&(h=f,f=this._renderer.texture.getTextureView(i.msaaTextures[g]));const m=t&u.CLEAR.COLOR?"clear":"load";return r??(r=s.defaultClearColor),{view:f,resolveTarget:h,clearValue:r,storeOp:"store",loadOp:m}});let o;if((e.stencil||e.depth)&&!e.depthStencilTexture&&(e.ensureDepthStencilTexture(),e.depthStencilTexture.source.sampleCount=i.msaa?4:1),e.depthStencilTexture){const d=t&u.CLEAR.STENCIL?"clear":"load",g=t&u.CLEAR.DEPTH?"clear":"load";o={view:this._renderer.texture.getGpuSource(e.depthStencilTexture.source).createView(),stencilStoreOp:"store",stencilLoadOp:d,depthClearValue:1,depthLoadOp:g,depthStoreOp:"store"}}return{colorAttachments:n,depthStencilAttachment:o}}clear(e,t=!0,r,s){if(!t)return;const{gpu:i,encoder:n}=this._renderer,o=i.device;if(n.commandEncoder===null){const d=o.createCommandEncoder(),g=this.getDescriptor(e,t,r),p=d.beginRenderPass(g);p.setViewport(s.x,s.y,s.width,s.height,0,1),p.end();const f=d.finish();o.queue.submit([f])}else this.startRenderPass(e,t,r,s)}initGpuRenderTarget(e){e.isRoot=!0;const t=new J;return e.colorTextures.forEach((r,s)=>{if(u.CanvasSource.test(r.resource)){const i=r.resource.getContext("webgpu"),n=r.transparent?"premultiplied":"opaque";try{i.configure({device:this._renderer.gpu.device,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC,format:"bgra8unorm",alphaMode:n})}catch(o){console.error(o)}t.contexts[s]=i}if(t.msaa=r.source.antialias,r.source.antialias){const i=new u.TextureSource({width:0,height:0,sampleCount:4});t.msaaTextures[s]=i}}),t.msaa&&(t.msaaSamples=4,e.depthStencilTexture&&(e.depthStencilTexture.source.sampleCount=4)),t}destroyGpuRenderTarget(e){e.contexts.forEach(t=>{t.unconfigure()}),e.msaaTextures.forEach(t=>{t.destroy()}),e.msaaTextures.length=0,e.contexts.length=0}ensureDepthStencilTexture(e){const t=this._renderTargetSystem.getGpuRenderTarget(e);e.depthStencilTexture&&t.msaa&&(e.depthStencilTexture.source.sampleCount=4)}resizeGpuRenderTarget(e){const t=this._renderTargetSystem.getGpuRenderTarget(e);t.width=e.width,t.height=e.height,t.msaa&&e.colorTextures.forEach((r,s)=>{const i=t.msaaTextures[s];i==null||i.resize(r.source.width,r.source.height,r.source._resolution)})}}class L extends b.RenderTargetSystem{constructor(e){super(e),this.adaptor=new Q,this.adaptor.init(e,this)}}L.extension={type:[u.ExtensionType.WebGPUSystem],name:"renderTarget"};class k{constructor(){this._gpuProgramData=Object.create(null)}contextChange(e){this._gpu=e}getProgramData(e){return this._gpuProgramData[e._layoutKey]||this._createGPUProgramData(e)}_createGPUProgramData(e){const t=this._gpu.device,r=e.gpuLayout.map(i=>t.createBindGroupLayout({entries:i})),s={bindGroupLayouts:r};return this._gpuProgramData[e._layoutKey]={bindGroups:r,pipeline:t.createPipelineLayout(s)},this._gpuProgramData[e._layoutKey]}destroy(){this._gpu=null,this._gpuProgramData=null}}k.extension={type:[u.ExtensionType.WebGPUSystem],name:"shader"};const _={};_.normal={alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}};_.add={alpha:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"one",dstFactor:"one",operation:"add"}};_.multiply={alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"dst",dstFactor:"one-minus-src-alpha",operation:"add"}};_.screen={alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"one",dstFactor:"one-minus-src",operation:"add"}};_.overlay={alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"one",dstFactor:"one-minus-src",operation:"add"}};_.none={alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"zero",dstFactor:"zero",operation:"add"}};_["normal-npm"]={alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"}};_["add-npm"]={alpha:{srcFactor:"one",dstFactor:"one",operation:"add"},color:{srcFactor:"src-alpha",dstFactor:"one",operation:"add"}};_["screen-npm"]={alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"src-alpha",dstFactor:"one-minus-src",operation:"add"}};_.erase={alpha:{srcFactor:"zero",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"zero",dstFactor:"one-minus-src",operation:"add"}};class D{constructor(){this.defaultState=new l.State,this.defaultState.blend=!0}contextChange(e){this.gpu=e}getColorTargets(e){return[{format:"bgra8unorm",writeMask:0,blend:_[e.blendMode]||_.normal}]}destroy(){this.gpu=null}}D.extension={type:[u.ExtensionType.WebGPUSystem],name:"state"};const ee={type:"image",upload(a,e,t){const r=a.resource,s=(a.pixelWidth|0)*(a.pixelHeight|0),i=r.byteLength/s;t.device.queue.writeTexture({texture:e},r,{offset:0,rowsPerImage:a.pixelHeight,bytesPerRow:a.pixelHeight*i},{width:a.pixelWidth,height:a.pixelHeight,depthOrArrayLayers:1})}},z={"bc1-rgba-unorm":{blockBytes:8,blockWidth:4,blockHeight:4},"bc2-rgba-unorm":{blockBytes:16,blockWidth:4,blockHeight:4},"bc3-rgba-unorm":{blockBytes:16,blockWidth:4,blockHeight:4},"bc7-rgba-unorm":{blockBytes:16,blockWidth:4,blockHeight:4},"etc1-rgb-unorm":{blockBytes:8,blockWidth:4,blockHeight:4},"etc2-rgba8unorm":{blockBytes:16,blockWidth:4,blockHeight:4},"astc-4x4-unorm":{blockBytes:16,blockWidth:4,blockHeight:4}},te={blockBytes:4,blockWidth:1,blockHeight:1},re={type:"compressed",upload(a,e,t){let r=a.pixelWidth,s=a.pixelHeight;const i=z[a.format]||te;for(let n=0;n<a.resource.length;n++){const o=a.resource[n],c=Math.ceil(r/i.blockWidth)*i.blockBytes;t.device.queue.writeTexture({texture:e,mipLevel:n},o,{offset:0,bytesPerRow:c},{width:Math.ceil(r/i.blockWidth)*i.blockWidth,height:Math.ceil(s/i.blockHeight)*i.blockHeight,depthOrArrayLayers:1}),r=Math.max(r>>1,1),s=Math.max(s>>1,1)}}},O={type:"image",upload(a,e,t){const r=a.resource;if(!r)return;const s=Math.min(e.width,a.resourceWidth||a.pixelWidth),i=Math.min(e.height,a.resourceHeight||a.pixelHeight),n=a.alphaMode==="premultiply-alpha-on-upload";t.device.queue.copyExternalImageToTexture({source:r},{texture:e,premultipliedAlpha:n},{width:s,height:i})}},se={type:"video",upload(a,e,t){O.upload(a,e,t)}};class ie{constructor(e){this.device=e,this.sampler=e.createSampler({minFilter:"linear"}),this.pipelines={}}_getMipmapPipeline(e){let t=this.pipelines[e];return t||(this.mipmapShaderModule||(this.mipmapShaderModule=this.device.createShaderModule({code:`
                        var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
                        vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));

                        struct VertexOutput {
                        @builtin(position) position : vec4<f32>,
                        @location(0) texCoord : vec2<f32>,
                        };

                        @vertex
                        fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
                        var output : VertexOutput;
                        output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
                        output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                        return output;
                        }

                        @group(0) @binding(0) var imgSampler : sampler;
                        @group(0) @binding(1) var img : texture_2d<f32>;

                        @fragment
                        fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
                        return textureSample(img, imgSampler, texCoord);
                        }
                    `})),t=this.device.createRenderPipeline({layout:"auto",vertex:{module:this.mipmapShaderModule,entryPoint:"vertexMain"},fragment:{module:this.mipmapShaderModule,entryPoint:"fragmentMain",targets:[{format:e}]}}),this.pipelines[e]=t),t}generateMipmap(e){const t=this._getMipmapPipeline(e.format);if(e.dimension==="3d"||e.dimension==="1d")throw new Error("Generating mipmaps for non-2d textures is currently unsupported!");let r=e;const s=e.depthOrArrayLayers||1,i=e.usage&GPUTextureUsage.RENDER_ATTACHMENT;if(!i){const c={size:{width:Math.ceil(e.width/2),height:Math.ceil(e.height/2),depthOrArrayLayers:s},format:e.format,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC|GPUTextureUsage.RENDER_ATTACHMENT,mipLevelCount:e.mipLevelCount-1};r=this.device.createTexture(c)}const n=this.device.createCommandEncoder({}),o=t.getBindGroupLayout(0);for(let c=0;c<s;++c){let d=e.createView({baseMipLevel:0,mipLevelCount:1,dimension:"2d",baseArrayLayer:c,arrayLayerCount:1}),g=i?1:0;for(let p=1;p<e.mipLevelCount;++p){const f=r.createView({baseMipLevel:g++,mipLevelCount:1,dimension:"2d",baseArrayLayer:c,arrayLayerCount:1}),h=n.beginRenderPass({colorAttachments:[{view:f,storeOp:"store",loadOp:"clear",clearValue:{r:0,g:0,b:0,a:0}}]}),m=this.device.createBindGroup({layout:o,entries:[{binding:0,resource:this.sampler},{binding:1,resource:d}]});h.setPipeline(t),h.setBindGroup(0,m),h.draw(3,1,0,0),h.end(),d=f}}if(!i){const c={width:Math.ceil(e.width/2),height:Math.ceil(e.height/2),depthOrArrayLayers:s};for(let d=1;d<e.mipLevelCount;++d)n.copyTextureToTexture({texture:r,mipLevel:d-1},{texture:e,mipLevel:d},c),c.width=Math.ceil(c.width/2),c.height=Math.ceil(c.height/2)}return this.device.queue.submit([n.finish()]),i||r.destroy(),e}}class H{constructor(e){this.managedTextures=[],this._gpuSources=Object.create(null),this._gpuSamplers=Object.create(null),this._bindGroupHash=Object.create(null),this._textureViewHash=Object.create(null),this._uploads={image:O,buffer:ee,video:se,compressed:re},this._renderer=e}contextChange(e){this._gpu=e}initSource(e){if(e.autoGenerateMipmaps){const c=Math.max(e.pixelWidth,e.pixelHeight);e.mipLevelCount=Math.floor(Math.log2(c))+1}let t=GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST;e.uploadMethodId!=="compressed"&&(t|=GPUTextureUsage.RENDER_ATTACHMENT,t|=GPUTextureUsage.COPY_SRC);const r=z[e.format]||{blockBytes:4,blockWidth:1,blockHeight:1},s=Math.ceil(e.pixelWidth/r.blockWidth)*r.blockWidth,i=Math.ceil(e.pixelHeight/r.blockHeight)*r.blockHeight,n={label:e.label,size:{width:s,height:i},format:e.format,sampleCount:e.sampleCount,mipLevelCount:e.mipLevelCount,dimension:e.dimension,usage:t},o=this._gpu.device.createTexture(n);return this._gpuSources[e.uid]=o,this.managedTextures.includes(e)||(e.on("update",this.onSourceUpdate,this),e.on("resize",this.onSourceResize,this),e.on("destroy",this.onSourceDestroy,this),e.on("unload",this.onSourceUnload,this),e.on("updateMipmaps",this.onUpdateMipmaps,this),this.managedTextures.push(e)),this.onSourceUpdate(e),o}onSourceUpdate(e){const t=this.getGpuSource(e);t&&(this._uploads[e.uploadMethodId]&&this._uploads[e.uploadMethodId].upload(e,t,this._gpu),e.autoGenerateMipmaps&&e.mipLevelCount>1&&this.onUpdateMipmaps(e))}onSourceUnload(e){const t=this._gpuSources[e.uid];t&&(this._gpuSources[e.uid]=null,t.destroy())}onUpdateMipmaps(e){this._mipmapGenerator||(this._mipmapGenerator=new ie(this._gpu.device));const t=this.getGpuSource(e);this._mipmapGenerator.generateMipmap(t)}onSourceDestroy(e){e.off("update",this.onSourceUpdate,this),e.off("unload",this.onSourceUnload,this),e.off("destroy",this.onSourceDestroy,this),e.off("resize",this.onSourceResize,this),e.off("updateMipmaps",this.onUpdateMipmaps,this),this.managedTextures.splice(this.managedTextures.indexOf(e),1),this.onSourceUnload(e)}onSourceResize(e){const t=this._gpuSources[e.uid];t?(t.width!==e.pixelWidth||t.height!==e.pixelHeight)&&(this._textureViewHash[e.uid]=null,this._bindGroupHash[e.uid]=null,this.onSourceUnload(e),this.initSource(e)):this.initSource(e)}_initSampler(e){return this._gpuSamplers[e._resourceId]=this._gpu.device.createSampler(e),this._gpuSamplers[e._resourceId]}getGpuSampler(e){return this._gpuSamplers[e._resourceId]||this._initSampler(e)}getGpuSource(e){return this._gpuSources[e.uid]||this.initSource(e)}getTextureBindGroup(e){return this._bindGroupHash[e.uid]??this._createTextureBindGroup(e)}_createTextureBindGroup(e){const t=e.source,r=t.uid;return this._bindGroupHash[r]=new u.BindGroup({0:t,1:t.style}),this._bindGroupHash[r]}getTextureView(e){const t=e.source;return this._textureViewHash[t.uid]??this._createTextureView(t)}_createTextureView(e){return this._textureViewHash[e.uid]=this.getGpuSource(e).createView(),this._textureViewHash[e.uid]}generateCanvas(e){const t=this._renderer,r=t.gpu.device.createCommandEncoder(),s=u.DOMAdapter.get().createCanvas();s.width=e.source.pixelWidth,s.height=e.source.pixelHeight;const i=s.getContext("webgpu");return i.configure({device:t.gpu.device,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC,format:navigator.gpu.getPreferredCanvasFormat(),alphaMode:"premultiplied"}),r.copyTextureToTexture({texture:t.texture.getGpuSource(e.source),origin:{x:0,y:0}},{texture:i.getCurrentTexture()},{width:s.width,height:s.height}),t.gpu.device.queue.submit([r.finish()]),s}getPixels(e){const t=this.generateCanvas(e),r=P.CanvasPool.getOptimalCanvasAndContext(t.width,t.height),s=r.context;s.drawImage(t,0,0);const{width:i,height:n}=t,o=s.getImageData(0,0,i,n),c=new Uint8ClampedArray(o.data.buffer);return P.CanvasPool.returnCanvasAndContext(r),{pixels:c,width:i,height:n}}destroy(){this.managedTextures.slice().forEach(e=>this.onSourceDestroy(e)),this.managedTextures=null;for(const e of Object.keys(this._bindGroupHash)){const t=Number(e),r=this._bindGroupHash[t];r==null||r.destroy(),this._bindGroupHash[t]=null}this._gpu=null,this._mipmapGenerator=null,this._gpuSources=null,this._bindGroupHash=null,this._textureViewHash=null,this._gpuSamplers=null}}H.extension={type:[u.ExtensionType.WebGPUSystem],name:"texture"};class F{init(){const e=new l.UniformGroup({uTransformMatrix:{value:new u.Matrix,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),t=l.compileHighShaderGpuProgram({name:"graphics",bits:[l.colorBit,l.generateTextureBatchBit(u.getMaxTexturesPerBatch()),l.localUniformBitGroup2,l.roundPixelsBit]});this.shader=new l.Shader({gpuProgram:t,resources:{localUniforms:e}})}execute(e,t){const r=t.context,s=r.customShader||this.shader,i=e.renderer,n=i.graphicsContext,{geometry:o,instructions:c}=n.getContextRenderData(r),d=i.encoder;d.setPipelineFromGeometryProgramAndState(o,s.gpuProgram,e.state),d.setGeometry(o);const g=i.globalUniforms.bindGroup;d.setBindGroup(0,g,s.gpuProgram);const p=i.renderPipes.uniformBatch.getUniformBindGroup(s.resources.localUniforms,!0);d.setBindGroup(2,p,s.gpuProgram);const f=c.instructions;for(let h=0;h<c.instructionSize;h++){const m=f[h];if(s.groups[1]=m.bindGroup,!m.gpuBindGroup){const B=m.textures;m.bindGroup=u.getTextureBatchBindGroup(B.textures,B.count),m.gpuBindGroup=i.bindGroup.getBindGroup(m.bindGroup,s.gpuProgram,1)}d.setBindGroup(1,m.bindGroup,s.gpuProgram),d.renderPassEncoder.drawIndexed(m.size,1,m.start)}}destroy(){this.shader.destroy(!0),this.shader=null}}F.extension={type:[u.ExtensionType.WebGPUPipesAdaptor],name:"graphics"};class I{init(){const e=l.compileHighShaderGpuProgram({name:"mesh",bits:[l.localUniformBit,b.textureBit,l.roundPixelsBit]});this._shader=new l.Shader({gpuProgram:e,resources:{uTexture:u.Texture.EMPTY._source,uSampler:u.Texture.EMPTY._source.style,textureUniforms:{uTextureMatrix:{type:"mat3x3<f32>",value:new u.Matrix}}}})}execute(e,t){const r=e.renderer;let s=t._shader;if(!s)s=this._shader,s.resources.uTexture=t.texture.source,s.resources.uSampler=t.texture.source.style,s.resources.textureUniforms.uniforms.uTextureMatrix=t.texture.textureMatrix.mapCoord;else if(!s.gpuProgram){u.warn("Mesh shader has no gpuProgram",t.shader);return}const i=s.gpuProgram;if(i.autoAssignGlobalUniforms&&(s.groups[0]=r.globalUniforms.bindGroup),i.autoAssignLocalUniforms){const n=e.localUniforms;s.groups[1]=r.renderPipes.uniformBatch.getUniformBindGroup(n,!0)}r.encoder.draw({geometry:t._geometry,shader:s,state:t.state})}destroy(){this._shader.destroy(!0),this._shader=null}}I.extension={type:[u.ExtensionType.WebGPUPipesAdaptor],name:"mesh"};const ne=[...b.SharedSystems,w,E,S,v,H,L,k,D,A,U,M,C],oe=[...b.SharedRenderPipes,R],ae=[T,I,F],W=[],V=[],N=[];u.extensions.handleByNamedList(u.ExtensionType.WebGPUSystem,W);u.extensions.handleByNamedList(u.ExtensionType.WebGPUPipes,V);u.extensions.handleByNamedList(u.ExtensionType.WebGPUPipesAdaptor,N);u.extensions.add(...ne,...oe,...ae);class ue extends u.AbstractRenderer{constructor(){const e={name:"webgpu",type:l.RendererType.WEBGPU,systems:W,renderPipes:V,renderPipeAdaptors:N};super(e)}}exports.WebGPURenderer=ue;
