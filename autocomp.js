const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const uri = "mongodb+srv://root:root123@cluster-sdc.6bekb.mongodb.net/Food"; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

app.get('/autocomplete', async (req, res) => {
    const searchTerm = req.query.term; // Get the search term from the query string
    console.log("Search Term:", searchTerm); // Log the search term

    try {
        await client.connect();
        console.log("Connected to MongoDB"); // Log connection success
        const database = client.db('Food');
        const collection = database.collection('Densities');

        // Use regex to find items starting with the search term
        const query = { "Food name and description": { $regex: `^${searchTerm}`, $options: "i" } };
        console.log("Query:", query); // Log the query

        const results = await collection.find(query).toArray();
        console.log("Results:", results); // Log the results

        res.json(results); // Send the results back to the client
    } catch (error) {
        console.error("Error:", error); // Log any errors
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
        console.log("MongoDB connection closed"); // Log connection closure
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});