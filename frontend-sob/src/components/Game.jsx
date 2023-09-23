import { useState, useEffect, useRef } from 'react';
import { Input, Button, notification } from "antd";
import axios from 'axios';
import { FrownOutlined, SmileTwoTone, QuestionCircleOutlined} from '@ant-design/icons'
import PointsChange from './PointsChange';
import { triggerConfetti } from './Confetti';

//Randomizing Function
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function Game () {

    //Variables
    const [changedWord, setChangedWord] = useState("");
    const [word, setWord] = useState("hello");
    const [guess, setGuess] = useState("");
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);  
    const [pointChanges, setPointChanges] = useState([]);
    const [timeLeft, setTimeLeft] = useState(60); 
    const [isActive, setIsActive] = useState(true); // Use this to control if the timer should be running


    const guessTime = 60;

    //Tooltips
    var tooltips = ["...Don't tell the dev I told you this, but when you guess wrong the answer is in the terminal",
                    "Well done!", 
                    "You're so smart.", 
                    "Have you played Baldur's Gate?", 
                    "All my homies love change++",
                    "These words are really hard, huh..", 
                    "Yo whoever made that guess is super cool", 
                    "Have you ever seen a notification gain self awareness?😣",
                    "[Insert Encouragement]", 
                    "Have you played Baldur's Gate?",
                    "👌 Holy Smokes.",
                    "I'm blown away. Take 100.",
                    "💯💯💯💯",
                    "Terraria is better than Minecraft. Here's another word.",
                    "Dont give up",
                    "Reach for the stars",
                    "Cava is goated, trust",
                    "🚨🚨We got a know it all over here🚨🚨",
                    "The harder you try, the better the impression you set on the people around you. - Tom Holland apparently."];

    //Scrambling in frontend
    function ekreb(word) {


        const characters = word.split('');
        
        // Shuffle the characters randomly
        for (let i = characters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [characters[i], characters[j]] = [characters[j], characters[i]];
        }

        const scrambledWord = characters.join('');        
        return scrambledWord;
    }

    //Skip word. For the weak.
    const skipWord = () => {
      notification.info({
        message: "Succesfully skipped.",
        description: `The answer was: ${word}. Skippers shall be punished...`,
        placement: "bottomLeft",
        duration: 3,
        icon: <FrownOutlined/>
      });

      getNewWord();            // Fetch a new word
      setShowHint(false);      // Hide the hint
      setGuess("");            // Clear the guess
      setIsActive(true);       // Restart the timer
      setTimeLeft(guessTime);  // Reset the timer back to its initial value
      incrementScore(-5);    

    };

    //Reset game. For the bad.
    const resetGame = () => {
      getNewWord();               // Get a new word
      setShowHint(false);         // Hide the hint
      setGuess("");               // Clear the guess
      setIsActive(true);          // Restart the timer
      setTimeLeft(guessTime);     // Reset the timer back to its initial value
      setPointChanges([]);        // Clear any point changes animations
      resetScore();                
    };

    //Grabs the current score
    const getScore = () => {
        axios
          .get('http://localhost:3000/score')
          .then((response) => {
            setScore(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
    };

    //Resets the score to 0
    const resetScore = () => {
      axios
        .patch('http://localhost:3000/resetscore')
        .then((response) => {
          setScore(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };

    //Add a pointchange object to the array
    const addPointChange = (value, count) => {
        const changes = Array.from({ length: count }, () => ({
          value,
          onAnimationEnd: () => {
            // Remove the point change when the animation ends
            setPointChanges((prevPointChanges) =>
              prevPointChanges.filter((_, index) => index !== 0)
            );
          },
          left: getRandomNumber(0, window.innerWidth - 40),
          bottom: getRandomNumber(10, 100),
        }));
    
        setPointChanges((prevPointChanges) => [...prevPointChanges, ...changes]);
      };

      const onAnimationEnd = (index) => {
        setPointChanges((prevPointChanges) =>
          prevPointChanges.filter((_, i) => i !== index)
        );
      };

    //Increment the score by calling backend
    const incrementScore = (value) => {
        axios
          .patch(`http://localhost:3000/score?val=${value}`)
          .then(() => {
            getScore(); 

            addPointChange(value, getRandomNumber(1, 5));

          })
          .catch((error) => {
            console.log(error);
          });
    };

    //If definition exists, it is the hint. If not, the word partially masked is the hint.
    const handleHint = () => {
        incrementScore(-30);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/definition`,
            headers: { }
        };

        axios.request(config)
        .then((response) => {
            const def = response.data.definition;
            
            notification.open({
            message: "Hint",
            description: def,
            placement: "bottomLeft",
            duration: 0, // Set duration to 0 to keep the notification open
            icon: <QuestionCircleOutlined />,
            onClose: () => notification.destroy('hint'), 
            key: 'hint', 
            btn: (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => notification.destroy('hint')} 
                >
                    Close
                </Button>
            ),
        });
        })
        .catch((error) => {
            console.log(error);
        });

    } 

    //On submit, if kagura bachi is passed, instant win. If guess is correct get points. If not, lose points.
    const handleSubmit = () => {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/guessWord?word=${guess}`,
            headers: { }
          };
          
        axios.request(config)
        .then((response) => {
        if (guess === "kagurabachi") {
            setScore(10000);
            setGuess("");  
            notification.success({
              message: "Filthy Cheater.",
              description: "I have no words for you.",
              placement: "bottomRight",
              duration: 2,
              icon: <SmileTwoTone/>
          })
            return;  
        } else if(response.data === true){
            incrementScore(100);
            notification.success({
                message: "Good Guess.",
                description: tooltips[getRandomNumber(0, tooltips.length - 1)],
                placement: "bottomRight",
                duration: 2,
                icon: <SmileTwoTone/>
            })
            getNewWord();
            setShowHint(false);
        } else {
            setShowHint(true);
            notification.warning({
                message: "Bad Guess.",
                description: "Try again.",
                placement: "bottomRight",
                duration: 2,
                icon: <FrownOutlined style={{color: '#ff0000'}}/>
            })
        }
        setGuess("")
        })
        .catch((error) => {
        console.log(error);
        });
    }

    //Gets a new word.
    const getNewWord = () => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/word',
          headers: {},
        };
    
        axios.request(config)
          .then((response) => {
            setWord(response.data.word);
          })
          .catch((error) => {
            console.log(error);
          });
      };
    
      
    // Timer logic
    useEffect(() => {
      let timer;
      if (isActive && timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else if (timeLeft === 0) {

        notification.info({
          message: "Haha Time UP!",
          description: `The answer was: ${word}`,
          placement: "bottomLeft",
          duration: 3,
          icon: <FrownOutlined/>
        });

        incrementScore(-20); // Deduct points when time runs out 
        getNewWord();
        setIsActive(false);
      }
      
      return () => clearTimeout(timer); 
    }, [timeLeft, isActive]);
    
    //Effect functions

    // Update the timer's active status and reset the timer whenever a new word is fetched
    useEffect(() => {
      setIsActive(true);
      setTimeLeft(guessTime); // Reset to initial value
    }, [word]);
      
    useEffect(() => {
        // Grab word at beggining
        getNewWord();
        getScore();
      }, []);
      
    useEffect(() => {
        // Scrambles words
        setChangedWord(ekreb(word));
    }, [word]);

    //Celebration. Triggers when score changes.
    useEffect(() => {
      if (score >= 1000) {
          triggerConfetti();

          notification.open({
            message: "Congratulations!",
            description: "You reached 1000 points! 🎉",
            className: "rainbowNotification",  
            duration: 5,
        });

      }
    }, [score]);


    //Html
    return <div className="card">  
        <h2> Bet you can't guess this. Your word is {changedWord} </h2> 
        <div id="confetti" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></div>
        <Input size = 'large' placeholder="And so it begins..." 
            style={{zIndex: 2}}
            onChange={(input) => {setGuess(input.target.value);}}
            value={guess} 
            /> 
        <Button type = 'primary' style={{zIndex: 2}} onClick={handleSubmit}size = 'large' placeholder="Guess">Submit</Button>
        <Button type="default" style={{ zIndex: 2, marginLeft: '10px' }} onClick={skipWord}>Skip</Button>
        {showHint && (
            <Button type="dashed" style={{zIndex: 2}} onClick={handleHint} placeholder='Hint' icon={<QuestionCircleOutlined/>}>Hint..</Button>
        )}
        <PointsChange pointChanges={pointChanges} onAnimationEnd={onAnimationEnd}/>
        <Button type="secondary" style={{ zIndex: 2, marginLeft: '10px' }} onClick={resetGame}>Reset</Button>
        <p>Score = {score}</p>
        <p>Time's running out... {timeLeft} seconds left</p>
    </div>
}

export default Game;