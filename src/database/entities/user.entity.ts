import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogPost } from './post.entity';
import { Comment } from './comment.entity';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  @IsNumber()
  @IsOptional()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string;

  @IsString()
  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @IsOptional()
  @IsString()
  @Exclude()
  @Column({ type: 'varchar', nullable: true, unique: true })
  token: string;

  @Exclude()
  @OneToMany(() => BlogPost, (blogPost) => blogPost.author)
  posts: BlogPost[];

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
