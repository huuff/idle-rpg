// Receives:
// obj: An array of objects on which to operate
// extractor: A function that takes some numeric property out of the objects
// setter: A function that returns a new object with a new value for the specified property
// Returns:
// The same array of object,s but where each object's value of the specified property is the sum of
// its previous value and the sum of all the ones coming before it.
export function accumulate<T>(
  objs: T[], 
  extractor: (obj: T) => number,
  setter: (obj: T, newVal: number) => T,
): T[] {
  const result: T[] = [];
  
  let accNum = 0;
  for (const obj of objs) {
    accNum += extractor(obj);
    result.push(setter(obj, accNum))
  }

  return result;
}
