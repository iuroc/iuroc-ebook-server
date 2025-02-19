import { DataSource } from 'typeorm'
import { AppConfig } from './config.js'

export const AppDataSource = new DataSource({
    type: 'mysql',
    ...AppConfig.mysql.app,
})

export const EbookDataSource = new DataSource({
    type: 'mysql',
    ...AppConfig.mysql.ebook,
})