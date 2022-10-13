import fetch from 'node-fetch';

export class Spotify {
    constructor(clientId, secret) {
        this.clientId = clientId;
        this.secret = secret
    }

    async authorize() {
        const base64EncodedCredentials = Buffer.from(`${this.clientId}:${this.secret}`).toString('base64');
        const body = new URLSearchParams({
            grant_type: 'client_credentials'
        });

        const resp = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${base64EncodedCredentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        });

        const result = await resp.json();
        return result; // { access_token: string, token_type: string, expires_in: number }
    }

    async findArtist(name) {
        const resp = await this.authenticatedFetch(`https://api.spotify.com/v1/search?q=${name}&type=artist`);
        return resp;
    }


    async authenticatedFetch(requestInfo, init) {
        const {
            access_token
        } = await this.authorize();

        const resp = await fetch(requestInfo, {
            ...init,
            headers: {
                ...init?.headers,
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        });

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }

        return await resp.json();
    }
}