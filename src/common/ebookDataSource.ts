import { DataSource } from 'typeorm'
import { EbookConfig } from './config.js'
import { Book, BookCatalog, Category, entities as ebookEntities, Issue, Magazine, MagazineCatalog, ReadItem } from 'gede-book-entity'

export const EbookDataSource = new DataSource({
    type: 'mysql',
    ...EbookConfig.mysql,
    entities: ebookEntities
})

export const CategoryRepository = EbookDataSource.getRepository(Category)
export const BookRepository = EbookDataSource.getRepository(Book)
export const ReadItemRepository = EbookDataSource.getRepository(ReadItem)
export const MagazineRepository = EbookDataSource.getRepository(Magazine)
export const IssueRepository = EbookDataSource.getRepository(Issue)
export const BookCatalogRepository = EbookDataSource.getRepository(BookCatalog)
export const MagazineCatalogRepository = EbookDataSource.getRepository(MagazineCatalog)