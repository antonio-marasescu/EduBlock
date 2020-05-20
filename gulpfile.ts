import * as gulp from 'gulp'
import {initGulpNMS} from './network-map-service/gulpfile';
import {initGulpEduNode} from './edunode/gulpfile';
import {initGulpCA} from './certificate-authority/gulpfile';
import {initGulpEduNodeWorker} from "./edunode-worker/gulpfile";
import {initGulpEduNodeUI} from "./edunode-ui/gulpfile";

initGulpCA(gulp, 'certificate-authority');
initGulpNMS(gulp, 'network-map-service');
initGulpEduNode(gulp, 'edunode');
initGulpEduNodeWorker(gulp, 'edunode-worker');
initGulpEduNodeUI(gulp, 'edunode-ui');
