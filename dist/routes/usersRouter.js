import express from 'express';
import { addUser, deleteUser, getUser, getUsers, updateUser, } from '../controller/usersController.js';
import { signUp, login, protectRoute } from '../controller/userAuthContoller.js';
const userRouter = express.Router();
userRouter.route('/').get(protectRoute, getUsers).post(addUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
userRouter.post('/signUp', signUp);
userRouter.post('/login', login);
export default userRouter;
//# sourceMappingURL=usersRouter.js.map