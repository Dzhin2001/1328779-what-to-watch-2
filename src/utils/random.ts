export const generateRandomValue = (min:number, max: number, numAfterDigit = 0) =>
  +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);

export const getRandomItems = <T>(items: T[]):T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export const getRandomItem = <T>(items: T[]):T =>
  items[generateRandomValue(0, items.length -1)];

export const generateRandomString = (lengthString: number) => {
  let charSet ='abcdefghijklmnopqrstuvwxyz';
  charSet+=charSet.toUpperCase()+1234567890;
  return Array.from({length: lengthString},() => charSet[generateRandomValue(0, charSet.length-1)]).join('');
};
