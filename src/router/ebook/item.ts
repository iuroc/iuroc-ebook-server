import { Router } from 'express'
import { checkTokenMiddleware } from '../../common/checkToken.js'
import { sendError, sendSuccess } from '../../common/response.js'
import { ReadItemRepository } from '../../common/ebookDataSource.js'
import Joi from 'joi'

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
    }).then(result => {
        sendSuccess(res, '获取成功', result)
    }).catch(error => {
        if (error instanceof Error) {
            sendError(res, error.message)
        }
    })
})

export default router