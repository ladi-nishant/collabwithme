import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const fixDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        console.log('Checking indexes...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        if (indexes.find(i => i.name === 'username_1')) {
            console.log('Dropping legacy "username_1" index...');
            await collection.dropIndex('username_1');
            console.log('Index dropped successfully!');
        } else {
            console.log('No "username_1" index found. You might have already fixed it!');
        }

        console.log('Database fix complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing database:', error);
        process.exit(1);
    }
};

fixDatabase();
