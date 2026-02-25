import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
        if (collections.length > 0) {
            console.log('Collection "users" found. Checking indexes...');
            const indexes = await mongoose.connection.db.collection('users').indexes();
            console.log('Current indexes:', JSON.stringify(indexes, null, 2));

            const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');
            if (hasUsernameIndex) {
                console.log('Dropping "username_1" index...');
                await mongoose.connection.db.collection('users').dropIndex('username_1');
                console.log('Index dropped successfully.');
            } else {
                console.log('"username_1" index not found.');
            }
        } else {
            console.log('Collection "users" not found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixIndex();
