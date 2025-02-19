import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { sendError } from './response.js'
import { AppConfig } from './config.js'
import { UserRepository } from './dataSource.js'
import { User } from '../entity/User.js'

/** 校验 `headers` 中的 `token`，如果校验通过，则将对应的 `User` 对象挂载到 `req` 中，后续通过 {@link getReqUser} 获取 `User` 对象。 */
export async function checkTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers['token']
        if (typeof token != 'string') throw new Error('token 格式错误')
        const userId = verify(token, AppConfig.jwtSecretKey) as string
        const user = await UserRepository.findOne({
            where: {
                id: parseInt(userId)
            }
        })
        if (!user) {
            throw new Error('用户不存在')
        }
        (req as any).user = user
        next()
    } catch {
        sendError(res, 'token 校验失败')
    }
}

/** 该方法必须在 {@link checkTokenMiddleware} 之后执行 */
export function getReqUser(req: Request) {
    return (req as any).user as User
}