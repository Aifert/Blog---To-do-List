import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Blog",
    password: "aifert",
    port: 5432,
  });

db.connect();
  
const app = express();
const port = 3000;

const activityURL = "https://www.boredapi.com/api/"
const quoteURL = "https://www.zenquotes.io/api/"
const cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/"
var prompt_arr = [];
var id = 1;
var index = 0;
let currentUserId = 1;
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

async function registerUser(username, password){
    try{
        await db.query("INSERT INTO users (name, password) VALUES ($1,$2)", [username, password]);
        return true;
    }
    catch(error){
        return false;
    }
}

async function verifyUser(inputUsername, inputPassword){
    const result = await db.query("SELECT * FROM users where name = ($1)", [inputUsername]);

    
    if(result.rows.length > 0){
        const data = result.rows[0];
        const password = data.password;
    
        if(inputPassword === password){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
   
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", async (req, res) => {
    res.render("front_page.ejs", {
        Heading : "Who are you?",
        color : "#776B5D"
    });
})

app.get("/home", (req, res) => {
    res.render("index.ejs", {
        Heading : "",
        Content : ""
    })
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


app.post("/verify", async (req , res) => {
    const advance_value = req.body.advance;
    const user_name = req.body.name;
    const user_password = req.body.password
    if(advance_value === "REGISTER"){
        if(await registerUser(user_name, user_password) === true){
            res.render("login.ejs", {
                Heading : "Success!",
                color : "#77dd77"
            })
        }
        else{
            res.render("front_page.ejs",{
                Heading : "Name taken, try another one!",
                color : "#ff6961"
            })
        }
    }
    else{
        if(await verifyUser(user_name, user_password) === true){
            res.redirect("/home");
        }
        else{
            res.render("front_page.ejs",{
                Heading : "Please try again...",
                color : "#ff6961"
            })
        }
    }
})

app.listen(port, () => {
    console.log(`Port successfully started at ${3000}`);
})

