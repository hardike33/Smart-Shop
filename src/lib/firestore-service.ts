import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    writeBatch,
    doc,
    query,
    where
} from 'firebase/firestore';
import { restaurantsData } from '@/data/restaurants';
import { groceryShopsData } from '@/data/groceryShops';

export const seedFirestore = async () => {
    try {
        console.log('🌱 Starting Firestore Seeding...');
        const batch = writeBatch(db);

        // 1. Seed Restaurants
        const restaurantsCol = collection(db, 'restaurants');
        const restaurantSnap = await getDocs(restaurantsCol);

        // Only seed if empty to avoid duplicates
        if (restaurantSnap.empty) {
            for (const restaurant of restaurantsData) {
                const newDocRef = doc(restaurantsCol);
                batch.set(newDocRef, {
                    ...restaurant,
                    createdAt: new Date()
                });
            }
            console.log('✅ Added Restaurants to batch');
        }

        // 2. Seed Grocery Shops
        const groceryCol = collection(db, 'groceryShops');
        const grocerySnap = await getDocs(groceryCol);
        if (grocerySnap.empty) {
            for (const shop of groceryShopsData) {
                const newDocRef = doc(groceryCol);
                batch.set(newDocRef, {
                    ...shop,
                    createdAt: new Date()
                });
            }
            console.log('✅ Added Grocery Shops to batch');
        }

        await batch.commit();
        console.log('🚀 Firestore Seeding Complete!');
        return true;
    } catch (error) {
        console.error('❌ Firestore Seeding Error:', error);
        throw error;
    }
};

export const fetchRestaurantsFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, 'restaurants'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchGroceryShopsFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, 'groceryShops'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
