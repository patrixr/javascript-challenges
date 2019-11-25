const LAST = (stack) => {
  return stack[stack.length - 1];
}

const INT = (stack, num) => {
  stack.push(num);
}

const POP = (stack) => {
  return stack.pop();
}

const SUB = (stack) => {
  INT(stack, POP(stack) - POP(stack));
}

const ADD = (stack) => {
  INT(stack, POP(stack) + POP(stack));
}

const DUP = (stack) => {
  INT(stack, LAST(stack));
}

const OPERATIONS = {
  INT, POP, ADD, SUB, DUP,
  "+": ADD, // alias
  "-": SUB  // alias
};

const runCommand = (stack, ...args) => {
  const command = args[0];
  OPERATIONS[command](stack, ...(args.slice(1)));
}

/**
 * Stack machine
 *
 * @param {string} instructions
 * @returns {number}
 */
const stackMachineCalculator = (instructions) => {
  const isNum = (n) => /\d+/.test(n);

  const commands = instructions
    .split(" ")
    .map(ins => isNum(ins) ? ['INT', Number(ins)] : [ins]);

  const stack = commands.reduce((stack, command) => {
    runCommand(stack, ...command)
    return stack;
  }, []);

  return LAST(stack);
}

module.exports = stackMachineCalculator
