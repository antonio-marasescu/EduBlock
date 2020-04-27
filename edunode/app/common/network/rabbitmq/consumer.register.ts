import {PingConsumerToken} from "./consumers/ping/ping.consumer";
import {Token} from "typedi";
import {BasicConsumer} from "./consumers/basic.consumer";

const CONSUMER_TOKENS: Token<BasicConsumer<any>>[] = [PingConsumerToken];
export default CONSUMER_TOKENS;
