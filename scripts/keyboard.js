class KeyTracker {
  constructor() {
    this.keys = {};
    window.onkeydown = (e) => {
      if (this.keys[e.code] == true) return;
      events.raiseEvent("KeyAny");
      events.raiseEvent(e.code);
      this.keys[e.code] = true;
    };
    window.onkeyup = (e) => {
      this.keys[e.code] = false;
    };
    // turn off all keys when the window loses focus
    window.onblur = () => {
      for (const key in this.keys) {
        this.keys[key] = false;
      }
    };
  }
  isPressed(code) {
    return this.keys[code] == true;
  }
}