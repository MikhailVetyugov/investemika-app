import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

const bucket = process.env.S3_BUCKET ?? 'd14ff143-860b-4cf0-bd4f-86045542966d';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.S3_ENDPOINT ?? 'https://s3.twcstorage.ru',
  forcePathStyle: true,
  region: 'ru-1',
});

export async function getS3Object(objectKey: string) {
  try {
    return await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      }),
    );
  } catch (error) {
    console.error(`Error getting S3 object, ${objectKey}`, error);

    return null;
  }
}

export async function listS3Objects(prefix = '') {
  try {
    return await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      }),
    );
  } catch (error) {
    console.error(`Error listing S3 objects: ${prefix}`, error);

    return null;
  }
}
