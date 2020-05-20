/// <reference lib="webworker" />

import * as keypair from 'keypair';

const keyPair: { public: string, private: string } = keypair();
postMessage(keyPair);
