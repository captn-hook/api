import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Schemas
const bizSchema = new Schema({
    bizId: String,
    name: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    category: String,
    subcategories: [String],
    website: String,
    email: String,
});

const reviewSchema = new Schema({
    rId: String,
    bizId: String,
    uId: String,
    stars: Number,
    cost: Number,
    text: String,
});

const photoSchema = new Schema({
    pId: String,
    bizId: String,
    uId: String,
    caption: String,
    imageUrl: String,
});

const userSchema = new Schema({
    uId: String,
    name: String,
    ownedBizes: [String],
    uploadedPhotos: [String],
    writtenReviews: [String],
});

// Model exports
export const Biz = model('Biz', bizSchema);
export const Review = model('Review', reviewSchema);
export const Photo = model('Photo', photoSchema);
export const User = model('User', userSchema);