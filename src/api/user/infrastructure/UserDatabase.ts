import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';
import { openDb } from '../../../config/dbConfig';

export class UserDataBase implements UserRepository {
    
    async findByUsername(username: string): Promise<User | null> {
        const db = await openDb();
        const user = await db.get('SELECT * FROM user WHERE username = ?', [username]);
        return user || null;
    }

    async createUser(user: User): Promise<void> {
        const db = await openDb();
        await db.run('INSERT INTO user (id, username, password) VALUES (?, ?, ?)', [
            user.id,
            user.username,
            user.password
        ]);
    }
}