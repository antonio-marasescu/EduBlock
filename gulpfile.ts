import * as gulp from 'gulp'
import {initGulpNMS} from './network-map-service/gulpfile';
import {initGulpEduNode} from './edunode/gulpfile';
import {initGulpCA} from './certificate-authority/gulpfile';

initGulpCA(gulp, 'certificate-authority');
initGulpNMS(gulp, 'network-map-service');
initGulpEduNode(gulp, 'edunode');
