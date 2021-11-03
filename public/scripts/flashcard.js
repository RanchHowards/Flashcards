let position = 0;
let correctWords = {};
let incorrectWords = {};
let session = 0;
let deckStatus = true;
let combinedDecks; //= Object.keys(decks.get(0));
let shufArr; //= shuffle(combinedDecks);
let firstRound = true;
let decks = new Map();



//Event Handlers
$(document).ready(function(){
    fetch(); 
    $('#flipCard').click( () => $('.card').toggleClass('flipped'));

    $('#correct').click( () => {
        if(deckStatus){
            let eng = $('#english').text();
            correctWords[eng] = $('#spanish').text();
            if(!!decks.get('new')[eng]){
                    delete decks.get('new')[eng];
                    decks.set(session, {...decks.get(session), [eng]: correctWords[eng]});
            }
            else if(!!decks.get(session + 1)[eng]){
                    delete decks.get(session + 1)[eng];
                    decks.set('retired', {...decks.get('retired'), [eng]: correctWords[eng]});
            }
            
            checkPosition();
        }
    })

    $('#wrong').click( () => {
        if(deckStatus){
            let eng = $('#english').text();
            incorrectWords[eng] = $('#spanish').text();
            for(const [key, value] of decks){
                if(value[eng]){
                    delete value[eng];
                    decks.set('new', {...decks.get('new'), [eng]: incorrectWords[eng]});
                }
            }
            checkPosition();
        }
    })

    $('#newSession').click( () => {
        
        if(session === 10){
            session = 1;
            firstRound = false;
        }
        else{
            session++;
        };
        $('.side').text(`Session #${session}`);
        position = 0;
        correctWords ={};
        incorrectWords = {};
        deckStatus = true;
        //calcuating the decks for the session
        if(firstRound){
            var subArr = [0,2,5,9]
            .filter( (val) => session - val > 0)
            .map( (val) => session - val);
            console.log(subArr);
        }
        else{var subArr = [0,2,5,9].map( (val) => (session - val > 0) ? (session - val) : (10 + session - val));
            }
        combinedDecks = {
            ...decks.get('new'),
            ...decks.get(subArr[0]),
            ...decks.get(subArr[1]),
            ...decks.get(subArr[2]),
            ...decks.get(subArr[3])
        };
        shufArr = shuffle(Object.keys(combinedDecks));
        
    })
       
})

function fetch() {
    $.get('/api')
    .then( function(data){
        // let mapKeys = Object.keys(data[0].words);
        // for(let key of mapKeys){
        //     decks.set(Number(key), data[0].words[key]);
        // }
        decks.set('new', data[0].words.new);
        decks.set(1, data[0].words[1]);
        decks.set(2, data[0].words[2]);
        decks.set(3, data[0].words[3]);
        decks.set(4, data[0].words[4]);
        decks.set(5, data[0].words[5]);
        decks.set(6, data[0].words[6]);
        decks.set(7, data[0].words[7]);
        decks.set(8, data[0].words[8]);
        decks.set(9, data[0].words[9]);
        decks.set(10, data[0].words[10]);
        decks.set('retired', data[0].words.retired);
        
        return decks;
    })
 }

function checkPosition() {
    if(position < shufArr.length){
        nextCard()
    }
    else {
        $('#english').text('END');
        $('#spanish').text('END!!');
        deckStatus = false;
    }
}

function resetCard() {
    $('.card').removeClass('flipped');
}

function nextCard() {
    resetCard();
    $('#english').text(shufArr[position]);
    setTimeout( () => {
        $('#spanish').text(combinedDecks[shufArr[position]]);
        position++;
    },300);
    
}

//Shuffle Word Bank


function shuffle(array) {
    let arrayCopy = array.slice();
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
        // generate a random index between 0 and idx1 (inclusive)
        let idx2 = Math.floor(Math.random() * (idx1 + 1));

        // swap elements at idx1 and idx2
        [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]];
    }
    return arrayCopy;
}
//sort card

    //add to appropriate stack
    //wrong deck
    //correct deck
    //depending on sessison gets sorted

//add cards to database