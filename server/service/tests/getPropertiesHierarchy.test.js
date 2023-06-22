import { getPropertiesHierarchy } from '../getPropertiesHierarchy.js'; // Замініть на відповідний імпорт вашого файлу з функцією

describe('getPropertiesHierarchy', () => {
  it('Має повертати порожній об’єкт для порожнього вхідного об’єкта', () => {
    const obj = {};
    const result = getPropertiesHierarchy(obj);
    expect(result).toEqual({});
  });

  it('Має правильно побудувати ієрархію властивостей для вкладеного об’єкта', () => {
    const obj = {
      level1: {
        level2: {
          level3: 'value',
        },
      },
      otherProperty: 'otherValue',
    };
    const expected = {
      'level1.level2.level3': ['value'],
      otherProperty: ['otherValue'],
    };
    const result = getPropertiesHierarchy(obj);
    expect(result).toEqual(expected);
  });

  it('Має правильно обробляти масиви у вхідному об’єкті', () => {
    const obj = {
      arrayProp: [
        {
          nestedProp: 'value1',
        },
        {
          nestedProp: 'value2',
        },
      ],
      otherProperty: 'otherValue',
    };
    const expected = {
      'arrayProp.nestedProp': ['value1', 'value2'],
      otherProperty: ['otherValue'],
    };
    const result = getPropertiesHierarchy(obj);
    expect(result).toEqual(expected);
  });

  it('Повинен обробляти кілька рівнів вкладених масивів', () => {
    const obj = {
      array1: [
        {
          array2: [
            {
              array3: ['value1', 'value2'],
            },
            {
              array3: ['value3'],
            },
          ],
        },
        {
          array2: [
            {
              array3: ['value4'],
            },
          ],
        },
      ],
    };
    const expected = {
      'array1.array2.array3': ['value1', 'value2', 'value3', 'value4'],
    };
    const result = getPropertiesHierarchy(obj);
    expect(result).toEqual(expected);
  });
});
