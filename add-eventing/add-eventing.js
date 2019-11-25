const addEventing = function (obj) {
  const hooks   = {};
  const emitter = { ...obj };

  emitter.on = (evt, cb) => {
    hooks[evt] = hooks[evt] || []
    hooks[evt].push(cb);
  };

  emitter.trigger = (evt, ...args) => {
    (hooks[evt] || []).forEach(cb => cb(...args));
  };

  return emitter;
}

module.exports = addEventing
