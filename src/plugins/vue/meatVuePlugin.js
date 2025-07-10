// Plugin: meatVuePlugin.js
// Makes MEAT accessible via app.config.globalProperties as $meat

export const meatVuePlugin = {
  install(app, options = {}) {
    app.config.globalProperties.$meat = options.meat || window.meat;
  }
};
