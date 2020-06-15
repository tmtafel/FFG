import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const createUserRecord = functions.auth.user().onCreate((user, context) => {
    console.log(`Attempting to create user with email ${user.email}`);
    console.log(user);
    console.log(context);
    const userRef = db.doc(`users/${user.uid}`);
    return userRef.set({
        name: user.displayName,
        email: user.email
    });
});

export const deleteUserRecord = functions.auth.user().onDelete((user, context) => {
    console.log(`Attempting to delete user with email ${user.email}`);
    console.log(user);
    console.log(context);
    return db.doc(`users/${user.uid}`).delete();
});

export const getUsers = functions.https.onCall(async (data, context) => {
    return await admin.auth().listUsers();
});

export const addAdmin = functions.https.onCall((data, context) => {
    if (context.auth) {
        const email = data.email;
        return grantAdminRole(email).then(() => {
            console.log(`Request fulfilled! ${email} is now an admin.`);
            return true;
        });
    }
    console.log("Request not authorized. User must be an admin to fulfill request.");
    return false;
});


async function grantAdminRole(email: string) {
    const user = await admin.auth().getUserByEmail(email);
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
    });
}

export const removeAdmin = functions.https.onCall((data, context) => {
    if (context.auth) {
        if (context.auth.token.admin) {
            const email = data.email;
            return removeAdminRole(email).then(() => {
                console.log(`Request fulfilled! ${email} is no longer an admin.`);
                return true;
            });
        };
    }
    console.log("Request not authorized. User must be an admin to fulfill request.");
    return false;
});

async function removeAdminRole(email: string) {
    const user = await admin.auth().getUserByEmail(email);
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: false
    });
}