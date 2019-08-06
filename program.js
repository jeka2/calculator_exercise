var tally = '';
var number = '';
var operator = null;
var memoryStore = 0;
var screen = document.getElementById('value');
screen.innerHTML = 0;
var buttons = document.getElementsByClassName('button');

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    buttonAllocation(this);
  });
}

function buttonAllocation(button) {
  var val = button.textContent;
  if (button.classList.contains('number')) {
    numberPicked(Number(val));
  } else if (button.classList.contains('meta-button')) {
    metaPicked(val);
  } else if (button.classList.contains('equals')) {
    equalsPicked();
  } else if (button.classList.contains('dot')) {
    dotPicked();
  } else if (button.classList.contains('operator')) {
    operatorPicked(val);
  }
}

function operatorPicked(op) {
  let singleOperators = ['SQRT', '1/x', '%', '+/-'];
  if (number.length != 0 || tally.length != 0) {
    if (singleOperators.includes(op)) {
      if (tally.length != 0) {
        performSingularOperation(tally, op);
      }
      else {
        performSingularOperation(number, op);
      }
    }
    else {
      if (!operator) {
        operator = op;
        if (tally.length == 0) { tally = number; }
        number = '';
      }
      else {
        performBindingOperation(number, operator);
        operator = op;
      }
    }
    updateScreen();
  }
}

function numberPicked(num) {
  number += num;
  updateScreen(number);
}

function performSingularOperation(num, op) {
  console.log(op);
  let n = Number(num);
  let singularOperators = {
    'SQRT': Math.sqrt(n),
    '1/x': 1 / n,
    '%': n / 100,
    '+/-': n * -1
  }
  tally = singularOperators[op] + '';
  number = '';
  operator = null;
}

function performBindingOperation(num, op) {
  num = Number(num);
  let n = Number(tally);
  let bindingOperators = {
    'x': n * num,
    '/': n / num,
    '+': n + num,
    '-': n - num,
  }
  tally = bindingOperators[op] + '';
  number = '';
  operator = null;
}

function dotPicked() {
  if (!number.includes('.') || number.length === 0) {
    number += '.';
    updateScreen(number);
  }
}

function metaPicked(met) {
  var numToStore;
  if (number.length > 0) { numToStore = Number(number); }
  else if (tally.length > 0) { numToStore = Number(tally); }
  else { if (met != 'MR') { return; } }
  if (met === 'MC') {
    memoryStore = 0;
  }
  else if (met === 'MR') {
    if (tally.length > 0 && operator) {
      updateScreen(memoryStore);
      number = memoryStore;
    }
    else if (!operator) {
      updateScreen(memoryStore);
      tally = memoryStore;
    }
  }
  else if (met === 'M+') {
    memoryStore += numToStore;
  }
  else if (met === 'M-') {
    memoryStore -= numToStore;
  }
  else {
    Reset();
  }
}

function equalsPicked() {
  if (tally != '' && operator) {
    performBindingOperation(number, operator);
    updateScreen();
  }
}

function Reset() {
  tally = '';
  number = '';
  operator = null;
  canEdit = true;
  updateScreen();
}

function updateScreen(num = null) {
  var display = '';

  if (num) { display = num; }
  else { display = tally == '' ? 0 : tally; }

  screen.innerHTML = display;
}
