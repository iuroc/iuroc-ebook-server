import express from 'express'
import { AppConfig, EbookConfig } from './common/config.example.js'
import mainRouter from './mainRouter.js'
import { AppDataSource, EbookDataSource } from './common/dataSource.js'
import { statSync } from 'fs'

if (!EbookConfig.imageDir || !statSync(EbookConfig.imageDir).isDirectory()) throw new Error('图片资源目录错误')
await AppDataSource.initialize().then(() => console.log('应用数据库初始化完成'))
await EbookDataSource.initialize().then(() => console.log('电子书数据库初始化完成'))

const app = express()
app.use(mainRouter)
app.listen(AppConfig.server.port, AppConfig.server.host, () => {
    console.log(`Server is running at http://${AppConfig.server.host}:${AppConfig.server.port}`)
})