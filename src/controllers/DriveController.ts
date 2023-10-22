import { google } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Readable } from "stream"


class DriveController {
    private static _driveInstance: DriveController;
    private _googleDriveClient: OAuth2Client;

    public constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
        this._googleDriveClient = this.createGoogleDriveClient(clientId, clientSecret, redirectUri, refreshToken);
    }

    public static initialize(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string): DriveController {
        if (!this._driveInstance) {
            this._driveInstance = new DriveController(clientId, clientSecret, redirectUri, refreshToken);
            console.log("")
        }
        return this._driveInstance;
    }

    private createGoogleDriveClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string): OAuth2Client {
        try{
            let auth = new OAuth2Client(clientId, clientSecret, redirectUri);
            this.setGoogleApiCredencial(refreshToken);
            return auth;
        }catch(error){
            console.error(error);
        }
    }

    private setGoogleApiCredencial(refreshToken: string){
        this._googleDriveClient.setCredentials({refresh_token: refreshToken})
    }

    public static get DriveInstance(): DriveController {
        if (!this._driveInstance) {
            throw new Error("DriveController must be initialized with configuration");
        }
        return this._driveInstance;
    }

    get googleDriveClient(){
        return this._googleDriveClient;
    }
}

export default DriveController;