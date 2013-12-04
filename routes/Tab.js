exports.makeTab=function(req,res){
    res.render("tab.ejs",{name:req.params.name});
}