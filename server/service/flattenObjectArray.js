/**
 * Функція, що сплющує масив об'єктів і повертає об'єкт з унікальними значеннями масивів.
 * @param {Array} arr - Масив об'єктів
 * @returns {Object} - Плоский об'єкт
 */
 const flattenObjectArray = (arr) => {
  const result = {};
  arr.forEach((obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (!result[key]) result[key] = [];
        value.forEach((val) => {
          if (!result[key].includes(val)) result[key].push(val);
        });
      }
    });
  });
  return result;
}

export default flattenObjectArray;
