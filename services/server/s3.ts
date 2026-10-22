import S3 from 'aws-sdk/clients/s3';
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';

const bucket = process.env.S3_BUCKET ?? 'd14ff143-860b-4cf0-bd4f-86045542966d';

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT ?? 'https://s3.twcstorage.ru',
  s3ForcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
});


export async function getS3Object(objectKey: string): Promise<PromiseResult<S3.GetObjectOutput, AWSError> | null> {
  try {
    const requestParams = { Bucket: bucket, Key: objectKey };

    return s3.getObject(requestParams).promise();
  } catch (error) {
    console.error(`Error getting S3 object, ${objectKey}`, error);

    return null;
  }
}

export async function listS3Objects(prefix = ''): Promise<PromiseResult<S3.ListObjectsOutput, AWSError> | null> {
  try {
    const requestParams = { Bucket: bucket, Prefix: prefix };
    
    return s3.listObjects(requestParams).promise();
  } catch (error) {
    console.error(`Error listing S3 objects: ${prefix}`, error);

    return null;
  }
}
