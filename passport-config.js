const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser=(email, password, done)=>{
        const user = getUserByEmail(email)
        if(user == null){
            return done(null, false, {message: "No user with that email"}) //null is for error
        }
        try{
            if(bcrypt.compareSync(password, user.password)){
                return done(null,user) //returning user if pwd correct
            }
            else{
                return done(null, false, {message: "Incorrect Password"})
            }
        }catch(e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))

    passport.serializeUser((user, done)=>{done(null, user.id)})
    passport.deserializeUser((id, done)=>{return done(null, getUserById(id))})
}

module.exports = initialize