import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SALTING_ROUNDS } from '../../../common/constant';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class UserService {
    constructor(private repository: UserRepository) {}

    async register(username: string, password: string) {
        if (typeof username !== 'string') throw new Error('Invalid username');
        if (typeof password !== 'string') throw new Error('Invalid password');

        const user = await this.repository.findByUsername(username);
        if (user) throw new Error('User already exists');

        if (username.length < 4) throw new Error('Username too short');
        if (password.length < 4) throw new Error('Password too short');

        const id = crypto.randomUUID();
        const pwd = await bcrypt.hash(password, SALTING_ROUNDS);
        const newUser: User = { id, username, password: pwd };
        
        await this.repository.createUser(newUser);
        
        return id;
    }

    async authenticate(username: string, password: string) {
        const user = await this.repository.findByUsername(username);

        if (!user) throw new Error('User not found');
        if (!await bcrypt.compare(password, user.password)) throw new Error('Invalid password');

        const access_token = jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        
        const refresh_token = jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        return {access_token, refresh_token};
    }
}