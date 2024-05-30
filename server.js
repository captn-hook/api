import express from 'express';
import cors from 'cors';
import multer from 'multer';

import * as indexJs from './index.js';

import web_interface from './interface.js';

import connect from './mongo-init/dbconnect.js'

connect();

const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });

//port from package.json
const port = process.env.PORT || 8000;

let openEndpoints = {
    post: [],
    get: [],
    put: [],
    delete: []
}

for (let exportedFunc in indexJs) {

    let d = indexJs[exportedFunc];
    let { TYPE: type, PATH: path, FUNCTION: func } = d();

    switch (type) {
        case 'get':
            app.get(path, await func);
            openEndpoints.get.push(path);
            break;
        case 'post':
            app.post(path, await func);
            openEndpoints.post.push(path);
            break;
        case 'put':
            app.put(path, await func);
            openEndpoints.put.push(path);
            break;
        case 'delete':
            app.delete(path, await func);
            openEndpoints.delete.push(path);
            break;
        case 'file':
            app.post(upload.single('file'), await func);
            openEndpoints.post.push(path);
        default:
            console.log('Invalid route type:', type);
            break;
    }
}
console.log('openEndpoints:', openEndpoints);

app.use(express.static('public'));

web_interface(app);

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port http://localhost:${port}`);
} );