const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const dictKey = '7d0b57cd-6a2f-4399-bc89-e546c08bd671';
const dictUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'; //dictionary isnt free though.
const wordUrl = "https://random-word-api.herokuapp.com/"; //free words
const PORT = 3000; 

app.use(cors());

let score = 0;
let randomWord = ""

function maskWord(word) {
    //Changes random letters in a passed word with an underscore _
    const characters = word.split('');
    const maskCount = Math.floor(characters.length / 2);

    for (let i = 0; i < maskCount; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        characters[randomIndex] = '_';
    }

    const maskedWord = characters.join('');
    return maskedWord;
}


app.get('/word?', async (req, res) => {
    try {
        //Make an API request to the free API for a random word.
        const response = await axios.get(`${wordUrl}word`);
        randomWord = response.data[0];
        res.json({ word: randomWord });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the random word.' });
    }
});

app.get('/score', (req, res) => {
    //Send the score to the frontend
    res.send(`${score}`);
});

app.patch('/score', (req, res) => {
    //Make a query for the passed-in value. Increments score.
    score += parseInt(req.query.val);
    res.status(200).send(`${score}`);
});

app.patch('/resetscore', (req, res) => {
    //Resets score to 0.
    score = 0;
    res.status(200).send(`${score}`);
});

app.patch('/guessWord', (req, res) => {
    //Make a query for the passed-in word.
    const guess = req.query.word

    //Compares guess to the random word.
    if (guess === randomWord) {
        res.status(200).send('true');
    } else {
        res.status(200).send('false');
        console.log(`Word is ${randomWord}`);
    }
});

app.get('/definition', async (req, res) => {
    const word = randomWord;

    try {
        // Make an API request to get the definition for the randomly generated word. Key is
        // put in a header soas not to expose key.

        const response = await axios.get(`${dictUrl}${word}?key=${dictKey}`);


        // Retrieving first element(word) in array and querying shortdef
        const definition = response.data[0]?.shortdef?.[0];
        
        const maskedWord = maskWord(word);
        if (definition) {
            // If definition is found, send it along with a "found" flag
            res.status(200).json({ word, definition, mask: maskedWord, found: true });
        } else {
            // If definition is found, send a false flag
            
            res.status(200).json({
                mask: maskedWord,
                definition: `Sorry... the silly developer can't account for every word, and this one doesn't have a definition. Instead, here's another hint: ${maskedWord}`,
                found: false,
            });
        }
    } catch (error) {
        console.error('Error fetching definition:', error);
        res.status(500).json({ error: 'Error fetching definition.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});