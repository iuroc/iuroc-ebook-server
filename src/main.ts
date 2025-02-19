import express from 'express'
import { AppConfig } from './common/config.js'
import mainRouter from './mainRouter.js'

const app = express()

app.use(mainRouter)

app.listen(AppConfig.server.port, AppConfig.server.host, () => {
    console.log(`Server is running at http://${AppConfig.server.host}:${AppConfig.server.port}`)
})