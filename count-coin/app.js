// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {

        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
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

      /*    deleteItem: function(type, id) {
            var myArray = data.allItems[type];
            myArray.forEach(function(current, index, array) {
                if(current.id === id) {
                    array.pop(current);
                }
            })
        }, 
        */

        deleteItem: function(type, id) {

            var ids, index;
            ids = data.allItems[type].map(function(current, index, array) {
                return current.id;
            });
            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }


        },

        calculateBudget: function() {
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;
            
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current, index, array) {
                current.calcPercentage(data.totals.inc);
            })
        },

        getPercentage: function() {
            var allPercentages = data.allItems.exp.map(function(current, index, array) {
                return current.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateContainer: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var sliceNum;
        num = Math.abs(num);
        num = num.toFixed(2);

        splitNum = num.split('.');

        int = splitNum[0];
        dec = splitNum[1];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }

    var nodeListForEach = function(list, callback) {
        for(var i =0; i < list.length; i++) {
            callback(list[i], i);
        }
    };


    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.incomeContainer;
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.expenseContainer;
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                current.value = '';
            });

            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercetnages: function(percentage) {

            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {
                if(percentage[index] > 0) {
                    current.textContent = percentage[index] + '%';
                } else {
                    current.textContent = '---';
                }
            })

        },

        displayDate: function() {
            var now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(DOMStrings.dateContainer).textContent = months[month] + ' ' + year;

        },

        formatNumber: function(num, type) {
            num = Math.abs(num);
            num = num.toFixed(2);
            console.log(num);
        },

        changeStyle: function() {
            var fields = document.querySelectorAll
            (DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            })

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');

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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeStyle);
    }

    var updateBugdet = function () {
        // 5.Calculate the budget
        budgetCtrl.calculateBudget();

        // 6.Return the budget
        var budget = budgetCtrl.getBudget();

        // 7.Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
        // 8.Calculate the percentages
        budgetCtrl.calculatePercentages();

        // 9.Read percentages
        var percentages = budgetCtrl.getPercentage();

        // 10.Update teh UI with new percentages
        UICtrl.displayPercetnages(percentages);
    }

    var ctrlAddItem = function () {

        var input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear input fields
            UICtrl.clearFields();

            // 5.Calculate and update the budget
            updateBugdet();

            // 8.Calculate and update percentages
            updatePercentages();
        }

    }

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }
        // Delete item from the data
        budgetCtrl.deleteItem(type, ID);

        // Delete item from the UI
        UICtrl.deleteListItem(itemID);

        // Update and show the budget
        updateBugdet();

        // Calculate percentages
        updatePercentages();
        
    }

    return {
        init: function () {
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            UICtrl.displayDate();
            console.log('Application started');
        }
    }

})(budgetController, UIController);

controller.init();