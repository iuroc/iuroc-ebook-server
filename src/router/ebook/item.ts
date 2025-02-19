import { Router } from 'express'
import { checkTokenMiddleware } from '../../common/checkToken.js'
import { sendError, sendSuccess } from '../../common/response.js'
import { BookRepository, MagazineRepository } from '../../common/ebookDataSource.js'
import Joi from 'joi'
import { Category } from 'gede-book-entity'
import { MoreThanOrEqual } from 'typeorm'

const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        categoryId?: number
        /** 前端列表当前已有的最大书刊ID，本次请求将从大于这个值的记录中查询 */
        oldMaxId: number
        limit: number
        type?: Category['type']
    }>({
        categoryId: Joi.number(),
        oldMaxId: Joi.number().default(0),
        limit: Joi.number().default(72).max(120),
        type: Joi.valid('book', 'magazine').required(),
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    if (value.type == 'book') {
        BookRepository.find({
            where: {
                category: { id: value.categoryId },
                id: MoreThanOrEqual(value.oldMaxId + 1)
            },
            relations: ['category'],
            take: value.limit,
        }).then(result => {
            sendSuccess(res, '获取成功', result)
        }).catch(error => {
            if (error instanceof Error) {
                sendError(res, error.message)
            }
        })
    } else if (value.type == 'magazine') {
        MagazineRepository.find({
            where: {
                category: { id: value.categoryId },
                id: MoreThanOrEqual(value.oldMaxId + 1)
            },
            take: value.limit,
        }).then(result => {
            sendSuccess(res, '获取成功', result)
        }).catch(error => {
            if (error instanceof Error) {
                sendError(res, error.message)
            }
        })
    }
})

export default router