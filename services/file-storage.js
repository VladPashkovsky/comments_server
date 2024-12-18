const { S3Client} = require('@aws-sdk/client-s3');
const { Upload } = require ('@aws-sdk/lib-storage');
const cuid = require('cuid');
const mime = require('mime-types');

class FileStorage {
  constructor() {
    this.s3Client = new S3Client({
      forcePathStyle: true,
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadImage(file, tag) {
    return this.upload(file, process.env.S3_IMAGES_BUCKET, tag);
  }

  async upload(file, bucket, tag) {
    const res = await new Upload({
      client: this.s3Client,
      params: {
        ACL: 'public-read',
        Bucket: bucket,
        Key: `${tag}-${Date.now().toString()}-${file.name}`,
        Body: file,
        ContentType: mime.lookup(file.name) || undefined,
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    }).done();

    return {
      id: cuid(),
      name: file.name,
      type: file.type,
      path: `/storage/${bucket}/${res.Key}`,
      prefix: '/storage',
      eTag: res.ETag,
    };
  }
}

module.exports = new FileStorage();