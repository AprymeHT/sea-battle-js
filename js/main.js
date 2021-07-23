// Скрывает правое поле при загрузке страницы
window.onload = function() {
    $('#rightSquareText').toggle();
}

const minElem = 0;
const maxElem = 100;
let arrElems = [maxElem]; // Количество элементов в массиве

for (let i = minElem; i < maxElem; i++) {
    arrElems[i] = i;
}

// Генерация массива для ходов компьютера
$('#start').click(function() { // Создание поля

    $('#start').html('Начать заново');
    $('#rightSquareText').toggle(); // Показывает правое поле при нажании на "Начать"

    clearSquares('#leftSquare, #rightSquare'); // Генерация пустого поля
    addShades();

    // Размещение кораблей
    for (let length = 4; length >= 1; length--) {
        for (let shipDeck = (5 - length); shipDeck >= 1; shipDeck--) {
            const firstPos = generation(length, '#leftSquare');
            const secondPos = generation(length, '#rightSquare');

            for (let deck = 0; deck < firstPos.length; deck++) {
                addDeck(firstPos[deck], '#leftSquare');
                addDeck(secondPos[deck], '#rightSquare');
            }
        }
    }
    $('#leftSquareText p').text(name); // Присваивание имени

    // Сокрытие элементов массива пустотой
    paintingSquare('#leftSquare');
    paintingSquare('#rightSquare');
    whatsShot(true);
});

$('#newGame').click(function() {
    $('#rightSquareText').toggle();
});


// Добавление "слоев" на поле боя
function addShades() {
    $('#leftSquare').append('<div id="leftShade"></div>');
    $('#rightSquare').append('<div id="rightShade"></div>');
}

// Проверка элементов на коллизию и постановка кораблей
function addDeck(deck, square) {
    let arrClose = [deck - 1, deck - 10, deck + 10, deck - 1 - 10, deck - 1 + 10, deck + 1, deck + 1 - 10, deck + 1 + 10];
    let lengthArrClose;
    if (Math.floor(deck % 10) < 9) {
        lengthArrClose = arrClose.length;
    } else lengthArrClose = arrClose.length - 3;

    for (let i = 0; i < lengthArrClose; i++) {
        let elem = $(square + ' #cell' + arrClose[i]);
        if (!elem.hasClass('shipColor')) {
            elem.removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');
        }
    }
    $(square + ' #cell' + deck).removeClass('deckColor waterColor cellColor fireColor').addClass('deckColor');
    $(square + ' #cell' + deck).addClass('ship');
}

// Функция заполняет поле клетками
function clearSquares() {
    let $squares = $('#leftSquare, #rightSquare')
    $squares.empty();
    for (let i = minElem; i < maxElem; i++) {
        $squares.append('<span class = "cell cellColor" id = cell' + i + '  oncontextmenu = "blocker(' + i + '); return false" ></span>');

    }
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

// Рандомизация и нахождение частей корабля
function generation(numberOfDecks, square) {
    let deck = [];
    let direction = randomInteger(0, 1);
    deck[0] = randomInteger(0, 99);
    if (direction) {
        if (deck[0] % 10 > (10 - numberOfDecks)) {
            deck[0] = Math.floor(deck[0] / 10) * 10 + (10 - numberOfDecks);
        }
        for (i = 1; i < numberOfDecks; i++) {
            deck[i] = deck[i - 1] + 1;
        }
    } else {
        if (deck[0] > (numberOfDecks * 10 - 1)) {
            deck[0] = (numberOfDecks * 10 - 1) + Math.round(deck[0] % 10);
        }
        for (i = 1; i < numberOfDecks; i++) {
            deck[i] = deck[i - 1] + 10;
        }
    }
    for (i = 0; i < numberOfDecks; i++) {
        if ($(square + ' #cell' + deck[i]).hasClass('deckColor') ||
            $(square + ' #cell' + deck[i]).hasClass('waterColor'))
            return generation(numberOfDecks, square);
    }
    return deck;
}

// Функция для получения имени игрока
function getName() {
    name = $('input').val();
    $('#yourName').toggle();
}

// Функция выстрела, которая сверяет значения попал или нет
function shot(cell, x) {
    if ($(cell).hasClass('flagColor')) {
        return false;
    }
    if (!(($(cell).hasClass('fireColor')) || ($(cell).hasClass('cellColor')) || ($(cell).hasClass('ship')) && ($(cell).parent('#rightSquare')))) {
        opponentShot();
    }
    if (x) {
        $(cell).removeClass('deckColor waterColor cellColor fireColor').addClass('fireColor');
        checkWinner('#rightSquare');
    } else {
        $(cell).removeClass('deckColor waterColor cellColor fireColor').addClass('cellColor');
    }
}

// Функция для генерации выстрела компьютера
function opponentShot() {
    whatsShot(false);
    i = randomInteger(0, arrElems.length - 1);
    if (arguments[0] === 'boom') {
        i = arguments[1];
        if (Math.floor(i / 10) > 9) i = arguments[1] - 1;
    }
    arrElems.splice(i, 1);
    let cell = '#leftSquare #cell' + arrElems[i];
    if (randomInteger(0, 5) > 1 && $(cell).hasClass('waterColor')) {
        for (let i = 0; i < arrElems.length; i++) {
            if ($('#cell' + arrElems[i]).hasClass('.deckColor')) {
                cell = '#cell' + arrElems[i];
                arrElems.splice(i, 1);
                break;
            }
        }
    }
    // Задержка перед выстрелом
    setTimeout(function() {
        if ($(cell).hasClass('ship')) {
            $(cell).removeClass('deckColor waterColor cellColor fireColor').addClass('fireColor');
            checkWinner('#leftSquare');
            opponentShot('boom', i);
        } else {
            $(cell).removeClass('deckColor waterColor cellColor fireColor').addClass('cellColor');
        }
        $('#leftShade').toggle();
        $('#rightShade').toggle();
        whatsShot(true);
    }, 400);
}

// Функция отображает информацию о ходе игрока/противника
function whatsShot(x) {
    if (x) {
        $('#info').html(`<p><h3>Ход игрока ${name}</h3></p>`);
    } else {
        $('#info').html("<p><h3>Ход игрока Компьютер</h3></p>");
        $('#leftShade').toggle();
        $('#rightShade').toggle();
    }
}

// Проверка на победителя
function checkWinner(square) {
    let wins = 0;
    for (let i = minElem; i < maxElem; i++) {
        if ($(square + ' #cell' + i).hasClass('fireColor')) wins++;
    }
    if (wins === 20) {
        name = (square === '#leftShade') ? 'Компьютер' : name;
        $('#info').html(`<p><h3 id="blinkText">Игрок ${name} победил!</h3></p>`);
        paintingSquare(' ', true);
        $('#leftShade').show();
        $('#rightShade').show();
    }
}

// Сервисная функция для закрашивания ячеек
function paintingSquare(square) {
    for (let i = minElem; i < maxElem; i++) {
        let $rightSquare = $('#rightSquare #cell' + i);
        if (arguments[1]) {
            if ($rightSquare.hasClass('ship waterColor') || $rightSquare.hasClass('ship flagColor'))
                $('#rightSquare #cell' + i).removeClass('deckColor waterColor cellColor fireColor').addClass('deckColor');
            else if ($('#rightSquare #cell' + i).hasClass('fireColor')) {
                continue;
            } else if ($('#rightSquare #cell' + i).hasClass('cellColor')) {
                continue;
            } else {
                $('#rightSquare #cell' + i).removeClass('deckColor waterColor cellColor fireColor').addClass('waterColor');
            }
        } else {
            if ($(square + ' #cell' + i).hasClass('cellColor')) {
                $(square + ' #cell' + i).removeClass('deckColor waterColor cellColor fireColor').addClass('waterColor');
            }
            if ($rightSquare.hasClass('ship')) {
                $rightSquare.removeClass('deckColor waterColor cellColor fireColor').addClass('waterColor');
                $rightSquare.click(function() {
                    shot(this, true);
                });
            } else {
                $(square + ' #cell' + i).click(function() {
                    shot(this, false);
                });
            }
        }
    }
}
let letters = ['а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'к'];
let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

// Добавляение букв и цифр к полям
function addTextToSquares() {
    for (let i = 0; i < 10; i++) {
        $('#' + 'left' + 'TextLeft').append('<span>' + numbers[i] + '</span>');
        $('#' + 'left' + 'Text').append('<span>' + letters[i] + '</span>');
        $('#' + 'right' + 'TextLeft').append('<span>' + numbers[i] + '</span>');
        $('#' + 'right' + 'Text').append('<span>' + letters[i] + '</span>');
    }
}
clearSquares();
addTextToSquares();
$('.cell').removeClass('cellColor');