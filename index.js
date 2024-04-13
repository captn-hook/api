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

    let { type: TYPE, func: FUNCTION } = utils.post(reviews, review, PATH);

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

// list all reviews by a user
// GET /users/:id/reviews
export function listuserreviews() {
    const PATH = '/users/:id/reviews';
    const TYPE = 'get';

    let FUNCTION = (req, res) => {
        let id = req.params.id;

        let userReviews = reviews.filter(review => review.uId === id);

        res.status(200).send(userReviews);
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

        res.status(200).send(bizReviews);
    }

    return {TYPE, PATH, FUNCTION};     
    
}

// photos
const photo = {
    pid: "1",
    bizId: "1",
    userId: "1",
    caption: "0",
    imageUrl: "1",
};

let photos = [];

// upload a photo for a business
// POST /businesses/:id/photos
export function uploadphoto() { 
    const PATH = '/businesses/:id/photos';

    let { type: TYPE, func: FUNCTION } = utils.post(photos, photo, PATH);

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

// users
const user = {
    uid: "1",
    ownedBizes: [],
    uploadedPhotos: [],
    writtenReviews: [], // list reviews by bizId
};

let users = [
    {
        uid: "1",
        ownedBizes: ["1"],
        uploadedPhotos: ["1"],
        writtenReviews: ["1"],
    }
];

// list all businesses owned by a user
// GET /users/:id/businesses
export function listuserbizes() { 
    const PATH = '/users/:id/businesses';
    const TYPE = 'get';

    let FUNCTION = (req, res) => {
        let id = req.params.id;

        let userBizes = businesses.filter(biz => biz.uid === id);

        res.status(200).send(userBizes);
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

        res.status(200).send(userPhotos);
    }

    return {TYPE, PATH, FUNCTION};
}
