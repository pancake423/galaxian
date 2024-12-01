// really useful functions that JS doesn't have or doesn't implement how I'd like
const utils = {
  // modulo operators that forces all numbers in the range [a, b), including negatives
  mod: (a, b) => ((a % b) + b) % b,
  // select a random element from the input array
  choice: (arr) => arr[Math.floor(Math.random() * arr.length)],
};
