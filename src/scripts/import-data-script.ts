import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Tour from '../modules/TourModule.js'

dotenv.config({ path: 'config.env' })

const DB = process.env.DATABASE?.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD!
)

mongoose.connect(DB!).then(() => {
    console.log('Connected to MongoDB')
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const filePath = path.join(__dirname, '../../data/tours-simple.json')
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

async function importData() {
    await Tour.create(data)
    console.log('Data Uploaded successfully !')
    process.exit()
}

async function deleteData() {
    await Tour.deleteMany()
    console.log('Data deleted successfully !')
    process.exit()
}

if (process.argv[2] === '--import') {
    await importData()
}

if (process.argv[2] === '--delete') {
    await deleteData()
}
