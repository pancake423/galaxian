class BackgroundCanvas extends CanvasBase {
  bgColor = "black";
  numStars = "100";
  scrollSpeed = 0.02; //in screens per second; ie. 0.1 means 1/10th of the screen scrolls by per second
  starSize = 0.002;
  starColors = [
    "white",
    "red",
    "green",
    "purple",
    "orange",
    "yellow",
    "blue",
    "pink",
  ];

  constructor(canvas) {
    super(canvas);
    this.ctx = this.canvas.getContext("2d");
    this.t = Date.now();
    this.stars = [];
    // manual scrolling offset
    this.scrollX = 0;
    this.scrollY = 0;
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push([
        Math.random(), // x
        Math.random(), // y
        utils.choice(this.starColors), // color
      ]);
    }
  }

  draw() {
    // fill background
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.w, this.h);

    // update time and background scrolling
    const dt = (Date.now() - this.t) / 1000;
    this.t = Date.now();
    this.scrollY += dt * this.scrollSpeed;

    // draw stars
    for (let i = 0; i < this.numStars; i++) {
      const x = utils.mod(this.stars[i][0] + this.scrollX, 1) * this.h;
      const y = utils.mod(this.stars[i][1] + this.scrollY, 1) * this.h;
      this.ctx.fillStyle = this.stars[i][2];
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.starSize * this.w, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }
}
