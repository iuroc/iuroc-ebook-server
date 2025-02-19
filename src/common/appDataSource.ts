import { DataSource } from 'typeorm'
import { AppConfig, EbookConfig } from './config.js'
import { User } from '../entity/User.js'

export const AppDataSource = new DataSource({
    type: 'mysql',
    ...AppConfig.mysql,
    synchronize: true,
    entities: [User]
})

export const UserRepository = AppDataSource.getRepository(User)