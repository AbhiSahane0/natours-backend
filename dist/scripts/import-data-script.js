import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tour from '../modules/TourModule.js';
import Review from '../modules/reviewModule.js';
import User from '../modules/UsersModule.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../config.env') });
const DB = process.env.DATABASE?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => {
    console.log('Connected to MongoDB');
});
const TourFilePath = path.join(__dirname, '../../data/tours.json');
const TourData = JSON.parse(fs.readFileSync(TourFilePath, 'utf-8'));
const ReviewFilePath = path.join(__dirname, '../../data/reviews.json');
const ReviewData = JSON.parse(fs.readFileSync(ReviewFilePath, 'utf-8'));
const UsersFilePath = path.join(__dirname, '../../data/users.json');
const UsersData = JSON.parse(fs.readFileSync(UsersFilePath, 'utf-8'));
async function importData() {
    await Tour.create(TourData);
    await User.create(UsersData, { validateBeforeSave: false });
    await Review.create(ReviewData);
    console.log('Data Uploaded successfully !');
    process.exit();
}
async function deleteData() {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data deleted successfully !');
    process.exit();
}
if (process.argv[2] === '--import') {
    await importData();
}
if (process.argv[2] === '--delete') {
    await deleteData();
}
//Command to run script
// npx ts-node-esm import-data-script.ts --delete or --import
//# sourceMappingURL=import-data-script.js.map