import { Router } from 'express'
import { checkTokenMiddleware } from '../../common/checkToken.js'
import { CategoryRepository } from '../../common/ebookDataSource.js'
import { Category } from 'gede-book-entity'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../common/response.js'

const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        type: Category['type']
    }>({
        type: Joi.valid('book', 'magazine')
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    CategoryRepository.find({
        where: {
            type: value.type
        }
    }).then(result => {
        sendSuccess(res, '获取成功', result)
    }).catch(error => {
        if (error instanceof Error) {
            sendError(res, error.message)
        }
    })
})

export default router