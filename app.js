const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const Review = require("./modules/review.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

let MongoURL = "mongodb://127.0.0.1:27017/travelNest";

main()
    .then(()=>{
        console.log("Connected Succesfully");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(MongoURL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json())
app.engine("ejs",ejsMate);

app.use("/listing" , listings)
app.use("/listing/:id/reviews" , reviews)


    // console.log("New Review Saved");
    // res.send("New Review Saved");
// app.get("/testing", (req,res)=>{
//     let sampleTest = new listing({
//         title: "My New Villa",
//         description : "by the beach",
//         price: 2000,
//         location : "Calangute Goa",
//         country : "India"
//     })

//     sampleTest.save();
//     console.log("Sample was saved");
//     res.send("Successful Test");
// })

app.get("/",(req,res)=>{
    res.send("Server is working");
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})

app.use((err,req,res,next)=>{
    let{statusCode=500 , message="something went wrong"} = err;
    res.status(statusCode).render("listing/error.ejs",{message});
})

app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
})