import { createHash } from 'crypto'

export async function generateImagePath(imageUrl: string): Promise<string> {
    const sha1Hash = createHash('sha1').update(imageUrl).digest('hex')
    return `/images/${sha1Hash}.jpg`
}