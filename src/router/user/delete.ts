import { Router } from 'express'
import { checkTokenMiddleware, getReqUser } from '../../common/checkToken.js'
import { sendError, sendSuccess } from '../../common/response.js'
import { UserRepository } from '../../common/appDataSource.js'

/** 注销用户，删除该用户相关数据表记录 */
const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    const currentUser = getReqUser(req)
    UserRepository.delete({ id: currentUser.id }).then(() => {
        sendSuccess(res, '账号注销成功', null)
    }).catch(error => {
        if (error instanceof Error) {
            sendError(res, error.message)
        }
    })
})

export default router