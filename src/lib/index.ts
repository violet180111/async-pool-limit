import type { IOptions } from './type';

export default function scheduler<P = any, T = any>(
  options: IOptions<P, T>,
  cur = 0,
  pool = new Set<Promise<P>>()
): Promise<string> {
  let { limit, values, pCtor, cb } = options;

  if (!Array.isArray(values)) {
    throw new TypeError('values must be a array');
  }

  if (typeof pCtor !== 'function') {
    throw new TypeError('pCtor must be a function');
  }

  const next = () => scheduler(options, cur, pool);

  if (cur >= values.length) {
    return pool.size ? Promise.race(pool).then(next).catch(next) : Promise.resolve('Tasks Ended!');
  }

  const execute = (v: T) => {
    const p = Promise.resolve(pCtor(v));
    const clean = (res: P) => {
      cb?.(res);
      pool.delete(p);
    };

    pool.add(p);
    p.then(clean).catch(clean);
  };

  while (pool.size < limit && values[cur]) {
    execute(values[cur++]);
  }

  return Promise.race(pool).then(next).catch(next);
}

// export default async function* scheduler<P = any, T = any>(
//   limit: number,
//   values: T[],
//   pCtor: (v: T) => Promise<P>
// ) {
//   if (!Array.isArray(values)) {
//     throw new TypeError('values must be a array');
//   }

//   if (typeof pCtor !== 'function') {
//     throw new TypeError('pCtor must be a function');
//   }

//   // ensure a safe positive integer
//   limit = limit >>> 0 || 1;

//   const set = new Set();

//   for (const v of values) {
//     const p = Promise.resolve(pCtor(v)).then(res => {
//       set.delete(p);

//       return res;
//     });

//     set.add(p);

//     if (set.size >= limit) {
//       yield await Promise.race(set);
//     }
//   }

//   while (set.size) {
//     yield await Promise.race(set);
//   }
// }
