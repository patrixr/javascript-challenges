
let timeouts  = {};
let intervals = {};
let running   = false;
let lastId    = 0;

/**
 * Generates a unique id
 *
 * @returns {number}
 */
function uid() {
  return ++lastId;
}

/**
 * Starts the event loop
 * 
 */
function eventLoop () {
  if (running) return;

  running = true;
  
  setImmediate(function _loop() {
    if (!running) return;
    poll();
    setImmediate(_loop);
  });
}

/**
 * Evaluates all the timeouts and triggers the callbacks
 *
 */
function poll () {
  const now = Date.now();

  let toCall = [];
  
  for (let timeoutId in timeouts) {
    const timeout = timeouts[timeoutId];

    if (timeout.timeout < now) {
      toCall.push(timeout.fn);
      clearTimeout(timeoutId);
    }
  }

  toCall.forEach(fn => fn());

  running = Object.keys(timeouts).length > 0;
}

/**
 * setTimeout re-write
 *
 * @param {function} fn
 * @param {number} [ms=0]
 * @param {...any} args
 * @returns {number}
 */
function setTimeout(fn, ms, ...args) {
  eventLoop();
  
  const timeout = {
    fn: fn.bind(null, ...args),
    timeout: Date.now() + ms,
  };
  
  const id = uid();

  timeouts[id] = timeout;

  return id;
}

/**
 * clearTimeout rewrite
 *
 * @param {number} timeoutId
 */
function clearTimeout (timeoutId) {
  Reflect.deleteProperty(timeouts, timeoutId);
}

/**
 * setInterval re-write
 *
 * @param {function} fn
 * @param {number} [ms=0]
 * @param {...any} args
 * @returns {number}
 */
function setInterval(fn, ms = 0, ...args) {
  const id = uid();
  
  intervals[id] = true;

  setTimeout(function _cb() {
    if (intervals[id]) {
      setTimeout(_cb, ms);
      fn(...args);
    }
  }, ms)

  return id;
}

/**
 * clearInterval rewrite
 *
 * @param {number} intervalId
 */
function clearInterval(id) {
  Reflect.deleteProperty(intervals, id);
}

module.exports = { setInterval, clearInterval };
