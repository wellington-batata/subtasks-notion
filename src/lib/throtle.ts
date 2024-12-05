export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
    let lastCallTime = 0;
    let timer: NodeJS.Timeout | undefined;

    return function (this: any, ...args: Parameters<T>) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime;

        clearTimeout(timer); // Limpa qualquer timer anterior

        if (timeSinceLastCall < delay) {
            // Se o tempo desde a última chamada for menor que o delay, agenda a próxima chamada
            timer = setTimeout(() => {
                lastCallTime = Date.now();
                fn.apply(this, args);
            }, delay - timeSinceLastCall);
        } else {
            // Se o tempo desde a última chamada for maior que o delay, executa a função imediatamente
            lastCallTime = now;
            fn.apply(this, args);
        }
    } as T;
}