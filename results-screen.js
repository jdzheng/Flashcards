// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Adding methods
// - Adding additional fields

class ResultsScreen {
  constructor(containerElement) {
    this.containerElement = containerElement;
    this.chooseOption = this.chooseOption.bind(this);

    let backToMenu = document.querySelector('#results .to-menu');
    let other = document.querySelector('#results .continue');
    other.addEventListener('click', this.chooseOption);
    backToMenu.addEventListener('click', this.chooseOption);
  }

  show(numberCorrect, numberWrong) {
    this.containerElement.classList.remove('inactive');
    let percentage = document.querySelector('#results .percent');
    let correct = document.querySelector('#results .correct');
    let incorrect = document.querySelector('#results .incorrect');
    let resultOption = document.querySelector('#results .continue')

    percentage.textContent = parseInt(100*parseInt(numberCorrect)/(parseInt(numberCorrect) + parseInt(numberWrong)));
    correct.textContent = numberCorrect;
    incorrect.textContent = numberWrong;

    if(numberWrong == 0) {
      resultOption.textContent = 'Start over?';
    } else {
      resultOption.textContent = 'Continue';
    }
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  chooseOption(event) {
    let resetChoice = document.querySelector('#results .to-menu');
    let otherChoice = document.querySelector('#results .continue');
    if(event.currentTarget == resetChoice) {
      let id = document.getElementById('set-name');
      id.remove();
      document.dispatchEvent(new CustomEvent('reset'));
    } else if(otherChoice.textContent === 'Continue'){
      document.dispatchEvent(new CustomEvent('continue'));
    } else if(otherChoice.textContent === 'Start over?') {
      document.dispatchEvent(new CustomEvent('start-over'));
    }
  }
}
