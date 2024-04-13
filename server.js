import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
const port = 8000;

import * as indexJs from './index.js';
// this feels wrong... but just imagine it as a router object
let openEndpoints = {
    post: [],
    get: [],
    put: [],
    delete: []
}
for (let exportedFunc in indexJs) {

    let d = indexJs[exportedFunc];
    let { TYPE: type, PATH: path, FUNCTION: func } = d();

    //switch types get, post, put, delete
    switch (type) {
        case 'get':
            app.get(path, func);
            openEndpoints.get.push(path);
            break;
        case 'post':
            app.post(path, func);
            openEndpoints.post.push(path);
            break;
        case 'put':
            app.put(path, func);
            openEndpoints.put.push(path);
            break;
        case 'delete':
            app.delete(path, func);
            openEndpoints.delete.push(path);
            break;
        default:
            console.log('Invalid route type:', type);
            break;
    }
}
console.log('openEndpoints:', openEndpoints);

const biz = {
    bizId: "1",
    name: "da bomb burritos",
    address: "123 main st.",
    city: "fraggle rock",
    state: "CA",
    zip: "12345",
    phone: "123-456-7890",
    category: "food",
    subcategories: [],
    website: "www.dabombburritos.com",
    email: "",
};
const review = {
    bizId: "1",
    uId: "1",
    stars: 4,
    cost: 3,
    text: "great food, great service, great prices!", 
};
const photo = {
    pid: "fe1a5a",
    bizId: "1",
    userId: "1",
    caption: "yum!",
    imageUrl: "www.dabombburritos.com/yum.jpg",
};
const user = {
    uid: "1",
    ownedBizes: ['1'], // list of bizIds
    uploadedPhotos: ['fe1a5a'], // list of pids
    writtenReviews: ['1'], // list of reviewIds
};

let objects = [biz, review, photo, user];
let objNames = ['biz', 'review', 'photo', 'user'];

app.get('/', (req, res) => {
    //buttons for each endpoint
    let html = '<html><head><title>API</title><link rel="stylesheet" href="style.css"></head><body>';
    for (let type in openEndpoints) {
        html += `<div class="type"><h2>${type}</h2>`;
        if (type === 'get') {
            let arr = openEndpoints[type];
            for (let i in arr) {
                html += `<a href="${arr[i]}">${arr[i]}</a><br>`;
            }
        } else if (type === 'post') {
            
            //for each object, create a post button
            for (let i in objects) {
                html += `<h1>${objNames[i]}</h1>`;
                let obj = objects[i];
                html += `<form action="${openEndpoints[type][0]}" method="post">`;
                for (let key in obj) {
                    html += `<label for="${key}">${key}</label>`;
                    html += `<input type="text" id="${key}" name="${key}" value="${obj[key]}"><br>`;
                }
                html += '<input type="submit" value="Submit"></form>';
            }

        } else if (type === 'put') {
            //for each object, create a put button
            for (let i in objects) {
                html += `<h1>${objNames[i]}</h1>`;
                let obj = objects[i];
                html += `<form action="${openEndpoints[type][0]}" method="put">`;
                for (let key in obj) {
                    html += `<label for="${key}">${key}</label>`;
                    html += `<input type="text" id="${key}" name="${key}" value="${obj[key]}"><br>`;
                }
                html += '<input type="submit" value="Submit"></form>';
            }
        } else if (type === 'delete') {
            //for each object, create a delete button
            for (let i in objects) {
                html += `<h1>${objNames[i]}</h1>`;
                let obj = objects[i];
                html += `<form action="${openEndpoints[type][0]}" method="delete">`;
                for (let key in obj) {
                    html += `<label for="${key}">${key}</label>`;
                    html += `<input type="text" id="${key}" name="${key}" value="${obj[key]}"><br>`;
                }
                html += '<input type="submit" value="Submit"></form>';
            }
        }
        html += '<br></div>';
    }
    html += '</body></html>';
    res.send(html);
} );

app.use(express.static('public'));

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port http://localhost:${port}`);
} );