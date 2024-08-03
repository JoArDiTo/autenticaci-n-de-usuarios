import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { CORS_PORT } from '../common/constant';
import { openDb } from './dbConfig';
import userRoutes from '../api/user/application/UserRoutes';
import { jwtMiddleware, refreshTokenMiddelware } from '../common/middelware';

const app = express();

//Depedencias
app.use(express.json());
app.use(cookieParser());

//Permisos CORS
app.use(cors({
    origin: `http://localhost:${CORS_PORT}`,
    credentials: true,
}));

//middelwares
app.use(jwtMiddleware);
app.use(refreshTokenMiddelware);

//Creacion de la tabla user
openDb().then(db => {
    db.exec('CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, username TEXT, password TEXT);');
})

//Ruta principal
app.get('/', (req, res) => {
    res.send('<h1>Hola tilin!</h1>');
})

//rutas
app.use('/api/users', userRoutes);

export default app;