const toPath  = (str) => Array.isArray(str) ? str : str.split('.');


/**
 * Returns the nested value by it's key
 *
 * @param {object} obj
 * @param {string} key
 * @returns
 */
const get = (obj, key) => {
  const path  = toPath(key);
  const val   = obj[path[0]];

  if (!val) return undefined;

  return (path.length > 1) ? get(val, path.slice(1)) : val;
}

/**
 * Nested iteration function
 *
 * @param {object} obj
 * @param {function} cb
 * @param {string} [prefix='']
 */
const iterate = (obj, cb, prefix = '') => {
  Object
    .keys(obj)
    .forEach(key => {
      const keyPath = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object') {
        return iterate(obj[key], cb, keyPath);
      }

      cb(keyPath, obj[key]);
    });
};

/**
 * Returns a change row
 *
 * @param {any} newValue
 * @param {any} oldValue
 * @param {string} key
 * @returns {Array}
 */
const change = (newValue, oldValue, key) => {
  if (isNaN(newValue) && isNaN(oldValue)) {
    return null; // Should never happen but just in case
  }

  if (newValue && isNaN(oldValue)) return ['+', key, newValue];
  if (oldValue && isNaN(newValue)) return ['-', key, oldValue];

  const delta = oldValue - newValue;

  if (delta === 0) {
    return null;
  }

  return [delta > 0 ? '+' : '-', key, delta];
}


/**
 * Returns the diff between two objects
 *
 * @param {object} newCode
 * @param {object} oldCode
 * @param {string} [prefix='']
 *
 * @returns {Array[]}
 */
const diff = (newCode, oldCode, prefix = '') => {
  let diffs = {};

  const compare = (key) => {
    diffs[key] = diffs[key] || change(
      get(newCode, key),
      get(oldCode, key),
      key
    );
  }

  iterate(oldCode, compare);
  iterate(newCode, compare);

  return Object.values(diffs).filter(d => !!d);
}

module.exports = diff
