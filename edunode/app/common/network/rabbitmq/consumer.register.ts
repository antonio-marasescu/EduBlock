import {PingConsumerToken} from "./consumers/ping/ping.consumer";
import {Token} from "typedi";
import {BasicConsumer} from "./consumers/basic.consumer";
import {TransactionConsumerToken} from "./consumers/transaction/transaction.consumer";

const CONSUMER_TOKENS: Token<BasicConsumer>[] = [PingConsumerToken, TransactionConsumerToken];
export default CONSUMER_TOKENS;
