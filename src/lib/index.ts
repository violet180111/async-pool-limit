import type { IOptions } from './type';

export default function scheduler<P = any, T = any>(options: IOptions<P, T>): Promise<string> {
  let { limit, values, pCtor, cb, cur = 0, pool = new Set() } = options;

  if (!Array.isArray(values)) {
    throw new TypeError('values must be a array');
  }

  if (typeof pCtor !== 'function') {
    throw new TypeError('pCtor must be a function');
  }

  const final = () => 'Tasks Ended!';

  if (cur >= values.length) {
    return pool.size ? Promise.race(pool).then(final).catch(final) : Promise.resolve('Tasks Ended!');
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

  if (limit > values.length) {
    return Promise.all(pool).then(final).catch(final);
  }

  const next = () => scheduler({ ...options, cur, pool });
  return Promise.race(pool).then(next).catch(next);
}
