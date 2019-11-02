// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };

    return {
        addItem: function (type, desc, val) {
            var newItem, id;

            // Create the id
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // Create new item based on type: inc or exp
            if (type === 'exp') {
                newItem = new Expense(id, desc, val);
            } else if (type === 'inc') {
                newItem = new Income(id, desc, val);
            }
            // Add the created item to data array
            data.allItems[type].push(newItem);

            // Return the created item
            return newItem;
        },
        testingData: function () {
            console.log(data);
        }
    }

})();


// UI CONTROLLER
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    }

})();

// APPLICATION CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    // Setting up an event listeners
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
    }

    var ctrlAddItem = function () {

        var input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        budgetCtrl.testingData();

        // 3. Add the item to UI

        // 4.Calculate the budget

        // 5. Display the budget on the UI
    }


    return {
        init: function () {
            setupEventListeners();
            console.log('Application started');
        }
    }

})(budgetController, UIController);

controller.init();