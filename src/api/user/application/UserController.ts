import { Request, Response } from 'express';
import { UserService } from '../domain/UserService';

export class UserController {
    constructor(private service: UserService) {}

    async register(req: any, res: Response) {
        const { username, password } = req.body;

        try{
            const id = await this.service.register(username, password);
            res.status(201).send({id: id});
        } catch (error: any) {
            res.status(400).send({error:error.message});
        }
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const {access_token, refresh_token} = await this.service.authenticate(username, password);

            res.cookie('access_token', access_token,
                { 
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60
                })
                .cookie('refresh_token', refresh_token,
                { 
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 * 24 * 7
                })
                .status(200)
                .send({ access_token: access_token, refresh_token: refresh_token });
        } catch (error: any) {
            res.status(400).send({error:error.message});
        }
    }

    async getUser(req: any, res: Response) {
        const { user } = req.session;

        if (!user) return res.status(401).send({error:'Access not authorized'});

        res.status(200).send(user);
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('access_token').clearCookie('refresh_token').send({ message:'Logged out' });
    }
}