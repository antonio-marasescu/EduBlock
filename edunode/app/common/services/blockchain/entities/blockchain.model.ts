import {Block} from "./block.model";
import {Transaction} from "./transaction.model";

export class Blockchain {
    chain: { [key: string]: Block } = {};
    pendingTransactions: Transaction[] = [];
}
