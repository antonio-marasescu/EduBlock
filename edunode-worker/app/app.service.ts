import {Inject, Service} from "typedi";
import {EduNodeWorker, EduNodeWorkerToken} from "./server/edu.node.worker";

@Service()
export class App {
    constructor(@Inject(EduNodeWorkerToken) private eduNodeWorker: EduNodeWorker) {
    }

    public async start(): Promise<void> {
        await this.eduNodeWorker.start();
    }
}
