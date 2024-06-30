const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js");
const Review = require("../modules/review.js")
const listing = require("../modules/listing.js")

const validateReview = (req,res,next)=>{
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

//Review Route 
router.post("/", validateReview , wrapAsync(async(req,res)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    list.reviews.push(newReview);
    await newReview.save();
    await list.save();

    res.redirect(`/listing/${list._id}`);
}));

//Delete Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{ $pull : {reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}));

module.exports = router;