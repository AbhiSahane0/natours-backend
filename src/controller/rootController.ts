import { Request, Response } from 'express'

const getRoot = (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello from Server', app: 'Natorus' })
}

const postRoot = (_req: Request, res: Response) => {
    res.send('Post on this end point')
}

export { getRoot, postRoot }
