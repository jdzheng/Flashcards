// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Adding methods
// - Adding additional fields

class MenuScreen {
  constructor(containerElement) {
    this.containerElement = containerElement;

    this.mainMenu = document.querySelector('#menu #choices');
    this._selectDeck = this._selectDeck.bind(this);

    this._loadChoices();
  }

  _loadChoices() {
    for(const deck of FLASHCARD_DECKS) {
      const choice = deck['title'];
      const set = document.createElement('div');
      set.textContent = choice;
      set.addEventListener('click', this._selectDeck);
      this.mainMenu.appendChild(set);
    }
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  _selectDeck(event) {
    let flashcardSet = document.querySelector('#main');
    let setName = event.currentTarget.textContent;
    const set = document.createElement('div');
    set.id = 'set-name';
    set.textContent = setName;
    set.style.visibility = "hidden";
    flashcardSet.appendChild(set);
    document.dispatchEvent(new CustomEvent('deck-selected'));
  }
}
