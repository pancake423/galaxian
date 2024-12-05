// really useful functions that JS doesn't have or doesn't implement how I'd like
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
};
