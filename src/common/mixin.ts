import { createHash } from 'crypto'

export function generateImagePath(imageUrl: string): string {
    const sha1Hash = createHash('sha1').update(imageUrl).digest('hex')
    return `/images/${sha1Hash}.jpg`
}