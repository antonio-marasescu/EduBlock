import "reflect-metadata";
import {Container} from "typedi";
import DIExecutor from "./di/di.executor";
import {App} from "./app.service";
import {SeederHandler} from "./server/seed/seeder.handler";
import {NetworkMapServiceToken} from "./common/services/network-map.service";

const di = new DIExecutor();
di.initialize(null).then(async () => {
    const seeder = new SeederHandler();
    const networkMapService = Container.get(NetworkMapServiceToken);
    await seeder.seed(networkMapService);
    const app = Container.get(App);
    app.start().then(async () => {
    });
});
