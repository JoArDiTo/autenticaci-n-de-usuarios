import { User } from './User';

export interface UserRepository {
    createUser(user: User): Promise<void>;
    findByUsername(username: string): Promise<User | null>;
}
