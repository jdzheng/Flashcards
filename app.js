// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Changing the code in the constructor
// - Adding methods
// - Adding additional fields

class App {
  constructor() {
    const menuElement = document.querySelector('#menu');
    this.menu = new MenuScreen(menuElement);

    const mainElement = document.querySelector('#main');
    this.flashcards = new FlashcardScreen(mainElement, FLASHCARD_DECKS);

    const resultElement = document.querySelector('#results');
    this.results = new ResultsScreen(resultElement);

    this._displaySet = this._displaySet.bind(this);
    this._displayNextCard = this._displayNextCard.bind(this);
    this._displayResults = this._displayResults.bind(this);

    this._backToMenu = this._backToMenu.bind(this);
    this._displayInccorect = this._displayInccorect.bind(this);
    this._displayAgain = this._displayAgain.bind(this);

    this.menu.show();

    document.addEventListener('deck-selected', this._displaySet);
    document.addEventListener('card-studied', this._displayNextCard);
    document.addEventListener('none-left', this._displayResults);

    document.addEventListener('reset', this._backToMenu);
    document.addEventListener('continue', this._displayInccorect);
    document.addEventListener('start-over', this._displayAgain);

    let rightAnswers = document.querySelector('#main .status .correct');
    let wrongAnswers = document.querySelector('#main .status .incorrect');

    this.correctCount = rightAnswers;
    this.incorrectCount = wrongAnswers;
  }

  _displaySet() {
    this.menu.hide();
    this.flashcards.show();
    this.flashcards._displayNext();
  }

  _displayNextCard() {
    this.flashcards._displayNext();
  }

  _displayResults() {
    this.flashcards.hide();
    this.results.show(this.correctCount.textContent, this.incorrectCount.textContent);
  }

  _backToMenu() {
    this.results.hide();
    this.menu.show();
  }

  _displayInccorect() {
    this.results.hide();
    this.flashcards._resetScreen();
    this.flashcards.show(this.flashcards.incorrectSet);
    this.flashcards._displayNext();
  }

  _displayAgain() {
    this.results.hide();
    this.flashcards._resetScreen();
    let chosenSet = document.querySelector('#set-name').textContent;
    this.flashcards.show(chosenSet);
    this.flashcards._displayNext();
  }
}
