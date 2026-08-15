import { Router } from 'express';
import usersRouter from '../../modules/users/user.routes.ts';

const router = Router();
router.use(usersRouter);

export default router;
