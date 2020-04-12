export interface NodeDatabaseConfigModel {
    username: string;
    password: string;
    host: string;
    port: number;
    databaseName: string;
    logging: string[];
    logger: string;
}
