// ---------------------------
// 1. Game setup
// ---------------------------

// constants
const DEFAULT_IMAGE = "001-face.png"
// @NOTE: your game must work for any size array!
const POSSIBLE_WORDS = ["TORONTO", "PARIS", "ROME", "MISSISSIPPI", "BURLINGTON"]; 
let trueLetters = [];
let falseLetters = [];
const MAX_CHANCES = 6
let remainingChances;
let selectedWordIndex;
let selectedWord;
let displayMessageElement = document.querySelector("#results");
let correctWordLength = 0;
let hangIndex;

// Save Game
const saveGame = function() {
    alert("SAVING THE GAME!");
    const gameInfo = {
      "selectedWord": selectedWord,
      "chancesRemaining": remainingChances
    };
    localStorage.setItem("game_info", JSON.stringify(gameInfo));
}

//Start Game
const startGame = function() {
  alert("STARTING THE GAME!");

  //register listner only after starting the game!
  document.querySelector(".letter-bank").addEventListener("click", letterClickAction);
  let currentWord = "";

  //Reset letter arrays
  trueLetters = [];
  falseLetters = [];

  //Reset hand and remaining chance index
  hangIndex = 1;
  remainingChances = 6;

  //Randomly select new word
  selectedWordIndex = Math.floor(Math.random() * POSSIBLE_WORDS.length);
  selectedWord = POSSIBLE_WORDS[selectedWordIndex];
  correctWordLength = selectedWord.length;

  //Reset to _ _ _ _
  document.querySelector("#debug-actual-word").innerText = `DEBUG: Selected word is: ${selectedWord}`;
  for(let i=0; i<selectedWord.length; i++){
    currentWord += "_ ";
  }

  //Reset image, max chance and word
  document.querySelector("#word").innerText = currentWord;
  document.querySelector(".chancesLabel").innerText = MAX_CHANCES;
  document.querySelector("#img-hangperson-status").src = `img/001-face.png`;
  document.querySelector("#results").innerText = "";

  //Remove msg
  displayMessageElement.classList.remove("message");

  //remove style from selected button
  const allLetterDivs = document.querySelectorAll(".letter");
  for(let i=0; i<allLetterDivs.length; i++){
    allLetterDivs[i].classList.remove("already-selected");
  }
}

//Handle Event on letter click
const letterClickAction = function(event){
    let updatedWord = "";
    let finalWord = "";
    let letterElement = event.target;

    //Only letter click will work outside div click is not allowed!
    if (letterElement.classList.contains("letter") === true) {
    
      let isLetterInWord = false;
      letterElement.classList.add("already-selected")
      for(let i=0; i<selectedWord.length; i++){
        if (selectedWord[i] === letterElement.innerText) {
          isLetterInWord=true;
        }
      }

      //check correct and incorrect letter and push to array accordingly and show msg
      if (isLetterInWord) {
        let pushCLetter = true;
        for(let i=0; i<trueLetters.length; i++){
          if(trueLetters[i] == letterElement.innerText){
            pushCLetter = false;
          }
        }
        if(pushCLetter){
          displayMessageElement.innerText = `CORRECT. ${letterElement.innerText} is in the word.`
          trueLetters.push(letterElement.innerText);
        }
      } else {
        let pushILetter = true;
        for(let i=0; i<falseLetters.length; i++){
          if(falseLetters[i] == letterElement.innerText){
            pushILetter = false;
          }
        }
        if(pushILetter){
          falseLetters.push(letterElement.innerText);
          displayMessageElement.innerText = `Wrong!. ${letterElement.innerText} is not in the word.`
          remainingChances--;
          hangIndex++;
          document.querySelector(".chancesLabel").innerText = remainingChances;
          document.querySelector("#img-hangperson-status").src = `img/00${hangIndex}-face.png`;
          if(remainingChances === 0){
            displayMessageElement.innerText = "GAME OVER! YOU LOSE!";
            displayMessageElement.classList.add("message");
            //After losing you can not interact with buttons restart game to play!
            document.querySelector(".letter-bank").removeEventListener("click", letterClickAction);
          }
        }
      }

      //Make words from correct letter or show _ _ _
      for(let i=0; i<selectedWord.length; i++){
        let anyLetterMatch = "";
        for(let j=0; j<trueLetters.length; j++){
          if (selectedWord[i] === trueLetters[j]) {
            anyLetterMatch = trueLetters[j];
          }
        }
        if(anyLetterMatch !== "") {
          updatedWord += anyLetterMatch + " ";
          finalWord += anyLetterMatch;
        } else {
          updatedWord += "_ ";
        }
      }    
      document.querySelector("#word").innerText = updatedWord;

      //compare final word length to correct word length
      if (finalWord.length == correctWordLength) {
        displayMessageElement.innerText = "GAME OVER! YOU WIN!";
        displayMessageElement.classList.add("message");

        //After winning you can not interact with buttons restart game to play!
        document.querySelector(".letter-bank").removeEventListener("click", letterClickAction);
      }
    }
}

// -------------------
// EVENT LISTENERS
// -------------------

// start button: when clicked, start a new game
document.querySelector(".btn-start-game").addEventListener("click", startGame);

// save button: when clicked, save game to local storage
document.querySelector(".btn-save-game").addEventListener("click", saveGame);

