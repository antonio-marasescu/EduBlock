import {Token} from "typedi";
import {AxiosInstance} from "axios";

export const AxiosTokenNMS = new Token<AxiosInstance>('services.axios.nms');
export const AxiosTokenCA = new Token<AxiosInstance>('services.axios.ca');
export const AxiosTokenWorker = new Token<AxiosInstance>('services.axios.worker');
