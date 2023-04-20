import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class BlogPost {
  constructor(post: Partial<BlogPost>) {
    Object.assign(this, post);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @Column({ type: 'varchar', nullable: false })
  text: string;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
