import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const userAdded = functions.auth.user().onCreate(async (user) => {
    await admin.firestore().collection('/users').add({ email: user.email, name: user.displayName }).then(aResult => {
        console.log('added user: ' + user.email);
        console.log(aResult);
    }).catch(error => {
        console.log("failed to add new useruser");
        console.log(error);
    });
});

export const userDeleted = functions.auth.user().onDelete(async (user) => {
    await admin.firestore().collection('/users').where('email', '==', user.email).get().then(async result => {
        result.docs.forEach(async doc => {
            await admin.firestore().collection('users').doc(doc.id).delete().then((deleteResult) => {
                console.log('deleted user: ' + user.email);
                console.log(deleteResult);
            }).catch((deleteError) => {
                console.log(deleteError);
            });
        });
    }).catch((error) => {
        console.log(error);
    });
});