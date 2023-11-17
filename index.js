import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const quotes = [
    {
      author: 'Nelson Mandela',
      text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.'
    },
    {
      author: 'Walt Disney',
      text: 'The way to get started is to quit talking and begin doing.'
    },
    {
      author: 'Steve Jobs',
      text: 'Your time is limited, so don\'t waste it living someone else\'s life. Don\'t be trapped by dogma – which is living with the results of other people\'s thinking.'
    },
    {
      author: 'Eleanor Roosevelt',
      text: 'The future belongs to those who believe in the beauty of their dreams.'
    },
    {
      author: 'Oprah Winfrey',
      text: 'If you look at what you have in life, you\'ll always have more. If you look at what you don\'t have in life, you\'ll never have enough.'
    },
    {
      author: 'James Cameron',
      text: 'If you set your goals ridiculously high and it\'s a failure, you will fail above everyone else\'s success.'
    },
    {
      author: 'John Lennon',
      text: 'You may say I\'m a dreamer, but I\'m not the only one. I hope someday you\'ll join us. And the world will live as one.'
    }
  ];
  

function generateQuote(){
    var index = (Math.floor(Math.random() * (quotes.length + 1)));
    const quote = (`${quotes[index].text} - ${quotes[index].author}`);
    return quote;
}

var prompt_arr = [];
const quote = generateQuote();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        randomQuote : quote
    });
    prompt_arr = [];
})

app.post("/submit", (req,res) => {
    const prompt = req.body["prompt"];
    if(prompt && prompt.trim() !== ""){
        prompt_arr.push(req.body["prompt"]);
    }
    res.redirect("/result");
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


