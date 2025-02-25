import { Router } from 'express'
import { checkTokenMiddleware, getReqUser } from '../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../common/response.js'
import { BookShelfRepository } from '../../common/appDataSource.js'
import { makeBookAndIssueMixedList } from './history.js'

const router = Router()

router.post('/list', checkTokenMiddleware, (req, res) => {
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

    BookShelfRepository.find({
        where: {
            user: { id: currentUser.id },
        },
        order: {
            createAt: 'DESC'
        },
        take: value.pageSize,
        skip: value.page * value.pageSize,
    }).then(async result => {
        if (result.length == 0) {
            sendSuccess(res, '获取成功', [])
            return
        } else {
            sendSuccess(res, '获取成功', await makeBookAndIssueMixedList(result))
        }
    })
})

export default router