import { Router } from 'express';
import authRouter from '../../modules/auth/auth.routes.ts';
import usersRouter from '../../modules/users/user.routes.ts';

const router = Router();
router.use(usersRouter);
router.use(authRouter);

export default router;
