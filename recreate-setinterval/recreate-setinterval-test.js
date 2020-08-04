const test = require('tape')
const { setInterval, clearInterval } = require('./recreate-setinterval')

function noop() {}

function blockFor(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

test('should return an id', t => {
  const ret = setInterval(noop);

  clearInterval(ret);

  t.ok(typeof ret === 'number', 'expected a number')
  t.end()
})

test('clearInterval cancels the interval', t => {
  let count = 0;

  let id = setInterval(() => {
    count++;
  }, 100);

  clearInterval(id);

  setTimeout(() => {
    t.ok(count === 0, 'got cancelled, should never have run');
    t.end();
  }, 200);
});

test('interval repeats until cleared', t => {
  let count = 0;

  let id = setInterval(() => {
    count++;

    if (count === 3) { 
      clearInterval(id);
      setTimeout(() => {
        t.ok(count === 3, 'should have run 3 times');
        t.end();
      }, 200);
    }
  }, 100);
});

test('interval repeats at correct intervals', t => {
  let count = 0;
  let margin = 10;
  let tick = Date.now();

  let id = setInterval(() => {
    count++;

    let elapsed = Date.now() - tick;
    tick = Date.now();

    t.ok(elapsed >= 100 && elapsed <= 100 + margin, 'should have run after ~100ms');

    if (count === 3) { 
      clearInterval(id);
      t.end();
    }
  }, 100);
});

test('interval schedules next tick correctly despite blocking methods', t => {
  let count = 0;
  let margin = 10;
  let tick = Date.now();

  let id = setInterval(() => {
    count++;

    let elapsed = Date.now() - tick;
    tick = Date.now();

    t.ok(elapsed >= 100 && elapsed <= 100 + margin, 'should have run after ~100ms');

    blockFor(80);

    if (count === 3) { 
      clearInterval(id);
      t.end();
    }
  }, 100);
});