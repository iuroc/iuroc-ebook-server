import { Router } from 'express'
import express from 'express'
import userLoginOrRegisterRouter from './router/user/loginOrRegister.js'
import userDeleteRouter from './router/user/delete.js'

const router = Router()

router.use(express.json())

// [/api/user]
router.use('/api/user/loginOrRegister', userLoginOrRegisterRouter)
router.use('/api/user/delete', userDeleteRouter)

// [/api/book]

// [/api/magazine]

// [/api/openai]

export default router