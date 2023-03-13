// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  // HTML class and ID
  var DOMstrings = {
    addBtn: '.add__btn',
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    incomeList: '.income__list',
    expenseList: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    allPercentageLabel: '.budget__expenses--percentage',
    containerDiv: '.container',
  };
  var nodeElForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i]);
    }
  };

  return {
    clearItem: function () {
      var nodeEls = document.querySelectorAll(
        DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
      );
      var nodeElsArr = Array.prototype.slice.call(nodeEls);
      nodeElsArr.forEach((el) => (el.value = ''));
      nodeElsArr[0].focus();
    },

    showBudget: function (budget) {
      document.querySelector(DOMstrings.budgetLabel).textContent =
        budget.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent =
        budget.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent =
        budget.totalExp;
      document.querySelector(DOMstrings.allPercentageLabel).textContent =
        budget.percentage;
    },
    // Дэлгэцэнд орлого зарлагыг үзүүлнэ
    showInput: function (type, item) {
      var list, html;
      if (type === 'inc') {
        html = `<div class="item clearfix" id="inc-${item.id}">
        <div class="item__description">${item.desc}</div>
        <div class="right clearfix">
          <div class="item__value">${item.val}</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
             </div>
            </div>
        </div>`;
        list = DOMstrings.incomeList;
      } else {
        html = `<div class="item clearfix" id="exp-${item.id}">
        <div class="item__description">${item.desc}</div>
        <div class="right clearfix">
            <div class="item__value">${item.val}</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
        </div>`;
        list = DOMstrings.expenseList;
      }
      document.querySelector(list).insertAdjacentHTML('beforeend', html);
    },

    // Дэлгэцний оролтуудыг авах функц
    getInput: function () {
      var type = document.querySelector(DOMstrings.inputType).value;
      var description = document.querySelector(
        DOMstrings.inputDescription
      ).value;
      var value = document.querySelector(DOMstrings.inputValue).value;

      return { type, description, value };
    },

    // DOM элемент сонгоход зориулж классуудыг өгөх
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// Санхүүтэй ажиллах контроллер
var fnController = (function () {
  // Орлого үүсгэх
  var Income = function (id, desc, val) {
    this.id = id;
    this.desc = desc;
    this.val = parseInt(val);
  };

  // Зарлага үүсгэх
  var Expense = function (id, desc, val) {
    this.id = id;
    this.desc = desc;
    this.val = parseInt(val);
  };

  var data = {
    items: {
      inc: [],
      exp: [],
    },
    total: {
      inc: 0,
      exp: 0,
    },
    percentage: 0,
    budget: 0,
  };

  var calcTusuv = function (type) {
    var sum = 0;
    data.items[type].forEach((el) => (sum += el.val));
    console.log(sum);
    data.total[type] = sum;
  };

  var calcPercentage = function () {
    if (data.total.inc === 0) data.percentage = 0;
    else
      data.percentage = Math.round(
        (data.total['exp'] / data.total['inc']) * 100
      );
    data.budget = data.total.inc - data.total.exp;
  };

  return {
    // Item ycтгах
    deleteItem: function (type, id) {
      var ids = data.items[type].map((el) => el.id);
      var x = ids.indexOf(id);
      console.log(x);
    },

    // Төсвийг тооцоолох
    calcBudget: function () {
      calcTusuv('inc');
      calcTusuv('exp');
      calcPercentage();
      return {
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage,
        budget: data.budget,
      };
    },

    // Дэлгэцнээс авсан утгуудыг хадгална
    saveInput: function (type, desc, val) {
      var id, item;

      // Орлого зарлагын массивт ямар нэгэн орлого оруулаагүй бол id = 1 утга оруулна
      if (data.items[type].length === 0) id = 1;
      else {
        // Утга оруулсан бол хамгийн сүүлийн утгын id-г 1-р нэмэгдүүлнэ
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      // Орлого бол орлогын зарлага бол зарлагын обьект үүсгэнэ
      if (type === 'inc') {
        item = new Income(id, desc, val);
      } else item = new Expense(id, desc, val);

      // Орлого зарлагаа тохирох массивт хадгална
      data.items[type].push(item);

      // Хадгалсан орлого юмуу зарлагаа буцаана
      return item;
    },
    seeData: function () {
      return data;
    },
  };
})();

// Дэлгэц болон Санхүүг холбох контроллер
var appController = (function (uiCtrl, fnCtrl) {
  // Орлого зарлага нэмэх удирдлага
  var ctrlAddItem = function () {
    // 1. Дэлгэцнээс оролтуудыг авна
    var input = uiCtrl.getInput();

    if (input.description !== '' && input.value !== '') {
      // 2. Санхүүгийн контроллерт дамжуулж тэнд хадгална
      var item = fnController.saveInput(
        input.type,
        input.description,
        input.value
      );

      // 3. Дэлгэцэнд оруулсан оролтыг үзүүлнэ
      uiCtrl.showInput(input.type, item);
      uiCtrl.clearItem();

      // 4. Төсвийг тооцоолно
      var budget = fnController.calcBudget();

      // 5. Эцсийн үлдэгдлийг тооцоолно
      // 6. Дэлгэцэнд тооцоог харуулна
      uiCtrl.showBudget(budget);
    }
  };

  // Event listeners тохируулах функц
  var setupEventListeners = function () {
    // DOM
    var DOM = uiCtrl.getDOMstrings();

    // Дэлгэцний зөв тэмдэг дээр дарахад ажиллах функц
    document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

    // Дэлгэцэн дээр enter дарахад ажиллах функц
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        ctrlAddItem();
      }
    });

    // Дэлгэцнээс устгах эвент листенер
    document
      .querySelector(DOM.containerDiv)
      .addEventListener('click', function (e) {
        var typeAndId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        var typeAndIdArr = typeAndId.split('-');
        var type = typeAndIdArr[0];
        var id = typeAndIdArr[1];
        fnController.deleteItem(type, id);
      });
  };

  return {
    init: function () {
      console.log('Programm started');
      uiController.showBudget({
        totalInc: 0,
        totalExp: 0,
        percentage: 0,
        budget: 0,
      });
      setupEventListeners();
    },
  };
})(uiController, fnController);

appController.init();
