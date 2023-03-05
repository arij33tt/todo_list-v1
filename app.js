const express =require("express");

const bodyparser= require("body-parser");

const mongoose = require("mongoose");

const _= require("lodash");

const { application } = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))


// ?retryWrites=true&w=majority

mongoose.connect("mongodb+srv://arijeet:arijeet123@ejstodo.m2bzlqj.mongodb.net/toDoList", { useNewUrlParser: true, useUnifiedTopology: true });


const itemSchema = {
    name:String,
}

const Item = mongoose.model("Item",itemSchema);


const item1 = new Item({
    name:"Welcome to TO DO LIST"
})


const defaultItems=[item1];

const listSchema = {
    name:String,
    items:[itemSchema]
}

const List = mongoose.model("List",listSchema);




app.get("/",(req,res)=>{

    Item.find({},function(err,foundItems){

    if(foundItems===0){
        
        Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Many items stored ");
            }
        })

        res.redirect("/")
    }

    else{
       res.render("list",{ListTitle:"Today",newListItems:foundItems})
    }
    })
})


app.get("/:customListName", function(req,res){
    const customListName =  _.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,foundList){
        
        if(!err){
            if(!foundList){
                const list = new List ({
                    name:customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName)
            }
            else{
                res.render("list",{ListTitle:foundList.name,newListItems:foundList.items})
            } 
        }
       
    })


   
     
})

app.post("/",(req,res)=>{
    const itemName=req.body.newItem;
    const listName = req.body.list

    const item = new Item({
        name:itemName
    });
    

    if(listName==="Today"){
    item.save();
    

    res.redirect("/");
    }

    else{
        List.findOne({name:listName},function(err,foundList){
            if(!err){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
            }
        });
    }
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="Today"){

        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("delete item scuccesfully");
                res.redirect("/");
            }
           
        });
    }

    else{
        List.findOneAndUpdate({name: listName},{$pull: {items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }

});




app.listen(3000,()=>{
    console.log("To-Do-List working on port 3000")

})