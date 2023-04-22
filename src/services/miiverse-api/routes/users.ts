import express from 'express';
import xml from 'object-to-xml';

const router = express.Router();

router.get('/:pid/notifications', async function(req, res) {
    let type = req.query.type, title_id = req.query.title_id;
    console.log(type);
    console.log(title_id);
    console.log(req.params.pid);

    res.set("Content-Type", "application/xml");
    let response = {
        result: {
            has_error: 0,
            version: 1,
            posts: " "
        }
    };
    return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
});

export default router;
