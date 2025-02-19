import { Router } from 'express'
import express from 'express'
import userLoginOrRegisterRouter from './router/user/loginOrRegister.js'
import userDeleteRouter from './router/user/delete.js'
import ebookCategoryRouter from './router/ebook/category.js'

const router = Router()

router.use(express.json())

// [/api/user]
router.use('/api/user/loginOrRegister', userLoginOrRegisterRouter)
router.use('/api/user/delete', userDeleteRouter)

// [/api/ebook/book]

// [/api/ebook/magazine]

// [/api/ebook/common]
router.use('/api/ebook/category', ebookCategoryRouter)

// [/api/openai]

export default router