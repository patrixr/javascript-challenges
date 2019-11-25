function thenable(p) {
  if (typeof (p && p.then) === 'function') {
    return p;
  }
  return Promise.resolve(p);
}

function all(promises = []) {
  if (promises.length === 0) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {

    let results = [];
    let countdown = promises.length;

    const done = (idx) => (res) => {
      results[idx] = res;
      if (--countdown === 0) { resolve(results) }
    };

    const stop = (err) => reject(err);

    const listen = (promise, idx) => promise.then(done(idx)).catch(stop)

    promises.map(thenable).forEach(listen);
  });
}

module.exports = all