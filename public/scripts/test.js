let position = 0
let correctCount = 0
let incorrectCount = 0
let deckCount = 0
let session = 0
let deckStatus = false
let combinedDecks //= Object.keys(decks.get(0));
let shufArr //= shuffle(combinedDecks);
let firstRound = true
let decks = {
  new: {
    Hola: 'hello',
    rojo: 'red',
    niña: 'girl',
    murciélago: 'bat',
    dirección: 'address/direction',
    monopatín: 'skateboard',
    suegros: 'in-laws',
    guay: 'cool',
    vale: 'okay',
    comer: 'to eat',
    'darse de cuenta de': 'to realize ',
  },
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
  10: {},
  retired: {},
}

//Event Handlers
$(document).ready(function () {
  $('#flipCard').click(() => $('#content').toggleClass('flipped'))

  $('#start').click(() => startRound())

  $('#correct').click(() => {
    if (deckStatus) {
      correctCount++
      $('#correctProgress').css('width', (correctCount / deckCount) * 100 + '%')
      let front = $('#english').text()
      let back = $('#spanish').text()
      if (!!decks.new[front]) {
        delete decks.new[front]
        decks[session][front] = back
      } else if (session === 10) {
        if (!!decks[1][front]) {
          delete decks[1][front]
          decks.retired[front] = back
        } else checkPosition()
      } else if (!!decks[session + 1][front]) {
        delete decks[session + 1][front]
        decks.retired[front] = back
      }
      checkPosition()
    }
  })

  $('#wrong').click(() => {
    if (deckStatus) {
      incorrectCount++
      $('#incorrectProgress').css(
        'width',
        (incorrectCount / deckCount) * 100 + '%'
      )
      let front = $('#english').text()
      let back = $('#spanish').text()
      for (let i = 1; i < 11; i++) {
        if (decks[i][front]) {
          delete decks[i][front]
          decks.new[front] = back
        }
      }
      checkPosition()
    }
  })

  $('#newSession').click(() => {
    $('.progress').addClass('trans')
    $('.button-container').addClass('trans')
    $('.start-button').removeClass('invisible')

    $('.group-button').addClass('invisible')
    resetCard()
    if (session === 10) {
      session = 1
      firstRound = false
    } else {
      session++
    }
    $('.front').text(`Session #${session}`)
    $('.back').text('Click "Start"')
    position = 0
    correctCount = 0
    incorrectCount = 0
    $('#correctProgress').css('width', '0%')
    $('#incorrectProgress').css('width', '0%')
    //calcuating the decks for the session
    if (firstRound) {
      var subArr = [0, 2, 5, 9]
        .filter((val) => session - val > 0)
        .map((val) => session - val)
    } else {
      var subArr = [0, 2, 5, 9].map((val) =>
        session - val > 0 ? session - val : 10 + session - val
      )
    }
    combinedDecks = {
      ...decks.new,
      ...decks[subArr[0]],
      ...decks[subArr[1]],
      ...decks[subArr[2]],
      ...decks[subArr[3]],
    }
    shufArr = shuffle(Object.keys(combinedDecks))
    deckCount = shufArr.length
  })
})

function startRound() {
  if (!shufArr.length) {
    checkPosition()
  }
  deckStatus = true
  $('.start-button').addClass('invisible')
  $('.group-button').removeClass('invisible')
  nextCard()
}

function checkPosition() {
  if (position < shufArr.length) {
    nextCard()
  } else if (position === 0) {
    $('#english').text('Empty Round')
    $('#spanish').text('Click "New Session"')

    deckStatus = false
  } else {
    $('#english').text('END')
    $('#spanish').text('Click "New Session"')
    deckStatus = false
  }
}

function resetCard() {
  $('#content').removeClass('flipped')
}

function nextCard() {
  resetCard()
  $('#english').text(shufArr[position])
  setTimeout(() => {
    $('#spanish').text(combinedDecks[shufArr[position]])
    position++
  }, 300)
}

//Shuffle Word Bank

function shuffle(array) {
  let arrayCopy = array.slice()
  for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
    // generate a random index between 0 and idx1 (inclusive)
    let idx2 = Math.floor(Math.random() * (idx1 + 1))

    // swap elements at idx1 and idx2
    ;[arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]]
  }
  return arrayCopy
}
