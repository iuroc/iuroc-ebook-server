import { Router, Request, Response, NextFunction } from 'express'
import express from 'express'
import userLoginOrRegisterRouter from './router/user/loginOrRegister.js'
import userCheckTokenRouter from './router/user/checkToken.js'
import userDeleteRouter from './router/user/delete.js'
import ebookCategoryRouter from './router/ebook/category.js'
import ebookMagazineIssueRouter from './router/ebook/magazine/issue.js'
import ebookBookInfoRouter from './router/ebook/book/info.js'
import ebookMagazineIssueInfoRouter from './router/ebook/magazine/issueInfo.js'
import ebookItemRouter from './router/ebook/item.js'
import { sendError } from './common/response.js'
import { EbookConfig } from './common/config.js'

const router = Router()

router.use('/images', express.static(EbookConfig.imageDir))

router.use(express.json())

// [/api/user]
router.use('/api/user/loginOrRegister', userLoginOrRegisterRouter)
router.use('/api/user/checkToken', userCheckTokenRouter)
router.use('/api/user/delete', userDeleteRouter)  // 这个接口还需要完善：等其余实体构建完成后，要记得联合删除。

// [/api/ebook/book]
router.use('/api/ebook/book/info', ebookBookInfoRouter)

// [/api/ebook/magazine]
router.use('/api/ebook/magazine/issue', ebookMagazineIssueRouter)
router.use('/api/ebook/magazine/issueInfo', ebookMagazineIssueInfoRouter)

// [/api/ebook/common]
router.use('/api/ebook/category', ebookCategoryRouter)
router.use('/api/ebook/item', ebookItemRouter)

// [/api/openai]

router.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    sendError(res, error.message)
})

export default router