import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number
    /** 登录用户名，允许数字、字母、下划线，即 `\w` */
    @Column({ type: 'varchar', length: 30, primary: true })
    username: string = ''

    /** Bcrypt 哈希密码 */
    @Column({ type: 'varchar', length: 60 })
    passwordHash: string = ''

    @CreateDateColumn()
    createAt!: Date
}