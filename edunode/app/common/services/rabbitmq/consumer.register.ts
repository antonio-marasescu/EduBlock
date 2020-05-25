import {PingConsumerToken} from './consumers/ping.consumer';
import {Token} from 'typedi';
import {BasicConsumer} from './consumers/basic.consumer';
import {TransactionConsumerToken} from './consumers/transaction.consumer';
import {BlockConsumerToken} from './consumers/block.consumer';
import {AccessTokenConsumerToken} from './consumers/access-token.consumer';

const CONSUMER_TOKENS: Token<BasicConsumer>[] = [
    PingConsumerToken,
    TransactionConsumerToken,
    BlockConsumerToken,
    AccessTokenConsumerToken
];
export default CONSUMER_TOKENS;
