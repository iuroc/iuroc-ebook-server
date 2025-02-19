import { Router } from 'express'
import { checkTokenMiddleware } from '../../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../../common/response.js'
import { BookCatalogRepository, BookRepository } from '../../../common/ebookDataSource.js'


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
        sendSuccess(res, '获取成功', book)
    }).catch(error => {
        if (error instanceof Error) {
            sendError(res, error.message)
        }
    })
})

export default router