import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore'


const serviceAccount = require('../../token.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = async () =>{
  try{
    getFirestore();
    console.log('Banco de dados conectado com sucesso!!!');
  }catch(error){
      console.log(error)
  }
}

export const connection = getFirestore();

export default db;
