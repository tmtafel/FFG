import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as  https from 'https';

import { Convert, Event } from './Espn';
import { ConvertSitemap, Sitemap } from './Sitemap';

admin.initializeApp();
const db = admin.firestore();
const espnUrl = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga';

export const getEspnData = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const evt = await fetchEspnData();
            const result = await updateEspnData(evt);
            console.log(`Updated ${evt.name} Tournament at ${result.writeTime.toDate().toString()}`);
            resolve(null);
            return null;
        } catch (err) {
            reject(err);
            return null;
        }
    });
});

export const tournamentDataChanged = functions.firestore.document('tournaments/{year}/events/{tournamentId}').onUpdate((change, context) => {
    return new Promise(async (resolve, reject) => {
        try {
            const evt = Convert.toEspnEventData(change.after.get("json"));
            await UpdateSitemap(evt);
            resolve();
        } catch (err) {
            reject(err);
        }

    });
});

export const tournamentDataCreated = functions.firestore.document('tournaments/{year}/events/{tournamentId}').onCreate((newData, context) => {
    return new Promise(async (resolve, reject) => {
        try {
            const evt = Convert.toEspnEventData(newData.get("json"));
            await UpdateSitemap(evt);
            resolve();
        } catch (err) {
            reject(err);
        }

    });
});

async function fetchEspnData(): Promise<Event> {
    return new Promise<Event>((resolve, reject) => {
        const request = https.get(espnUrl, (res) => {
            let data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', async () => {
                try {
                    const espnData = Convert.toEspnData(data);
                    if (espnData.events[0] !== null) {
                        resolve(espnData.events[0]);
                    } else {
                        console.error("no events found");
                        reject("no events found");
                    }
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            });
        });
        request.on('error', (err) => {
            console.error(err);
            reject(err);
        });
    });
}

async function updateEspnData(evt: Event): Promise<admin.firestore.WriteResult> {
    return new Promise<admin.firestore.WriteResult>(async (resolve, reject) => {
        try {
            const espnJsonString = JSON.stringify(evt);
            const now = new Date(Date.now());
            const json = {
                json: espnJsonString,
                updated: now.toString()
            };
            const result = await db.doc(`tournaments/${evt.season.year}/events/${evt.id}`).set(json);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

async function UpdateSitemap(evt: Event): Promise<admin.firestore.WriteResult> {
    return new Promise(async (resolve, reject) => {
        try {
            const year = evt.season.year;
            const sitemap = await getSitemap(year);
            const tournamentId = parseInt(evt.id);
            const idx = sitemap.tournaments.map(trn => trn.id).indexOf(tournamentId);
            if (idx >= 0) {
                sitemap.tournaments[idx].completed = evt.status.type.completed;
            } else {
                const sitemapTournament = {
                    id: tournamentId,
                    name: evt.name,
                    completed: evt.status.type.completed,
                    begin: admin.firestore.Timestamp.fromDate(new Date(evt.date)),
                    end: admin.firestore.Timestamp.fromDate(new Date(evt.endDate))
                };
                sitemap.tournaments.push(sitemapTournament);
            }
            const sitemapUrl = `tournaments/${year}`;
            const result = await db.doc(sitemapUrl).set(sitemap);
            resolve(result);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

async function getSitemap(year: number): Promise<Sitemap> {
    return new Promise<Sitemap>(async (resolve, reject) => {
        try {
            const sitemapDoc = await db.doc(`tournaments/${year.toString()}`).get();
            const sitemap = sitemapDoc.exists ? sitemapDoc.data() as Sitemap : getNewSitemap(year);
            resolve(sitemap);
        } catch (err) {
            reject(err);
            return err;
        }
    });
}

function getNewSitemap(year: number) {
    return ConvertSitemap.toSitemap(`{"season":${year},"tournaments":[]}`);
}

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

export const getUsers = functions.https.onCall(async () => {
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

