const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: "https://images.unsplash.com/photo-1711635595664-8ca45f3e7971?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1711635595664-8ca45f3e7971?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    },

    price: Number,          
    location: String,
    country: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        } 
    ],
    owner : 
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref : "User",
        },
});

// listingSchema.post("findOneAndDelete",async(listing)=>{
//     if(listing){
//         await Review.deleteMany({ _id: {$in : listing.reviews}});
//     }
// })

listingSchema.post("findOneAndDelete", async(listings)=>{
    if(listings) {
        await Review.deleteMany({ _id : {$in : listings.reviews}});
    }
})

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;