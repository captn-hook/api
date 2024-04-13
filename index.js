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

let businesses = [];

// Function Signature
// TYPE, PATH, API FUNCTION
// GET /businesses listbizes
//types: get, post, put, delete

// add a new business
// POST /business
export function addBusiness() { 
    const PATH = '/businesses';

    let { type: TYPE, func: FUNCTION } = utils.post(businesses, biz, PATH);

    return {TYPE, PATH, FUNCTION};
}

// update an existing business
// POST /businesses/:id
export function updatebiz() { 
    const PATH = '/businesses/:id';

    let { type: TYPE, func: FUNCTION } = utils.put(businesses, biz);

    return {TYPE, PATH, FUNCTION};
}

// remove a business
// DELETE /businesses/:id
export function removebiz() { 
    const PATH = '/businesses/:id';

    let { type: TYPE, func: FUNCTION } = utils.del(businesses);

    return {TYPE, PATH, FUNCTION};
}

// get a list of all businesses
// GET /businesses
export function listbizes() { 
    const PATH = '/businesses';

    let { type: TYPE, func: FUNCTION } = utils.get(businesses);

    return {TYPE, PATH, FUNCTION};
}

// get detailed information about a business
// GET /businesses/:id
export function bizdetails() { 
    const PATH = '/businesses/:id';
 
    let { type: TYPE, func: FUNCTION } = utils.getID(businesses);

    return {TYPE, PATH, FUNCTION};
}

// reviews
const review = {
    bizId: "1",
    uId: "1",
    stars: 0,
    cost: 0,
    text: "0", 
};

let reviews = [];

// write a review for a business
// POST /businesses/:id/reviews
export function addreview() { 
    const PATH = '/businesses/:id/reviews';
    const TYPE = 'post';

    let FUNCTION = (req, res) => {
        if (utils.validate(req.body, review)) {

            //check bizId and uId
            if (businesses.filter(biz => biz.bizId === req.body.bizId).length === 0) {
                res.status(400).send('Invalid business ID');
                return;
            } else if (users.filter(user => user.uId === req.body.uId).length === 0) {
                console.log('Invalid user ID:', req.body.uId);
                console.log('Users:', users);
                res.status(400).send('Invalid user ID');
                return;
            }

            //check if review already exists
            if (reviews.filter(rev => rev.bizId === req.body.bizId && rev.uId === req.body.uId).length > 0) {
                res.status(400).send('Review already exists');
                return;
            } else {
                //add review to user
                let user = users.filter(user => user.uId === req.body.uId)[0];
                if (user.writtenReviews === undefined) {
                    user.writtenReviews = [req.body.bizId];
                } else {
                    user.writtenReviews.push(req.body.bizId);
                }
            }

            reviews.push(req.body);
            console.log('Sending 200: OK from post review');
            res.status(200).send();
        } else {
            res.status(400).send('Invalid data from post review');
        }
    }
    
    return {TYPE, PATH, FUNCTION};

}

// modify a review
// POST /reviews/:id
export function updatereview() { 
    const PATH = '/reviews/:id';

    let { type: TYPE, func: FUNCTION } = utils.put(reviews, review, PATH);

    return {TYPE, PATH, FUNCTION};
}

// delete a review
// DELETE /reviews/:id
export function deletereview() { 
    const PATH = '/reviews/:id';

    let { type: TYPE, func: FUNCTION } = utils.del(reviews, PATH);

    return {TYPE, PATH, FUNCTION};

}

// get all reviews for testing
export function listreviews() {
    const PATH = '/reviews';

    let { type: TYPE, func: FUNCTION } = utils.get(reviews);

    return {TYPE, PATH, FUNCTION};
}

// list all reviews by a user
// GET /users/:id/reviews
export function listuserreviews() {
    const PATH = '/users/:id/reviews';
    const TYPE = 'get';

    let FUNCTION = (req, res) => {
        let id = req.params.id;

        let userReviews = reviews.filter(review => review.uId === id);

        res.status(200).send(utils.paginate(req, userReviews));
    }

    return {TYPE, PATH, FUNCTION};    

}

// get business reviews
// GET /businesses/:id/reviews
export function bizreviews() {
    const PATH = '/businesses/:id/reviews';
    const TYPE = 'get';

    let FUNCTION = (req, res) => {
        let id = req.params.id;

        let bizReviews = reviews.filter(review => review.bizId === id);

        res.status(200).send(utils.paginate(req, bizReviews));
    }

    return {TYPE, PATH, FUNCTION};     
    
}

// photos
const photo = {
    pId: "1",
    bizId: "1",
    uId: "1",
    caption: "0",
    imageUrl: "1",
};

let photos = [];

// upload a photo for a business
// POST /businesses/:id/photos
export function uploadphoto() { 
    const PATH = '/businesses/:id/photos';
    const TYPE = 'post';

    let FUNCTION = (req, res) => {
        if (utils.validate(req.body, photo)) {

            //check bizId and uId
            if (businesses.filter(biz => biz.bizId === req.body.bizId).length === 0) {
                res.status(400).send('Invalid business ID');
                return;
            } else if (users.filter(user => user.uId === req.body.uId).length === 0) {
                res.status(400).send('Invalid user ID');
                return;
            }

            //check if photo already exists
            if (photos.filter(photo => photo.bizId === req.body.bizId && photo.uId === req.body.uId).length > 0) {
                res.status(400).send('Photo already exists');
                return;
            } else {
                //add photo to user
                let user = users.filter(user => user.uId === req.body.uId)[0];
                if (user.uploadedPhotos === undefined) {
                    user.uploadedPhotos = [req.body.pId];
                } else {
                    user.uploadedPhotos.push(req.body.pId);
                }
            }

            photos.push(req.body);
            console.log('Sending 200: OK from post photo');
            res.status(200).send();
        } else {
            res.status(400).send('Invalid data');
        }
    }

    return {TYPE, PATH, FUNCTION};
}

// remove a photo
// DELETE /photos/:id
export function removephoto() { 
    const PATH = '/photos/:id';

    let { type: TYPE, func: FUNCTION } = utils.del(photos, PATH);

    return {TYPE, PATH, FUNCTION};
}

// modify the caption of a photo
// POST /photos/:id
export function updatephotocaption() { 
    const PATH = '/photos/:id';

    let { type: TYPE, func: FUNCTION } = utils.put(photos, photo, PATH);

    return {TYPE, PATH, FUNCTION};
}

// get all photos for testing
export function listphotos() {
    const PATH = '/photos';

    let { type: TYPE, func: FUNCTION } = utils.get(photos);

    return {TYPE, PATH, FUNCTION};
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
  
    let { type: TYPE, func: FUNCTION } = utils.post(users, user, PATH);

    return {TYPE, PATH, FUNCTION};
}

// list all businesses owned by a user
// GET /users/:id/businesses
export function listuserbizes() { 
    const PATH = '/users/:id/businesses';
    const TYPE = 'get';

    let FUNCTION = (req, res) => {
        let id = req.params.id;

        let userBizes = businesses.filter(biz => biz.uid === id);

        res.status(200).send(utils.paginate(req, userBizes));
    }

    return {TYPE, PATH, FUNCTION};
}

// list all photos uploaded by a user
// GET /users/:id/photos
export function listuserphotos() { 
    const PATH = '/users/:id/photos';
    const TYPE = 'get';

    let FUNCTION = (req, res) => {
        let id = req.params.id;

        let userPhotos = photos.filter(photo => photo.userId === id);

        res.status(200).send(utils.paginate(req, userPhotos));
    }

    return {TYPE, PATH, FUNCTION};
}

// add a business to a user's list of owned businesses
// POST /users/:id/businesses
export function addbiztouser() { 
    const PATH = '/users/:id/businesses';
    const TYPE = 'post';

    let FUNCTION = (req, res) => {
        let id = req.params.id;

        if (utils.validate(req.body, biz)) {
            if (businesses.filter(biz => biz.bizId === req.body.bizId).length === 0) {
                res.status(400).send('Invalid business ID');
                return;
            }

            let user = users.filter(user => user.uId === id)[0];
            if (user.ownedBizes === undefined) {
                user.ownedBizes = [req.body.bizId];
            } else {
                user.ownedBizes.push(req.body.bizId);
            }
            
            res.status(200).send();
        } else {
            res.status(400).send('Invalid data');
        }
    }

    return {TYPE, PATH, FUNCTION};
}
