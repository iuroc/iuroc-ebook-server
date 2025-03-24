import { Router } from 'express'
import { checkTokenMiddleware, getReqUser } from '../../common/checkToken.js'
import Joi from 'joi'
import { BookAndIssueMixed } from '../../entity/ReadHistory.js'
import { sendError, sendSuccess } from '../../common/response.js'
import { BookMarkRepository } from '../../common/appDataSource.js'

const router = Router()

router.post('/toggle', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        title: string
        bookPage: number
        itemId: number
        type: BookAndIssueMixed['type']
    }>({
        title: Joi.string().required(),
        bookPage: Joi.number().required(),
        itemId: Joi.number().required().required(),
        type: Joi.string().valid('book', 'issue').required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const user = getReqUser(req)

    // 判断书签是否存在
    BookMarkRepository.findOne({
        where: {
            user: { id: user.id },
            bookPage: value.bookPage,
            itemId: value.itemId,
            type: value.type
        }
    }).then(async result => {
        if (result) {
            await BookMarkRepository.delete({ id: result.id })
            sendSuccess(res, '移除书签成功')
        } else {
            const result = await BookMarkRepository.insert({
                title: value.title,
                bookPage: value.bookPage,
                itemId: value.itemId,
                type: value.type,
                user: { id: user.id },
            })
            sendSuccess(res, '添加书签成功', result.generatedMaps)
        }
    }).catch((error: Error) => {
        sendError(res, '操作失败：' + error.message)
    })
})

router.post('/find', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        bookPage: number
        itemId: number
        type: BookAndIssueMixed['type']
    }>({
        bookPage: Joi.number().required(),
        itemId: Joi.number().required().required(),
        type: Joi.string().valid('book', 'issue').required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const user = getReqUser(req)
    BookMarkRepository.findOne({
        where: {
            user: { id: user.id },
            bookPage: value.bookPage,
            itemId: value.itemId,
            type: value.type
        }
    }).then(result => {
        sendSuccess(res, `查询成功，书签记录${result ? '存在' : '不存在'}`, result)
    }).catch((error: Error) => {
        sendError(res, error.message)
    })
})

router.post('/list', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        itemId: number
        type: BookAndIssueMixed['type']
        page: number
        pageSize: number
    }>({
        itemId: Joi.number().required().required(),
        type: Joi.string().valid('book', 'issue').required(),
        page: Joi.number().empty('').default(0),
        pageSize: Joi.number().empty('').default(72)
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const user = getReqUser(req)
    BookMarkRepository.find({
        where: {
            user: { id: user.id },
            itemId: value.itemId,
            type: value.type,
        },
        take: value.pageSize,
        skip: value.page * value.pageSize
    }).then(result => {
        sendSuccess(res, '获取成功', result)
    }).catch((error: Error) => {
        sendError(res, error.message)
    })
})

export default router