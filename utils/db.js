const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://comp3047-assignment:CCRNxs9bBO2j2QYKsKQz959BIZTd2t5wSday52UzG3LJiUEtWtKpzZ6xVWrVkCsgHV97bZX9A1rbACDbArftVQ==@comp3047-assignment.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@comp3047-assignment@';

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('bookingsDB');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };