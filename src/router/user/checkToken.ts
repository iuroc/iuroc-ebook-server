import { Router } from 'express'
import { checkTokenMiddleware, getReqUser } from '../../common/checkToken.js'
import { User } from '../../entity/User.js'
import { sendSuccess } from '../../common/response.js'

const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const user = getReqUser(req)
    delete (user as Partial<User>).passwordHash
    sendSuccess(res, '校验成功', user)
})

export default router