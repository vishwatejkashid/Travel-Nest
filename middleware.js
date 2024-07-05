const ExpressError = require("./utils/ExpressError.js")
const { listingSchema , reviewSchema } = require("./schema.js");
const listing = require("./modules/listing.js");
const Review = require("./modules/review.js");

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

module.exports.validateListing = (req,res,next)=>{
  // console.log(req.body); //checks what body actually contains
  let result = listingSchema.validate(req.body);
  if(result.error){
      let errMsg = result.error.details.map((el)=>el.message).join(",");
      //maps multiple message and join with ","
      throw new ExpressError(400 , errMsg);
  }else{
     next();
  }
}

module.exports.validateReview = (req,res,next)=>{
  //  console.log(req.body); //checks what body actually contains
   let {error} = reviewSchema.validate(req.body);
  //  console.log(error)
   if(error){
       let errMsg = error.details.map((el)=>el.message).join(",");
       //maps multiple message and join with ","
       throw new ExpressError(400 , errMsg);
   }else{
      next();
   }
}

module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params;
  let list = await listing.findById(id);
  if(!list.owner.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission to do the action");
    return res.redirect(`/listing/${id}`);  
  }
next();
}

module.exports.isReviewOwner = async(req,res,next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission to do the action");
    return res.redirect(`/listing/${id}`);  
  }
next();
}