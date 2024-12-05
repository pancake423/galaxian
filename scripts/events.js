/*
simple event pattern for hopefully smooth game development

holds a list of functions to call when a specific event is raised
*/

class EventEmitter {
  constructor() {
    this.listeners = {};
    this.uid = 0;
  }
  addListener(event, func) {
    if (this.listeners[event] == undefined) {
      this.listeners[event] = {};
    }
    this.listeners[event][this.uid] = func;
    this.uid++;
    return this.uid - 1;
  }
  removeListener(uid) {
    for (const l in this.listeners) {
      for (const id in this.listeners[l]) {
        if (id == uid) delete this.listeners[l][id];
      }
    }
  }
  raiseEvent(event, arg) {
    if (this.listeners[event] == undefined) return;
    for (const key in this.listeners[event]) {
      this.listeners[event][key](arg);
    }
  }
}
