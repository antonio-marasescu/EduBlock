import "reflect-metadata";
import {Container} from "typedi";
import DIExecutor from "./di/di.executor";
import {App} from "./app.service";

const di = new DIExecutor();
di.initalize(null).then(async () => {
    const app = Container.get(App);
    app.start().then(async () => {
    });
});
