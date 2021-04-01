// Здесь  представление
var view = {																	//объект представление
	displayMessage: function(msg){                                              //метод,отвечает за вывод сообщений на поле длясообщенй
		var messageArea = document.querySelector('#messageArea');               //присваевает переменную по id к полю для сообщений
		messageArea.innerHTML = msg;                                            //выводит в поле сообщение
	},

	displayHit: function(location){                                             //метод,отвечает за вывод отображение картинки попадания
		var cell = document.getElementById(location);                           //присваевает переменную по id
		cell.setAttribute("class", "hit");                                      //присваевает выбранному элементу класс с названием hit
	},

	displayMiss: function(location){                                            //метод,отвечает за вывод отображение картинки промаха
		var cell = document.getElementById(location);                           //присваевает переменную по id
		cell.setAttribute("class", "miss");                                     //присваевает выбранному элементу класс с названием miss
	},

	displayTableHit: function(kil){
		var cell = document.getElementById(kil);
		cell.setAttribute("class", "kill");
	},
	displayTablePzdc: function(pzdc){
		var cell = document.getElementById(pzdc);
		cell.setAttribute("class", "pzdc");
	}
};
//view.displayTablePzdc("pzdc1");
// Здесь наша модель поведения игры
var model = {                                                                   //объект модель
	boardSize: 7,                                                               //размер игрового поля 7*7
	numShips: 4,                                                                //количество кораблей
	shipLength:3,                                                               //длинна корабля
	shipsSunk: 0,                                                               //количество потопленных кораблей
	ships: [                                                                    //массив с координатами размещения кораблей и попаданий по ним
		{ locations: [0, 0, 0], hits: ["", "", ""], kill:["kill0", "kill1", "kill2"], pzdc:["pzdc1"] },
		{ locations: [0, 0, 0], hits: ["", "", ""], kill:["kill3", "kill4", "kill5"], pzdc:["pzdc2"] },
		{ locations: [0, 0, 0], hits: ["", "", ""], kill:["kill6", "kill7", "kill8"], pzdc:["pzdc3"] },
		{ locations: [0, 0, 0], hits: ["", "", ""], kill:["kill9", "kill10", "kill11"], pzdc:["pzdc4"] }
	],

	fire: function(guess) {                                                     //метод,отвечает за стрельбу по кораблям
		for (var i = 0; i < this.numShips; i++) {                               //цилк перебирает корабли из массива ships
			var ship = this.ships[i];          
			var gag = ship.kill;
			var pzd = ship.pzdc;
			var index = ship.locations.indexOf(guess);                          //присваеваем index-су значение возвращенное indexOf-фом (indexOf-возвращает индекс   //элемента запрошенного в параметрах (),возвращает 0,1,2,, -1-если ничего не найдено		
			if (ship.hits[index] === "hit") {                                   //записаваем в массив ships в массив hits координаты если попали в корабль
				view.displayMessage("ВЫ уже стреляли по этим координатам!");    //вызаваем метод отправки сообщения из объекта viev 
				return true;
			} else if (index >= 0) {                                            //если координаты верны в массмв hits записавается попадание
				ship.hits[index] = "hit";
				view.displayHit(guess);                                         //тут методом вызывается катинка попадания на поле игры
				view.displayMessage("Попадание!");                              //тут методом вызывается сообщение попадания на поле сообщений
				if(index == 0 ){
					view.displayTableHit(gag[0]);
				}else if(index == 1){
					view.displayTableHit(gag[1]);
				}else{
					view.displayTableHit(gag[2]);
				}
				if (this.isSunk(ship)) {                                        //если условие true 
					view.displayMessage("Вы потопили корабль!");                //методом вызывается сообщение 
					this.shipsSunk++;                                           //к свойству объекта shipSunk записывается 1 потопленный корабль
				}					
				view.displayTablePzdc(pzd);
				return true;
			}
		} 
		view.displayMiss(guess);                                                //тут методом вызывается сообщение промаха на поле сообщений
		view.displayMessage("Вы промахнулись.");
		return false;
	},

	isSunk: function(ship) {                                                 //метод,перебирает 'палубы' корабля по очереди
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function() {                                         // Метод создает в модели кораблей массив ships
		var locations;
		for (var i = 0; i < 4; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {                                                  // метод создает  корабли
		var direction = Math.floor(Math.random() * 2);                          //методом рандома выбираем горизонтальное или вертикальное расположение корабля
		var row, col;

		if (direction === 1) {                                                  // если 1 - горизонтально
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else {                                                                // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {                             //цикл работает пока не построит корабль длинной указанной в свойтве shipLength
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));                    //метод(push-добавляет в конец массива элемент и возвращает новую длинну массива)
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return  newShipLocations;
	},
                                                                                
	collision: function(locations) {                                       // метод получает один корабль и проверяет, что тот не перекрывается с другими кораблями
		for (var i = 0; i < this.numShips; i++) {                          //цикл работает пока не переберёт количество кораблей указанное в свойстве numShips
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
};
//здесь контролер объеденяющий работу модели и представления
var controller = {                                                         //объект контроллер
	gusses: 0,                                                             //количество выстрелло сделанное игроком

	processGuess: function(guess){                                         //метод,отвечает за окончание игры и сообщении игроку что он потопил все корабли
		var location = parseGuess(guess);
		if(location){
			this.gusses++;
			var hit = model.fire(location);
			if(hit && model.shipsSunk === model.numShips){
				view.displayMessage("Вы потопили все корабли за: " + this.gusses + " выстрелов");
			}
		}
	},
	retId: function(guess){
		var location = parseGuess1(guess);
		if(location){
			this.gusses++;
			var hit = model.fire(location);
			if(hit && model.shipsSunk === model.numShips){
				view.displayMessage("Вы потопили все корабли за: " + this.gusses + " выстрелов");
			}
		}
	}
}
function parseGuess1(guess){                                              //функция конвертирует систему координат А1...в 10...
	var alphabet = ["0", "1", "2", "3", "4", "5", "6"];
	if(guess === null || guess.length !== 2){                            //если координаты не указанны или длинна больше 2 символов вызов сообщения
		alert("Вы ввели неверные координаты");
	}else{
		firstChar = guess.charAt(0);                                     //извлекаем со строки первый символ методом charAt(0)
		var row = alphabet.indexOf(firstChar);                           //сравниваем методом indexOf первый символ введенный пользователем с массивом символов
		var column = guess.charAt(1);                                    //просто берем второй символ из введенных пользователем
		if(isNaN(row) || isNaN(column)){                                 //проверяем методом isNaN является ли уже конвертированные координаты цифрами
			alert("Вы ввели неверные координаты");                       // если нет выводим сообщение
		}else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){  
			alert("Вы ввели неверные координаты");
		}else{
			return row + column;
		}
	}
	return null;
}

function parseGuess(guess){                                              //функция конвертирует систему координат А1...в 10...
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if(guess === null || guess.length !== 2){                            //если координаты не указанны или длинна больше 2 символов вызов сообщения
		alert("Вы ввели неверные координаты");
	}else{
		firstChar = guess.charAt(0);                                     //извлекаем со строки первый символ методом charAt(0)
		var row = alphabet.indexOf(firstChar);                           //сравниваем методом indexOf первый символ введенный пользователем с массивом символов
		var column = guess.charAt(1);                                    //просто берем второй символ из введенных пользователем
		if(isNaN(row) || isNaN(column)){                                 //проверяем методом isNaN является ли уже конвертированные координаты цифрами
			alert("Вы ввели неверные координаты");                       // если нет выводим сообщение
		}else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){  
			alert("Вы ввели неверные координаты");
		}else{
			return row + column;
		}
	}
	return null;
}


function init() {                                                          //функция,отвечает за нажатие кнопки 'fire' на игровом поле
	var fireButton = document.getElementById("fireButton");                //присваеваем кнопке функцию oneklick
	fireButton.onclick = handleFireButton;                                 //теперь при нажатии мыши будет вызываться финкция handleFireButton

	var guessInput = document.getElementById('guessInput');                //тоже самое для кнопки enter 
	guessInput.onkeypress = handleKeyPress;                                //теперь при нажатии enter будет вызываться финкция handleKeyPress

	model.generateShipLocations();                                         //вызывает метод generateShipLocations 
}

function vvod(){
	var guessInput = event.target.getAttribute('id');
	var guess = guessInput;
	controller.retId(guess); 
}

function handleFireButton(){                                                 //функция,отвечает за ввод координат пользователем
	var guessInput = document.getElementById('guessInput');                  //привязываем по id строко для ввода координат к переменной guessInput
	var guess = guessInput.value;                                            //присваеваем переменной guess координаты введенные пользователем 
	controller.processGuess(guess);                                          //отдаем на обработку контроллеру

	guessInput.value = "";                                                   //стерает значение в троке html
}
function handleKeyPress(e){                                                  //функция,для нажатия кнопки 'fire' кнопкой enter
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13){                                                    //13-индекс кнопки enter
		fireButton.click();                                                  //метод имитирующий нажатие кнопки мышью
		return false;
	}
}
table.onclick = vvod;
window.onload = init;                                                        //вызывает метод/функцию когда страница полностью загружена