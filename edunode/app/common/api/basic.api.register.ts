import {NetworkApiToken} from "./routes/network.api";
import {P2pCommunicationApiToken} from "./routes/p2p-communication.api";
import {FilesApiToken} from "./routes/files.api";
import {BlockchainApiToken} from './routes/blockchain.api';
import {StudentsApiToken} from './routes/students.api';


export const API_REGISTER_TOKENS = [
    NetworkApiToken,
    P2pCommunicationApiToken,
    FilesApiToken,
    BlockchainApiToken,
    StudentsApiToken,
];
