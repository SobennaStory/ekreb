import './App.css'
import Title from './components/Title'
import Game from './components/Game'
import Background from './components/Background'

function App() {  


  return (
    <>
      <Title/>
      <Game/>
      <Background />

      
      
      <div>
        <a href="https://www.merriam-webster.com/" target="_blank">
          <img src={"https://www.pngall.com/wp-content/uploads/4/Businessman-Thinking-PNG.png"} className="logo" alt="ekreb logo" />
        </a>
        <a href="https://www.oed.com/" target="_blank">
          <img src={"https://media.tenor.com/uyL9b2u5zKEAAAAM/dictionary-homer-simpson.gif"} className="logo react" alt="ekreb logo2" />
        </a>
      </div>
      <h1>The rules are simple:</h1>
      <div className="card">
        <p>
          Guess the word, get 100 points. Take too long, lose 20 points. You can get a hint for 30 points. <br></br>
          Try to get as high as you can. Get to 1000 points for a little celebration.
        </p>
      </div>
    </>
  )
}

export default App
