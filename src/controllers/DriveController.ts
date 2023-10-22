import { google } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Readable } from "stream"
import { drive_v3 } from "googleapis/build/src/apis/drive/v3"


class DriveController {
    private static _driveInstance: DriveController;
    private _googleApiClient: OAuth2Client;
    private _googleDriveClient: drive_v3.Drive;

    public constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
        this._googleApiClient = this.createGoogleApiClient(clientId, clientSecret, redirectUri, refreshToken);
        this._googleDriveClient = this.createGoogleDriveClient();
    }

    public static initialize(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string): DriveController {
        if (!this._driveInstance) {
            this._driveInstance = new DriveController(clientId, clientSecret, redirectUri, refreshToken);
            console.log("")
        }
        return this._driveInstance;
    }

    private setGoogleApiCredencial(refreshToken: string){
        this._googleApiClient.setCredentials({refresh_token: refreshToken})
    }

    private createGoogleApiClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string): OAuth2Client{
        try{
        let googleApiClient = new OAuth2Client(clientId, clientSecret, redirectUri);
        this.setGoogleApiCredencial(refreshToken);
        return googleApiClient;
        }catch(error){
            return error;
        }
    }

    private createGoogleDriveClient(): drive_v3.Drive {
        try{
            let driveClient = google.drive({ version: 'v3', auth: this._googleApiClient })
            return driveClient;
        }catch(error){
            console.error(error);
        }
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