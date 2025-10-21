import { config } from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Charger les variables d'environnement
config({ path: '.env.local' });

// Vérifier que les variables sont présentes
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('❌ Missing Firebase environment variables!');
  console.error('Make sure .env.local contains:');
  console.error('- FIREBASE_PROJECT_ID');
  console.error('- FIREBASE_CLIENT_EMAIL');
  console.error('- FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const profiles = [
  {
    id: "ivana",
    name: "Ivana",
    slug: "ivana",
    avatar: "/images/ivana.png",
    quote: "Every book is a new adventure waiting to unfold",
    favoriteBook: "Pride and Prejudice",
    currentReading: "The Seven Husbands of Evelyn Hugo",
    alignment: "left",
    order: 1,
    bio: "Book lover and coffee enthusiast. I believe that every great story deserves to be shared."
  },
  {
    id: "laure",
    name: "Laure",
    slug: "laure",
    avatar: "/images/laure.png",
    quote: "A cup of coffee and a good book make the perfect day",
    favoriteBook: "Little Women",
    currentReading: "Daisy Jones & The Six",
    alignment: "center",
    order: 2,
    bio: "Romance reader and mood reader. Always searching for the next book that will make me feel all the feels."
  },
  {
    id: "sandra",
    name: "Sandra",
    slug: "sandra",
    avatar: "/images/sandra.png",
    quote: "Books are portals to infinite worlds",
    favoriteBook: "The Night Circus",
    currentReading: "The Invisible Life of Addie LaRue",
    alignment: "right",
    order: 3,
    bio: "Fantasy and magical realism lover. I read to escape, to dream, and to discover new perspectives."
  }
];

async function initProfiles() {
  try {
    console.log('🔄 Adding profiles to Firebase...\n');
    
    for (const profile of profiles) {
      const { id, ...data } = profile;
      await db.collection('profiles').doc(id).set(data);
      console.log(`✓ Added profile: ${profile.name}`);
    }
    
    console.log('\n🎉 All profiles added successfully!');
    console.log('\n✅ You can now view them at:');
    console.log('   - /about');
    console.log('   - /profile/ivana');
    console.log('   - /profile/laure');
    console.log('   - /profile/sandra');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding profiles:', error);
    process.exit(1);
  }
}

initProfiles();