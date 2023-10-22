import { google } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Readable } from "stream"


class DriveController {
    private static _driveInstance: DriveController;
    private _googleDriveClient: OAuth2Client;

    public constructor(clientId: string, clientSecret: string, redirectUri: string) {
        this._googleDriveClient = this.createGoogleDriveClient(clientId, clientSecret, redirectUri);
    }

    public static initialize(clientId: string, clientSecret: string, redirectUri: string): DriveController {
        if (!this._driveInstance) {
            this._driveInstance = new DriveController(clientId, clientSecret, redirectUri);
            console.log("")
        }
        return this._driveInstance;
    }

    private createGoogleDriveClient(clientId, clientSecret, redirectUri): OAuth2Client {
        try{
            let auth = new OAuth2Client(clientId, clientSecret, redirectUri);
            return auth;
        }catch(error){
            console.error(error);
        }
    }

    // private setGoogleApiCredencial(){

    // }

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