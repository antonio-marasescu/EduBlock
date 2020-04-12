import {Inject, Service} from "typedi";
import {EduNode, EduNodeToken} from "./server/edu.node";

@Service()
export class App {
    constructor(@Inject(EduNodeToken) private eduNode: EduNode) {
    }

    public async start(): Promise<void> {
        await this.eduNode.start();
    }
}
