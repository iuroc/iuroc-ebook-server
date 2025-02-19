import { DataSource } from 'typeorm'
import { AppConfig } from './config.js'
import { User } from '../entity/User.js'
import { entities as ebookEntities } from 'gede-book-entity'

export const AppDataSource = new DataSource({
    type: 'mysql',
    ...AppConfig.mysql.app,
    synchronize: true,
    entities: [User]
})

export const EbookDataSource = new DataSource({
    type: 'mysql',
    ...AppConfig.mysql.ebook,
    entities: ebookEntities
})