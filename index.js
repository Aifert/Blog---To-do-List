import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

// const quotes = [
//     {
//       author: 'Nelson Mandela',
//       text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.'
//     },
//     {
//       author: 'Walt Disney',
//       text: 'The way to get started is to quit talking and begin doing.'
//     },
//     {
//       author: 'Steve Jobs',
//       text: 'Your time is limited, so don\'t waste it living someone else\'s life. Don\'t be trapped by dogma – which is living with the results of other people\'s thinking.'
//     },
//     {
//       author: 'Eleanor Roosevelt',
//       text: 'The future belongs to those who believe in the beauty of their dreams.'
//     },
//     {
//       author: 'Oprah Winfrey',
//       text: 'If you look at what you have in life, you\'ll always have more. If you look at what you don\'t have in life, you\'ll never have enough.'
//     },
//     {
//       author: 'James Cameron',
//       text: 'If you set your goals ridiculously high and it\'s a failure, you will fail above everyone else\'s success.'
//     },
//     {
//       author: 'John Lennon',
//       text: 'You may say I\'m a dreamer, but I\'m not the only one. I hope someday you\'ll join us. And the world will live as one.'
//     }
//   ];

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
    try{
        var quote = "";
        const response = await axios.get("https://zenquotes.io/api/random");
        var last3 = (response.data[0].a).slice(-3);
        if(last3 === ".io"){
            quote = "Be Happy - Me"
        }
        else{
            quote = `${response.data[0].q} - ${response.data[0].a}`;
        }
        res.render("index.ejs", {
            randomQuote : quote
        })
        prompt_arr = [];
    }
    catch(error){
        res.render("index.ejs", {
            randomQuote : error
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
        randomQuote : quote
    });
});

app.listen(port, () => {
    console.log(`Port successfully started at ${3000}`);
})

