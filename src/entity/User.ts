import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BookShelf } from './BookShelf.js'

@Entity({ comment: '用户表' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number
    /** 登录用户名，允许数字、字母、下划线，即 `\w` */
    @Column({ type: 'varchar', length: 30, primary: true })
    username!: string

    /** Bcrypt 哈希密码 */
    @Column({ type: 'varchar', length: 60 })
    passwordHash!: string

    @CreateDateColumn()
    createAt!: Date

    @OneToMany(() => BookShelf, bookShelf => bookShelf.user)
    bookShelfs?: BookShelf[]

    @OneToMany(() => BookShelf, readHistory => readHistory.user)
    readHistorys?: BookShelf[]
}