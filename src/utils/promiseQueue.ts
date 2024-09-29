export class PromiseQueue {
    private queue: (() => Promise<any>)[] = [];
    private runningTasks: number = 0;
    private onError: ((error: any) => void) | null = null;
    private onAllComplete: (() => void) | null = null;
    private concurrency: number;

    constructor(concurrency: number = 1) {
        this.concurrency = Math.max(1, concurrency);
    }

    /**
     * 添加任务到队列
     * @param task 返回 Promise 的任务函数
     */
    addTask(task: () => Promise<any>): void {
        this.queue.push(task);
        this.run();
    }

    /**
     * 设置任务失败后的回调
     * @param callback 失败回调函数
     */
    setOnError(callback: (error: any) => void): void {
        this.onError = callback;
    }

    /**
     * 设置所有任务完成后的回调
     * @param callback 所有任务完成后的回调函数
     */
    setOnAllComplete(callback: () => void): void {
        this.onAllComplete = callback;
    }

    isEmpty(): boolean {
        return this.queue.length === 0 && this.runningTasks === 0;
    }

    /**
     * 运行队列
     */
    private async run(): Promise<void> {
        if (this.runningTasks >= this.concurrency) {
            return;
        }

        while (this.queue.length > 0 && this.runningTasks < this.concurrency) {
            const task = this.queue.shift()!;
            this.runningTasks++;

            this.executeTask(task).finally(() => {
                this.runningTasks--;
                this.run();
            });
        }

        if (this.isEmpty() && this.onAllComplete) {
            this.onAllComplete();
        }
    }

    private async executeTask(task: () => Promise<any>): Promise<void> {
        try {
            await task();
        } catch (error: any) {
            if (this.onError) {
                this.onError(error);
            } else {
                console.error("任务执行出错:", error.message);
            }
        }
    }
}

export const sleep = (sleepTime:number) => {
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}