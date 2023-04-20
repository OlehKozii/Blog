import { MigrationInterface, QueryRunner } from 'typeorm';
import { Comment } from '../entities/comment.entity';

export class SeedTableComment1681311216433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values({ text: 'You are right', post: () => '1', author: () => '1' })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Comment)
      .where({ text: 'You are right', post: '1', author: '1' })
      .execute();
  }
}
