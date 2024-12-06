// really useful functions that JS doesn't have or doesn't implement how I'd like
// includes some collision code, random number generators, and vector functions
const utils = {
  // modulo operators that forces all numbers in the range [a, b), including negatives
  mod: (a, b) => ((a % b) + b) % b,
  // select a random element from the input array
  choice: (arr) => arr[Math.floor(Math.random() * arr.length)],
  flatten: (arr) => {
    // 2d array -> 1d array
    out = [];
    arr.forEach((i) => i.forEach((j) => out.push(j)));
    return out;
  },
  // vector stuff
  add: (a, b) => a.map((e, i) => e + b[i]),
  sub: (a, b) => a.map((e, i) => e - b[i]),
  scale: (v, n) => v.map((c) => c * n),
  mag: (v) => {
    let ssq = 0;
    for (let i = 0; i < v.length; i++) {
      ssq += v[i] * v[i];
    }
    return Math.sqrt(ssq);
  },
  norm: (v) => utils.scale(v, 1 / utils.mag(v)),
  center: (vlist) => {
    let sum = vlist[0].map((n) => 0);
    for (const v of vlist) {
      sum = utils.add(sum, v);
    }
    return utils.scale(sum, 1 / vlist.length);
  },
  randRange: (min, max) => Math.floor(Math.random() * (max - min)) + min,
  uniform: (min, max) => Math.random() * (max - min) + min,
  rectCollide: (r1, r2) => {
    return (
      utils.intervalOverlap(r1[0], r1[0] + r1[2], r2[0], r2[0] + r2[2]) &&
      utils.intervalOverlap(r1[1], r1[1] + r1[3], r2[1], r2[1] + r2[3])
    );
  },
  intervalOverlap: (a0, a1, b0, b1) => {
    if (b1 - b0 > a1 - a0) return utils.intervalOverlap(b0, b1, a0, a1);
    return (b0 >= a0 && b0 <= a1) || (b1 >= a0 && b1 <= a1);
  },
};
