var buttons = ['MC', 'MR', 'M+', 'M-', 'CE', 7, 8, 9, '/', 'SQRT', 4, 5, 6, 'x', '%', 1, 2, 3, '-', '1/x', 0, '.', '+/-', '+', '='];
var tally = '';
var number = '';
var operator = null;
var canEdit = true;
var memoryStore = 0;
var row;
var column;
var cell;
var button;
var screen = document.getElementById('screen');
var table = document.getElementById('calculator-buttons');
// Maybe enumerate operators or just an array so I don't have to
// have many if statements
table.style.padding = '10';
window.onload = function () {
  for (let i = 0; i < buttons.length; i++) {
    column = i % 5;
    if (i % 5 === 0) {
      row = table.insertRow(-1);
    }
    cell = row.insertCell(column);

    button = document.createElement('BUTTON');
    button.textContent = buttons[i];
    button.classList.add('button');
    if (i < 5) {
      button.classList.add('meta-button');
    } else if (!isNaN(Number(button.textContent))) {
      button.classList.add('number');
    } else if (button.textContent === '.') {
      button.classList.add('dot');
    } else if (button.textContent === '=') {
      button.classList.add('equals');
    } else {
      button.classList.add('operator');
    }
    button.addEventListener('click', function () {
      buttonAllocation(this);
    });
    cell.appendChild(button);
  }
  updateScreen();
};

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
    // It the operators are 'SQRT', '1/x', or '%'
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
  if (number.length > 0) { numToStore = Number(number) }
  else if (tally.length > 0) { numToStore = Number(tally) }
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
      //tally = memoryStore;
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
  if (screen.hasChildNodes()) {
    screen.removeChild(screen.childNodes[0]);
  }
  if (num) { display = num; }
  else { display = tally == '' ? 0 : tally; }

  var node = document.createElement("P");
  var textnode = document.createTextNode(display);
  node.appendChild(textnode);
  screen.appendChild(node);
}
