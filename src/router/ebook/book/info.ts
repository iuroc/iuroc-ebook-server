import { Router } from 'express'
import { checkTokenMiddleware } from '../../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../../common/response.js'
import { BookRepository } from '../../../common/ebookDataSource.js'
import { addLevels, buildNestedCatalogs, CatalogWithLevel } from '../mixin.js'
import { generateImagePath } from '../../../common/mixin.js'
import { Book, Issue } from 'gede-book-entity'


/** 获取图书信息和图书目录 */
const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        bookId: number
    }>({
        bookId: Joi.number().required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    BookRepository.findOne({
        where: {
            id: value.bookId,
        },
        relations: ['catalogs']
    }).then(async book => {
        if (!book) {
            sendError(res, '没有找到该图书')
            return
        }
        book.cover = await generateImagePath(book.cover)
        book.bigCover = await generateImagePath(book.bigCover)
        const bookInfo: BookInfo = {
            ...book,
            catalogs: addLevels(book.catalogs)
        }
        // book.catalogs = buildNestedCatalogs(book.catalogs)
        sendSuccess(res, '获取成功', bookInfo)
    }).catch(error => {
        if (error instanceof Error) {
            sendError(res, error.message)
        }
    })
})



export default router

export type BookInfo = Omit<Book, 'catalogs'> & { catalogs: CatalogWithLevel[] }