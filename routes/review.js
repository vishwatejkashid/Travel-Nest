const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")

const {validateReview, isLoggedIn, isReviewOwner} = require("../middleware.js")
const reviewController = require("../controllers/review.js")

//Review Route 
router.post("/",isLoggedIn, validateReview , wrapAsync(reviewController.newReview));

//Delete Route
router.delete("/:reviewId",isLoggedIn ,isReviewOwner ,wrapAsync(reviewController.deleteReview));

module.exports = router;