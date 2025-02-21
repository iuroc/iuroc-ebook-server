import { Router } from 'express'
import Joi from 'joi'
import { sendError, sendSuccess } from '../../common/response.js'
import { UserRepository } from '../../common/appDataSource.js'
import { hashPassword, verifyPassword } from '../../common/bcrypt.js'
import jwt from 'jsonwebtoken'
import { AppConfig } from '../../common/config.js'
import { User } from '../../entity/User.js'

/** 用户登录和注册聚合接口 */
const router = Router()

router.post('/', async (req, res) => {
    const { error, value } = Joi.object<{
        username: string
        password: string
    }>({
        username: Joi.string().regex(/^\w{4,30}$/).required(),
        password: Joi.string().regex(/^\S{10,30}$/).required()
    }).validate(req.body)

    if (error) {
        sendError(res, error.message)
        return
    }

    const user = await UserRepository.findOne({
        where: {
            username: value.username,
        },
    })

    if (!user) {
        // 注册
        const insertResult = await UserRepository.insert({
            username: value.username,
            passwordHash: hashPassword(value.password)
        })
        const newUser = insertResult.generatedMaps[0] as User
        delete (newUser as Partial<User>).passwordHash
        sendSuccess(res, '注册成功', {
            user: insertResult.generatedMaps[0],
            token: jwt.sign(newUser.id.toString(), AppConfig.jwtSecretKey)
        })
    } else {
        // 登录
        if (verifyPassword(value.password, user.passwordHash)) {
            delete (user as Partial<User>).passwordHash
            sendSuccess(res, '登录成功', {
                user,
                token: jwt.sign(user.id.toString(), AppConfig.jwtSecretKey)
            })
        } else {
            sendError(res, '登录失败，账号或密码错误')
        }
    }
})

export default router