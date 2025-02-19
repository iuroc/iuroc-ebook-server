import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions.js'

export const AppConfig = {
    /** 应用程序数据库 */
    mysql: {
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '12345678',
        database: 'iuroc_ebook'
    } as MysqlConnectionCredentialsOptions,
    server: {
        host: '192.168.1.88',
        port: 7873
    },
}

export const EbookConfig = {
    /** 电子书数据库 */
    mysql: {
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '12345678',
        database: 'iuroc_ebook_test'
    } as MysqlConnectionCredentialsOptions,

    /** 图片资源目录 */
    imageDir: 'E:/其他文件/数据库备份/iuroc-ebook-images-3381845'
}