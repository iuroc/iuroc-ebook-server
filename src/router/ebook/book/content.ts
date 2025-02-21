import { Router } from 'express'
import { checkTokenMiddleware } from '../../../common/checkToken.js'

const router = Router()

router.post('/', checkTokenMiddleware, (req, res) => {
    
})

export default router