import express from 'express'
import { getRoot, postRoot } from '../controller/rootController.js'

const rootRouter = express.Router()

rootRouter.route('/').get(getRoot).post(postRoot)

export default rootRouter
