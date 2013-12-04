exports.makeTab=function(req,res){
    res.render("tab.ejs",{id:req.params.id});
}