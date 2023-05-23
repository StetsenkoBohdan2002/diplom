import flattenObjectArray from '../flattenObjectArray.js'; // Замініть на відповідний імпорт вашого файлу з функцією

describe('flattenObjectArray', () => {
  it("Повинно повертати порожній об'єкт для порожнього вхідного масиву", () => {
    const arr = [];
    const result = flattenObjectArray(arr);
    expect(result).toEqual({});
  });

  it("Повинно сплющувати масиви в об'єктах та видаляти дублікати значень", () => {
    const arr = [
      { key1: ['value1', 'value2'] },
      { key2: ['value2', 'value3'] },
      { key3: ['value3'] },
      { key1: ['value2', 'value4'] },
    ];
    const expected = {
      key1: ['value1', 'value2', 'value4'],
      key2: ['value2', 'value3'],
      key3: ['value3'],
    };
    const result = flattenObjectArray(arr);
    expect(result).toEqual(expected);
  });

  it('Повинно обробляти масиви з нестроковими значеннями', () => {
    const arr = [{ key1: [1, 2, 3] }, { key2: [true, false] }, { key3: [null, undefined] }];
    const expected = {
      key1: [1, 2, 3],
      key2: [true, false],
      key3: [null, undefined],
    };
    const result = flattenObjectArray(arr);
    expect(result).toEqual(expected);
  });

  it("Повинно ігнорувати не-масивні значення в об'єктах", () => {
    const arr = [{ key1: ['value1', 'value2'] }, { key2: 'value3' }, { key3: ['value4'] }];
    const expected = {
      key1: ['value1', 'value2'],
      key3: ['value4'],
    };
    const result = flattenObjectArray(arr);
    expect(result).toEqual(expected);
  });
});
