import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = fs.readFileSync('./firebase-private-key.json').toString();
const parsedServiceAccount = JSON.parse(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(parsedServiceAccount),
});

const db = admin.firestore();

async function renameLinkToCard() {
  const users = await db.collection('users').get();
  for (const user of users.docs) {
    const userData = user.data();
    if (userData.links) {
      await user.ref.update({ cards: userData.links });
      await user.ref.update({ links: admin.firestore.FieldValue.delete() });
    }
    if (userData.linksHistory) {
      await user.ref.update({ cardsHistory: userData.linksHistory });
      await user.ref.update({ linksHistory: admin.firestore.FieldValue.delete() });
    }
  }
}

renameLinkToCard().catch(console.error);
