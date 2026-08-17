import type { RoleEnum } from '../../common/enums/RoleEnum.ts';
import { db } from '../../configuration/postgres.ts';

export class RoleRepository {
  static async userHasRole(
    userId: number,
    roleIds: RoleEnum[],
  ): Promise<boolean> {
    const result = await db.query<{ has_role: boolean }>(
      `SELECT EXISTS (
         SELECT 1
         FROM auth.user_roles ur
         WHERE ur.user_id = $1
           AND ur.role_id = ANY($2::int[])
       ) AS has_role;`,
      [userId, roleIds],
    );

    return result.rows[0].has_role;
  }

  static async setRoles(userId: number, roleIds: RoleEnum[]): Promise<void> {
    return db.transaction(async (client) => {
      await client.query(
        `DELETE FROM auth.user_roles
         WHERE user_id = $1 AND role_id != ALL($2::int[])`,
        [userId, roleIds],
      );

      if (roleIds.length === 0) return;

      await client.query(
        `INSERT INTO auth.user_roles (user_id, role_id)
         SELECT $1, role_id
         FROM unnest($2::int[]) AS role_id
         ON CONFLICT (user_id, role_id) DO NOTHING`,
        [userId, roleIds],
      );
    });
  }
}
