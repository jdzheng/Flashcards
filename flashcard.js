// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Adding methods
// - Adding additional fields

class Flashcard {
  constructor(containerElement, frontText, backText) {
    this.containerElement = containerElement;
    this.body = document.querySelector('body');

    this.cardMoved = false;
    this.originX = null;
    this.originY = null;
    this.offsetX = 0;
    this.offsetY = 0;

    this._resetTransition = this._resetTransition.bind(this);
    this.changeBack = this.changeBack.bind(this);

    this._flipCard = this._flipCard.bind(this);
    this.flashcardElement = this._createFlashcardDOM(frontText, backText);
    this.flashcardElement.addEventListener('pointerup', this._flipCard);
    this.flashcardElement.style.transform = 'transition(0.6s)';

    //methods to mode flashcards
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDragMove = this._onDragMove.bind(this);

    //event listeners to move flashcards around
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDragMove = this._onDragMove.bind(this);
    this.flashcardElement.addEventListener('pointerdown', this._onDragStart);
    this.flashcardElement.addEventListener('pointerup', this._onDragEnd);
    this.flashcardElement.addEventListener('pointermove', this._onDragMove);
  }

  render() {
    this.containerElement.append(this.flashcardElement);
    let card = document.querySelector('#main #flashcard-container .flashcard-box');
    card.classList.add('show-word');
  }

  // Creates the DOM object representing a flashcard with the given
  // |frontText| and |backText| strings to display on the front and
  // back of the card. Returns a reference to root of this DOM
  // snippet. Does not attach this to the page.
  //
  // More specifically, this creates the following HTML snippet in JS
  // as a DOM object:
  // <div class="flashcard-box show-word">
  //   <div class="flashcard word">frontText</div>
  //   <div class="flashcard definition">backText</div>
  // </div>
  // and returns a reference to the root of that snippet, i.e. the
  // <div class="flashcard-box">
  _createFlashcardDOM(frontText, backText) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('flashcard-box');
    cardContainer.classList.add('show-word');

    const wordSide = document.createElement('div');
    wordSide.classList.add('flashcard');
    wordSide.classList.add('word');
    wordSide.textContent = frontText;

    const definitionSide = document.createElement('div');
    definitionSide.classList.add('flashcard');
    definitionSide.classList.add('definition');
    definitionSide.textContent= backText;

    cardContainer.appendChild(wordSide);
    cardContainer.appendChild(definitionSide);
    return cardContainer;
  }

  _flipCard(event) {
    this.flashcardElement.classList.toggle('show-word');
  }

  _onDragStart(event) {
    this.originX = event.clientX;
    this.originY = event.clientY;
    this.cardMoved = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.removeEventListener('transitioned', this._resetTransition(event));
  }

  _onDragMove(event) {
    const right = document.querySelector('#status #correct');
    const wrong = document.querySelector('#status #incorrect');
    if (!this.cardMoved) {
      return;
    }
    event.preventDefault();

    this.flashcardElement.removeEventListener('pointerup', this._flipCard);
    const deltaX = event.clientX - this.originX;
    const deltaY = event.clientY - this.originY;
    const translateX = this.offsetX + deltaX;
    const translateY = this.offsetY + deltaY;
    const rotation = 0.2 * (deltaX);
    event.currentTarget.style.transform = 'translate(' +  translateX + 'px, ' +
                                  translateY  + 'px) rotate(' + rotation + 'deg)';

    if(deltaX > 150) {
      document.dispatchEvent(new CustomEvent('update-correct'));
      this.body.style.backgroundColor = '#97b7b7';
    } else if(deltaX < -150) {
      document.dispatchEvent(new CustomEvent('update-incorrect'));
      this.body.style.backgroundColor = '#97b7b7';
    } else {
      document.dispatchEvent(new CustomEvent('original'));
      this.body.style.backgroundColor = '#d0e6df';
    }
  }
  
  /*Reverts back to oringial settings*/
  changeBack(object) {
    object.currentTarget.style.transform = 'translate(0px,0px)';
    this.originX = null;
    this.originY = null;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  _onDragEnd(event) {
    this.flashcardElement.addEventListener('pointerup', this._flipCard);
    this.cardMoved = false;
    this.offsetX += event.clientX - this.originX;
    this.offsetY += event.clientY - this.originY;

    if(this.offsetX > -150 && this.offsetX < 150) {
      event.currentTarget.addEventListener('transitioned', this._resetTransition(event));
      event.currentTarget.style.transition = '0.6s';
      this.changeBack(event);
    } else if(this.offsetX < -150 || this.offsetX > 150) {
      if(this.offsetX < -150) {
        this.changeBack(event);
        document.dispatchEvent(new CustomEvent('incorrect'));
      } else {
        this.changeBack(event);
        document.dispatchEvent(new CustomEvent('correct'));
      }
      let card = document.getElementById('flashcard-container');
      card.innerHTML = '';
      this.body.style.backgroundColor = '#d0e6df';
      document.dispatchEvent(new CustomEvent('card-studied'));
    }
  }

  _resetTransition(event) {
    event.currentTarget.style.transition = '0.0s';
  }
}
