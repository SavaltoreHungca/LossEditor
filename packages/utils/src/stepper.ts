export function stepper(from: number, to: number, spendTime: number, eachTime: number, consumer: (value: number) => void) {
    if (spendTime < eachTime) spendTime = eachTime;

    const times = spendTime / eachTime;
    const len = to - from;
    const step = len / times;

    let executedTimes = 0;
    const func = () => {
        from += step;
        executedTimes++;
        consumer(from);
        if (executedTimes < times) {
            window.setTimeout(() => func(), eachTime);
        }
    }

    func();
}