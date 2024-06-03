import jwt from 'jsonwebtoken';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { User } from './data/schema.js';
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
                    console.log('Missing required:', key);
                    valid = false;
                }
            } else if (model[key] && typeof obj[key] !== model[key]) {
                console.log('Type mismatch:', key, obj[key], model[key]);
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
export function post(model, Required, pathRequired, parameterid = null) {

    const type = 'post';
    const func = async (req, res) => {

        if (validate(req.body, Required, model)) {

            //posts should always have an authorized user
            const user = await checkAuth(req.headers.authorization);
            if (!user) {
                return res.status(403).send('Forbidden');
            } else if (user.admin) {
                //whatever man
            } else if (user.uId !== req.body.uId) {
                return res.status(403).send('Forbidden');
            } else if (parameterid && req.body[parameterid] != req.params.id) {
                return res.status(403).send('Forbidden');
            }

            let obj = new model(newCopy(req.body, Required));

            await obj.save();

            //send the new arr endpoint
            let path = pathRequired + '/' + req.body[Object.keys(req.body)[0]];
            let status = 201;
            res.status(status).send(req.get('host') + path.replace(':id', req.params.id));

        } else {
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

            //put should always authorize the uIds match
            const user = checkAuth(req.headers.authorization);
            if (!user) {
                res.status(403).send('Forbidden');
            } else if (user.admin) {
            } else if (obj && user.uId !== obj.uId) {
                obj.uId = user.uId;
            }

            if (obj) {
                let newobj = newCopy(req.body, Required);
                obj.set(newobj);
                await obj.save();

                res.status(200).send(req.get('host') + req.originalUrl);
            }
            else {
                res.status(400).send('Invalid id');
            }

        } else {
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
            res.status(200).send(paginate(req, arr));
        } else {
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
            res.status(200).send(obj);
        } else {
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
            res.status(200).send();
        } else {
            res.status(400).send('Invalid id');
        }
    }

    return { type, func };
}

export async function checkAuth(authorization) {
    if (!authorization) {
        console.log('no authorization');
        return null;
    }
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        //find user by id
        const user = await User.findById(decoded._id).exec();
        return user;
    }
    catch (e) {
        console.log('Error:', e);
        return null;
    }
}

export async function authorize(reqAuth, uId = null, admin = false) {
    try {

        const user = await checkAuth(reqAuth);
        if (!user || user === null) {
            return false;
        } else if (user.admin) {
            return true;
        } else if (uId && user.uId !== uId) {
            console.log('Not authorized');
            return false;
        } else if (admin && !req.user.admin) {
            console.log('Not an admin');
            return false;
        } else {
            return true;
        }
    } catch (e) {
        console.log('Authorization error:', e);
    }
}

export async function deletefrombucket(bucket, filename) {
   
    //fail silently if url cant be found
    let f = await bucket.delete(filename).catch((err) => {
        console.log('Error:', err);
    });

    return f;
}

export async function uploadtobucket(bucket, filename) {
    let f = await fs.createReadStream('./uploads/' + filename).
        pipe(bucket.openUploadStream(filename)).
        on('finish', () => {
            fs.unlink('./uploads/' + filename, (err) => {
                if (err) {
                    console.log('Error:', err);
                }
            });
        })
        .on('error', (err) => {
            console.log('Error:', err);
        });

    return f.filename;
}

export async function copytobucket(bucket, url) {
    //copys a file at a remote url to the bucket, also saves my one specific test file locally to not redownload it 1000 times
    let file = url.split('/').pop();
    //download the file
    if (file === '07CAT-STRIPES-mediumSquareAt3X-v2.jpg' && fs.existsSync('./uploads/' + file)) {
        console.log('File already exists');
        return file.split('.')[0];
    }

    let f = fs.createWriteStream('./uploads/' + file)
        .on('finish', () => {
            console.log('Downloaded a image');
        })
        .on('error', (err) => {
            console.log('Error:', err);
        });

    let protocol = url.startsWith('https') ? https : http;

    // request in a Promise
    await new Promise((resolve, reject) => {
        protocol.get(url, (response) => {
            response.pipe(f);
            response.on('end', resolve);
            response.on('error', reject);
        });
    });

    //upload the file
    let g = fs.createReadStream('./uploads/' + file)
        .pipe(bucket.openUploadStream(file.split('.')[0]))
        .on('finish', () => {
            console.log('Uploaded a image:', g.filename);
            if (file !== '07CAT-STRIPES-mediumSquareAt3X-v2.jpg') {
                fs.unlink('./uploads/' + file, (err) => {
                    if (err) {
                        console.log('Error:', err);
                    }
                });
            }
        })
        .on('error', (err) => {
            console.log('Error:', err);
        });

    return g.filename.split('.')[0];
}

export async function getNewId(model) {
    let newId = Math.floor(Math.random() * 1000000000); //lol
    let obj = await model.findOne({ [Object.keys(model.schema.paths)[0]]: newId });
    if (obj) {
        return getNewId(model);
    } else {
        return newId;
    }
}

export async function getNextId(model) {
    let arr = await model.find();
    let ids = arr.map(obj => obj[Object.keys(model.schema.paths)[0]]);
    let max = Math.max(...ids);
    return max + 1;
}