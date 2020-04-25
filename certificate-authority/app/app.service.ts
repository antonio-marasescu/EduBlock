import {CaNode, CaNodeToken} from "./server/ca.node";
import {Inject, Service} from "typedi";

@Service()
export class App {
    constructor(@Inject(CaNodeToken) private node: CaNode) {
    }

    public async start(): Promise<void> {
        await this.node.start();
    }
}
