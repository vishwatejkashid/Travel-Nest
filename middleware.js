module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;//req.originalUrl saves the path/Url before directing to login
    //saving it to res.session with name redirectUrl for all modules middlewares to use it in the session  
      req.flash("error","User must be logged in");
        return res.redirect("/login")
     }
    next();
}

module.exports.RedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl  = req.session.redirectUrl;
        //saving it to res.locals.redirectUrl because session get reset after very passport.authenticate is executed    
    }
    next();
}