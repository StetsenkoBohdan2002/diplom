import { getPropertiesHierarchy } from '../getPropertiesHierarchy.js'; // Замініть на відповідний імпорт вашого файлу з функцією

describe('getPropertiesHierarchy', () => {
  it('should return an empty object for an empty input object', () => {
    const obj = {};
    const result = getPropertiesHierarchy(obj);
    expect(result).toEqual({});
  });

  it('should correctly build the properties hierarchy for a nested object', () => {
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

  it('should correctly handle arrays in the input object', () => {
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

  it('should handle multiple levels of nested arrays', () => {
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
