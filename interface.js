// Defaults for testing
const bizD = {
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
const reviewD = {
    bizId: "1",
    uId: "1",
    stars: 4,
    cost: 3,
    text: "great food, great service, great prices!", 
};
const photoD = {
    pId: "fe1a5a",
    bizId: "1",
    uId: "1",
    caption: "yum!",
    imageUrl: "www.dabombburritos.com/yum.jpg",
};
const userD = {
    uId: "1",
    ownedBizes: ['1'], // list of bizIds
    uploadedPhotos: ['fe1a5a'], // list of pids
    writtenReviews: ['1'], // list of reviewIds
};

let objects = [bizD, reviewD, photoD, userD];
let objNames = ['biz', 'review', 'photo', 'user'];

export default function(app) {
    //index page for submitting requests
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

    //database page for viewing database        
    app.get('/db', (req, res) => {
        let html = '<html><head><title>Database</title><link rel="stylesheet" href="style.css"></head><body>';

        html += '<h1>THIS IS WHERE I WOULD PUT MY DATABASE</h1>';
        html += '<img src="https://media.tenor.com/N2hV1al2rjcAAAAe/if-i-had-one-angry.png" alt="if i had one">';
        html += '</body></html>';
        res.send(html);
    } );
}