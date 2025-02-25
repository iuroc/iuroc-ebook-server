import { Router } from 'express'
import { checkTokenMiddleware, getReqUser } from '../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../common/response.js'
import { ReadHistoryRepository } from '../../common/appDataSource.js'
import { BookRepository, IssueRepository, ReadItemRepository } from '../../common/ebookDataSource.js'
import { In } from 'typeorm'
import { BookAndIssueMixed, ReadHistory } from '../../entity/ReadHistory.js'
import { Book, Issue } from 'gede-book-entity'

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

    ReadHistoryRepository.find({
        where: {
            user: { id: currentUser.id },
        },
        order: {
            updateAt: 'DESC'
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

export async function makeBookAndIssueMixedList(items: BookAndIssueMixed[]) {
    const bookIds = items.filter(item => item.type == 'book').map(item => item.itemId)
    const issueIds = items.filter(item => item.type == 'issue').map(item => item.itemId)
    const books = await BookRepository.find({
        where: {
            id: In(bookIds)
        }
    })
    const issues = await IssueRepository.find({
        where: {
            id: In(issueIds)
        }
    })
    // 使用 Map 将 id 映射到对应的实体，以便根据 itemId 快速查找
    const bookMap = new Map(books.map(book => [book.id, book]))
    const issueMap = new Map(issues.map(issue => [issue.id, issue]))
    const list: { item: BookAndIssueMixed, data: Book | Issue }[] = []
    // 按照 result 的顺序重新构造 list
    for (const item of items) {
        if (item.type === 'book') {
            const book = bookMap.get(item.itemId)
            if (book) {
                list.push({
                    item: item,
                    data: book,
                })
            }
        } else if (item.type === 'issue') {
            const issue = issueMap.get(item.itemId)
            if (issue) {
                list.push({
                    item: item,
                    data: issue,
                })
            }
        }
    }
    return list
}

router.post('/get', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        readItemId: number
    }>({
        readItemId: Joi.number().required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const currentUser = getReqUser(req)

    ReadHistoryRepository.findOne({
        where: {
            user: { id: currentUser.id },
            itemId: value.readItemId
        },
    }).then(result => {
        if (!result) {
            sendError(res, '没有找到记录')
            return
        }
        sendSuccess(res, '获取成功', result)
    })
})

router.post('/update', checkTokenMiddleware, (req, res) => {

})

export default router