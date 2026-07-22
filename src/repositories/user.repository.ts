import { eq } from "drizzle-orm";
import { getDb } from "../infra/db/db.context.js";
import { NewUser, User, usersTable } from "../infra/db/schema.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: number): Promise<User | undefined>;
  create(data: NewUser): Promise<User>;
}

export class UserRepository implements IUserRepository {
  private get db() {
    return getDb();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return result[0];
  }

  async findById(id: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return result[0];
  }

  async create(data: NewUser): Promise<User> {
    const result = await this.db.insert(usersTable).values(data).returning();

    return result[0];
  }
}

export default UserRepository;
