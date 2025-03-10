import express from 'express';
import { registerUser, loginUser, getMe, forgotPassword, resetPassword } from '../controller/userController.js';
import userAuth from '../middleware/userMiddleware.js';

const router = express.Router();

 router.post('/register', registerUser);
 router.post('/login', loginUser);
 router.get('/me', userAuth, getMe);
 router.post('/forgotpassword', forgotPassword);
 router.put('/resetpassword/:resettoken', resetPassword);

export default router;
