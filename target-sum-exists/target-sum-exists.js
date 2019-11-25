const targetSumExists = (list, target, numCount) => {
  for (let num of list) {
    if (numCount === 1) {
      if (num !== target) continue;
      return true;
    }

    const missing = target - num;
    if (targetSumExists(list, missing, numCount - 1)) {
      return true;
    }
  }

  return false;
}

const targetSumExistsInTwoNumbers = (list, target) => {
  return targetSumExists(list, target, 2);
}

const targetSumExistsInThreeNumbers = (list, target) => {
  return targetSumExists(list, target, 3);
}

module.exports = {
  targetSumExistsInTwoNumbers,
  targetSumExistsInThreeNumbers
}
