export const keyMirror = keys =>
  Object.keys(keys).reduce((result, elem) => {
    result[elem] = elem;
    return result;
  }, {});
