import randomInt from 'random-int';

export function getRandom(lower, upper) {
  const min = Math.min(lower, upper);
  const max = Math.max(lower, upper);
  return getRandomFloat(max - min) + min;
}

export function getRandomFloat(upper) {
  return Math.random() * upper;
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomInt(upper) {
  return randomInt(upper);
}
