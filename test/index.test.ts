import scheduler from '../src/lib';

describe('scheduler - √', () => {
  const timeout = (time: number) => {
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  };

  test('正常测试并发限制', async () => {
    const times = [10, 50, 30, 20];
    const correctOutput = [10, 30, 50, 20];
    const finalResult: number[] = [];

    await scheduler({
      limit: 2,
      values: times,
      pCtor: timeout,
      cb: (res: number) => {
        finalResult.push(res);
      },
    });

    expect(correctOutput).toEqual(finalResult);
  });

  test('并发数大于或等于源数据长度', async () => {
    const times = [10, 50, 30, 20];
    const correctOutput = [10, 20, 30, 50];
    const finalResult: number[] = [];

    await scheduler({
      limit: 5,
      values: times,
      pCtor: timeout,
      cb: (res: number) => {
        finalResult.push(res);
      },
    });

    expect(correctOutput).toEqual(finalResult);
  });

  test('同一时间完成所有任务', async () => {
    const times = [10, 50, 30, 20];
    const correctOutput = [10, 50, 30, 20];
    const finalResult: number[] = [];

    await scheduler({
      limit: 2,
      values: times,
      pCtor: x => Promise.resolve(x),
      cb: (res: number) => {
        finalResult.push(res);
      },
    });

    expect(correctOutput).toEqual(finalResult);
  });
});
