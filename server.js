import express from 'express';
import cors from 'cors';

import * as indexJs from './index.js';

import web_interface from './interface.js';

import connect from './dbconnect.js';

connect();

const app = express();

app.use(express.json());
app.use(cors());


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