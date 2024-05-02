
//new, validate, update match the req.body object to an object template
export function validate(obj, Required, model) {
    // validate the object, 
    // Required has strings with "1" in that are required, arrays are always optional
    // And make sure the type matches the model
    let newRequired = JSON.parse(JSON.stringify(Required));
    let keys = Object.keys(newRequired);
    let valid = true;
    try {
        keys.forEach(key => {
            if (newRequired[key] == "1") {
                if (obj[key] === undefined || obj[key] === "") {
                    console.log('Error:', key, 'is required');
                    console.log('Object:', obj);
                    console.log('Value', obj[key]);
                    valid = false;
                } 
            } else if (model[key] && typeof obj[key] !== model[key]) {
                console.log('Error:', key, 'is not the correct type');
                console.log('Object:', obj);
                console.log('Value', obj[key]);
                valid = false;
            }
        });
    } catch (e) {
        console.log('Error:', e);
        valid = false;
    }

    return valid;
}

export function newCopy(obj, Required) {
    //create a new object from the template
    let newRequired = JSON.parse(JSON.stringify(Required));
    let keys = Object.keys(newRequired);
    keys.forEach(key => {
        if (newRequired[key] = "0") {
            newRequired[key] = "";
        }
        newRequired[key] = obj[key];
    });

    return newRequired;
}


// post, update, get, delete helpers for crud operations
export function post(model, Required, pathRequired) {

    const type = 'post';
    const func = async (req, res) => {

        if (validate(req.body, Required, model)) {
            
            let obj = new model(newCopy(req.body, Required));

            await obj.save();

            //send the new arr endpoint
            let path = pathRequired + '/' + req.body[Object.keys(req.body)[0]];
            let status = 201;
            console.log('Sending 201: Created from post:', path);
            res.status(status).send(path);

        } else {
            console.log('Sending 400: Invalid data from post:', req.body);
            res.status(400).send(`Invalid data`);
        }
    }
    return { type, func };
}

export function put(model, Required) {
    //requires an id in the url
    const type = 'put';
    const func = async (req, res) => {

        let id = req.params.id;

        if (validate(req.body, Required, model)) {

            let obj = await model.findOne({ [Object.keys(Required)[0]]: id });

            if (obj) {
                let newobj = newCopy(req.body, Required);
                obj.set(newobj);
                await obj.save();

                console.log('Sending 200: OK from put id:', id);
                res.status(200).send();
            }
            else {
                console.log('Sending 400: Invalid id:', id);
                res.status(400).send('Invalid id');
            }

        } else {
            console.log('Sending 400: Invalid data: ', req.body);
            res.status(400).send(`Invalid data`);
        }
    }

    return { type, func };
}

export function paginate(req, arr) {
        const page = req.query.page || 1;
        const limit = req.query.limit || arr.length;
        const start = (page - 1) * limit;
        const end = page * limit;

        return arr.slice(start, end);
}


export function get(model) {
    //requires names arr items
    const type = 'get';
    const func = async (req, res) => {

        let arr = await model.find();
        
        if (arr) {        
            console.log('Sending 200: OK from get');
            res.status(200).send(paginate(req, arr));
        } else {
            console.log('Sending 400: Invalid data');
            res.status(400).send('Invalid data');
        }
    }

    return { type, func };
}

export function getID(model, key) {
    //requires an id in the url
    const type = 'get';
    const func = async (req, res) => {

        let id = req.params.id;

        let obj = await model.findOne({ [key]: id });

        if (obj) {
            console.log('Sending 200: OK from get id:', id);
            res.status(200).send(obj);
        } else {
            console.log('Sending 400: Invalid id:', id);
            res.status(400).send('Invalid id');
        }
        
    }

    return { type, func };
}

export function del(model, key) {
    //requires an id in the url
    const type = 'delete';
    const func = async (req, res) => {

        let id = req.params.id;

        let trydel = model.deleteOne({ [key]: id });

        if (trydel) {
            console.log('Sending 200: OK from delete id:', id);
            res.status(200).send();
        } else {
            console.log('Sending 400: Invalid id:', id);
            res.status(400).send('Invalid id');
        }
    }

    return { type, func };
}

