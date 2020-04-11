import express from "express";
import {NetworkApi, NetworkApiToken} from "./controllers/network.api";

export const API_REGISTER = [
    {token: NetworkApiToken, instance: new NetworkApi()}
];
export const API_ROUTER_REGISTER: express.Router[] = API_REGISTER.map(x => x.instance.getRouter());
