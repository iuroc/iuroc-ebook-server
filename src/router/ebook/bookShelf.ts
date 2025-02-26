import { Router } from 'express'
import { checkTokenMiddleware, getReqUser } from '../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../common/response.js'
import { BookShelfRepository } from '../../common/appDataSource.js'
import { makeBookAndIssueMixedList } from './history.js'
import { BookAndIssueMixed } from '../../entity/ReadHistory.js'

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

// 判断 bookId 或 issueId 是否在书架中
router.post('/get', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<BookAndIssueMixed>({
        itemId: Joi.number().required(),
        type: Joi.string().valid('book', 'issue').required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const currentUser = getReqUser(req)

    BookShelfRepository.findOne({
        where: {
            user: { id: currentUser.id },
            type: value.type,
            itemId: value.itemId
        },
    }).then(result => {
        if (!result) {
            sendError(res, '没有找到记录')
            return
        }
        sendSuccess(res, '获取成功', result)
    })
})

router.post('/toggle', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<BookAndIssueMixed>({
        itemId: Joi.number().required(),
        type: Joi.string().valid('book', 'issue').required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const currentUser = getReqUser(req)
    const selector = {
        user: { id: currentUser.id },
        type: value.type,
        itemId: value.itemId
    }
    // 判断是否存在记录
    BookShelfRepository.findOne({ where: selector }).then(result => {
        if (result) {
            // 删除记录
            BookShelfRepository.delete(selector).then(result => {
                if (result.affected) {
                    sendSuccess(res, '已从书架移除', {
                        isInBookShelf: false
                    })
                } else {
                    sendError(res, '删除记录失败')
                }
            }).catch(_error => {
                sendError(res, '删除记录失败')
            })
        } else {
            // 插入新记录
            BookShelfRepository.insert(selector).then(result => {
                sendSuccess(res, '已添加到书架', {
                    ...result.generatedMaps[0],
                    isInBookShelf: true
                })
            }).catch(error => {
                if (error instanceof Error) {
                    sendError(res, '添加失败')
                }
            })
        }
    })
})

export default router