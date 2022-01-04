const app = {};

app.letterConcat = function(inputNums){
    let newWordArr = [];
    for (i=inputNums; i<(inputNums+5); i++){
        const currentInput = document.querySelector(`.checkLetter${i}`);
        newWordArr.push(currentInput.value);
    }
    const newWordConcat = newWordArr.join("");
    return newWordConcat;
}

app.checkGuess = function(targetWord){
    const targetWordStr = targetWord.join("");
    const checkButton = document.getElementById("submitGuess");
    let currentGuess = 0;

    checkButton.addEventListener('click', function(){
        const wordToCheck = app.letterConcat(currentGuess);

        console.log(wordToCheck);
        console.log(targetWordStr);
        

        if(targetWordStr === wordToCheck){
            console.log("match");
        } else {
            console.log("not a match");
            currentGuess = currentGuess + 5;
            app.buildInputs(currentGuess);
        }
    });
    
}

app.getTargetWord = function() {

    const randomWordGen = function(){
        let randomWordArr = [];
        const alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

        for (i = 0; i < 5; i++){
            const randNum = Math.ceil((Math.random()*26) - 1);
            const letterToPush = alphabet[randNum];
            randomWordArr.push(letterToPush);
        }

        return randomWordArr;  
    }

    const randomWord = randomWordGen();
    const targetWord = document.getElementById("wordToGuess");
    targetWord.innerText = randomWord.join("");
    app.checkGuess(randomWord);
}

app.buildInputs = function(initialVal){
    const guessContainer = document.querySelector(".guessContainer");
    let currentInput = initialVal;

    let maxInput = currentInput + 5;
    for (i=currentInput; i<maxInput; i++){
        const inputEl = document.createElement("input");
        inputEl.classList.add(`checkLetter`+[i]);
        guessContainer.append(inputEl);
    }
    currentInput = maxInput;
}

app.init = function(){
    app.getTargetWord();
    app.buildInputs(0);

}

app.init();