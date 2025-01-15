// This implements a simple game to help with learning about
// geometric and arithmetic sequences.

function randomFraction() {
    let numerator = parseInt(1 + 6 * Math.random());
    if (Math.random() < 0.2) {
        numerator = -numerator;
    }
    const denominator = Math.random() < 0.5 ? 1 : parseInt(1 + 6 * Math.random());
    return new Fraction(numerator, denominator);
}

function hide(elem) {
    elem.style.display = 'none';
}

function show(elem) {
    elem.style.display = 'block';
}

function markError(elem) {
    elem.style.backgroundColor = 'red';
}

function clearError(elem) {
    elem.style.backgroundColor = '';
}

function setFeedback(elem, message, color) {
    elem.style.backgroundColor = color;
    elem.textContent = message;
}

function clearFeedback(elem) {
    elem.style.backgroundColor = '';
    elem.textContent = '';
}

class AnswerWithFeedback {
    constructor(div, id, oracle) {
        this.input = div.querySelector(`#${id}-answer`);
        this.feedbackElem = div.querySelector(`#${id}-answer-feedback`);
        this.oracle = oracle;
        this.input.addEventListener('keyup', () => {
            try {
                let parsed = new Fraction(this.input.value);
            } catch (e) {
                clearFeedback(this.feedbackElem);
                return;
            }
            if (oracle().equals(new Fraction(this.input.value))) {
                setFeedback(this.feedbackElem, 'You got it!', 'green');
            } else {
                setFeedback(this.feedbackElem, 'Keep trying!', 'red');
            }
        });
    }
    clear() {
        this.input.value = '';
        clearFeedback(this.feedbackElem);
    }
}

class SequenceSubgame {
    constructor(div) {
        this.div = div;
        this.rLabel = div.querySelector('#r-label');
        this.a1Answer = new AnswerWithFeedback(div, 'a1', () => this.a1);
        this.rAnswer = new AnswerWithFeedback(div, 'r', () => this.r);
        this.selectedGeometric = false;
    }
    chooseParams() {
        this.a1 = randomFraction();
        this.r = randomFraction();
    }
    nth(n) {
        return this.selectedGeometric ? this.nthGeometric(n) : this.nthArithmetic(n);
    }
    hide() {
        this.div.style.display = 'none';
    }
    show() {
        this.div.style.display = 'block';
    }
    nthGeometric(n) {
        return this.a1.mul(this.r.pow(n - 1));
    }
    nthArithmetic(n) {
        return this.a1.add(this.r.mul(n - 1));
    }
    sequenceString(maxN) {
        const parts = [`a<sub>1</sub> = ${this.a1.toFraction()}`];
        for (let i = 2; i <= maxN; i++) {
            parts.push(`a<sub>${i}</sub> = ${this.nth(i).toFraction()}`);
        }
        return parts.join(', ');
    }
    clear() {
        this.a1Answer.clear();
        this.rAnswer.clear();
    }
    newRound(selectedGeometric) {
        this.clear();
        this.selectedGeometric = selectedGeometric;
        this.rLabel.textContent = this.selectedGeometric ? 'r' : 'd';
        this.chooseParams();
    }
}

class SequencesGame {
    constructor() {
        this.arithmeticRadio = document.getElementById('arithmetic-answer-radio');
        this.arithmeticRadioLabel = this.arithmeticRadio.parentNode;
        this.geometricRadio = document.getElementById('geometric-answer-radio');
        this.geometricRadioLabel = this.geometricRadio.parentNode;
        this.quizArea = document.getElementById('quiz');
        this.sequenceDisplay = document.getElementById('sequence');
        this.subgame = new SequenceSubgame(document.getElementById('param-questions'));
        this.selectedGeometric = false;

        this.arithmeticRadio.addEventListener('change', () => this.checkSequenceTypeAnswer());
        this.geometricRadio.addEventListener('change', () => this.checkSequenceTypeAnswer());
    }

    newRound() {
        this.selectedGeometric = Math.random() < 0.5;
        this.subgame.hide();
        this.resetRadios();
        this.subgame.newRound(this.selectedGeometric);
        this.sequenceDisplay.innerHTML = this.subgame.sequenceString(6);
        show(this.quizArea);
    }

    resetErrors() {
        clearError(this.arithmeticRadioLabel);
        clearError(this.geometricRadioLabel);
    }

    resetRadios() {
        this.arithmeticRadio.checked = false;
        this.geometricRadio.checked = false;
        this.resetErrors();
    }

    checkSequenceTypeAnswer() {
        this.resetErrors();
        const choseGeometric = this.geometricRadio.checked;
        if (choseGeometric !== this.selectedGeometric) {
            markError(choseGeometric ? this.geometricRadioLabel : this.arithmeticRadioLabel);
        }
        this.subgame.show();
    }
}

const game = new SequencesGame();

document.getElementById('generate-button').addEventListener('click', () => {game.newRound()});