// TODO: Use this in `enemy-distribution` or I dunno wherever
// I've done this before ad-hoc

type CountObject = { [type: string]: number}

export function countByType<T>(items: T[], extractType: (obj: T) => string): CountObject {
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
