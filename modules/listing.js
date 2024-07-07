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
        url : String,
        filename : String,
    },

    price: Number,          
    location: String,
    country: String,
    type : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        } 
    ],
    owner : 
        {
            type: Schema.Types.ObjectId,
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