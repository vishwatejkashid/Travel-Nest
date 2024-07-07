if(process.env.NODE_ENV !="production"){ 
    //ensure the private info in env does not get used when we deploy the project 
    require('dotenv').config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./modules/user.js")

const listingRoute= require("./routes/listing.js")
const reviewRoute = require("./routes/review.js")
const UserRoute = require("./routes/user.js")

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

const sessionOptions = {
    secret : "mysupersecretcode" ,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 3 * 24 * 60 * 60 * 1000,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly : true
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demoUser",async(req,res,)=>{
    let fakeUser = new User ({
        email : "abc@gmail.com",
        username : "Abc",
    });
    let newUser = await User.register(fakeUser,"Abc@1234");
    res.send(newUser);
})

app.use("/listing" , listingRoute)
app.use("/listing/:id/reviews" , reviewRoute)
app.use("/",UserRoute)

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

// app.get("/",(req,res)=>{
//     res.send("Server is working");
// })

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