// businesses
const biz = {
    bizId: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    category: "",
    subcategories: [],
    website: "",
    email: "",
};

// add a new business
// POST /businesses
function addBusiness() { }

// update an existing business
// POST /businesses/:id
function updatebiz() { }

// remove a business
// DELETE /businesses/:id
function removebiz() { }

// GET a list of all businesses
// GET /businesses
function listbizes() { }

// GET detailed information about a business
// GET /businesses/:id
function bizdetails() { }

// reviews
const review = {
    bizId: "",
    uId: "",
    stars: 0,
    cost: 0,
    text: "", 
};

// write a review for a business
// POST /businesses/:id/reviews
function addreview() { }

// modify a review
// POST /reviews/:id
function updatereview() { }

// delete a review
// DELETE /reviews/:id
function deletereview() { }

// list all reviews by a user
// GET /users/:id/reviews
function listuserreviews() { }

// photos
const photo = {
    pid: "",
    bizId: "",
    userId: "",
    caption: "",
    imageUrl: "",
};

// upload a photo for a business
// POST /businesses/:id/photos
function uploadphoto() { }

// remove a photo
// DELETE /photos/:id
function removephoto() { }

// modify the caption of a photo
// POST /photos/:id
function updatephotocaption() { }

// users
const user = {
    uid: "",
    ownedBizes: [],
    uploadedPhotos: [],
    writtenReviews: [], // list reviews by bizId
};

// list all businesses owned by a user
// GET /users/:id/businesses
function listuserbizes() { }

// list all photos uploaded by a user
// GET /users/:id/photos
function listuserphotos() { }