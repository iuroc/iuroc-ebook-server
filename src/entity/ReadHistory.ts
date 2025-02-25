import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'
import { User } from './User.js'

@Entity({ comment: '阅读历史' })
@Unique(['userId', 'itemId', 'type'])
export class ReadHistory implements BookAndIssueMixed {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('int', { comment: 'bookId or issueId' })
    itemId!: number

    @Column('varchar')
    type!: 'book' | 'issue'

    @Column('int', { comment: '当前阅读到的页码' })
    currentBookPage!: number

    @CreateDateColumn()
    createAt!: Date

    @Column('int')
    userId!: number

    @ManyToOne(() => User, user => user.readHistorys, { onDelete: 'CASCADE', nullable: false })
    user?: User

    /** 更新时间，可以作为最近阅读时间 */
    @UpdateDateColumn()
    updateAt!: Date
}

export interface BookAndIssueMixed {
    type: 'book' | 'issue'
    itemId: number
}