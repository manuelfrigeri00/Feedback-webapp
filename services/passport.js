const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys')

const User = mongoose.model('users')

passport.serializeUser((user, done)=> {
    done(null, user.id)
})

passport.deserializeUser((id, done)=> {
    User.findById(id)
    .then(user => {
        done(null, user)
    })
})


passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecrect,
    callbackURL: keys.callbackURL,
    proxy: true
},
async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id})
    if (existingUser)  {
        // we already have a record with the given profile ID
        return done(null, existingUser)
    }
        // no user record
        const user = await new User ({ googleId: profile.id}).save()
        done(null, user)
    
})
)


