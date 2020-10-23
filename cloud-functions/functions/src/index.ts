import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as https from 'https';

import { EspnConvert, Event } from '../../../shared/Espn';
import { FirebaseEvent, GetSitemap } from '../../../shared/Sitemap';

admin.initializeApp();
export const db = admin.firestore();

export const GetEspnData = functions.pubsub.schedule('every 2 minutes').onRun(async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const evt = await FetchEspnData();
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
});

export const TournamentDataChanged = functions.firestore.document('tournaments/{year}/events/{tournamentId}').onUpdate((change) => {
    return new Promise(async (resolve, reject) => {
        try {
            const json = change.after.get("json");
            const evt = EspnConvert.toEspnEventData(json);
            await UpdateSitemap(evt);
            resolve();
        } catch (err) {
            reject(err);
        }

    });
});

export const TournamentDataCreated = functions.firestore.document('tournaments/{year}/events/{tournamentId}').onCreate((newData, context) => {
    return new Promise(async (resolve, reject) => {
        try {
            const evt = EspnConvert.toEspnEventData(newData.get("json"));
            await UpdateSitemap(evt);
            resolve();
        } catch (err) {
            reject(err);
        }

    });
});


export const UpdateTournamentPlayers = functions.https.onRequest(async (req, res) => {
    try {
        const id = req.params[0];
        if (id) {
            const docs = await db.collection('tournaments').listDocuments();
            const years = docs.map(d => parseInt(d.id, 0)).sort((a, b) => a - b).reverse();
            years.forEach(async year => {
                const evtDoc = await db.doc(`tournaments/${year}/events/${id}`).get();
                if (evtDoc.exists) {
                    const fEvent = evtDoc.data() as FirebaseEvent;
                    const evt = EspnConvert.toEspnEventData(fEvent.json);
                    const update = await UpdatePlayersForTournament(evt);
                    res.send(update);
                }
            });
        }
    } catch (err) {
        res.status(404).send(err);
    }
});

async function UpdatePlayersForTournament(evt: Event): Promise<FirebaseFirestore.WriteResult[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const playerPromises: Promise<FirebaseFirestore.WriteResult>[] = [];
            evt.competitions[0].competitors.forEach(player => {
                const playerUrl = `tournaments/${evt.season.year}/events/${evt.id}/players/${player.id}`;
                const playerPromise = db.doc(playerUrl).set(player);
                playerPromises.push(playerPromise);
            });
            const playerPromisesResult = await Promise.all(playerPromises)
            resolve(playerPromisesResult);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

async function UpdateSitemap(evt: Event): Promise<FirebaseFirestore.WriteResult[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const year = evt.season.year;
            const sitemap = await GetSitemap(year);
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
            await db.doc(sitemapUrl).set(sitemap);
            const playerUpdates = await UpdatePlayersForTournament(evt);
            resolve(playerUpdates);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

export const CreateUserRecord = functions.auth.user().onCreate((user, context) => {
    console.log(`Attempting to create user with email ${user.email}`);
    console.log(user);
    console.log(context);
    const userRef = db.doc(`users/${user.uid}`);
    return userRef.set({
        name: user.displayName,
        email: user.email
    });
});

export const DeleteUserRecord = functions.auth.user().onDelete((user, context) => {
    console.log(`Attempting to delete user with email ${user.email}`);
    console.log(user);
    console.log(context);
    return db.doc(`users/${user.uid}`).delete();
});

export const AddAdmin = functions.https.onCall((data, context) => {
    if (context.auth) {
        const email = data.email;
        return GrantAdminRole(email).then(() => {
            console.log(`Request fulfilled! ${email} is now an admin.`);
            return true;
        });
    }
    console.log("Request not authorized. User must be an admin to fulfill request.");
    return false;
});

async function GrantAdminRole(email: string) {
    const user = await admin.auth().getUserByEmail(email);
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
    });
}

export const RemoveAdmin = functions.https.onCall((data, context) => {
    if (context.auth) {
        if (context.auth.token.admin) {
            const email = data.email;
            return RemoveAdminRole(email).then(() => {
                console.log(`Request fulfilled! ${email} is no longer an admin.`);
                return true;
            });
        };
    }
    console.log("Request not authorized. User must be an admin to fulfill request.");
    return false;
});

async function RemoveAdminRole(email: string): Promise<void> {
    const user = await admin.auth().getUserByEmail(email);
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: false
    });
}

export const espnUrl = new URL('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga');

export async function FetchEspnData(): Promise<Event> {
    return new Promise<Event>((resolve, reject) => {
        const request = https.get(espnUrl, (res) => {
            let data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', async () => {
                try {
                    const espnData = EspnConvert.toEspnData(data);
                    if (espnData.events[0] !== null) {
                        resolve(espnData.events[0]);
                    } else {
                        reject("no events found");
                    }
                } catch (err) {
                    reject(err);
                }
            });
        });
        request.on('error', (err) => {
            reject(err);
        });
        request.end();
    });
}