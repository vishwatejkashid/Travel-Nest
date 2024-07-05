const User = require("../modules/user.js");

module.exports.getSignUp = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postSignUp = async(req,res)=>{
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
    })}
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }   
}

module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.postLogin = async(req,res)=>{
    req.flash("success","Welcome to TravelNest");
    let redirect = res.locals.redirectUrl || "/listing"
    res.redirect(redirect)
}

module.exports.Logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout successfully");
        res.redirect("/listing")
    })
}