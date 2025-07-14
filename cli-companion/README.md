# demo-app

Welcome to MEAT 🧠

This is a minimal vanilla setup with:

- `meat.js`: the reactive core
- `chronicle.js` & `logState.js`: state inspection plugins
- A working counter in `index.html`

You’ll find everything under `assets/`, including:
- `assets/js/vendor/meat/` for MEAT core and plugins
- `assets/img/` for the project logo

To extend this setup:
- Add signals to the `signals/` folder
- Drop new state definitions in `state/`
- Use `meat.emit()` and `meat.listen()` to build your own interactions

Want to bundle everything later into a single `bundle.js`? The starter kit plays nicely with that too.
