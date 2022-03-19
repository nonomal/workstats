const admin = require('firebase-admin');
const serviceAccount = require('./secrets.json');
// @ts-ignore
const verifyIdToken = (token) => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    return admin
        .auth()
        .verifyIdToken(token)
        // @ts-ignore
        .catch((error) => {
            throw error;
        });
};

export { verifyIdToken };