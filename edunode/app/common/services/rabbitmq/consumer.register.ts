import {PingConsumerToken} from "./consumers/ping.consumer";
import {Token} from "typedi";
import {BasicConsumer} from "./consumers/basic.consumer";
import {TransactionConsumerToken} from "./consumers/transaction.consumer";
import {BlockConsumerToken} from "./consumers/block.consumer";

const CONSUMER_TOKENS: Token<BasicConsumer>[] = [PingConsumerToken, TransactionConsumerToken, BlockConsumerToken];
export default CONSUMER_TOKENS;
