export interface IOptions<P, T> {
  limit: number;
  values: T[];
  pCtor: (v: T) => Promise<P>;
  cb: (res: P) => any;
  cur?: number;
  pool?: Set<Promise<P>>;
}
