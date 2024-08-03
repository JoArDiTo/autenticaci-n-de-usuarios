import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constant';

export const jwtMiddleware = (req:any, res:any, next:any) => {
    const token = req.cookies.access_token;
    req.session = { user: null };
    
    try {
        const data = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.session.user = data;
    } catch {}

    next();
}

export const refreshTokenMiddelware = (req:any, res:any, next:any) => {
    const access_token = req.cookies.access_token;
    const refresh_token = req.cookies.refresh_token;

    if (!access_token || !refresh_token) return next()

    try {
        const decoded:any = jwt.verify(access_token, ACCESS_TOKEN_SECRET);
        const exp = decoded.exp * 1000;
        const now = Date.now();

        if (exp - now < 30000) {
            const data:any = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);

            const newAccessToken = jwt.sign(
                {   
                    id: data.id,
                    username: data.username
                }, ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            });
            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60
            });
        }
    } catch {}

    next();
}