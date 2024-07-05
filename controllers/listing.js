const listing = require("../modules/listing");

module.exports.index =async(req,res)=>{
    let allListings = await listing.find({});
    res.render("./listing/list.ejs",{ allListings});
}

module.exports.newListing = (req,res)=>{
    res.render("listing/new.ejs")
}

module.exports.infoListing = async (req,res)=>{
    let {id} = req.params;
    let list = await listing.findById(id).populate(
        {
            path:"reviews",
            populate: {
                path : "author"
            }
        }).populate("owner");
     if(!list){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listing");
     }
    res.render("listing/info.ejs", { list });
}

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newLists = new listing(req.body.list);
    newLists.owner = req.user._id;
    newLists.img = {url,filename}
    await newLists.save();
    console.log(newLists);
    req.flash("success","New listing Created!")
    res.redirect("/listing");
}

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    let lists = await listing.findById(id);
    if(!lists){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listing");
    }
    res.render("listing/edit.ejs", { lists  })
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let list = await listing.findByIdAndUpdate(id, { ...req.body.list });
    if(typeof req.file !=="undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        list.img = {url,filename}
        await list.save(); 
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let { id } = req.params;
    let deleted_list = await listing.findByIdAndDelete(id)
    console.log(deleted_list)
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
    
 }