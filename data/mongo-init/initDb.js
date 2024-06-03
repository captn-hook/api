import { Biz, Review, Photo, User } from '../schema.js';
import connect from './dbconnect.js';

// import data
import businessData from '../businesses.js';
import reviewData from '../reviews.js';
import photoData from '../photos.js';
import userData from '../users_salty.js';
import mongoose from 'mongoose';

// delete all data then bulk write all data
async function initDb() {
    await Biz.insertMany(businessData.businesses);
    await Review.insertMany(reviewData.reviews);
    await Photo.insertMany(photoData.photos);
    await User.insertMany(userData.users);
}

connect().then(() => {
    initDb().then(() => {
        console.log('Database initialized: ', mongoose.connection.name);
    });
});