import { Router } from 'express'
import { checkTokenMiddleware } from '../../common/checkToken.js'
import { sendError, sendSuccess } from '../../common/response.js'
import { ReadItemRepository } from '../../common/ebookDataSource.js'
import Joi from 'joi'
import { generateImagePath } from '../../common/mixin.js'
import { Book } from 'gede-book-entity'
import { Brackets } from 'typeorm'

/** 获取指定类型的（或全部类型）图书或期刊列表 */
const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const { error, value } = Joi.object<{
        categoryId?: number
        page: number
        pageSize: number
        keyword?: string
    }>({
        categoryId: Joi.number(),
        page: Joi.number().default(0),
        pageSize: Joi.number().default(72).max(120),
        keyword: Joi.string().empty('')
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const keyword = value.keyword?.trim()
    const keywordLike = keyword ? `%${keyword.replace(/\s+/g, '%')}%` : null

    const query = ReadItemRepository
        .createQueryBuilder('readItem')
        .leftJoinAndSelect('readItem.category', 'category')

    if (value.categoryId) {
        query.where('category.id = :categoryId', { categoryId: value.categoryId });
    }

    if (keyword) {
        query.andWhere(
            new Brackets(qb => {
                qb.where('readItem.name LIKE :kw', { kw: keywordLike })
                    .orWhere('readItem.summary LIKE :kw', { kw: keywordLike })
                    .orWhere('readItem.author LIKE :kw', { kw: keywordLike })
                    .orWhere('readItem.isbn = :exactKw', { exactKw: keyword })
                    .orWhere('readItem.issn = :exactKw', { exactKw: keyword })
                    .orWhere('readItem.cn = :exactKw', { exactKw: keyword })
            })
        )
    }

    query
        .skip(value.page * value.pageSize)
        .take(value.pageSize)
        .getMany()
        .then(async result => {
            for (const item of result) {
                item.cover = generateImagePath(item.cover)
                const book = item as Book
                if (book.bigCover) {
                    book.bigCover = generateImagePath(book.bigCover)
                }
            }
            sendSuccess(res, '获取成功', result)
        }).catch(error => {
            if (error instanceof Error) {
                sendError(res, error.message)
            }
        })
})

export default router