import { Router } from 'express'
import express from 'express'
import userLoginOrRegisterRouter from './router/user/loginOrRegister.js'
import userDeleteRouter from './router/user/delete.js'
import ebookCategoryRouter from './router/ebook/category.js'
import ebookItemRouter from './router/ebook/item.js'

const router = Router()

router.use(express.json())

// [/api/user]
router.use('/api/user/loginOrRegister', userLoginOrRegisterRouter)
router.use('/api/user/delete', userDeleteRouter)

// [/api/ebook/book]

// [/api/ebook/magazine]

// [/api/ebook/common]
router.use('/api/ebook/category', ebookCategoryRouter)
router.use('/api/ebook/item', ebookItemRouter)

// [/api/openai]

export default router