const express = require("express");
const router = express.Router();
const User = require("../modules/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {RedirectUrl} = require("../middleware.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let{username,email,password} = req.body;
    let newUser = new User({email , username })
    let user = await User.register(newUser,password)
    req.login(user , (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Homepage")
        res.redirect("/listing")
    })         

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login",RedirectUrl, passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash : true,
}) 
,(req,res)=>{
    req.flash("success","Welcome to TravelNest");
    let redirect = res.locals.redirectUrl || "/listing"
    res.redirect(redirect)
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout successfully");
        res.redirect("/listing")
    })
})

module.exports = router;