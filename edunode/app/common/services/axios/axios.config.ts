import {Token} from "typedi";
import {AxiosInstance} from "axios";

export const AxiosTokenNMS = new Token<AxiosInstance>('services.axios.nms');
