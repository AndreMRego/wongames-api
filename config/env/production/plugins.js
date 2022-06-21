module.exports = ({ env }) => ({
  email: {
    provider: "nodemailer",
    providerOptions: {
      host: env("SMTP_HOST", "smtp-relay.sendinblue.com"),
      port: env("SMTP_PORT", 587),
      auth: {
        user: env("SMTP_USERNAME"),
        pass: env("SMTP_PASSWORD"),
      },
    },
    settings: {
      defaultFrom: "wongames@gmail.com",
      defaultReplyTo: "contact@gmail.com",
    },
  },
  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env("AWS_REGION"),
      params: {
        Bucket: env("AWS_BUCKET"),
      },
    },
  },
});
