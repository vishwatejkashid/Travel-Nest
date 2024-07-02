const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js");
const listing = require("../modules/listing.js")
const {isLoggedIn} = require("../middleware.js") // add were changes available only when logged in  

const validateListing = (req,res,next)=>{
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

//Index Route
router.get("/",wrapAsync(async(req,res)=>{
    let allListings = await listing.find({});
    res.render("./listing/list.ejs",{ allListings});
}))

//New Route
router.get("/new", isLoggedIn ,  (req,res)=>{
    
    res.render("listing/new.ejs")
})

//Info Route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let list = await listing.findById(id).populate("reviews");
     if(!list){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listing");
     }
    res.render("listing/info.ejs", { list });
}))

//Create Route
router.post("/",isLoggedIn ,validateListing ,wrapAsync(async(req,res,next)=>{
        let newLists = new listing(req.body.list);
        await newLists.save();
        req.flash("success","New listing Created!")
        res.redirect("/listing");
}))

//Edit Route
router.get("/:id/edit",isLoggedIn ,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let lists = await listing.findById(id);
    if(!lists){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listing");
     }
    res.render("listing/edit.ejs", { lists })
}))

//Update Route
router.put("/:id", isLoggedIn ,validateListing ,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.list });
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);  
}));

//Delete Route
router.delete("/:id",isLoggedIn , wrapAsync(async (req,res)=>{
    let { id } = req.params;
    let deleted_list = await listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
    
 }))

 module.exports = router;