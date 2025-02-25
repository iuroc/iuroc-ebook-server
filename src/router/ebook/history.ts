import { Router } from 'express'
import { checkTokenMiddleware, getReqUser } from '../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../common/response.js'
import { ReadHistoryRepository } from '../../common/appDataSource.js'
import { ReadItemRepository } from '../../common/ebookDataSource.js'
import { In } from 'typeorm'

const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        page: number
        pageSize: number
    }>({
        page: Joi.number().default(0),
        pageSize: Joi.number().default(72).max(120)
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const currentUser = getReqUser(req)

    ReadHistoryRepository.find({
        where: {
            user: { id: currentUser.id },
        },
        order: {
            updateAt: 'DESC'
        },
        take: value.pageSize,
        skip: value.page * value.pageSize,
    }).then(result => {
        if (result.length == 0) {
            sendSuccess(res, '获取成功', [])
            return
        } else {
            const readItemIds = result.map(item => item.readItemId)
            ReadItemRepository.find({
                where: {
                    id: In(readItemIds)
                }
            }).then(readItems => {
                sendSuccess(res, '获取成功', readItems)
            })
        }
    })
})

export default router