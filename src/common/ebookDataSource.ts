import { DataSource } from 'typeorm'
import { EbookConfig } from './config.js'
import { Book, Category, entities as ebookEntities, Magazine, ReadItem } from 'gede-book-entity'

export const EbookDataSource = new DataSource({
    type: 'mysql',
    ...EbookConfig.mysql,
    entities: ebookEntities
})

export const CategoryRepository = EbookDataSource.getRepository(Category)
export const BookRepository = EbookDataSource.getRepository(Book)
export const ReadItemRepository = EbookDataSource.getRepository(ReadItem)
export const MagazineRepository = EbookDataSource.getRepository(Magazine)