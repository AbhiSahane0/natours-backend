import express from 'express';
import { addUser, deleteUser, getMe, getUser, getUsers, updateUser, } from '../controller/usersController.js';
import { signUp, login, protectRoute, restrictPath, forgotPassword, resetPassword, updateUserPassword, } from '../controller/userAuthContoller.js';
const userRouter = express.Router();
userRouter.get('/me', protectRoute, getMe, getUser);
userRouter.post('/signUp', signUp);
userRouter.post('/login', login);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updatePassword', protectRoute, updateUserPassword);
userRouter.patch('/updateUser', protectRoute, updateUser);
userRouter.delete('/deleteMe', protectRoute, deleteUser);
userRouter.route('/').get(protectRoute, restrictPath, getUsers).post(addUser);
userRouter
    .route('/:id')
    .get(getUser)
    .delete(protectRoute, restrictPath, deleteUser);
export default userRouter;
//# sourceMappingURL=usersRouter.js.map