import { DataSource } from 'typeorm'
import { AppConfig } from './config.js'
import { User } from '../entity/User.js'
import { ReadHistory } from '../entity/ReadHistory.js'
import { BookShelf } from '../entity/BookShelf.js'
import { Note } from '../entity/Note.js'

export const AppDataSource = new DataSource({
    type: 'mysql',
    ...AppConfig.mysql,
    synchronize: true,
    entities: [User, ReadHistory, BookShelf, Note]
})

export const UserRepository = AppDataSource.getRepository(User)
export const ReadHistoryRepository = AppDataSource.getRepository(ReadHistory)
export const BookShelfRepository = AppDataSource.getRepository(BookShelf)
export const NoteRepository = AppDataSource.getRepository(Note)