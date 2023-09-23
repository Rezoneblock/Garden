// ЯБЛОКО
class Apple {
  constructor(treeId, appleId, newBorn, applesGeneration) {
    
    if (newBorn) { // Возраст
      this.id = `tree#${treeId+1}_apple#${appleId+1}_gen#${applesGeneration}`; // Идентификатор новорожденного яблока
      this.old = 0; // Только родившееся - 0 
    } else {
      this.old = Math.round(Math.random() * (28 - 1) + 1); // Изначальное - рандом от 0 до 28 
      this.id = `tree#${treeId+1}_apple#${appleId+1}`; 
    }

    switch (true) {
      case (this.old < 15): 
        this.color = 'green';
        break;
      case (this.old >= 15 && this.old < 25): 
        this.color = 'yellow';
        break;
      case (this.old >= 25): 
        this.color = 'red';
        break;
    }

    this.size = 0; // Размер
    this.roted = 0; // Сгнило (0 - нет; 1 - да)
    this.fallen = 0; // Упало (0 - нет, 1 - да)
  }

  fall() {
    this.fallen = 1; // упало
  }

  rot() {
    this.roted = 1; // сгнило
  }
}


// ДЕРЕВО
class Tree {
  constructor(treeId, initAppleCount, applesGeneration) {
    this.id = `tree#${treeId+1}`; // Идентификатор дерева
    this.apples = Array.apply(null, Array(initAppleCount)).map(function (appleVal, appleIndex) { // Создаём массив с яблоками
      return new Apple(treeId, appleIndex, false);
    })
    this.applesOnTreeCounter = this.apples.length; // Обновляем счётчик яблок
    this.createTree(); // Создаём дерево в html
  }

  
  createTree() { // Метод создания дерева в html
    let tree = document.createElement('div'); // Создаём елемент дерева
    tree.classList.add('tree'); // Стили
    tree.setAttribute('data-id', `${this.id}`); // Идентификатор   
    
    let appleCounter = document.createElement('span'); // Создать счётчик яблок
    appleCounter.innerHTML = `Яблок на дереве: ${this.applesOnTreeCounter}`; // Указать текущее кол-во яблок 
    
    let applesWrapper = document.createElement('div'); // Яблоки дерева 
    applesWrapper.classList.add('apples-wrapper');
    
    
    this.createHtmlApples(applesWrapper);
    
    tree.append(appleCounter, applesWrapper); // Добавляем счётчик яблок в дерево html
    document.querySelector('.trees-wrapper').append(tree); // Добавляем дерево в сад html
  }


  createHtmlApples(applesWrapper) {
    this.apples.forEach(function(apple, appleIndex) {
      if (!document.querySelector(`[data-id="${apple.id}"]`)) {
        let appleHtml = document.createElement('div');
        appleHtml.classList.add('apple');
        appleHtml.setAttribute('data-id', `${apple.id}`);
        let appleOld = document.createElement('span');
        appleOld.classList.add('apple-old');
        appleOld.innerHTML = `${apple.old}`;
        switch (apple.color) {
          case 'green': 
            appleHtml.style.backgroundImage = "url('img/greenApple.png')"
            break;
          case 'yellow': 
            appleHtml.style.backgroundImage = "url('img/yellowApple.png')"
            break;
          case 'red': 
            appleHtml.style.backgroundImage = "url('img/redApple.png')"
            break;
        }
        appleHtml.append(appleOld);
        applesWrapper.append(appleHtml);
      }
    })
  }
}


// САД
class Garden { 
  constructor(initTreesCount, initApplesCount) {
    this.allApplesCount = initApplesCount*initTreesCount; // Устанавливаем изначальное вол-во всех яблок на деревьях
    this.initHtml(initTreesCount, initApplesCount); // Создаём html сад
    this.gardenOld = 0; // Возраст
    this.applesGeneration = 1; // Генерация яблок по счёту
    this.initTreesCount = initTreesCount; // Изначальное кол-во деревьев
    this.initApplesCount = initApplesCount; // Изначальное кол-во яблок на всех деревьях
    this.trees = Array.apply(null, Array(initTreesCount)).map(function (treeVal, treeIndex) // Создаём массив с деревьями
    { 
      return new Tree(treeIndex, initApplesCount); // Возвращаем дерево 
    });

  
    this.gardenOldHtml = document.querySelector('.old'); // HTML счётчик возраста сада 
    this.oldUpdate(); // Обновляем возраст сада
  }

  initHtml(initTreesCount, initAppleCount) { // Метод создания HTML сада 
    let app = document.createElement('div') // Основной контейнер
    app.classList.add('app');
    document.querySelector('body').append(app);

    let treesWrapper = document.createElement('div'); // Контейнер бля деревьев
    treesWrapper.classList.add('trees-wrapper');

    let btnPassDay = document.createElement('button'); // Кнопка +1 день
    btnPassDay.setAttribute('id', 'btnPassDay');
    btnPassDay.innerHTML = "+1 день";

    let applesCounter = document.createElement('div'); // Счётчик всех яблок на деревьях
    applesCounter.classList.add('apples-counter')
    applesCounter.innerHTML = `Всего яблок на деревьях: ${initTreesCount*initAppleCount}`;

    let oldCounter = document.createElement('div'); // Возраст сада
    oldCounter.classList.add('old');

    app.append(oldCounter, applesCounter, btnPassDay, treesWrapper); // Добавляем всё в HTML
  }

  passDay() { // Метод пропуска суток
    this.trees.map((treeVal, treeIndex, treesArray) => { // Перебираем все деревья
      treeVal.apples = treeVal.apples.filter((appleVal, appleIndex, appleArray) => { // Перебираем все яблоки на дереве
        appleVal.old++; // Увеличиваем возраст яблока
        if (appleVal.old < 31) {
          document.querySelector(`[data-id="${appleVal.id}"]`).querySelector('.apple-old').innerHTML = appleVal.old; // Меняем возраст яблока на дереве html
        }
        switch (true) {
          case (appleVal.old < 15): // от 1 до 15 (дней)
            appleVal.color = 'green';
            document.querySelector(`[data-id="${appleVal.id}"]`).style.backgroundImage = "url('img/greenApple.png')"; // Зелёное 
            break;
          case (appleVal.old >= 15 && appleVal.old < 25): // от 15 до 25 (дней)
            appleVal.color = 'yellow';
            document.querySelector(`[data-id="${appleVal.id}"]`).style.backgroundImage = "url('img/yellowApple.png')"; // Жёлтое
            break;
          case (appleVal.old >= 25 && appleVal.old < 31): // от 25 до 35 (дней)
            appleVal.color = 'red';
            document.querySelector(`[data-id="${appleVal.id}"]`).style.backgroundImage = "url('img/redApple.png')"; // Красное
            break;
          case (appleVal.old == 31): // 31 день
            document.querySelector(`[data-id="${appleVal.id}"]`).style.backgroundImage = "url('img/rotedApple.png')"; // Гнилое
            break;
        }
        switch (appleVal.old) {
          case 30: // На 30 день яблоко падает
            appleVal.fall(); // Ставим свойство

            this.allApplesCount--; // Вычитаем его со списка всех яблок на деревьях
            treeVal.applesOnTreeCounter--; // Вычитаем его со списка яблок на данном дереве

            document.querySelector('.apples-counter').innerHTML = `Всего яблок на деревьях: ${this.allApplesCount}`; // html Всего яблок на деревьях
            document.querySelector(`[data-id="tree#${treeIndex+1}"]`).querySelector('span').innerHTML = `Яблок на дереве: ${treeVal.applesOnTreeCounter}`; // html Яблок на дереве
            break;
          case 31: // на 31 дне начинает гнить
            appleVal.rot(); // Вызываем метод гниения.
            document.querySelector(`[data-id="${appleVal.id}"]`).querySelector('.apple-old').remove();
            break;
          case 32: // на 32 дне удаляются
            document.querySelector(`[data-id="${appleVal.id}"]`).remove(); // Удаляем яблоко из html
            break;
        };
        if (appleVal.old == 32) { // либо возвращаем яблоко обратно (если оно младше 32 дней), либо удаляем.
          return false;
        } else {
          return true;
        }
      })
    })
    this.oldUpdate(); // Обновляем возраст сада
  }


  oldUpdate() { // Метод обновления возраста
    this.gardenOld++; // Увеличиваем возраст сада
    this.gardenOldHtml.innerHTML = `Возраст сада: ${this.gardenOld}`; // Меняем html
    if (this.gardenOld % 30 == 0 && this.gardenOld) {
      this.applesGeneration++;
      this.createApples(); // Создаём яблоко на 30 дне
    }
  }

  createApples() { // Метод создания яблока
    this.trees.map((treeVal, treeIndex) => {
      let randomApplesCount = Math.round(Math.random() * 20); // Рандомное количество новых яблок (от 0 до 20);  
      this.allApplesCount += randomApplesCount; // Увеличиваем общее кол-во яблок; 
      for (let i = 0; i < randomApplesCount; i++) {
        treeVal.apples.unshift(new Apple(treeIndex, treeVal.apples.length, true, this.applesGeneration)); // добавляем яблоко в массив яблок на дереве
      }
      treeVal.applesOnTreeCounter += randomApplesCount; // Увеличиваем кол-во яблок на данном дереве 
      document.querySelector(`[data-id="tree#${treeIndex+1}"]`).querySelector('span').innerHTML = `Яблок на дереве: ${treeVal.applesOnTreeCounter}`; // html
      
      treeVal.createHtmlApples(document.querySelector(`[data-id="tree#${treeIndex+1}"]`).querySelector('.apples-wrapper')); // Создание html яблок
    })
    document.querySelector('.apples-counter').innerHTML = `Всего яблок на деревьях: ${this.allApplesCount}`; // html
  }
}

var garden = null;

window.onload = function() { 
  document.querySelector('#randomSeed').addEventListener('click', function(event) { // Выбрать рандомное кол-во деревьев и яблок
    document.querySelector('#treesInitInput').value = Math.round(Math.random() * 29 + 1) // Рандом до 30, вручную можно указать больше (до 100)
    document.querySelector('#applesInitInput').value = Math.round(Math.random() * 29 + 1) // Рандом до 30, вручную можно указать больше (до 100)
  })
  document.querySelector('#createGardenBtn').addEventListener('click', function(event) { // Сгенерировать сад
    let treesInitElem = document.querySelector('#treesInitInput');
    let treesInitCount = parseInt(treesInitElem.value); // Кол-во деревьев

    let applesInitElem = document.querySelector('#applesInitInput');
    let applesInitCount = parseInt(applesInitElem.value); // Кол-во яблок на деревьях


    applesInitCount ? applesInitCount : applesInitCount = 0; // NaN --> 0
    treesInitCount ? treesInitCount : treesInitCount = 0; // NaN --> 0
    
    
    // Валидация
    if(treesInitCount >= 101 || treesInitCount <= 0) {
      treesInitElem.classList.add('--incorrect');
    } else {
      treesInitElem.classList.remove('--incorrect');
    }
    if(applesInitCount >= 101 || applesInitCount <= 0) {
      applesInitElem.classList.add('--incorrect');
    } else {
      applesInitElem.classList.remove('--incorrect');
    }
    
    if (treesInitCount < 101 && treesInitCount > 0 && applesInitCount < 101 && applesInitCount > 0) {
      
      this.disabled = 'disabled'; // Выключаем кнопку
      document.querySelector('.create-garden').classList.add('--hidden'); // Прячем форму
      
      garden = new Garden(treesInitCount, applesInitCount); // инициализация сада
  
      document.querySelector('#btnPassDay').addEventListener('click', () => { // инициализация метода .passDay() сада
        garden.passDay(); 
      })
    }
    
  })
}



