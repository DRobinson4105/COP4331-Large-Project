import dotenv from 'dotenv';
//const express = require('express');//Enables express
//const bodyParser = require('body-parser');//Body parser for incoming request. May not be needed
//const cors = require('cors');//Enables CORS secuirty handleing 
//const path = require('path');

dotenv.config({ path: '../../.env' })

import express from 'express';
import { MongoClient , ObjectId } from 'mongodb';
const PORT = process.env.VITE_PORT || 3000;
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

//Connect to database
const client = new MongoClient(process.env.DATABASE_URL);
// const prisma = new PrismaClient(process.env.DATABASE_URL)

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.set('port', PORT)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  )
  next()
})

app.get('/', (req, res) => {
  res.send('Server Is Ready')
})

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT + '\n');
  // console.log('Database_URL: ' + process.env.DATABASE_URL + '\n');
})

app.use(express.json())

//API Calls***************************************************************************************
//Login
//Login
app.get('/status', async (req, res, next) => {
  return res.status(200).send('Server is On\n')
})

app.post('/api/login', async (req, res, next) => {
  // incoming: username, password
  // outgoing: id, error
  var error = ''
  const { username, password, email, googleID } = req.body
  const input = req.body

  //If any missing, return 204
  if (
    (username == null && email == null) ||
    (googleID == null && password == null)
  ) {
    const er = { error: 'No Content' }
    console.log(er)
    return res.status(204).json(er)
  }
  //Search database for users with username and password. If so, return UserID
  try {
    await client.connect()
    const db = client.db('COP4331LargeProjectDatabase');
    const collection = db.collection('account');
    const cursor = collection.find({username:username, password:password});
    // const cursor = collection.find({});
    const result = await cursor.toArray();

    if (result.length > 0) {
      const id = result[0]._id
      var ret = { UserID: id, error: '' }
      return res.status(200).json(ret)
    }
  } finally {
    await client.close()
  }
  return res.status(409).send('Username or Password Wrong')
})

//Signup
app.post('/api/signup', async (req, res, next) => {
  //Create user in database & return UserID
  // try {
  //     const db = client.db();
  //     const result = db.collection('Users').insertOne(newUser);
  //     return res.status(200).send(result);

  //     await prisma.account.create({
  //         data:{
  //             email: email,
  //             name: displayName,
  //             username: username,
  //             password: password,
  //             googleId: googleID,
  //             image: profilePic,
  //             desc: description
  //         }
  //     })
  // }
  // catch (e) {
  //     error = e.toString();
  //     return res.status(500).send('Server error');
  // }

  //incoming username, display name, password, googleID, email
  const { username, display_name, password, googleID, email } = req.body
  const input = req.body

  //If any missing, return 204
  if (
    username == null ||
    display_name == null ||
    password == null ||
    googleID == null ||
    email == null
  ) {
    const er = { error: 'No Content' }
    console.log(er)
    return res.status(204).send('No Content')
  }

  const newUser = {
    username: username,
    display_name: display_name,
    password: password,
    email: email
  }

  try {
    await client.connect()

    const db = client.db('COP4331LargeProjectDatabase')
    const collection = db.collection('account')
    const cursor = collection.find({username:username})
    const result = await cursor.toArray()
    if (result.length > 0) {
      return res.status(409).json('Account Exists')
    }
  } finally {
    await client.close()
  }

  try {
    await client.connect()
    const db = client.db('COP4331LargeProjectDatabase')
    const collection = db.collection('account')
   
    const result = await collection.insertOne(newUser)
    const id = result.insertedId
    console.log(id)
    var ret = { UserID: id, error: '' }
    return res.status(200).json(ret)
  } finally {
    client.close()
  }
})

// //GetProfile
app.post('/api/getProfile', async(req, res, next) =>{
   
    var error = ''
  const { userId } = req.body
  const input = req.body

  //If any missing, return 204
  if (userId == null) {
    const er = { error: 'No Content' }
    console.log(er)
    return res.status(204).json(er)
  }
  //Search database for users with username and password. If so, return UserID
  try {
    await client.connect()
    const db = client.db('COP4331LargeProjectDatabase');
    const collection = db.collection('account');
    var tempId = new ObjectId(userId);
    const cursor = collection.find({_id:tempId});
    //const cursor = collection.find({});
    const result = await cursor.toArray();

    if (result.length > 0) {
      var ret = {   
                name: result[0].name, 
                desc: result[0].desc,
                image: result[0].image,
                username: result[0].username,
                recipesId: result[0].recipesId,
                filterId: result[0].filterId,
                }
      return res.status(200).json(ret)
    }
  } finally {
    await client.close()
  }
  return res.status(409).send('Username or Password Wrong')
})


// //UpdateProfile
app.post('/api/updateProfile', async(req, res, next) =>{
   
    var error = ''
  const { userId, username, name, image, desc } = req.body
  const input = req.body

  //If any missing, return 204
  if (userId == null) {
    const er = { error: 'No ID' }
    console.log(er)
    return res.status(204).json(er)
  }
  //Search database for users with username and password. If so, return UserID
  try {
    await client.connect()
    const db = client.db('COP4331LargeProjectDatabase');
    const collection = db.collection('account');
    var tempId = new ObjectId(userId);
    const cursor = collection.update({_id:tempId}, );
    //const cursor = collection.find({});
    const result = await cursor.toArray();

    if (result.length > 0) {
      var ret = {   
                name: result[0].name, 
                desc: result[0].desc,
                image: result[0].image,
                username: result[0].username,
                recipesId: result[0].recipesId,
                filterId: result[0].filterId,
                }
      return res.status(200).json(ret)
    }
  } finally {
    await client.close()
  }
  return res.status(409).send('Username or Password Wrong')
})

// //DeleteProfile

// //Search Profile

// //Search Tag

// //CreateTag

// //Get Macros

// //Create Recipe

// //Update Recipe

// //Delete Recipe

// //Generate PDF
