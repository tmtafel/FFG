import { firestore } from 'firebase-admin';

import { db } from './index';

export async function GetSitemap(year: number): Promise<Sitemap> {
    return new Promise<Sitemap>(async (resolve, reject) => {
        try {
            const sitemapDoc = await db.doc(`tournaments/${year.toString()}`).get();
            const sitemap = sitemapDoc.exists ? sitemapDoc.data() as Sitemap : GetNewSitemap(year);
            resolve(sitemap);
        } catch (err) {
            reject(err);
            return err;
        }
    });
}


export function GetNewSitemap(year: number) {
    return ConvertSitemap.toSitemap(`{"season":${year},"tournaments":[]}`);
}

export interface Sitemap {
    season: number;
    tournaments: SitemapTournament[];
}

export interface SitemapTournament {
    id: number;
    name: string;
    completed: boolean;
    begin: firestore.Timestamp;
    end: firestore.Timestamp;
}

export class ConvertSitemapTournament {
    public static toSitemapTournament(json: string): SitemapTournament {
        return JSON.parse(json);
    }
}

export class ConvertSitemap {
    public static toSitemap(json: string): Sitemap {
        return JSON.parse(json);
    }
}

export interface FirebaseEvent {
    json: string;
    updated: string;
}