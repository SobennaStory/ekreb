import { useState, useEffect, useRef } from 'react';
import { Input, Button, notification } from "antd";
import axios from 'axios';
import { FrownOutlined, SmileTwoTone, QuestionCircleOutlined} from '@ant-design/icons'
import PointsChange from './PointsChange';
import { triggerConfetti } from './Confetti';

//For a later Sobenna to finish --- 
// Maybe make an array that cycles tooltips after succeful guesses.
// Particles maybe

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function Game () {

    const [changedWord, setChangedWord] = useState("");
    const [word, setWord] = useState("hello");
    const [guess, setGuess] = useState("");
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);  
    const [pointChanges, setPointChanges] = useState([]);
    const [timeLeft, setTimeLeft] = useState(60); // Initialize with whatever starting time you want (e.g., 60 seconds)
    const [isActive, setIsActive] = useState(true); // Use this to control if the timer should be running


    const guessTime = 60;

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
      incrementScore(-5);     // Deduct a small penalty for skipping (optional, adjust as needed)

    };

    const resetGame = () => {
      getNewWord();               // Get a new word
      setShowHint(false);         // Hide the hint
      setGuess("");               // Clear the guess
      setIsActive(true);          // Restart the timer
      setTimeLeft(guessTime);     // Reset the timer back to its initial value
      setPointChanges([]);        // Clear any point changes animations
      resetScore();                 // Get the current score (you can also reset the score here if you want)
    };

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
            onClose: () => notification.destroy('hint'), // Close the notification when needed
            key: 'hint', // Unique key to identify this notification
            btn: (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => notification.destroy('hint')} // Close the notification on button click
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

        incrementScore(-20); // Deduct points when time runs out (change value to your liking)
        getNewWord();
        setIsActive(false);
      }
      
      return () => clearTimeout(timer); // Clear the timeout to prevent potential memory leaks
    }, [timeLeft, isActive]);
    
    // Update the timer's active status and reset the timer whenever a new word is fetched
    useEffect(() => {
      setIsActive(true);
      setTimeLeft(guessTime); // Reset to initial value
    }, [word]);
      
      // ... Rest of your component logic ...
    useEffect(() => {
        // Fetch a random word when the component mounts (you can modify this behavior as needed)
        getNewWord();
        getScore();
      }, []);
      
    useEffect(() => {
        // Update the displayed scrambled word when the word changes
        setChangedWord(ekreb(word));
    }, [word]);

    useEffect(() => {
      if (score >= 1000) {
          triggerConfetti();

          notification.open({
            message: "Congratulations!",
            description: "You reached 1000 points! 🎉",
            className: "rainbowNotification",  // custom class for the animated background
            duration: 5,
        });

      }
    }, [score]);


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