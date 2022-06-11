const LocalStrategy = require('passport-local').Strategy
const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env'})
var dbName =  process.env.MONGO_DB_NAME;
var MongoDB = require( './db');

function initialize(passport) {
    console.log("Here 1")

  const authenticateUser = async (username, password, done) => {
    console.log("Here 1.5" + username)
    return MongoDB.connectDB().then(async (db) => {
        // if (err) throw err;
        // Load db & collections
        // var db = MongoDB.getDB();
        // db = db.db(dbName);
        return db.collection("Users").findOne({username : username});
      }).then( isUser => {
    // console.log(isUser);
    console.log(isUser.password, isUser.username);
    console.log(username, password);
    if(isUser == null || isUser == undefined) {
        console.log("Here 3")
      return done(null, false, { message: 'No user with that username' })
    }

    try {
      if (isUser.password == password) {
        console.log("Here 6")
        return done(null, isUser)
      } else {
        console.log("Here 7")
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  });
 
  }
  // console.log("Here 8")
  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  // //In serialize user we decide what to store in the session. Here we're storing the user id only.
  // passport.serializeUser((isUser, done) => done(null, isUser.username))
  // //Here we retrieve all the info of the user from the session using the user id stored in the session earlier using serialize user.
  // passport.deserializeUser((id,done) => {
  //   return done(null, isUser.username)
  // })
}

module.exports = initialize