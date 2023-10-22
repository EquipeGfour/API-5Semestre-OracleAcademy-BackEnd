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

    private createGoogleApiClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string): OAuth2Client{
        try{
        let googleApiClient = new OAuth2Client(clientId, clientSecret, redirectUri);
        googleApiClient.setCredentials({refresh_token: refreshToken})
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

    public async searchFolder(folder: string){
        try{
            const folders = await this._googleDriveClient.files.list({
                q: `mimeType='application/vnd.google-apps.folder' and name='${folder}' and trashed=false`,
                fields: 'files(id, name, createdTime)',
            })
            return folders.data.files;
        }catch(error){
            console.log(error)
        }
    }

    public async createFolder(folder: string){
        try{
            const response = await this._googleDriveClient.files.create({
                requestBody: {
                    name: folder,
                    mimeType: 'application/vnd.google-apps.folder',
                },
                fields: 'id, name',
            })
            return response.data;
        }catch(error){
            console.log(error)
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