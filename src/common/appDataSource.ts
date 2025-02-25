import { DataSource } from 'typeorm'
import { AppConfig } from './config.js'
import { User } from '../entity/User.js'
import { ReadHistory } from '../entity/ReadHistory.js'
import { BookShelf } from '../entity/BookShelf.js'

export const AppDataSource = new DataSource({
    type: 'mysql',
    ...AppConfig.mysql,
    synchronize: true,
    entities: [User, ReadHistory, BookShelf]
})

export const UserRepository = AppDataSource.getRepository(User)
export const ReadHistoryRepository = AppDataSource.getRepository(ReadHistory)
export const BookShelfRepository = AppDataSource.getRepository(BookShelf)