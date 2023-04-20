import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogPost } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  constructor(comment: Partial<Comment>) {
    Object.assign(this, comment);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  author: User;

  @Column({ type: 'varchar', nullable: false })
  text: string;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.comments, {
    onDelete: 'CASCADE',
  })
  post: BlogPost;
}
