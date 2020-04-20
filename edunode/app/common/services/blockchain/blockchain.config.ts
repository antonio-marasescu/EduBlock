export interface GenesisProofConfig {
    nonce: number;
    hash: string;
}

export interface GenesisConfig {
    previousHash: string;
    proof: GenesisProofConfig;
}

export interface BlockchainConfig {
    genesis: GenesisConfig;
}

export const BLOCKCHAIN_CONFIG: BlockchainConfig = {
    genesis: {
        previousHash: "0",
        proof: {
            nonce: 0,
            hash: "0"
        }
    }
};
