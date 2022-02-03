type CountObject = { [type: string]: number}

// Returns an object whose keys are "types" (string extracted by a function from the object) and the value is the number of times
// that type is present in the passed array
export function countByType<T>(items: readonly T[], extractType: (obj: T) => string): CountObject {
  return items
            .map(item => extractType(item))
            .reduce((result, type) => {
              if (!result[type])
                result[type] = 1;
              else
                result[type]++;
              return result;
            }, {} as CountObject)
            ;
}
