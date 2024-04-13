
//new, validate, update match the req.body object to an object template
export function validate(obj, OG) {
    // loosely validate the object, strings with "1" in the og are required, arrays are optional
    // just make sure there is a value if required
    let newOG = JSON.parse(JSON.stringify(OG));
    let keys = Object.keys(newOG);
    let valid = true;
    try {
        keys.forEach(key => {
            console.log(key, newOG[key]);
            console.log(obj);
            console.log(obj[key]);
            if (newOG[key] === "1") {
                if (!obj[key]) {
                    valid = false;
                }
            }
        });
    } catch (e) {
        console.log('Error:', e);
        valid = false;
    }

    return valid;
}

export function update(obj, newObj) {
    //update the object with the new object
    let keys = Object.keys(newObj);
    keys.forEach(key => {
        obj[key] = newObj[key];
    });

    return obj;
}

export function newCopy(obj, OG) {
    //create a new object from the template
    let newOG = JSON.parse(JSON.stringify(OG));
    let keys = Object.keys(newOG);
    keys.forEach(key => {
        if (newOG[key] = "0") {
            newOG[key] = "";
        }
        newOG[key] = obj[key];
    });

    return newOG;
}


// post, update, get, delete helpers for crud operations
export function post(arr, OG, pathOG) {

    const type = 'post';
    const func = (req, res) => {

        console.log('POST:', req);
        console.log('POST:', req.body);

        if (validate(req.body, OG)) {
            arr.push(newCopy(req.body, OG));

            //send the new arr endpoint
            let path = pathOG + '/' + (arr.length - 1);
            let status = 201;
            console.log('Sending 201: Created from post');
            res.status(status).send(path);

        } else {
            console.log('Sending 400: Invalid data');
            res.status(400).send(`Invalid data`);
        }
    }
    return { type, func };
}

export function put(arr, OG) {
    //requires an id in the url
    const type = 'put';
    const func = (req, res) => {

        let id = req.params.id;

        if (id < arr.length && utils.validate(req.body, OG)) {

            arr[id] = utils.update(arr[id], req.body);
            console.log('Sending 200: OK from put');
            res.status(200).send();

        } else {
            console.log('Sending 400: Invalid data');
            res.status(400).send(`Invalid data`);
        }
    }

    return { type, func };
}

export function get(arr) {
    //requires names arr items
    const type = 'get';
    const func = (req, res) => {

        res.status(200).send(arr);
    }

    return { type, func };
}

export function getID(arr) {
    //requires an id in the url
    const type = 'get';
    const func = (req, res) => {

        let id = req.params.id;

        if (id < arr.length) {
            console.log('Sending 200: OK from getID');
            res.status(200).send(arr[id]);
        } else {
            console.log('Sending 400: Invalid id');
            res.status(400).send('Invalid id');
        }
    }

    return { type, func };
}

export function del(arr) {
    //requires an id in the url
    const type = 'delete';
    const func = (req, res) => {

        let id = req.params.id;

        if (id < arr.length) {
            arr.splice(id, 1);
            console.log('Sending 200: OK from del');
            res.status(200).send();
        } else {
            console.log('Sending 400: Invalid id');
            res.status(400).send('Invalid id');
        }
    }

    return { type, func };
}

