import bcrypt from 'bcryptjs'

/**
 * @description 使用 bcrypt 进行密码哈希
 * @param password 明文密码
 * @returns 哈希后的密码
 */
export function hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    return hashedPassword
}

/**
 * @description 验证明文密码与哈希密码是否匹配
 * @param password 明文密码
 * @param hash 数据库中存储的哈希密码
 * @returns 是否验证通过
 */
export function verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
}