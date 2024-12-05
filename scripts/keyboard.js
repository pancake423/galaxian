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
  }
  isPressed(code) {
    return this.keys[code] == true;
  }
}
