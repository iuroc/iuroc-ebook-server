import { Book, Issue } from 'gede-book-entity'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User.js'
import { BookAndIssueMixed } from './ReadHistory.js'

/** 书签 */
@Entity()
export class BookMark {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('varchar', { comment: '书签标题' })
    title: string = ''

    @Column('int', { comment: '书签所在页码' })
    bookPage: number = 0

    @Column('int', { comment: 'bookId or issueId' })
    itemId!: number

    @Column('varchar')
    type!: BookAndIssueMixed['type']

    @ManyToOne(() => User, user => user.bookMarks, { onDelete: 'CASCADE', nullable: false })
    user!: User

    @UpdateDateColumn()
    updateAt!: Date

    @CreateDateColumn()
    createAt!: Date
}