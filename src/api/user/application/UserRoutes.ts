import { Router } from 'express';
import { UserController } from './UserController';
import { UserDataBase } from '../infrastructure/UserDatabase';
import { UserService } from '../domain/UserService';

const router = Router();
const userRepository = new UserDataBase();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.get('/protected', (req, res) => userController.getUser(req, res));
router.post('/logout', (req, res) => userController.logout(req, res));

export default router;
