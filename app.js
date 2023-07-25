console.log('this is awesome!');
const express = require('express');

const axios = require('axios');

const db = require('./Database/mongo-connection');

const ObjectId = db.ObjectId;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
        res.send('HW!');
});

async function fetchAndStoreInDatabase() {
        try {
                const response = await axios.get(
                        'https://api.publicapis.org/entries'
                );
                const { entries } = response.data;
                // console.log(entries);
                //how mongo will know about the schema?
                //Ans: entries is just collection of documents
                await db.getDB().collection('entries').deleteMany({});
                await db.getDB().collection('entries').insertMany(entries);
                console.log('data fetched and inserted!');
        } catch (error) {
                console.log('Error fetching and storing data', error);
        }
}
fetchAndStoreInDatabase();

//to get all posts
app.get('/posts', async (req, res) => {
        try {
                const posts = await db
                        .getDB()
                        .collection('entries')
                        .find({})
                        .toArray();
                res.status(200).json(posts);
        } catch (error) {
                res.status(500).json({
                        error: 'Error in fetching all the records from database!',
                });
        }
});

//to get post with specific id
app.get('/posts/:id', async (req, res) => {
        try {
                const id = new ObjectId(req.params.id);
                const post = await db
                        .getDB()
                        .collection('entries')
                        .findOne({ _id: i });
                res.status(200).json(post);
        } catch (error) {
                res.status(500).json({
                        error: `Failed to fetch records`,
                });
        }
});

//to create post
app.post('/posts', async (req, res) => {
        try {
                const { API, Description, Auth, HTTPS, Cors, Link, Category } =
                        req.body;
                const post = {
                        API,
                        Description,
                        Auth,
                        HTTPS,
                        Cors,
                        Link,
                        Category,
                };

                await db.getDB().collection('entries').insertOne(post);
                console.log('data inserted!');
                res.status(201).json({
                        API,
                        Description,
                        Auth,
                        HTTPS,
                        Cors,
                        Link,
                        Category,
                });
        } catch (error) {
                res.status(500).json({ error: 'Failed to insert the record!' });
        }
});

//to update post
app.put('/posts/:id', async (req, res) => {
        try {
                const id = new ObjectId(req.params.id);
                const record = await db
                        .getDB()
                        .collection('entries')
                        .findOne({ _id: id });
                if (!record) {
                        return res
                                .status(404)
                                .json({ error: 'could not find the record' });
                }

                const putAck = await db
                        .getDB()
                        .collection('entries')
                        .updateOne(
                                { _id: id },
                                {
                                        $set: {
                                                API: req.body.API,
                                                Description:
                                                        req.body.Description,
                                                Auth: req.body.Auth,
                                                HTTPS: req.body.HTTPS,
                                                Cors: req.body.Cors,
                                                Link: req.body.Link,
                                                Category: req.body.Category,
                                        },
                                }
                        );
                res.status(200).json(putAck);
        } catch (error) {
                res.status(500).json({ error: 'Failed to update the record' });
        }
});

//to delete post
app.delete('/posts/:id', async (req, res) => {
        try {
                const id = new ObjectId(req.params.id);
                const record = await db
                        .getDB()
                        .collection('entries')
                        .findOne({ _id: id });
                if (!record) {
                        return res
                                .status(404)
                                .json({ error: 'could not find the record' });
                }
                const deleteAck = await db
                        .getDB()
                        .collection('entries')
                        .deleteOne({ _id: id });
                res.status(200).json(deleteAck);
        } catch (error) {
                res.status(500).json({
                        error: `Could not delete record with id: ${req.params.id}`,
                });
        }
});

app.use(function (error, req, res, next) {
        console.log(error);
        res.status(500).send('Something went wrong on server!');
});
db.connectionToDatabase().then(function () {
        console.log('Database Connected!');
        app.listen(3000, () => {
                console.log('Server is listening!!!');
        });
});
