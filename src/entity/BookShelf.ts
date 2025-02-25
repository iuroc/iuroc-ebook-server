import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'
import { User } from './User.js'
import { BookAndIssueMixed } from './ReadHistory.js'

/** 书架 */
@Entity({ comment: '书架' })
@Unique(['userId', 'itemId', 'type'])
export class BookShelf implements BookAndIssueMixed {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('int', { comment: 'bookId or issueId' })
    itemId!: number

    @Column('varchar')
    type!: 'book' | 'issue'

    @Column('int')
    userId!: number

    @ManyToOne(() => User, user => user.bookShelfs, { onDelete: 'CASCADE', nullable: false })
    user?: User

    /** 加入书架的时间 */
    @CreateDateColumn()
    createAt!: Date
}