const admin = require('firebase-admin');
const serviceAccount = {
  type: 'service_account',
  project_id: 'polygonhr-d5153',
  private_key_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
  client_email:
    'firebase-adminsdk-y10m7@polygonhr-d5153.iam.gserviceaccount.com',
  client_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_X509_CERT_URL
};

// @ts-ignore
const verifyIdToken = (token) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  return (
    admin
      .auth()
      .verifyIdToken(token)
      // @ts-ignore
      .catch((error) => {
        throw error;
      })
  );
};

export { verifyIdToken };
