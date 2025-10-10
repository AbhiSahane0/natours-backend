const getRoot = (_req, res) => {
    res.status(200).json({ message: 'Hello from Server', app: 'Natorus' });
};
const postRoot = (_req, res) => {
    res.send('Post on this end point');
};
export { getRoot, postRoot };
//# sourceMappingURL=rootController.js.map