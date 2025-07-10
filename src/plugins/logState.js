// Plugin: logState.js
// Adds console.table support to MEAT for visual state debugging

export function logStatePlugin(meat) {
  meat.logState = () => {
    console.table(meat.getState());
  };
}
