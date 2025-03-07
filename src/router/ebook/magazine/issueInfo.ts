import { Router } from 'express'
import { checkTokenMiddleware } from '../../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../../common/response.js'
import { IssueRepository } from '../../../common/ebookDataSource.js'
import { addLevels, buildNestedCatalogs, CatalogWithLevel } from '../mixin.js'
import { generateImagePath } from '../../../common/mixin.js'
import { Issue } from 'gede-book-entity'

/** 获取期刊的信息和其中某分期的目录 */
const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        issueId: number
    }>({
        issueId: Joi.number().required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    IssueRepository.findOne({
        where: {
            id: value.issueId,
        },
        relations: ['catalogs', 'magazine']
    }).then(async issue => {
        if (!issue) {
            sendError(res, '没有找到该期刊')
            return
        }
        // issue.catalogs = buildNestedCatalogs(issue.catalogs)
        issue.cover = generateImagePath(issue.cover)
        issue.magazine.cover = generateImagePath(issue.magazine.cover)

        const issueInfo: IssueInfo = {
            ...issue,
            catalogs: addLevels(issue.catalogs)
        }
        sendSuccess(res, '获取成功', issueInfo)
    }).catch(error => {
        if (error instanceof Error) {
            sendError(res, error.message)
        }
    })
})

router.post('/onlyInfo', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        issueId: number
    }>({
        issueId: Joi.number().required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    IssueRepository.findOne({
        where: {
            id: value.issueId,
        },
        relations: ['magazine']
    }).then(async issue => {
        if (!issue) {
            sendError(res, '没有找到该期刊')
            return
        }
        // issue.catalogs = buildNestedCatalogs(issue.catalogs)
        issue.cover = generateImagePath(issue.cover)
        issue.magazine.cover = generateImagePath(issue.magazine.cover)

        sendSuccess(res, '获取成功', issue)
    }).catch(error => {
        if (error instanceof Error) {
            sendError(res, error.message)
        }
    })
})

export default router

type IssueInfo = Omit<Issue, 'catalogs'> & { catalogs: CatalogWithLevel[] }