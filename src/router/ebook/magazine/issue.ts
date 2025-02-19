import { Router } from 'express'
import { checkTokenMiddleware } from '../../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../../common/response.js'
import { IssueRepository } from '../../../common/ebookDataSource.js'

const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        magazineId: number
        page: number
        pageSize: number
    }>({
        magazineId: Joi.number().required(),
        page: Joi.number().default(0),
        pageSize: Joi.number().default(72).max(120)
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    IssueRepository.find({
        where: {
            magazine: { id: value.magazineId }
        },
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