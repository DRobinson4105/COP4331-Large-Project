import dotenv from 'dotenv';
dotenv.config();
//const express = require('express');//Enables express
//const bodyParser = require('body-parser');//Body parser for incoming request. May not be needed
//const cors = require('cors');//Enables CORS secuirty handleing 
//const path = require('path');



import express from 'express';
import { MongoClient } from 'mongodb';
const PORT = process.env.PORT || 3000;
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';


//Connect to database
const client = new MongoClient(process.env.DATABASE_URL);
client.connect();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('port', (process.env.PORT || PORT));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.get('/', (req, res) => {
    res.send('Server Is Ready');
})

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT + '\n');
    console.log('Database_URL: ' + process.env.DATABASE_URL + '\n');
});


app.use(express.json());

//API Calls***************************************************************************************
//Login
app.post('/api/login', async (req, res, next) => {

    // incoming: username, password
    // outgoing: id, error
    var error = '';
    const { username, password } = req.body;

    //If any missing, return 204
    if (username == null || password == null) {
        
        const er = {error: 'No Content'};
        console.log(er);
        return res.status(204).json('No Content');
    }
    //Search database for users with username and password. If so, return UserID
    try {
        const db = client.db();
        const results = await
            db.collection('Users').find({ Login: username, Password: password }).toArray();
        var id = -1;
        var fn = '';
        var ln = '';
        if (results.length > 0) {
            id = results[0].UserId;
            var ret = { UserID: id, error: '' };
            return res.status(200).json(ret);
        }
        //If not, return 400 error stating either username or password is wrong
        return res.status(400).json('Username or Password Is Wrong');

    }
    catch (e) {
        return res.status(500).send('Server Error');
    }

});

//Signup
app.post('/api/signup', async (req, res, next) => {
    //incoming username, display name, password, googleID, email
    const { username, displayName, password, googleID, email } = req.body;

    //If any missing, return 204
    if (username == null || displayName == null || password == null || googleID == null || email == null) {
        const er = {error: 'No Content'};
        console.log(er);
        return res.status(204).send('No Content');
    }

    //Search for any users with the same username or email
    try {
        const db = client.db();
        const results = await
            db.collection('Users').find({ UserName: username }).toArray();
        var id = -1;
        var fn = '';
        var ln = '';
        if (results.length > 0) {
            return res.status(409).json('Account with provided username already exists');
        }
        results = await
            db.collection('Users').find({ Email: email }).toArray();
        if (results.length > 0) {
            return res.status(409).json('Account with provided email already exists');
        }
    }
    catch (e) {
        return res.status(500).send('Server Error');
    }

    const newUser = { UserName: username, DisplayName: displayName, Password: password, GoogleID: googleID, Email: email };
    //Create user in database & return UserID
    try {
        const db = client.db();
        const result = db.collection('Users').insertOne(newUser);
        return res.status(200).send(result);
    }
    catch (e) {
        error = e.toString();
        return res.status(500).send('Server error');
    }
});

//GetProfile
app.post('/api/getProfile', async(req, res, next) =>{
    
})




//UpdateProfile





//DeleteProfile




//Search Profile






//Search Tag





//CreateTag





//Get Macros





//Create Recipe





//Update Recipe



//Delete Recipe





//Generate PDF



