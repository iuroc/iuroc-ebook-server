import express from 'express'
import { AppConfig } from './common/config.js'
import mainRouter from './mainRouter.js'
import { AppDataSource, EbookDataSource } from './common/dataSource.js'

const task1 = '初始化应用数据库'
console.log(`[${task1}] 开始`)
await AppDataSource.initialize()
console.log(`[${task1}] 结束`)

const task2 = '初始化电子书数据库'
console.log(`[${task2}] 开始`)
await EbookDataSource.initialize()
console.log(`[${task2}] 结束`)

const task3 = `启动HTTP服务器`
console.log(`[${task3}] 开始`)
const app = express()
app.use(mainRouter)
app.listen(AppConfig.server.port, AppConfig.server.host, () => {
    console.log(`[${task3}] 结束 - Server is running at http://${AppConfig.server.host}:${AppConfig.server.port}`)
})