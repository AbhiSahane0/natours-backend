import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: 'config.env' });
import app from './app.js';
const DB = process.env.DATABASE?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
process.on('uncaughtException', (err) => {
    console.log(err.message, err.name);
    process.exit(1);
});
// For Local DB
// mongoose.connect(process.env.DATABASE_LOCAL!).then(() => {
//     console.log('Connected to MongoDB')
// })
// For cloud
mongoose.connect(DB).then(() => {
    console.log('Connected to MongoDB');
});
const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Listning on port : ${process.env.PORT || 5000}`);
});
process.on('unhandledRejection', (err) => {
    console.log(err.message, err.name);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=server.js.map