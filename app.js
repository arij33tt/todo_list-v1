const express =require("express");

const bodyparser= require("body-parser");

const { application } = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))


var items=[];
var workList=[];
app.get("/",(req,res)=>{
const today= new Date();
// const weekend = today.getDay();



// if(weekend===6 || weekend===0){
//     day="Weekend !!";
//     // res.send("Its a weekend ....enjoy the day")
// }
// else{
//     day="Weekday"
//     // res.send("BOO! not a weekend ,you have to work !!!!!")
// }


const options ={
    weekday:"long",
    day:"numeric",
    month:"long"
};

const day = today.toLocaleDateString("en-US",options);
res.render("list",{ListTitle:day,newListItems:items})
})


app.post("/",(req,res)=>{
    const item=req.body.newItem
    items.push(item);
    res.redirect("/");
})


app.get("/work",(req,res)=>{
    res.render("list",{ListTitle:"Work List",newListItems:workList})
})

app.post("/work",(req,res)=>{
    let item = res.body.newItem;
    workList.push(item);
})

app.listen(3000,()=>{
    console.log("To-Do-List working on port 3000")

})