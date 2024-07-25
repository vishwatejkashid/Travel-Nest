const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn , validateListing , isOwner} = require("../middleware.js") // add were changes available only when logged in  
const listingController = require("../controllers/listing")
const multer = require('multer');
const {storage} = require("../CloudConfig.js")
const upload = multer({storage})

//Index Route //Create Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn ,
        upload.single("list[img]") , 
        validateListing ,
        wrapAsync(listingController.createListing,
    ))

router.get("/search", wrapAsync(listingController.searchListings));

//New Route
router.get("/new", isLoggedIn , listingController.newListing )

//Info Route //Update Route //Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.infoListing))
    .put(isLoggedIn ,isOwner ,upload.single("list[img]"),validateListing ,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn ,isOwner ,wrapAsync(listingController.destroyListing))

//Edit Route
router.get("/:id/edit", isLoggedIn , isOwner ,wrapAsync(listingController.editListing))

module.exports = router;