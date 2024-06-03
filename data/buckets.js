
import mongoose from 'mongoose';
import connect from './mongo-init/dbconnect.js'

export var bucket = undefined;
export var thumbsBucket = undefined;

export async function createBuckets() {
    connect().then(() => {
        console.log('Connected to mongo: ', mongoose.connection.name);
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'photos' });
        thumbsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'thumbs' });
    }).catch((err) => {
        console.error('Error connecting to mongo: ', err);
    });
}