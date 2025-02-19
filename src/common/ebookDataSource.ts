import { DataSource } from 'typeorm'
import { EbookConfig } from './config.js'
import { Category, entities as ebookEntities } from 'gede-book-entity'

export const EbookDataSource = new DataSource({
    type: 'mysql',
    ...EbookConfig.mysql,
    entities: ebookEntities
})

export const CategoryRepository = EbookDataSource.getRepository(Category)