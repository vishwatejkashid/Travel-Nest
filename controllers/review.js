const Review = require("../modules/review.js")
const listing = require("../modules/listing.js")

module.exports.newReview = async(req,res)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id ; 
    req.flash("success","New Review Created!");
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();

    res.redirect(`/listing/${list._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{ $pull : {reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
}