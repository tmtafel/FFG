import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { EspnConvert } from './Espn';

admin.initializeApp();
const db = admin.firestore();
const app = express();
const cors = require('cors')({ origin: true });
app.use(cors);

const tournament = app.get('*', async (request, response) => {
    try {
        const docs = await db.collection('espn').listDocuments();
        const links = docs.map(doc => `<a href='/tournaments/${doc.id}'>${doc.id}</a>`);
        let html = '<ol>';
        links.forEach(link => {
            html += `<li>${link}</li>`;
        });
        html += "</ol>";
        response.send(html);
    } catch (err) {
        console.log(err);
        response.status(404).send(err);
    }
});

app.get('/tournaments/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const espnDoc = await db.doc(`espn/${id}`).get();
        const data = espnDoc.data();
        let html = '<div>';
        if (espnDoc.exists && typeof data !== 'undefined' && typeof data.json !== 'undefined') {
            const evt = EspnConvert.toEspnEventData(data.json);
            html += `<p>${evt.toString()}</p>`;
        } else {
            html += "<p>json doesnt exist</p>";
        }
        html += "</div>";
        response.send(html);
    } catch (err) {
        console.log(err);
        response.status(404).send(err);
    }
});



export const tournaments = functions.https.onRequest(app);

// export const EspnDataFetch = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const evt: Event = await FetchEspnData();
//             const espnJsonString = JSON.stringify(evt);
//             const now = new Date(Date.now());
//             const json = {
//                 updated: admin.firestore.Timestamp.fromDate(now),
//                 json: espnJsonString
//             };
//             const result = await db.doc(`espn/${evt.id}`).set(json);
//             resolve(result);
//         } catch (err) {
//             reject(err);
//         }
//     });
// });


// async function GetTournamentJson(id: string): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//         try {
//             const espnDoc = await db.doc(`espn/${id}`).get();
//             const data = espnDoc.data();
//             if (espnDoc.exists && typeof data !== 'undefined' && typeof data.json !== 'undefined') {
//                 const evt = EspnConvert.toEspnEventData(data.json);
//                 resolve(evt.toString());
//             }
//             resolve("<p>json doesnt exist</p>");

//         } catch (err) {
//             reject(err);
//         }
//     });
// }



// export const TournamentDataCreated = functions.firestore.document('espn/{tournamentId}').onCreate((newData, context) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const evt: Event = EspnConvert.toEspnEventData(newData.get("json"));
//             resolve();
//         } catch (err) {
//             reject(err);
//         }

//     });
// });

// export const TournamentDataChanged = functions.firestore.document('tournaments/{year}/events/{tournamentId}').onUpdate((change) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const json = change.after.get("json");
//             const evt = EspnConvert.toEspnEventData(json);
//             await UpdateSitemap(evt);
//             resolve();
//         } catch (err) {
//             reject(err);
//         }
//     });
// });

// export const GetEspnData = functions.pubsub.schedule('every 2 minutes').onRun(async () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const evt = await FetchEspnData();
//             const espnJsonString = JSON.stringify(evt);
//             const now = new Date(Date.now());
//             const json = {
//                 json: espnJsonString,
//                 updated: now.toString()
//             };
//             const result = await db.doc(`tournaments/${evt.season.year}/events/${evt.id}`).set(json);
//             resolve(result);
//         } catch (err) {
//             reject(err);
//         }
//     });
// });

// export const TournamentDataCreated = functions.firestore.document('tournaments/{year}/events/{tournamentId}').onCreate((newData, context) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const evt = EspnConvert.toEspnEventData(newData.get("json"));
//             await UpdateSitemap(evt);
//             resolve();
//         } catch (err) {
//             reject(err);
//         }

//     });
// });

// export const TournamentDataChanged = functions.firestore.document('tournaments/{year}/events/{tournamentId}').onUpdate((change) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const json = change.after.get("json");
//             const evt = EspnConvert.toEspnEventData(json);
//             await UpdateSitemap(evt);
//             resolve();
//         } catch (err) {
//             reject(err);
//         }
//     });
// });

// export const UpdateTournamentPlayers = functions.https.onRequest(async (req, res) => {
//     try {
//         const id = req.params[0];
//         if (id) {
//             const docs = await db.collection('tournaments').listDocuments();
//             const years = docs.map(d => parseInt(d.id, 0)).sort((a, b) => a - b).reverse();
//             years.forEach(async year => {
//                 const evtDoc = await db.doc(`tournaments/${year}/events/${id}`).get();
//                 if (evtDoc.exists) {
//                     const fEvent = evtDoc.data() as FirebaseEvent;
//                     const evt = EspnConvert.toEspnEventData(fEvent.json);
//                     const update = await UpdatePlayersForTournament(evt);
//                     res.send(update);
//                 }
//             });
//         }
//     } catch (err) {
//         res.status(404).send(err);
//     }
// });

// export const MoveDocToEspn = functions.https.onRequest(async (req, res) => {
//     try {
//         const seasonDocs = await db.collection('tournaments').listDocuments();
//         const years = seasonDocs.map(season => parseInt(season.id, 0));
//         const sitemapPromises: Promise<ISitemap>[] = [];
//         years.forEach(year => {
//             const sitemapPromise = GetSitemap(year);
//             sitemapPromises.push(sitemapPromise);
//         });
//         const sitemaps = await Promise.all(sitemapPromises);

//         const tournamentPromises: Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>>[] = [];
//         sitemaps.forEach(sitemap => {
//             sitemap.tournaments.forEach(tournament => {
//                 const tournamentPromise = db.doc(`tournaments/${sitemap.season}/events/${tournament.id}`).get();
//                 tournamentPromises.push(tournamentPromise);
//             });
//         });
//         const tournaments = await Promise.all(tournamentPromises);
//         const espnPromises: Promise<FirebaseFirestore.WriteResult>[] = [];
//         tournaments.forEach(trn => {
//             const data = trn.data();
//             if (data) {
//                 const updated = new Date(data.updated.toString());
//                 const newData = {
//                     updated: admin.firestore.Timestamp.fromDate(updated),
//                     json: data.json
//                 };
//                 const espnPromise = db.doc(`espn/${trn.id}`).set(newData);
//                 espnPromises.push(espnPromise);
//             }
//         });
//         const result = await Promise.all(espnPromises);
//         res.send(result);
//     } catch (err) {
//         res.status(404).send(err);
//     }
// });


// async function GetSitemap(year: number): Promise<ISitemap> {
//     return new Promise<ISitemap>(async (resolve, reject) => {
//         try {
//             const sitemapDoc = await db.doc(`tournaments/${year}`).get();
//             const sitemap = sitemapDoc.exists ?
//                 sitemapDoc.data() as ISitemap :
//                 ConvertSitemap.toSitemap(`{"season":${year},"tournaments":[]}`);
//             resolve(sitemap);
//         } catch (err) {
//             reject(err);
//             return err;
//         }
//     });
// }

// async function UpdatePlayersForTournament(evt: Event): Promise<FirebaseFirestore.WriteResult[]> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const playerPromises: Promise<FirebaseFirestore.WriteResult>[] = [];
//             const competitors = evt.competitions[0].competitors;
//             competitors.forEach(competitor => {
//                 const playerUrl = `tournaments/${evt.season.year}/events/${evt.id}/players/${competitor.id}`;
//                 const activePlayerString =
//                     `{
//                     "id":${competitor.id},
//                     "score":
//                     {
//                         "displayValue":"${competitor.score.displayValue}",
//                         "value":${competitor.score.value}
//                     },
//                     "sortOrder":${competitor.sortOrder}
//                 }`;
//                 const activePlayer = EspnConvert.toEspnActivePlayer(activePlayerString);
//                 const playerPromise = db.doc(playerUrl).set(activePlayer);
//                 playerPromises.push(playerPromise);
//             });
//             const playerPromisesResult = await Promise.all(playerPromises);
//             resolve(playerPromisesResult);
//         } catch (err) {
//             console.error(err);
//             reject(err);
//         }
//     });
// }

// async function UpdateSitemap(evt: Event): Promise<FirebaseFirestore.WriteResult[]> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const year = evt.season.year;
//             const sitemap = await GetSitemap(year);
//             const tournamentId = parseInt(evt.id);
//             const idx = sitemap.tournaments.map(trn => trn.id).indexOf(tournamentId);
//             if (idx >= 0) {
//                 sitemap.tournaments[idx].completed = evt.status.type.completed;
//             } else {
//                 const sitemapTournament = {
//                     id: tournamentId,
//                     name: evt.name,
//                     completed: evt.status.type.completed,
//                     begin: admin.firestore.Timestamp.fromDate(new Date(evt.date)),
//                     end: admin.firestore.Timestamp.fromDate(new Date(evt.endDate))
//                 };
//                 sitemap.tournaments.push(sitemapTournament);
//             }
//             const sitemapUrl = `tournaments/${year}`;
//             await db.doc(sitemapUrl).set(sitemap);
//             const playerUpdates = await UpdatePlayersForTournament(evt);
//             resolve(playerUpdates);
//         } catch (err) {
//             console.error(err);
//             reject(err);
//         }
//     });
// }

// export const CreateUserRecord = functions.auth.user().onCreate((user, context) => {
//     console.log(`Attempting to create user with email ${user.email}`);
//     console.log(user);
//     console.log(context);
//     const userRef = db.doc(`users/${user.uid}`);
//     return userRef.set({
//         name: user.displayName,
//         email: user.email
//     });
// });

// export const DeleteUserRecord = functions.auth.user().onDelete((user, context) => {
//     console.log(`Attempting to delete user with email ${user.email}`);
//     console.log(user);
//     console.log(context);
//     return db.doc(`users/${user.uid}`).delete();
// });

// export const AddAdmin = functions.https.onCall((data, context) => {
//     if (context.auth) {
//         const email = data.email;
//         return GrantAdminRole(email).then(() => {
//             console.log(`Request fulfilled! ${email} is now an admin.`);
//             return true;
//         });
//     }
//     console.log("Request not authorized. User must be an admin to fulfill request.");
//     return false;
// });

// async function GrantAdminRole(email: string) {
//     const user = await admin.auth().getUserByEmail(email);
//     return admin.auth().setCustomUserClaims(user.uid, {
//         admin: true
//     });
// }

// export const RemoveAdmin = functions.https.onCall((data, context) => {
//     if (context.auth) {
//         if (context.auth.token.admin) {
//             const email = data.email;
//             return RemoveAdminRole(email).then(() => {
//                 console.log(`Request fulfilled! ${email} is no longer an admin.`);
//                 return true;
//             });
//         };
//     }
//     console.log("Request not authorized. User must be an admin to fulfill request.");
//     return false;
// });

// async function RemoveAdminRole(email: string): Promise<void> {
//     const user = await admin.auth().getUserByEmail(email);
//     return admin.auth().setCustomUserClaims(user.uid, {
//         admin: false
//     });
// }