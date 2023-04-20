import { MigrationInterface, QueryRunner } from 'typeorm';
import { BlogPost } from '../entities/post.entity';
import { User } from '../entities/user.entity';

export class SeedTablePost1681303958256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(BlogPost)
      .values({ text: 'Hello World', author: () => '1' })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(BlogPost)
      .where({ text: 'Hello World', author: '1' })
      .execute();
  }
}
