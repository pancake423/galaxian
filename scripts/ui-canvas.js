class UICanvas extends CanvasBase {
  constructor(canvas) {
    super(canvas);
    this.ctx = this.canvas.getContext("2d");
    this.font = "20px Retro";
    this.titleFont = "40px Retro";
    this.padding = 20;
    this.iconSize = 30;
    this.blinkRate = 500;

    this.score = 0;
    this.lives = 3;
    this.level = 0;
    this.missiles = 0;
    this.message = "";
    this.messageOn = true;
    this.blinkOn = false;
    this.titleOffset = 0;
    this.titleOn = true;
    this.tStart = Date.now();
    this.t = Date.now();

    this.heartGraphic = new Image();
    this.heartGraphic.src = "assets/heart.png";
    this.missileGraphic = new Image();
    this.missileGraphic.src = "assets/missile.png";

    this.startuid = events.addListener("KeyAny", () => {
      events.removeListener(this.startuid);
      this.hideTitle();
      this.hideMessage();
      spawnAliens();
    });
  }

  #drawTitle() {
    this.ctx.font = this.titleFont;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "White";
    this.ctx.fillText(
      "Galaxian",
      this.w / 2 - 40,
      this.h / 4 - this.titleOffset,
    );
    this.ctx.fillStyle = "rgb(255, 0, 0)";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("3D", this.w / 2 + 140, this.h / 4 - this.titleOffset);
    this.ctx.fillStyle = "rgb(0, 128, 255)";
    this.ctx.fillText(
      "3D",
      this.w / 2 + 145,
      this.h / 4 + 5 - this.titleOffset,
    );
    this.ctx.font = this.font;
    this.ctx.fillStyle = "White";
    this.ctx.fillText("clone", this.w / 2, this.h / 4 + 20 - this.titleOffset);
  }

  draw() {
    const frameT = Date.now();
    const dt = frameT - this.t;
    this.ctx.clearRect(0, 0, this.w, this.h);
    if (this.messageOn) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(0, 0, this.w, this.h);
    }
    this.#drawTitle();
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "White";
    this.ctx.font = this.font;
    this.ctx.fillText(
      `SCORE ${String(this.score).padStart(5, 0)}`,
      this.padding,
      this.padding,
    );
    this.ctx.textAlign = "right";
    this.ctx.fillText(
      `LEVEL ${String(this.level).padStart(2, 0)}`,
      this.w - this.padding,
      this.padding,
    );
    let x = this.padding;
    let y = this.h - this.padding - this.iconSize;
    for (let i = 0; i < this.lives; i++) {
      this.ctx.drawImage(this.heartGraphic, x, y, this.iconSize, this.iconSize);
      x += this.iconSize * 1.5;
    }
    x = this.w - this.padding - this.iconSize;
    y = this.h - this.padding - this.iconSize;
    for (let i = 0; i < this.missiles; i++) {
      this.ctx.drawImage(
        this.missileGraphic,
        x,
        y,
        this.iconSize,
        this.iconSize,
      );
      x -= this.iconSize * 1.5;
    }
    if (
      this.messageOn &&
      (Math.floor((Date.now() - this.tStart) / this.blinkRate) % 2 == 0 ||
        this.blinkOn == false)
    ) {
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(this.message, this.w / 2, this.h / 2);
    }
    if (this.titleOn && this.titleOffset > 0) {
      this.titleOffset = Math.max(this.titleOffset - dt / 3, 0);
    }
    if (this.titleOn == false && this.titleOffset <= this.h / 2) {
      this.titleOffset = Math.min(this.titleOffset + dt / 3, this.h / 2);
    }

    this.t = frameT;
  }

  showMessage(m, blink = false) {
    this.blinkOn = blink;
    this.message = m;
    this.messageOn = true;
  }
  hideMessage() {
    this.messageOn = false;
  }
  showTitle() {
    this.titleOn = true;
  }
  hideTitle() {
    this.titleOn = false;
  }
}
