import {NmsNode, NmsNodeToken} from "./server/nms.node";
import {Inject, Service} from "typedi";

@Service()
export class App {
    constructor(@Inject(NmsNodeToken) private networkMapNode: NmsNode) {
    }

    public async start(): Promise<void> {
        await this.networkMapNode.start();
    }
}
