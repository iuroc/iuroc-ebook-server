import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions.js'

export const AppConfig = {
    mysql: {
        /** 应用程序数据库 */
        app: {
            host: '127.0.0.1',
            port: 3306,
            username: 'root',
            password: '12345678',
            database: 'iuroc_ebook'
        } as MysqlConnectionCredentialsOptions,
        /** 电子书数据库 */
        ebook: {
            host: '127.0.0.1',
            port: 3306,
            username: 'root',
            password: '12345678',
            database: 'iuroc_ebook_test'
        } as MysqlConnectionCredentialsOptions,
    },
    server: {
        host: '192.168.1.88',
        port: 7873
    }
}