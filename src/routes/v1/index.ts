import { Router } from 'express';
import authRouter from '../../modules/auth/auth.routes.ts';
import usersRouter from '../../modules/users/user.routes.ts';

const router = Router();
router.use(authRouter);
router.use(usersRouter);

export default router;
