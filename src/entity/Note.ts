import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User.js'

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('varchar', { comment: '笔记标题' })
    title!: string

    @Column('text', { comment: '笔记内容' })
    content!: string

    @ManyToOne(() => User, user => user.notes, { onDelete: 'CASCADE', nullable: false })
    user!: User

    @CreateDateColumn()
    createAt!: Date

    @UpdateDateColumn()
    updateAt!: Date
}