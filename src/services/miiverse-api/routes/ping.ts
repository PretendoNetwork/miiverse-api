import express from 'express';
import { getEndpoints } from '@/database';

const router = express.Router();

router.get('/', async function(req, res) {
    res.send('Pong!');
});

router.get('/database', async function(req, res) {
    let document = await getEndpoints();
    if(document)
        res.send('DB Connection Working! :D');
});

export default router;
