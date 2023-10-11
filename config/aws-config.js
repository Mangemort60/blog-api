const { S3 } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-provider-env');

const region = 'eu-west-3'; // Vous pouvez spécifier la région si elle n'est pas déjà dans votre fichier de config AWS

const s3 = new S3({ region, credentials: fromEnv() });

module.exports = s3;
