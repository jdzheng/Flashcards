// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Rewriting some of the existing methods, such as changing code in `show()`
// - Adding methods
// - Adding additional fields

class FlashcardScreen {
  constructor(containerElement, cardSet) {
    this.containerElement = containerElement;
    this.information = cardSet;

    this._displayNext = this._displayNext.bind(this);
    this._countCorrect = this._countCorrect.bind(this);
    this._countIncorrect = this._countIncorrect.bind(this);
    this._resetScreen = this._resetScreen.bind(this);

    this._showCorrect = this._showCorrect.bind(this);
    this._showIncorrect = this._showIncorrect.bind(this);
    this._revertBack = this._revertBack.bind(this);

    this.updateCardDeck = this.updateCardDeck.bind(this);

    this.cardDeck = [];
    this.currCard = null;

    this.incorrectSet = [];

    this.numberCorrect = 0;
    this.numberIncorrect = 0;

    document.addEventListener('correct', this._countCorrect);
    document.addEventListener('incorrect', this._countIncorrect);
    document.addEventListener('reset', this._resetScreen);

    document.addEventListener('update-correct', this._showCorrect);
    document.addEventListener('update-incorrect', this._showIncorrect);
    document.addEventListener('original', this._revertBack);

    this.correctCount = document.querySelector('#main .status .correct');
    this.incorrectCount = document.querySelector('#main .status .incorrect');
  }
  
  /* Places the correct set of cards to use in the card deck */
  updateCardDeck(deck) {
    const flashcardContainer = document.querySelector('#flashcard-container');

    let rightSet = null;
    for(const set of this.information) {
      if(set.title === deck) {
        rightSet = set;
      }
    }

    let definitions = Object.entries(rightSet.words);

    for(const word of definitions) {
      const card = new Flashcard(flashcardContainer, word[0], word[1]);
      this.cardDeck.push(card);
    }
  }

  show(lastSet) {
    this.containerElement.classList.remove('inactive');

    if(lastSet != null && Array.isArray(lastSet)) {
      this.incorrectSet = []; //reset the set of incorrect cards
      this.cardDeck = lastSet;
    } else if(lastSet != null && typeof lastSet === 'string') {
      const flashcardContainer = document.querySelector('#flashcard-container');
      this.updateCardDeck(lastSet);
    } else if(this.information === FLASHCARD_DECKS && lastSet == null) {
      let chosenSet = document.querySelector('#set-name').textContent;
      this.updateCardDeck(chosenSet);
    }
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  _displayNext() {
    if(this.cardDeck.length === 0) {
      document.dispatchEvent(new CustomEvent('none-left'));
    } else {
      this.currCard = this.cardDeck.shift();
      this.currCard.render();
    }
  }

  _showCorrect() {
    let update = this.numberCorrect + 1;
    if(update === this.numberCorrect + 1) {
      this.correctCount.textContent = update;
    }
  }

  _showIncorrect() {
    let update = this.numberIncorrect + 1;
    if(update === this.numberIncorrect + 1) {
      this.incorrectCount.textContent = update;
    }
  }

  _revertBack() {
    this.correctCount.textContent = this.numberCorrect;
    this.incorrectCount.textContent = this.numberIncorrect;
  }

  _countCorrect() {
    this.numberCorrect++;
    this.correctCount.textContent = this.numberCorrect;
  }

  _countIncorrect() {
    this.numberIncorrect++;
    this.incorrectCount.textContent = this.numberIncorrect;
    this.incorrectSet.push(this.currCard);
  }

  _resetScreen() {
    this.cardDeck = [];

    this.numberCorrect = 0;
    this.numberIncorrect = 0;

    this.correctCount.textContent = this.numberCorrect;
    this.incorrectCount.textContent = this.numberIncorrect;
  }
}
