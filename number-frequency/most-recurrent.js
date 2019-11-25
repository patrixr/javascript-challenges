const mostRecurrent = (set) => {
  let mem = {};
  let maxRecord = { count: -1 };

  set.forEach((n, idx) => {
    mem[n] = mem[n] || { firstIdx: idx, num: n, count: 0 }
    mem[n].count++;

    const count = mem[n].count;

    if (count === maxRecord.count && maxRecord.firstIdx < mem[n].firstIdx) {
      return;
    }

    if (count >= maxRecord.count) {
      maxRecord = mem[n];
    }
  });

  return maxRecord.num;
}

module.exports = mostRecurrent
