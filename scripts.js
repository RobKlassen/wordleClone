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
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    // let alphabet = /^[a-zA-Z]+$/;

    activeInputs.forEach(activeInput => {
        activeInput.addEventListener('keydown',function(e){
            e.preventDefault();
            const thisTabIndex = this.tabIndex;
            const nextTabIndex = thisTabIndex + 1;
            const nextInput = document.getElementById('inputID'+[nextTabIndex]);
            const goBackElement = document.querySelector('.checkLetter'+[this.tabIndex - 1]);

            if (alphabet.includes(e.key)){
                this.value = e.key.toUpperCase();
                nextInput === null ? null : nextInput.focus();
            } else if (e.key === "Backspace") {
                if (this.value == ""){
                    if (goBackElement === null){
                        console.log("error handling");
                    } else {
                        if (((goBackElement.tabIndex + 1) % 5) != 0){
                            goBackElement.focus();
                            goBackElement.value = "";
                        } else {
                            null;
                        }
                    }
                } else if (((this.tabIndex + 1) % 5) == 0){
                    this.value = "";
                } 
            }
        });
    });

    //puts focus on new line after pressing enter
    const firstInputInChain = document.querySelector(`.checkLetter`+[currentGuess]);
    firstInputInChain.focus();
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

    const markLetter = function(bool, guessedLetter){
        const letterEl = document.getElementById(`letterID`+guessedLetter);
        if (guessedLetter === "" || null){
        } else {
            if (bool === true){
                letterEl.classList.add('letterTrue');
            }else if (bool === false){
                letterEl.classList.add('letterFalse');
            } else {
            }
        }
    }

    let answerGrade = [];

    if (playerGuessArr){
        for (i=0; i<5; i++){
            if (answerAsArr.includes(playerGuessArr[i])){
                if (answerAsArr[i] === playerGuessArr[i]){
                    //make that block green
                    answerGrade.push(2);

                } else {
                    //make that block yellow
                    answerGrade.push(1);
                }
                markLetter(true, playerGuessArr[i]);
            } else {
                // make that block grey
                answerGrade.push(0);
                markLetter(false, playerGuessArr[i]);
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
        app.finalScore();
    } else {
        app.buildInputs(currentGuess);
    }
}

app.finalScore = function(){
    const overlayEl = document.getElementById('olVictory');
    overlayEl.classList.remove("hiddenElement");
    const newGame = document.getElementById('newGame');
    newGame.addEventListener('click', function(){
        window.location.reload();
    });
}

app.getTargetWord = async function() {
    const answerAsArr = await app.randomWordAPI(0);
    const checkButton = document.getElementById("submitGuess");
    const answerButton = document.getElementById("showAnswer");
    const targetWordTextEl = document.getElementById("wordToGuess");
    targetWordTextEl.innerText = answerAsArr.join("");
    let currentGuess = 0;

    const executeAction = function(){
        const playerGuessArr = app.letterConcat(currentGuess);
        currentGuess = currentGuess + 5;
        app.checkGuess(playerGuessArr, answerAsArr, currentGuess)
    }

    checkButton.addEventListener('click', function(){
        executeAction();
    });
    answerButton.addEventListener('click', function(){
        targetWordTextEl.style.display = "inline-block";
        // answerButton.innerText = "SHOW ANSWER";
    })  
    document.addEventListener('keydown', function(e){
        if (e.code == "Enter"){
            executeAction();
        }
    });    
}

app.buildLetters = function(){
    const letterContainerEl = document.querySelector('.letterContainer');
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    for (i=0; i<alphabet.length; i++){
        const letterBox = document.createElement('p');
        letterBox.id = 'letterID'+[alphabet[i]];
        letterBox.innerText = alphabet[i];
        letterContainerEl.append(letterBox);
    }   
}

app.randomWordAPI = async function(counter){
    counter = counter + 1;
    // console.log("accessing API for the " + counter + " time");    
    const endpointURL = new URL('https://random-word-api.herokuapp.com/word?number=100');
    const myObj = await fetch(endpointURL);
    const jsonData = await myObj.json();
    let fiveLetterWords = [];
    
    jsonData.forEach(pieceOfData => {
        if (pieceOfData.length === 5){
            fiveLetterWords.push(pieceOfData);
        } 
    })
    if (fiveLetterWords.length === 0){
        if (counter < 3){
            app.randomWordAPI(counter);
        }
    } else {
        const randomWordAsArr = fiveLetterWords[0].toUpperCase().split("");
        return randomWordAsArr;
    }
}
app.init = function(){
    app.getTargetWord();
    app.buildInputs(0);
    app.buildLetters();
}

app.init();


//======= OLD CODE =======
// app.getTargetWord = async function() {
    // const randomWordGen = function(){   
        // let randomWordArr = [];
        // const alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

        // for (i = 0; i < 5; i++){
        //     const randNum = Math.ceil((Math.random()*26) - 1);
        //     const letterToPush = alphabet[randNum];
        //     randomWordArr.push(letterToPush);
        // }
        // return randomWordArr;
        // // return ["s","a","s","s","y"]  
    // }
    // const answerAsArr = randomWordGen();
//========================
                    // console.log(playerGuessArr.indexOf(playerGuessArr[i], i));
//========================

            // console.log(e);
            // if (alphabet.includes(e.key)){
            //     this.value = e.key;
            // } else {
            //     // this.value = "";
            // }
            // if (e.key === "Backspace"){
                // e.preventDefault();
                // this.value = "";
                // const goBackElement = document.querySelector('.checkLetter'+[this.tabIndex - 1]);
                // if ((this.tabIndex + 1) % 5 == 0){
                    // console.log(this.tabIndex, "last element");
                    // if (this.value == ""){
                        // console.log("its an empty tile");
                        // this.value ="";
                    // } else {
                        // console.log("it's not an empty tile");
                        // goBackElement.value = "";
                        // goBackElement.focus();
                        //=====================================
                        // ACTIVE CODE ACTIVE CODE START HERE
                        //=====================================
                    // }
                // } else {
                    // goBackElement.focus();
                    // goBackElement.value = "";
                    // console.log(this.tabIndex, "not last element");
                // }
                // console.log("you went back");
            // }


        // activeInput.oninput = function(e){
        //     if (e.inputType === "deleteContentBackward"){
        //         null;
        //     } else {
        //         if (alphabet.includes(e.data)){
        //             // console.log(activeInput.value)
        //             const thisTabIndex = this.tabIndex;
        //             const nextTabIndex = thisTabIndex + 1;
        //             const nextInput = document.getElementById('inputID'+[nextTabIndex]);
        //             // const submitButton = document.getElementById('submitGuess');
        //             // nextInput === null ? submitButton.focus() : nextInput.focus();
        //             nextInput === null ? null : nextInput.focus();
        //         } else {
        //             // this.value = "";
                    
        //         }
        //     }
        // }     




//========================