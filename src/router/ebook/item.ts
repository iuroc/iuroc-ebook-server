import { Router } from 'express'
import { checkTokenMiddleware } from '../../common/checkToken.js'
import { sendError, sendSuccess } from '../../common/response.js'
import { ReadItemRepository } from '../../common/ebookDataSource.js'
import Joi from 'joi'
import { generateImagePath } from '../../common/mixin.js'
import { Book } from 'gede-book-entity'

/** 获取指定类型的（或全部类型）图书或期刊列表 */
const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        categoryId?: number
        page: number
        pageSize: number
    }>({
        categoryId: Joi.number(),
        page: Joi.number().default(0),
        pageSize: Joi.number().default(72).max(120)
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    ReadItemRepository.find({
        where: {
            category: { id: value.categoryId },
        },
        relations: ['category'],
        take: value.pageSize,
        skip: value.page * value.pageSize
    }).then(async result => {
        for (const item of result) {
            item.cover = await generateImagePath(item.cover)
            const book = item as Book
            if (book.bigCover) {
                book.bigCover = await generateImagePath(book.bigCover)
            }
        }
        sendSuccess(res, '获取成功', result)
    }).catch(error => {
        if (error instanceof Error) {
            sendError(res, error.message)
        }
    })
})

export default router