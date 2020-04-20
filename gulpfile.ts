import * as gulp from 'gulp'
import {initGulpNMS} from './network-map-service/gulpfile';
import {initGulpEduNode} from './edunode/gulpfile';

initGulpNMS(gulp, 'network-map-service');
initGulpEduNode(gulp, 'edunode');
