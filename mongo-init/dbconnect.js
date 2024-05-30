import mongoose from 'mongoose';

export default async function connect() {
    let username = process.env.MONGO_USERNAME;
    let pass = process.env.MONGO_PASSWORD;
    let host = process.env.MONGO_HOST;
    let dbport = process.env.MONGO_PORT;
    let db = process.env.MONGO_DB;

    let uri = `mongodb://${username}:${pass}@${host}:${dbport}/${db}`;

    mongoose.connect(uri);

    return new Promise((resolve, reject) => {
        mongoose.connection.once('open', () => {
            resolve();
        });
    });
}