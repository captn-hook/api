import { Biz, Review, Photo, User } from './schema.js';

let data = [Biz, Review, Photo, User];
let objNames = ['biz', 'review', 'photo', 'user'];

async function display(d, objName) {
    let html = `<div class="type"><h2>${objName}</h2>`
    
    html += `<table>`;
    
    let arr = await d.find();

    for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        html += `<tr><td>${obj}</td></tr>`;
    }

    html += `</table>`;

    html += `</div>`;

    return html;
}    

export default function(app) {
    //index page for viewing database
    app.get('/', async (req, res) => {
        //buttons for each endpoint
        let html = '<html><head><title>API</title><link rel="stylesheet" href="style.css"></head><body>';
        
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            let objName = objNames[i];

            html += await display(d, objName);
        }
        html += '</body></html>';
        
        console.log('Sending 200: OK from interface');
        res.send(html);
    });
}