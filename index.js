const express=require("express");
const fs=require("fs");

const mongoose = require("mongoose");
const { type } = require("os");
const app=express();
const port=8000;

mongoose
.connect("mongodb://127.0.0.1:27017/app-1")
.then(()=> console.log("Mongodb Connected"))
.catch(err => console.log("mongo error"));
const userSchema= new mongoose.Schema({
  firstName:{
    type: String,
    required: true,
  },
  lastName:{
    type: String,
  },
  email:{
    type:String,
    required: true,
    unique: true,
  },
  jobTitle:{
    type: String,
  },
  gender:{
    type:String,
  },

 });
 
const User= mongoose.model("user", userSchema);



app.use(express.urlencoded({extended:false}));
app.use((req,res,next)=>{
    fs.appendFile(
        "log.txt",
        `\n${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`, (err,data)=>{
            next();
        }
    );
});

app.get("/users",async (req,res)=>{
  const allDbUsers =await User.find({});
    const html=
    `
    <ul>
    ${allDbUsers.map(user => `<li>${user.firstName} - ${user.email} </li>`).join("")}
    </ul>
    `;
     return res.send(html);
  
  });

  //REST API

app.get("/api/users", async(req,res)=>{
  const allDbUsers =await User.find({});
 
 return res.json(allDbUsers);
});

app. //routing
route("/api/users/:id") 
.get(async (req,res)=>{
   const user= await User.findById(req.params.id);
    if(!user) return res.status(404).json({error: "user not found"}); 
    return res.json(user);
})
.patch(async(req,res)=>{
  await User.findByIdAndUpdate(req.params.id, {lastName:"changed"});
    return res.json({status:"success"});
})
.delete(async (req,res)=>{
  await User.findByIdAndDelete(req.params.id);
    return res.json({status:"success"});
}); 

app.post("/api/users", async(req,res)=>{
    
    const body=req.body;
    if(
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ) {
        return res.status(400).json({msg : "All fields are req..."});
    }
   const result= await User.create({ 
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      jobTitle : body.job_title, 
      gender:body.gender,
    });

    return res.status(201).json({
        status: "success"
    });
   
});



app.listen(port, ()=> console.log(`server started at ${port}`));
 