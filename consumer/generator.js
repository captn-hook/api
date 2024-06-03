import sharp from 'sharp';
import amqp from 'amqplib/callback_api.js';
import { Photo } from '../data/schema.js';
import { bucket, thumbsBucket, createBuckets } from '../data/buckets.js';

export function startThumbnailGenerator() {
    const opt = { credentials: amqp.credentials.plain(process.env.RABBITMQ_USER, process.env.RABBITMQ_PASS) };
    amqp.connect(`amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`, opt, function (error0, connection) {
        if (error0) {
            console.log('Error connecting to RabbitMQ');
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                console.log('Error creating channel');
                throw error1;
            }

            const queue = 'photo_upload';

            channel.assertQueue(queue, {
                durable: false
            });

            console.log("Waiting for messages in %s.", queue);

            channel.consume(queue, async (msg) => {
                console.log("Received message!");
                const photoId = msg.content.toString();

                // Check if the photoId exists in the GridFS
                const fileExists = await Photo.findOne({ filename: photoId }).exec();
                if (!fileExists) {
                    console.error(`File with id ${photoId} does not exist in mongoDB!`);
                    return;
                }

                // fetch the photo from GridFS
                const downloadStream = bucket.openDownloadStreamByName(photoId)
                    .on('error', (err) => {
                        console.log('Error downloading');
                        console.error(err);
                    })
                    .on('end', () => {
                        console.log('Download stream closed');
                    });

                const uploadStream = thumbsBucket.openUploadStream(photoId)
                    .on('error', (err) => {
                        console.log('Error uploading');
                        console.error(err);
                    })
                    .on('finish', async () => {
                        //update the photo document with the thumbnail url
                        try {
                            const updatedPhoto = await Photo.findOneAndUpdate({ filename: photoId }, { $set: { thumbUrl: photoId } }, { new: true });
                            console.log('Photo document updated with thumbnailUrl', updatedPhoto);
                        } catch (err) {
                            console.error('Error updating photo document with thumbnailUrl');
                            console.error(err);
                        }
                    });


                // generate a thumbnail image
                const transformer = sharp()
                    .resize(100, 100)
                    .on('error', (err) => {
                        console.log('Error resizing');
                        console.error(err);
                    })
                    .on('info', (info) => {
                        console.log('Info', info);
                    });

                downloadStream.pipe(transformer).pipe(uploadStream);
            }, {
                noAck: true
            });
        });
    });
}
await createBuckets();
startThumbnailGenerator();