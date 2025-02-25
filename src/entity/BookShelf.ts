import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User.js'

/** 书架 */
@Entity({ comment: '书架' })
export class BookShelf {
    @PrimaryGeneratedColumn()
    id!: number

    /**
     * read_item 表的记录 ID
     */
    @Column('int', { comment: 'bookId or issueId' })
    readItemId: number = 0

    @ManyToOne(() => User, user => user.bookShelfs, { onDelete: 'CASCADE' })
    user?: User

    /** 加入书架的时间 */
    @CreateDateColumn()
    createAt!: Date
}