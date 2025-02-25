import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User.js'

@Entity({ comment: '阅读历史' })
export class ReadHistory {
    @PrimaryGeneratedColumn()
    id!: number

    /**
     * read_item 表的记录 ID
     */
    @Column('int', { comment: 'bookId or issueId' })
    readItemId: number = 0

    @Column('int', { comment: '当前阅读到的页码' })
    currentBookPage: number = 1

    @CreateDateColumn()
    createAt!: Date

    @ManyToOne(() => User, user => user.readHistorys, { onDelete: 'CASCADE' })
    user?: User

    /** 更新时间，可以作为最近阅读时间 */
    @UpdateDateColumn()
    updateAt!: Date
}