const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js");
const listing = require("../modules/listing.js")

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
router.get("/new" ,(req,res)=>{
    res.render("listing/new.ejs")
})

//Info Route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    let list = await listing.findById(id).populate("reviews");
    res.render("listing/info.ejs", { list });
}))

//Create Route
router.post("/", validateListing ,wrapAsync(async(req,res,next)=>{
        
        let newLists = new listing(req.body.list);
        await newLists.save();
        console.log(newLists);
        res.redirect("/listing");
}))

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let lists = await listing.findById(id);
    res.render("listing/edit.ejs", { lists })
}))

//Update Route
router.put("/:id", validateListing ,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/listing/${id}`);  
}));

//Delete Route
router.delete("/:id" ,wrapAsync(async (req,res)=>{
    let { id } = req.params;
    let deleted_list = await listing.findByIdAndDelete(id)
    console.log(deleted_list);
    res.redirect("/listing");
    
 }))

 module.exports = router;