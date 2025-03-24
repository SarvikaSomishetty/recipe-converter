const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb://localhost:27017"; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Read the JSON file
        const data = fs.readFileSync('Densities.json', 'utf8');
        const jsonData = JSON.parse(data);

        // Access the database and collection
        const database = client.db('Food'); // Replace with your database name
        const collection = database.collection('Densities'); // Replace with your collection name

        // Insert each food item as a separate document
        const foodDensities = jsonData.food_densities;
        const result = await collection.insertMany(foodDensities);

        console.log(`${result.insertedCount} documents were inserted`)
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await client.close();
        console.log('MongoDB connection closed');
    }
}

run();