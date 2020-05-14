import Axios, {AxiosInstance} from "axios";

export function buildAxiosInstance(host: string, port: number): AxiosInstance {
    return Axios.create({
        baseURL: 'http://' + host + ":" + port
    });
}
