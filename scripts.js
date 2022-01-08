const app = {};

app.buildInputs = function(currentGuess){
    const guessContainer = document.querySelector(".guessContainer");

    for (i=currentGuess; i<(currentGuess + 5); i++){
        const inputEl = document.createElement("input");
        inputEl.classList.add(`checkLetter`+[i]);
        inputEl.id = `inputID`+[i];
        inputEl.tabIndex = [i];
        inputEl.maxLength = 1;
        guessContainer.append(inputEl);
    }

    const activeInputs = document.querySelectorAll('input');
    activeInputs.forEach(activeInput => {
        activeInput.oninput = function(){
            console.log(activeInput.value)
            const thisTabIndex = this.tabIndex;
            const nextTabIndex = thisTabIndex + 1;
            const nextInput = document.getElementById('inputID'+[nextTabIndex]);
            nextInput === null ? null : nextInput.focus();
        }








        // activeInput.addEventListener('keypress', function(e){
        //     if (e.code == "Enter"){
        //         const playerGuessArr = app.letterConcat(currentGuess);
        //         currentGuess = currentGuess + 5;



        //         app.checkGuess(playerGuessArr, answerAsArr, currentGuess)
        //     }
        // })




        
    })
}

app.letterConcat = function(inputNums){
    let newWordArr = [];
    for (i=inputNums; i<(inputNums+5); i++){
        const currentInput = document.querySelector(`.checkLetter${i}`);
        if (currentInput == null){
            //ERROR HANDLING
            return null
        } else {
            newWordArr.push(currentInput.value);
        } 
    }
    return newWordArr;
}

app.checkGuess = function(playerGuessArr, answerAsArr, currentGuess){
    const checkArrEquality = function(arr1,arr2){       
        for (i = 0; i<arr1.length; i++){
            if (arr1[i] == arr2[i]){
                null;
            } else {
                return false;
            }
        }
        return true;
    }

    let answerGrade = [];

    if (playerGuessArr){
        for (i=0; i<5; i++){
            if (answerAsArr.includes(playerGuessArr[i])){
                if (answerAsArr[i] === playerGuessArr[i]){
                    // console.log(playerGuessArr.indexOf(playerGuessArr[i], i));
                    //make that block green
                    answerGrade.push(2);
                } else {
                    //make that block yellow
                    answerGrade.push(1);
                }
            } else {
                // make that block grey
                answerGrade.push(0);
            }
        }
    }

    if (currentGuess > 0){
        let j = 0
        for (i=(currentGuess-5); i<currentGuess; i++){
            const currentGrade = answerGrade[j];
            let classToAdd;
    
            if (currentGrade === 0){
                classToAdd = 'doesNotContainLetter'
            } else if (currentGrade === 1){
                classToAdd = 'containsLetter'
            } else if (currentGrade === 2){
                classToAdd = 'correctLetter'
            } else {
                null
            }
            const inputEl = document.querySelector(`.checkLetter`+[(i)]);
            if (inputEl === null){
                //ERROR HANDLING
                return null
            } else {
                inputEl.classList.add(classToAdd);
                inputEl.disabled = true;
                j++;
            }
        }
    }

    if (checkArrEquality(playerGuessArr, answerAsArr) == true){
        //VICTORY
        console.log("victory");
    } else {
        //NOT VICTORY
        console.log("not victory");
        app.buildInputs(currentGuess);
    }

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
        // return ["s","a","s","s","y"]  
    }

    const answerAsArr = randomWordGen();
    const checkButton = document.getElementById("submitGuess");
    const targetWordTextEl = document.getElementById("wordToGuess");
    targetWordTextEl.innerText = answerAsArr.join("");
    let currentGuess = 0;

    checkButton.addEventListener('click', function(){
        const playerGuessArr = app.letterConcat(currentGuess);
        currentGuess = currentGuess + 5;
        app.checkGuess(playerGuessArr, answerAsArr, currentGuess)
    });  
    // checkButton.addEventListener('keydown', function(e){
    //     // console.log();(e);
    //     console.log("test");
    // })
}

// app.inputEventListener = function(){
    // document.querySelectorAll('input');
// }

app.init = function(){
    app.getTargetWord();
    app.buildInputs(0);
    // app.inputEventListener();
}

app.init();