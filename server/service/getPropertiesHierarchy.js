/**
 * Функція для отримання ієрархії властивостей об'єкта зі значенням у вигляді списку можливих варіантів.
 * @param {object} obj - Об'єкт для аналізу
 * @param {string} parent - Батьківський шлях властивості
 * @param {object} objWithArrays - Об'єкт, в який будуть зберігатися властивості з масивами
 * @returns {object} - Об'єкт з ієрархією властивостей та масивами значень
 */
const getPropertiesHierarchy = (obj, parent = '', objWithArrays = {}) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const prop = parent ? parent + '.' + key : key;
      if (typeof value === 'object' && !Array.isArray(value)) {
        getPropertiesHierarchy(value, prop, objWithArrays);
      } else if (Array.isArray(value)) {
        if (typeof value[0] === 'object') {
          value.forEach((item, index) => {
            const nestedProp = prop;
            getPropertiesHierarchy(item, nestedProp, objWithArrays);
          });
        } else {
          if (!objWithArrays.hasOwnProperty(prop)) {
            objWithArrays[prop] = [];
          }
          objWithArrays[prop].push(...value);
        }
      } else {
        if (!objWithArrays.hasOwnProperty(prop)) {
          objWithArrays[prop] = [];
        }
        objWithArrays[prop].push(value);
      }
    }
  }
  return objWithArrays;
};
export { getPropertiesHierarchy };
