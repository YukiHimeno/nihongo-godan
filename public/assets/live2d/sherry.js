/* 橘雪莉 Live2D 渲染封装（pixi-live2d-display）
 * 模型来源：https://github.com/DevYanxiSama/DesktopPet_TachibanaSherii
 * 版权声明见 public/assets/live2d/ATTRIBUTION.md
 */
window.Sherry = (function () {
  let app = null;
  let model = null;
  let pending = [];

  function paramsMap() {
    if (!model || !model.internalModel) return null;
    const params = model.internalModel.getModel().parameters;
    const map = {};
    for (let i = 0; i < params.count; i++) {
      map[params.ids[i]] = i;
    }
    return map;
  }

  function init(container) {
    if (!container) return Promise.resolve(false);
    return new Promise((resolve) => {
      const check = () => {
        if (window.PIXI && window.PIXI.live2d && window.Live2DCubismCore) {
          app = new PIXI.Application({
            transparent: true,
            resizeTo: container,
            autoStart: true,
            backgroundAlpha: 0,
          });
          // 只使用 Cubism4，忽略 Cubism2 运行时缺失的提示
          if (window.PIXI.live2d.config) {
            window.PIXI.live2d.config.cubism4Enabled = true;
            window.PIXI.live2d.config.LOG_LEVEL_ERROR = 3;
            window.PIXI.live2d.config.logLevel = 3;
          }
          container.appendChild(app.view);
          window.PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);
          PIXI.live2d.Live2DModel.from('assets/live2d/model.model3.json', {
            autoInteract: false,
            autoUpdate: true,
          }).then((m) => {
            model = m;
            // 只显示头部+上半身：放大模型，锚点沉到底部，让下半身被裁掉
            m.anchor.set(0.5, 1);
            m.scale.set(1.7);
            m.x = app.renderer.width / 2;
            m.y = app.renderer.height + 40;
            app.stage.addChild(m);
            pending.forEach((f) => { try { f(); } catch (e) {} });
            pending = [];
            resolve(true);
          }).catch((e) => { resolve(false); });
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  function ensure(fn) {
    if (model) fn();
    else pending.push(fn);
  }

  function setParam(id, value) {
    ensure(() => {
      try { model.internalModel.setParameterValueById(id, value); } catch (e) {}
    });
  }

  // 表情：简单参数组合（模型参数名可能因版本而异，做了兜底）
  function expr(name) {
    ensure(() => {
      try {
        const pm = paramsMap();
        if (!pm) return;
        const reset = () => {
          ['ParamEyeLOpen', 'ParamEyeROpen', 'ParamMouthOpenY', 'ParamBrowLY', 'ParamBrowRY', 'ParamAngleZ', 'ParamBodyAngleZ'].forEach((p) => {
            if (p in pm) model.internalModel.setParameterValueById(p, 0);
          });
        };
        reset();
        const set = (p, v) => { if (p in pm) model.internalModel.setParameterValueById(p, v); };
        if (name === 'smile') { set('ParamEyeLOpen', 0.2); set('ParamEyeROpen', 0.2); set('ParamMouthOpenY', 0.3); set('ParamBrowLY', -0.4); set('ParamBrowRY', -0.4); }
        else if (name === 'talk') { set('ParamMouthOpenY', 0.6); }
        else if (name === 'think') { set('ParamEyeLOpen', 0.6); set('ParamEyeROpen', 0.6); set('ParamAngleZ', -8); }
        else if (name === 'wonder') { set('ParamEyeLOpen', 1); set('ParamEyeROpen', 1); set('ParamMouthOpenY', 0.2); }
        else if (name === 'listen') { set('ParamMouthOpenY', 0.1); set('ParamEyeLOpen', 0.8); set('ParamEyeROpen', 0.8); }
      } catch (e) {}
    });
  }

  function breath() {
    ensure(() => {
      try {
        const pm = paramsMap();
        if (!pm) return;
        const base = 1;
        let t = 0;
        (function loop() {
          if (!model || !model.internalModel) return;
          t += 0.05;
          const b = Math.sin(t) * 0.04;
          ['ParamBodyAngleX', 'ParamAngleX'].forEach((p) => {
            if (p in pm) model.internalModel.setParameterValueById(p, b);
          });
          requestAnimationFrame(loop);
        })();
      } catch (e) {}
    });
  }

  return { init, expr, setParam, breath, get model() { return model; } };
})();
