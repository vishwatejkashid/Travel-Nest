const express = require("express");
const router = express.Router();
const User = require("../modules/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let{username,email,password} = req.body;
    let newUser = new User({email , username })
    let user = await User.register(newUser,password)
    req.flash("success","Welcome to Homepage")
    res.redirect("/listing")
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login",passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash : true,
}) 
,(req,res)=>{
    req.flash("success","Welcome to TravelNest")
    res.redirect("/listing")
});

module.exports = router;