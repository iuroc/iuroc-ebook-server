import { Router } from 'express'
import { checkTokenMiddleware, getReqUser } from '../../common/checkToken.js'
import Joi, { valid } from 'joi'
import { sendError, sendSuccess } from '../../common/response.js'
import { NoteRepository } from '../../common/appDataSource.js'

const router = Router()

router.post('/create', checkTokenMiddleware, (req, res) => {
    const user = getReqUser(req)
    const { error, value } = Joi.object<{
        title: string
        content: string
    }>({
        title: Joi.string().required(),
        content: Joi.string().required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    NoteRepository.insert({
        title: value.title,
        content: value.content,
        user: user
    }).then(result => {
        sendSuccess(res, '创建成功', result.generatedMaps)
    }).catch((error: Error) => {
        sendError(res, error.message)
    })
})

router.post('/edit', checkTokenMiddleware, (req, res) => {
    const user = getReqUser(req)
    const { error, value } = Joi.object<{
        id: number
        title: string
        content: string
    }>({
        title: Joi.string().empty(''),
        content: Joi.string().empty(''),
        id: Joi.number().required(),
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    NoteRepository.update({
        user: { id: user.id },
        id: value.id
    }, {
        title: value.title,
        content: value.content,
    }).then(result => {
        if (result.affected) {
            sendSuccess(res, '更新成功', result.generatedMaps)
        } else {
            throw new Error('更新失败')
        }
    }).catch((error: Error) => {
        sendError(res, error.message)
    })
})

router.post('/delete', checkTokenMiddleware, (req, res) => {
    const user = getReqUser(req)
    const { error, value } = Joi.object<{
        id: number
    }>({
        id: Joi.number().required(),
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    NoteRepository.delete({ user: { id: user.id }, id: value.id }).then(result => {
        if (result.affected) {
            sendSuccess(res, '删除成功')
        } else {
            throw new Error('删除失败')
        }
    }).catch((error: Error) => {
        sendError(res, error.message)
    })
})

router.post('/list', checkTokenMiddleware, (req, res) => {
    const user = getReqUser(req)

    const { error, value } = Joi.object<{
        page: number
        pageSize: number
    }>({
        page: Joi.number().empty('').default(0),
        pageSize: Joi.number().empty('').default(72)
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    NoteRepository.find({
        where: {
            user: { id: user.id }
        },
        take: value.pageSize,
        skip: value.page * value.pageSize
    }).then(result => {
        const processedResult = result.map(note => ({
            ...note,
            content: note.content.substring(0, 40) // 截取前40个字符
        }))
        sendSuccess(res, '获取成功', processedResult)
    }).catch((error: Error) => {
        sendError(res, error.message)
    })
})

export default router