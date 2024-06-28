import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = fs.readFileSync('./firebase-private-key.json').toString();
const parsedServiceAccount = JSON.parse(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(parsedServiceAccount),
});

const db = admin.firestore();

async function updateHideoutUrls() {
  const users = await db.collection('users').get();
  for (const user of users.docs) {
    const userData = user.data();
    if (userData.links) {
      userData.links.forEach((link) => {
        if (link.links.Hideout) {
          link.links.Hideout = link.links.Hideout.replace(
            'www.hideout-online.com',
            'www.hideoutcg.com',
          );
        }
      });
      await user.ref.update({ links: userData.links });
    }
    if (userData.linksHistory) {
      userData.linksHistory.forEach((link) => {
        if (link.links.Hideout) {
          link.links.Hideout = link.links.Hideout.replace(
            'www.hideout-online.com',
            'www.hideoutcg.com',
          );
        }
      });
      await user.ref.update({ linksHistory: userData.linksHistory });
    }
  }
}

updateHideoutUrls().catch(console.error);
