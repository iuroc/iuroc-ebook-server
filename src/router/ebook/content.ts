import { Router } from 'express'
import { checkTokenMiddleware } from '../../common/checkToken.js'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../common/response.js'
import { BookContentRepository, MagazineContentRepository } from '../../common/ebookDataSource.js'
import { MoreThan } from 'typeorm'
import { BookContent, MagazineContent } from 'gede-book-entity'
import { BookAndIssueMixed } from '../../entity/ReadHistory.js'

/** 获取图书或期刊的正文 */
const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        type: BookAndIssueMixed['type'],
        /** Book 或 Issue 的 ID */
        itemId: number
        startBookPage: number
        bookPageCount: number
    }>({
        type: Joi.valid('book', 'issue').required(),
        itemId: Joi.number().required(),
        startBookPage: Joi.number().min(1).default(1),
        bookPageCount: Joi.number().default(30).max(120),
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    /**
     * 逻辑解析
     * 
     * Content 包含了 index，从 0 开始的。
     * 
     * 防止 page 同名干扰，这里使用 startBookPage，对应的 content 的 index + 1
     * 
     * bookPageCount 表示提取 index >= startBookPage - 1, limit bookPageCount
     * 
     * 如 startBookPage = 1, bookPageCount = 30，则查询 index >= 0, limit 30，将返回 index 范围 [0, 30)
     * 
     * 如 startBookPage = 31, bookPageCOunt = 30. 则查询 index >= 30, limit 30，将返回 index 范围 [30, 60)
     * 
     * 即，查询 index >= startBookPage - 1, limit 30，将返回 index 范围 [30, 60)
     * 
     * 
     * 前端配置 bookPageCount: number，表示一次性加载多少页，在请求后端时，传递的 startBookPage 必须满足 (bookPageCount * N + 1)，N >= 0
     * 
     * 比如 bookPageCount = 30，则 startBokPage 可以为 1, 31, 61, 91
     * 比如 bookPageCount = 15，则 startBookPage 可以为 1, 16, 31, 46, 61
     * 
     * 可以看出，相邻的 startBookPage 之间的差值就是 bookPageCount
     * 
     * 为什么强调是 bookPage 而不是 page？
     * 
     * 根据编程习惯，在数据库分页查询时，传入的 page 和 pageSize，其中的 page 习惯性为以 0 为起始值。
     * 
     * 和编程中的下标的概念类似，都是从 0 开始的。
     * 
     * 而这里的 bookPage 则不是编程意义上的下标，而是对应真实世界中的书本页码，初始值为 1
     * 
     * catalog 表中存储的是 bookPage，content 中存储的是 index
     * 
     * catalog 查询时，前端传入的是 bookPage
     */


    (value.type == 'book' ? BookContentRepository : MagazineContentRepository).find({
        where: {
            ...(value.type == 'book'
                ? { book: { id: value.itemId } }
                : { issue: { id: value.itemId } }
            ),
            index: MoreThan(value.startBookPage - 1),
        },
        take: value.bookPageCount,
        order: {
            index: 'ASC'
        }
    }).then(result => {
        if (value.type == 'book') {
            sendSuccess(res, '获取成功', result as BookContent[])
        } else {
            sendSuccess(res, '获取成功', result as MagazineContent[])
        }
    })
})

export default router