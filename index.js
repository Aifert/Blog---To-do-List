import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

const activityURL = "https://www.boredapi.com/api/"
const quoteURL = "https://www.zenquotes.io/api/"
const cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/"
var prompt_arr = [];
var id = 1;
var index = 0;
// var quote = "";

function initPrompt(id, message){
    this.id = id;
    this.message = message;
}

function addPrompt(message){
    var prompt = new initPrompt(id, message);
    id ++;
    prompt_arr.push(prompt);
}

function searchAndDelete(promptId){
    for(var i = 0; i < prompt_arr.length; i++){
        if(prompt_arr[i].id == promptId){
            prompt_arr.splice(i, 1);
        }
    }
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", async (req, res) => {
    res.render("index.ejs", {
        Heading : "",
        Content : ""
    });
})

app.get("/get-quote", async (req,res) => {
    try{
        var quote = "";
        const response = await axios.get(quoteURL + "random");
        var last3 = (response.data[0].a).slice(-3);
        if(last3 === ".io"){
            quote = "Be Happy - Me"
        }
        else{
            quote = `${response.data[0].q} - ${response.data[0].a}`;
        }
        res.render("index.ejs", {
            Heading : "Quote",
            Content : quote
        })
        prompt_arr = [];
    }
    catch(error){
        res.render("index.ejs", {
            Heading : "Invalid function",
            Content : "Try again later please"
        })
    }
}) 

app.get("/get-activity", async (req, res) => {
    try{
        const response = await axios.get(activityURL + "activity/");
        var activity = `${response.data.activity} - ${response.data.participants} participants`
        res.render("index.ejs", {
            Heading : "Activity",
            Content : activity
        })
    }
    catch(error){
        res.render("index.ejs", {
            Heading : "Invalid function",
            Content : "Try again later please"
        })
    }
})


app.get("/get-Cocktail", async (req, res) => {
    try{
        const response = await axios.get(cocktailURL + "random.php");
        var cocktail = `${response.data.drinks[0].strDrink} - ${response.data.drinks[0].strAlcoholic} drink served in ${response.data.drinks[0].strGlass}`;
        res.render("index.ejs", {
            Heading : "Cocktail",
            Content : cocktail
        })
    }
    catch(error){
        res.render("index.ejs", {
            Heading : "Invalid function",
            Content : "Try again later please"
        })
    }
})
app.post("/submit", (req,res) => {
    const message = req.body["prompt"];
    if(message && message.trim() !== ""){
        addPrompt(message);
        res.redirect("/result");
    }
    else{
        res.redirect("/");
    }
})

app.post("/delete", (req, res) => {
    searchAndDelete(req.body.promptId);
    if(req.body["length"] - 1  === 0){
        res.redirect("/");
    }
    else{
        res.redirect("/result");
    }
})

app.get("/result", (req, res) => {
    // Render the result page
    res.render("index.ejs", {
        listOfItems : prompt_arr,
        promptValue : "",
    });
});

app.listen(port, () => {
    console.log(`Port successfully started at ${3000}`);
})

