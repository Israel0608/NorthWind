import mysql, { MysqlError } from "mysql";
import appConfig from "./app-config";

// Creating a connection object:
const connaction = mysql.createPool({
    host: appConfig.mysqlHost,// dataBase computer address;
    user: appConfig.mysqlUser,// dataBase email;
    password: appConfig.mysqlPassword,// dataBase password;
    database: appConfig.mysqlDatabase,// dataBase name; 
})

function execute(sql: string): Promise<any> { // Promisify
    return new Promise<any>((resolve, reject) => {
        connaction.query(sql, (err: MysqlError, result: any) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        })
    })
}

export default {
    execute
};