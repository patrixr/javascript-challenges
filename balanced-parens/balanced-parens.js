const pairs = [
  ['(', ')'],
  ['{', '}'],
  ['[', ']']
];

// Mapping
const openings = pairs.reduce((all, [op, cl]) => ({ ...all, [op]: cl }), {});
const closings = pairs.reduce((all, [op, cl]) => ({ ...all, [cl]: op }), {});

// Helpers
const last = (arr) => arr[arr.length - 1]
const openingOf = (c) => closings[c]
const isOpening = (c) => !!openings[c]
const isClosing = (c) => !!closings[c]

/**
 * Checks if parentheses are balanced
 *
 * @param {string} input
 * @returns
 */
const parensAreBalanced = (input) => {
  const stack = [];

  for (let c of input) {
    if (isOpening(c)) {
      stack.push(c);
      continue;
    }

    if (isClosing(c)) {
      if (stack.length === 0) return false;
      if (last(stack) !== openingOf(c)) return false;

      stack.pop();
    }
  }

  return stack.length === 0;
}

module.exports = parensAreBalanced
