import admin from "firebase-admin";

import serviceAccount from "../config/serviceFirebaseKey/serviceFirebaseKey.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export { admin };
