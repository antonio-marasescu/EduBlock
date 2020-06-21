# EduBlock
![EduBlock Logo](docs/images/edublock-logo.png?raw=true "EduBlock")
### Brief

EduBlock represents a private blockchain platform intended
 for sharing of educational records between universities.

### Prerequisites
    The following software must be installed in order to run the setup:
    - RabbitMQ
    - Docker
    - Node.js
    
    The Docker and RabbitMQ services must be started before running the nodes setup.
### Setup
1. clone the repository
2. run `npm install`
3. run `docker-compose up` in the `docker` folder
4. start one or more `edunodes` using the gulp command `eduNode:runNode:*`
5. copy the public key from the console and add them into the 
   *network-map-service/resources/network-identities.json* file
6. start the NMS node with the gulp command `nms:runNode` 
7. start the CA node with the gulp command `ca:runNode`
8. start the Worker node using the gulp command `eduNode:runNodeWorker:*`
9. start the edu-nodes UI with the gulp command `eduNode:runNodeUI:*`
### Configuration
    The setup for each node can be configured in the following files:
    - network-map-service/resources/identities.json
    - edunode/resources/identities.json
    - edunode-worker/resources/identities.json
    - certificate-authority/resources/identities.json
    - edunode-ui/src/proxies/*.json
    
### Acknowledgements
The project uses the following libraries:
1. Axios: https://github.com/axios/axios
2. JsonWebToken: https://github.com/auth0/node-jsonwebtoken
3. TypeORM: https://typeorm.io/#/
4. TypeDI: https://github.com/typestack/typedi
5. EOSJS-ECC: https://github.com/EOSIO/eosjs-ecc
6. Amqp-ts: https://github.com/abreits/amqp-ts/wiki
7. Mocha: https://mochajs.org
8. Chai: https://www.chaijs.com/plugins/chai-http/
9. ClassValidator: https://github.com/typestack/class-validator
10. Express: https://expressjs.com
11. Angular: https://angular.io
12. Angular Material: https://material.angular.io
13. Gulp: https://gulpjs.com
14. NGRX: https://ngrx.io
15. Jasmine: https://jasmine.github.io
