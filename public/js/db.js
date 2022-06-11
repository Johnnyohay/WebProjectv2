const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env' })
const { MONGO_DB_NAME, MONGO_URL_CON_DB } = process.env
const { MongoClient } = require('mongodb')
const client = new MongoClient(MONGO_URL_CON_DB)

//Generic function for DB connection
async function connectDB (){
	console.log("Connecting to DB...")
	await client.connect()
	var dbo = client.db(MONGO_DB_NAME)
	if (!dbo) {
		console.error(`DB Not Found! Failed to Connect`)
		process.exit(2)
	}
	console.log("Connected Successfully to DB!")
	return await dbo;
}

//Generic function for DB disconnect
async function disconnectDB (){
	
	try{
		await client.close()
		console.log("Disconnected from DB!")
	}
	catch(e){
		console.log("Error has occurred: Failed closing DB connection")
		throw e
	}
}

//----------------------------------------
//-------------- DB Actions --------------
//----------------------------------------
//Add a user to the Database
const createUser = async function (username, password) {
	console.log("Trying to add a user...")
	const db = await connectDB()
	var myobj = { username: username, password: password }
	try{
		const collectionUsers = db.collection("Users")

		const allUsers = collectionUsers.find();
		let exist = false
		// Execute the each command, triggers for each document
		await allUsers.forEach(function(user) {
			
			// If the user already exist then do nothing else add
			if(user.username == username && !exist) {
				console.log("User already exists ");
				exist = true
				return
			}
		})
		// Add the user if doesn't exist
		if(!exist){
			const result = await collectionUsers.insertOne(myobj)
			console.log(`User: ${username} added`)
		}
	}
	catch(e){
		console.log('Failed to add user')
		disconnectDB()
		throw e
	}
	finally{
	disconnectDB()
	}
}

module.exports = { createUser,  connectDB }
// module.exports = { connectDB }

