import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

var prompt_arr = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/submit", (req,res) => {
    prompt_arr.push(req.body["prompt"]);
    res.render("index.ejs", {
        listOfItems : prompt_arr
    })
})

app.listen(port, () => {
    console.log(`Port successfully started at ${3000}`);
})