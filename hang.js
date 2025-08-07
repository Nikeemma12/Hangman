const head = document.getElementById("head")
const body = document.getElementById("body")
const rhand = document.getElementById("right-hand")
const lhand = document.getElementById("left-hand")
const rleg = document.getElementById("right-leg")
const lleg = document.getElementById("left-leg")
let word = document.getElementById("word")
let score = document.getElementById("score")
const container = document.querySelector(".body-container")
const score_container = document.querySelector(".score")
const reset = document.getElementById("reset")
const general_container = document.querySelector(".general")
const mode = document.querySelector(".mode")
const diff = document.getElementById("diff")
const hint_word = document.getElementById("hint")
const hint_btn = document.querySelector(".hint")

let guess = 0
const parts = [head, body, rhand, lhand, rleg, lleg]
let guessWords = [
    ["cat","sun","tree","game","ball","book","fish","bird","moon","rain"],
    ["window","blanket","thunder","kitchen","monster","desert","laptop","school","garden","jellyfish"],
    ["internship","microscope","adventure","dictionary","spaceship","earthquake","backpacker","waterfall","basketball","holograph"],
]
let guessWord
let guessChoice
let randomNo
let scorer = 0
const start = (difficulty) => {
    mode.style.display = 'none'
    diff.style.display = 'none'
    general_container.style.display = 'block'
    let indexes
    if(difficulty === "EASY"){
        guessChoice = guessWords[0]
        randomNo = Math.floor(Math.random()*guessChoice.length)
        guessWord = guessChoice[randomNo]
    } else if(difficulty === "MEDIUM") {
        guessChoice = guessWords[1]
        randomNo = Math.floor(Math.random()*guessChoice.length)
        guessWord = guessChoice[randomNo]
    } else if(difficulty === "HARD") {
        guessChoice = guessWords[2]
        randomNo = Math.floor(Math.random()*guessChoice.length)
        guessWord = guessChoice[randomNo]
    }
    console.log(guessWord)
    game(guessWord)
    guessChoice = guessChoice.filter(item =>
        item !== guessWord
    )
    document.addEventListener(
        "keydown",
        (event) => {
            let letter = event.key.toLocaleLowerCase()
            if(guessWord.includes(letter)) {
                let index = guessWord.indexOf(letter)
                let final = guessWord.lastIndexOf(letter)
                word.innerText = word.innerText.slice(0,index) + letter + word.innerText.slice(index+1)
                word.innerText = word.innerText.slice(0,final) + letter + word.innerText.slice(final+1)
                
            } else {
                if(guess<parts.length) {
                    parts[guess].style.display = 'block'
                    guess++
                    if(guess == parts.length) {
                        score.innerText = `You failed to guess the word. The word is "${guessWord}"`
                        container.style.display = "none"
                        word.style.display = 'none'
                        score_container.style.display = "block"
                        score_container.style.margin = "100px"
                        score.style.backgroundColor = "blueviolet"
                        reset.style.display = "block"
                        hint_btn.style.display = "none"
                        hint_word.style.display = "none"
                    }
                }
                
            }
            if(word.innerText == guessWord) {
                word.innerText= ""
                randomNo = Math.floor(Math.random()*guessChoice.length)
                guessWord = guessChoice[randomNo]
                console.log(guessWord)
                game(guessWord)
                guessChoice = guessChoice.filter(item =>
                    item !== guessWord
                )
                scorer++
                if (guessChoice.length == 0) {
                    score.innerText = `You scored ${scorer} out of 10`
                    container.style.display = "none"
                    word.style.display = 'none'
                    score_container.style.display = "block"
                    score_container.style.margin = "100px"
                    score.style.backgroundColor = "blueviolet"
                    reset.style.display = "block"
                    hint_btn.style.display = "none"
                    hint_word.style.display = "none"
                }
            }
            
        } 
    )
}
let word_index = []
let indexNo
const game = (a) => {
    for(letter in a){
        word.innerText +=  '-'
    }
    if(a.length>5 && a.length<10){
        indexes = 2
        select(indexes,a)
        if(word_index[0]===word_index[1]){
            select(indexes,a)
        }
        word.innerText = word.innerText.slice(0,word_index[0]) + guessWord[word_index[0]] + word.innerText.slice(word_index[0]+1)
        word.innerText = word.innerText.slice(0,word_index[1]) + guessWord[word_index[1]] + word.innerText.slice(word_index[1]+1)
    } else if(a.length>=10) {
        indexes = 3
        select(indexes,a)
        if(word_index[0]===word_index[1]){
            select(indexes,a)
        }
        word.innerText = word.innerText.slice(0,word_index[0]) + guessWord[word_index[0]] + word.innerText.slice(word_index[0]+1)
        word.innerText = word.innerText.slice(0,word_index[1]) + guessWord[word_index[1]] + word.innerText.slice(word_index[1]+1)
        word.innerText = word.innerText.slice(0,word_index[2]) + guessWord[word_index[2]] + word.innerText.slice(word_index[2]+1)
    }
    else {
        indexes = 1
        select(indexes,a)
        word.innerText = word.innerText.slice(0,word_index[0]) + guessWord[word_index[0]] + word.innerText.slice(word_index[0]+1)
    }
    
}
const select = (indexes,a) => {
    for(let i=0; i<indexes;i++){
        indexNo = Math.floor(Math.random()*a.length)
        word_index.push(indexNo)
    }
    word_index.sort((a,b) => a-b)
    return word_index
}
const playagain = () => {
    location.reload()
}
async function hint(element) {
    hint_word.style.display = "block"
    try {
        guessWord  = guessWord.toLocaleLowerCase()
        const word = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guessWord}`)   
        if(!word.ok) {
            throw new Error("Could not fetch data")
        }
        const data = await word.json()
        let dataindex = Math.floor(Math.random()*data.length)
        let meanings = data[dataindex].meanings
        let meaningsindex = Math.floor(Math.random()*meanings.length)
        let definitions = meanings[meaningsindex].definitions
        let definitionsindex = Math.floor(Math.random()*definitions.length)
        let definition = definitions[definitionsindex].definition
        hint_word.innerText = definition
    } catch (error) {
        const error_message = error + " Could not fetch data Make sure your connected to internet"
        hint_word.innerText = error_message
    }
}