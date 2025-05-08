import { createHash } from 'crypto'
import { EbookConfig } from './config.js'

export function generateImagePath(imageUrl: string): string {
    if (!EbookConfig.useLocalImage) return imageUrl
    const sha1Hash = createHash('sha1').update(imageUrl).digest('hex')
    return `/images/${sha1Hash}.jpg`
}