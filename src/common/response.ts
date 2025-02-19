import { Response } from 'express'

/** API响应格式 */
export type ApiResponse<T = null> = {
    success: boolean
    data: T
    message: string
}

/** 发送成功响应 */
export function sendSuccess<T = null>(res: Response, message: string, data: T) {
    return res.send({
        success: true,
        data,
        message,
    } as ApiResponse)
}

/** 发送失败响应 */
export function sendError(res: Response, message: string) {
    return res.send({
        success: false,
        data: null,
        message
    })
}