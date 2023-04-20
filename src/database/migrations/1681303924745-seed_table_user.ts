import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/user.entity';

export class SeedTableUser1681303924745 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          nickname: 'Oleh',
          password: 'password',
          token: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
        {
          nickname: 'Ivan32',
          password: 'password',
          token: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQsswc',
        },
        {
          nickname: 'Dmytro3',
          password: 'password',
          token: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adssw5c',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(User)
      .where({ nickname: 'Oleh' })
      .orWhere({ nickname: 'Dmytro3' })
      .orWhere({ nickname: 'Ivan32' })
      .delete();
  }
}
