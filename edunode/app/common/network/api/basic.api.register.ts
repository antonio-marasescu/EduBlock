import {NetworkApiToken} from "./controllers/network.api";
import {P2pCommunicationApiToken} from "./controllers/p2p-communication.api";
import {FilesApiToken} from "./controllers/files.api";

export const API_REGISTER_TOKENS = [
    NetworkApiToken,
    P2pCommunicationApiToken,
    FilesApiToken
];
