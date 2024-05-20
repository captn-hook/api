import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import upload from './server.js';

import { Biz, Review, Photo, User } from './schema.js';

import * as utils from './utils.js';

// businesses
const biz = {
    bizId: "1",
    name: "1",
    address: "1",
    city: "1",
    state: "1",
    zip: "1",
    phone: "1",
    category: "1",
    subcategories: [],
    website: "0",
    email: "0",
};

// Function Signature
// TYPE, PATH, API FUNCTION
// GET /businesses listbizes
//types: get, post, put, delete

// add a new business
// POST /business
export function addBusiness() {
    const PATH = '/businesses';

    let { type: TYPE, func: FUNCTION } = utils.post(Biz, biz, PATH);

    return { TYPE, PATH, FUNCTION };
}

export function addBusinessAlt() {
    const PATH = '/businesses';

    let { type: TYPE, func: FUNCTION } = utils.post(Biz, biz, PATH);

    return { TYPE, PATH, FUNCTION };
}

// update an existing business
// POST /businesses/:id
export function updatebiz() {
    const PATH = '/businesses/:id';

    let { type: TYPE, func: FUNCTION } = utils.put(Biz, biz);

    return { TYPE, PATH, FUNCTION };
}

// remove a business
// DELETE /businesses/:id
export function removebiz() {
    const PATH = '/businesses/:id';

    let { type: TYPE, func: FUNCTION } = utils.del(Biz, Object.keys(biz)[0]);

    return { TYPE, PATH, FUNCTION };
}

// get a list of all businesses
// GET /businesses
export function listbizes() {
    const PATH = '/businesses';

    let { type: TYPE, func: FUNCTION } = utils.get(Biz);

    return { TYPE, PATH, FUNCTION };
}

// get detailed information about a business
// GET /businesses/:id
export function bizdetails() {
    const PATH = '/businesses/:id';

    let { type: TYPE, func: FUNCTION } = utils.getID(Biz, Object.keys(biz)[0]);

    return { TYPE, PATH, FUNCTION };
}

// reviews
const review = {
    rId: "1",
    bizId: "1",
    uId: "1",
    stars: 0,
    cost: 0,
    text: "0",
};

// write a review for a business
// POST /businesses/:id/reviews
export function addreview() {
    const PATH = '/businesses/:id/reviews';

    let { type: TYPE, func: FUNCTION } = utils.post(Review, review, PATH, parameterid = 'bizId');

    return { TYPE, PATH, FUNCTION };

}

// modify a review
// POST /reviews/:id
export function updatereview() {
    const PATH = '/reviews/:id';

    let { type: TYPE, func: FUNCTION } = utils.put(Review, review, PATH);

    return { TYPE, PATH, FUNCTION };
}

// delete a review
// DELETE /reviews/:id
export function deletereview() {
    const PATH = '/reviews/:id';

    let { type: TYPE, func: FUNCTION } = utils.del(Review, Object.keys(review)[0]);

    return { TYPE, PATH, FUNCTION };

}

// get a review
// GET /reviews/:id
export function getreview() {
    const PATH = '/reviews/:id';

    let { type: TYPE, func: FUNCTION } = utils.getID(Review, Object.keys(review)[0]);

    return { TYPE, PATH, FUNCTION };
}

// get all reviews for testing
export function listreviews() {
    const PATH = '/reviews';

    let { type: TYPE, func: FUNCTION } = utils.get(Review);

    return { TYPE, PATH, FUNCTION };
}

// list all reviews by a user
// GET /users/:id/reviews
export function listuserreviews() {
    const PATH = '/users/:id/reviews';
    const TYPE = 'get';

    let FUNCTION = async (req, res) => {
        if (!utils.authorize(req.params.id)) { return res.status(403).send('Forbidden'); }

        let reviews = await Review.find({ uId: req.params.id });

        if (reviews) {
            res.status(200).send(utils.paginate(req, reviews));
        } else {
            res.status(400).send('Invalid user id');
        }
    }

    return { TYPE, PATH, FUNCTION };

}

// get business reviews
// GET /businesses/:id/reviews
export function bizreviews() {
    const PATH = '/businesses/:id/reviews';
    const TYPE = 'get';

    let FUNCTION = async (req, res) => {
        let reviews = await Review.find({ bizId: req.params.id });

        if (reviews) {
            res.status(200).send(utils.paginate(req, reviews));
        } else {
            res.status(400).send('Invalid business id');
        }
    }

    return { TYPE, PATH, FUNCTION };

}

// photos
const photo = {
    pId: "1",
    bizId: "1",
    uId: "1",
    caption: "0",
    imageUrl: "1",
};

// upload a photo for a business
// POST /businesses/:id/photos
export function uploadphoto() {
    const PATH = '/businesses/:id/photos';

    let { type: TYPE, func: FUNCTION } = utils.post(Photo, photo, PATH, parameterid = 'bizId');

    return { TYPE, PATH, FUNCTION };
}

// remove a photo
// DELETE /photos/:id
export function removephoto() {
    const PATH = '/photos/:id';

    let { type: TYPE, func: FUNCTION } = utils.del(Photo, Object.keys(photo)[0]);

    return { TYPE, PATH, FUNCTION };
}

// modify the caption of a photo
// POST /photos/:id
export function updatephotocaption() {
    const PATH = '/photos/:id';

    let { type: TYPE, func: FUNCTION } = utils.put(Photo, photo, PATH);

    return { TYPE, PATH, FUNCTION };
}

// get a photo
// GET /photos/:id
export function getphoto() {
    const PATH = '/photos/:id';

    let { type: TYPE, func: FUNCTION } = utils.getID(Photo, Object.keys(photo)[0]);

    return { TYPE, PATH, FUNCTION };
}

// get all photos for testing
export function listphotos() {
    const PATH = '/photos';

    let { type: TYPE, func: FUNCTION } = utils.get(Photo);

    return { TYPE, PATH, FUNCTION };
}

// users
const user = {
    uId: "1",
    ownedBizes: [],
    uploadedPhotos: [],
    writtenReviews: [], // list reviews by bizId
};

let users = [];

// add a new user
// POST /users
export function adduser() {
    const PATH = '/users';
    const TYPE = 'post';
    const FUNCTION = async (req, res) => {

        if (utils.validate(req.body, user, User)) {

            let obj = new User(req.body);

            // hash and salt the password
            const salt = await bcrypt.genSalt(10);
            if (!req.body.password) { return res.status(400).send('Invalid data'); }
            obj.password_hash = await bcrypt.hash(req.body.password, salt);

            //safety check for adding new admins
            if (obj.admin) {
                const user = checkAuth(req.headers.authorization);
                if (!user.admin) {
                    console.log('Sending 403: Forbidden from post:', req.body);
                    return res.status(403).send('Forbidden');
                }
            }

            await obj.save();

            //send the new arr endpoint
            let path = PATH + '/' + req.body[Object.keys(req.body)[0]];
            let status = 201;
            console.log('Sending 201: Created from post:', path);
            res.status(status).send(path);

        } else {
            console.log('Sending 400: Invalid data from post:', req.body);
            res.status(400).send(`Invalid data`);
        }
    }
    return { TYPE, PATH, FUNCTION };
}

// POST /users/login
export function login() {
    const PATH = '/users/login';
    const TYPE = 'post';
    const FUNCTION = async (req, res) => {
        let user = await User.findOne({ email: req.body.email });
        if (!user) { return res.status(401).send('Invalid'); }

        try {
            //crypt compare
            console.log('Trying to login:', req.body.email, req.body.password, user.password_hash);
            const validPass = await bcrypt.compare(req.body.password, user.password_hash);
            if (!validPass) { return res.status(401).send('Invalid'); }

            //create and assign a token, using the mongoose id not uId
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
            res.header('auth-token', token).send(token);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    }
    return { TYPE, PATH, FUNCTION };
}

// update a user
// POST /users/:id
export function updateuser() {
    const PATH = '/users/:id';

    let { type: TYPE, func: FUNCTION } = utils.put(User, user);

    return { TYPE, PATH, FUNCTION };
}

// remove a user
// DELETE /users/:id
export function removeuser() {
    const PATH = '/users/:id';

    let { type: TYPE, func: FUNCTION } = utils.del(User, Object.keys(user)[0]);

    return { TYPE, PATH, FUNCTION };
}

// get a user
// GET /users/:id
export function getuser() {
    const PATH = '/users/:id';
    const TYPE = 'get';
    const FUNCTION = async (req, res) => {
        if (!utils.authorize(req.params.id)) { return res.status(403).send('Forbidden'); }

        const user = await User.findOne({ uId: req.params.id });
        if (!user) { return res.status(400).send('Invalid user id'); }

        //rm password
        const { password, ...userWithoutPassword } = user._doc;
        const { password_hash, ...userWithoutPasswordHash } = userWithoutPassword;

        res.status(200).send(userWithoutPasswordHash);
    }
    return { TYPE, PATH, FUNCTION };
}

// list all businesses owned by a user
// GET /users/:id/businesses
export function listuserbizes() {
    const PATH = '/users/:id/businesses';
    const TYPE = 'get';

    let FUNCTION = async (req, res) => {
        if (!utils.authorize(req.params.id)) { return res.status(403).send('Forbidden'); }

        let id = req.params.id;

        let userBizes = await Biz.find({ bizId: { $in: users.filter(user => user.uId === id)[0].ownedBizes } });

        if (userBizes) {
            res.status(200).send(utils.paginate(req, userBizes));
        } else {
            res.status(400).send('Invalid user id');
        }

    }

    return { TYPE, PATH, FUNCTION };
}

// list all photos uploaded by a user
// GET /users/:id/photos
export function listuserphotos() {
    const PATH = '/users/:id/photos';
    const TYPE = 'get';

    let FUNCTION = async (req, res) => {
        if (!utils.authorize(req.params.id)) { return res.status(403).send('Forbidden'); }

        let id = req.params.id;

        let userPhotos = await Photo.find({ pId: { $in: users.filter(user => user.uId === id)[0].uploadedPhotos } });

        if (userPhotos) {
            res.status(200).send(utils.paginate(req, userPhotos));
        } else {
            res.status(400).send('Invalid user id');
        }

    }

    return { TYPE, PATH, FUNCTION };
}
// add a business to a user's list of owned businesses
// POST /users/:id/businesses
export function addbiztouser() {
    const PATH = '/users/:id/businesses';
    const TYPE = 'post';

    let FUNCTION = async (req, res) => {
        if (!utils.authorize(req.params.id)) { return res.status(403).send('Forbidden'); }

        let id = req.params.id;

        if (utils.validate(req.body, biz, Biz)) {

            let user = await User.findOne({ uId: id });

            if (user) {
                user.ownedBizes.push(req.body.bizId);
                await user.save();

                res.status(200).send();
            }
            else {
                res.status(400).send('Invalid user id');
            }
        }
    }

    return { TYPE, PATH, FUNCTION };
}
