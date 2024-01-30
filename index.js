import express from 'express';
import bodyParser from "body-parser";

const app = express();
const port = 3000;


let posts = new Map();//create list of posts that can then be rendered in the ejs file
let times = new Array();//create ordered list of timestamps so we can display the individual blogs in order.
let editing = "";



app.use(bodyParser.urlencoded({extended: true}));//parses user requests

app.use(express.static("public"));//locates the static files

app.get("/",(req,res,next)=>{
    console.log(posts.length);  
    res.render("index.ejs");
    next();
})

app.post("/",(req,res,next)=>{
    if(!req.body["content"]){res.render("index.ejs",{posts: posts, times: times, hide: editing})};
    if(req.body["content"]){
        

        var time = new Date();
        var title = req.body["name"];
        var content = req.body["content"];

        

        posts.set(time.toUTCString(), [content, title]);
        times.unshift(time.toUTCString());

        
        res.render("index.ejs",{
            posts: posts,
            times: times,
            hide: editing
        });

        
    }
    if(req.body["deletePost"]){

        let deleteRequest = String(req.body["deletePost"]);
        posts.delete(deleteRequest);
        times.splice(times.indexOf(deleteRequest),1)

        res.render("index.ejs",{
            posts: posts,
            times: times,
            hide: editing
        });
    }
    if(req.body["editPost"]){
        let editRequest = String(req.body["editPost"]);
        editing = "hide";

        res.render("index.ejs",{
            posts: posts,
            editRequest: editRequest,
            times: times,
            hide: editing
        });
    }
    if(req.body["editContent"]){
        var editedContent = req.body["editContent"];
        var title = req.body["editName"];
        editing = "";
 
        posts.set(req.body["editTime"], [editedContent, title]);

        console.log(req.body["  editTime"]);

        res.render("index.ejs",{
            posts: posts,
            times: times,
            hide: editing
        });
        
    }
    
    next();
});




app.listen(port, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", port);
})