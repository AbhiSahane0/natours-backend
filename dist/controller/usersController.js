import User from '../modules/UsersModule.js';
import { catchAsync } from '../utils/catchAsync.js';
const getUsers = catchAsync(async (req, res) => {
    const users = await User.find();
    res.status(200).send({
        status: 'success',
        users,
    });
});
const addUser = (req, res) => {
    res.status(200).send('user added');
};
const getUser = (req, res) => {
    res.status(200).send('User');
};
const updateUser = (req, res) => {
    res.status(200).send('User Updated');
};
const deleteUser = (req, res) => {
    res.status(200).send('User deleted');
};
export { getUsers, addUser, getUser, updateUser, deleteUser };
//# sourceMappingURL=usersController.js.map