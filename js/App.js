// form adding first balance
const firstMoneyForm = document.querySelector('.modalWrapper__form--firstMoney');
const firstMoneyInput = document.querySelector('.firstMoney__input');
const firstNameInput = document.querySelector('.firstName__input');
const modalWrapperFirstMoney = document.querySelector('.modalWrapper--firstMoney');


//forms 
const formTransaction = document.querySelector('.modalWrapper__form--transaction');
const formCategory = document.querySelector('.modalWrapper__form--category');
const transactionList = document.querySelector('.main__ul');


//popups
const modalWrapperTransaction = document.querySelector('.modalWrapper--transaction');


//transaction buttons (edit and remove)
const ulMain = document.querySelector('.main__ul');


//add category section 
const modalWrapperCategory = document.querySelector('.modalWrapper--category');
const categoryForm = document.querySelector('.modalWrapper__form--category');
const categoryDeleteButton = document.querySelector('.category__delete');
const categoryUl = document.querySelector('.categoryList__ul');

//add wallet
const walletListUl = document.querySelector('.walletList__ul');
const wallets = [];
let obiect = [];
let checkName = [];


//-----------------------------------------------------------------------------------------------------

class App {
  constructor(money, name) {
    // infomations in header
    this.firstMoney = document.querySelector('.stats__firstMoney');
    this.income = document.querySelector('.stats__income');
    this.expense = document.querySelector('.stats__expense');
    this.equal = document.querySelector('.stats__equal');



    // add transactions form popup
    this.operationName = document.querySelector('.operationName');
    this.operationAmount = document.querySelector('.operationAmount');
    this.operationCategory = document.querySelector('.operationCategory');
    this.operationDate = document.querySelector('.operationDate');
    this.isIncome = document.querySelector('.plus');



    //main 
    this.mainUl = document.querySelector('.main__ul');



    // organisation
    this.stats = [];
    this.listOfTransactions = [];
    this.id = 0;
    this.name = name;
    this.money = money;
    this.expColors = [];
    this.incColors = [];

    //charts
    this.ctx1 = document.getElementById('myChart1').getContext('2d');
    this.ctx2 = document.getElementById('myChart2').getContext('2d');

    this.expenseCategories = [];
    this.incomeCategories = [];
    this.expenseValue = [];
    this.incomeValue = [];

    this.valuesToChartExpense = 0;
    this.valuesToChartIncome = 0;

    this.chart1;
    this.chart2;


  }

  randomColor = () => {
    const tab = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += tab[Math.floor(Math.random() * tab.length)];
    }

    return color;

  };

  showFirstMoney = () => {
    this.firstMoney.textContent = this.money;
    this.calculateFinances();

    this.chart1 = new Chart(this.ctx1, {
      type: 'pie',
      data: {
        labels: this.expenseCategories,
        datasets: [{
          // label: 'My first label',
          data: this.valuesToChartExpense,
          backgroundColor: this.expColors,
          borderColor: 'red',
          borderWidth: 1

        }],
      },

      options: {
        title: {
          display: true,
          text: 'Wydatki',
          position: 'top',
        },
        legend: {
          fullWidth: true
        }
      }
    })

    this.chart2 = new Chart(this.ctx2, {
      type: 'pie',
      data: {
        labels: this.incomeCategories,
        datasets: [{
          // label: 'My first label',
          data: this.valuesToChartIncome,
          backgroundColor: this.incColors,
          borderColor: 'green',
          borderWidth: 1
        }],
      },

      options: {
        title: {
          display: true,
          text: 'Przychody',
          position: 'top',
        },
        legend: {
          fullWidth: true
        }
      }
    })

    this.randomColor();
  }

  addTransaction = () => {

    const title = this.operationName.value;
    const amount = this.operationAmount.value;
    const category = this.operationCategory.value;
    const date = this.operationDate.value;
    const income = this.isIncome.checked;

    // console.log(amount);

    // console.log(title, amount, category, date, income);

    if (title === '' || amount === '' || category === '' || date === '') {
      alert('Wsystkie pola muszą być wypełnione')
    }

    else {
      const stat = {
        title,
        amount,
        category,
        date,
        income,
        id: this.id,
      }

      // push stat to main stats array and start next function
      this.stats.push(stat);

      //making arrays to charts-

      this.makeChartData(stat);

      // Updating charts

      this.updateCharts();

      //calculating

      this.calculateFinances();
      this.addToMainUl(stat);


      // reset form inputs
      this.id++;
      this.operationName.value = '';
      this.operationAmount.value = '';
      this.operationCategory.value = '';
      this.operationDate.value = '';
      this.isIncome.checked = false;

    }
  }

  calculateFinances = () => {
    const fullMoney = parseFloat(this.money);
    const { expense, income } = this.expenseOrIncome();
    const restMoney = fullMoney + income - expense;
    this.equal.textContent = restMoney.toFixed(2);

    if (restMoney > 0) {
      this.equal.style.color = 'rgb(39, 87, 20)';
    } else if (restMoney < 0) {
      this.equal.style.color = 'rgb(160, 48, 48)';
    } else this.equal.style.color = '#333333';


  }

  expenseOrIncome = () => {
    let expense = 0;
    let income = 0;

    // filter main stats table to income and expense
    const expenseTab = this.stats.filter(item => item.income == false);
    const incomeTab = this.stats.filter(item => item.income == true)

    // main condition to calculate expenses and incomes
    if (this.stats.length > 0) {

      expense = expenseTab.reduce((acc, curr) => {
        acc += parseFloat(curr.amount);
        return acc;
      }, 0);

      income = incomeTab.reduce((acc, curr) => {
        acc += parseFloat(curr.amount);
        return acc;
      }, 0)
    }

    // show results in header
    this.income.textContent = income.toFixed(2);
    this.expense.textContent = expense.toFixed(2);

    return { expense, income };
  }

  addToMainUl = (stat) => {
    //destructuring
    const { id, title, income, amount, date, category } = stat

    //Creating li element
    const li = document.createElement('li');
    li.classList.add('main__li');
    li.dataset.id = id;
    !stat.income ? li.style.backgroundColor = 'rgb(207, 123, 123)' : li.style.backgroundColor = 'rgb(125, 161, 105)';
    li.innerHTML = `<button class='li__button li__button--delete'><i class="fas fa-times"></i></button>
    <span class='name'>${title}</span>
    <span class='amount'> ${!income ? '-' + parseFloat(amount).toFixed(2) : '+' + amount}zł</span>
    <span class='date'>${date}</span>
    <span class='category'>${category}</span>
    <button class='li__button li__button--edit'><i class="fas fa-edit"></i></button>`;

    // Adding li element to listOfTransactions array
    this.listOfTransactions.push(li);

    //activate render function whitch is refreshing list
    this.renderList();
  }

  renderList = () => {
    this.mainUl.textContent = '';

    this.listOfTransactions.forEach((item, index) => {
      item.dataset.key = index;
      this.mainUl.prepend(item);
    });

  }

  removeTransaction = (li) => {
    //remove from stats
    const id = parseInt(li.dataset.id);
    const chosedStat = this.stats.filter(item => item.id === id);
    const actualStats = this.stats.filter(item => item.id !== id);
    this.stats = actualStats;


    //remove from charts

    this.removeFromCharts(chosedStat);


    //Updating charts
    this.updateCharts();

    //remove from view
    li.remove();

    //remove from listOfTransactions
    const index = li.dataset.key;
    this.listOfTransactions.splice(index, 1);

    //rendering main ul
    this.renderList();

    //refresh informations about money in header
    this.calculateFinances();
  }

  showEditTransaction = (li) => {
    // catch values
    const id = parseInt(li.dataset.id);
    const statObiect = this.stats.filter(item => item.id === id);



    // console.log(statObiect);
    //remove from stats
    const actualStats = this.stats.filter(item => item.id !== id);
    this.stats = actualStats;

    // show values
    this.operationName.value = statObiect[0].title;
    this.operationAmount.value = statObiect[0].amount;
    this.operationCategory.value = statObiect[0].category;
    this.operationDate.value = statObiect[0].date;
    this.isIncome.checked = statObiect[0].income;

    //remove from charts
    this.removeFromCharts(statObiect);

    //Updating charts
    this.updateCharts();

    //remove from view
    li.remove();

    //remove from listOfTransactions
    const index = li.dataset.key;
    this.listOfTransactions.splice(index, 1);

    //rendering main ul
    this.renderList();

    //refresh informations about money in header
    this.calculateFinances();
  }

  //FUNCTIONS TO MANAGE CHARTS
  removeFromCharts = (chosedStat) => {
    //remove from charts--------------
    let indexExp;
    let indexInc;

    if (this.expenseCategories.length > 0) {
      indexExp = this.expenseCategories.indexOf(chosedStat[0].category);
    }

    if (this.incomeCategories.length > 0) {
      indexInc = this.incomeCategories.indexOf(chosedStat[0].category);
    }


    if (!chosedStat[0].income && this.valuesToChartExpense[indexExp] > 0) {
      const index2Exp = this.expenseValue[indexExp].indexOf(chosedStat[0].amount);
      this.expenseValue[indexExp].splice(index2Exp, 1);
    }

    if (chosedStat[0].income && this.valuesToChartIncome[indexInc] > 0) {
      const index2Inc = this.incomeValue[indexInc].indexOf(chosedStat[0].amount);
      this.incomeValue[indexInc].splice(index2Inc, 1);
    }

    //updating arrays used in charts
    this.calculateChartValues();


    //cleaning values if empty (chart)
    if (!chosedStat[0].income && this.valuesToChartExpense[indexExp] <= 0) {
      this.expenseCategories.splice(indexExp, 1);
      this.expenseValue.splice(indexExp, 1);
    }

    if (chosedStat[0].income && this.valuesToChartIncome[indexInc] <= 0) {
      this.incomeCategories.splice(indexInc, 1);
      this.incomeValue.splice(indexInc, 1);
    }
  }

  makeChartData = (stat) => {
    const lengthBeforeExp = this.expenseCategories.length;
    const lengthBeforeInc = this.incomeCategories.length;


    if (!stat.income && this.expenseCategories.every(item => item !== stat.category)) {
      this.expenseCategories.push(stat.category);
    }

    if (stat.income && this.incomeCategories.every(item => item !== stat.category)) {
      this.incomeCategories.push(stat.category);
    }

    const lengthAfterExp = this.expenseCategories.length;
    const lengthAfterInc = this.incomeCategories.length;


    if (lengthBeforeExp < lengthAfterExp) {
      this.expenseValue.push([]);
    }

    if (lengthBeforeInc < lengthAfterInc) {
      this.incomeValue.push([]);
    }

    if (lengthBeforeExp < lengthAfterExp) {
      const colorExp = this.randomColor();
      this.expColors.push(colorExp);
    }

    if (lengthBeforeInc < lengthAfterInc) {
      const colorInc = this.randomColor();
      this.incColors.push(colorInc);
    }

    if (!stat.income && this.expenseCategories.indexOf(stat.category) !== -1) {
      const index = this.expenseCategories.indexOf(stat.category);
      this.expenseValue[index].push(stat.amount);
      // console.log(this.expenseValue);
    }

    if (stat.income && this.incomeCategories.indexOf(stat.category) !== -1) {
      const index = this.incomeCategories.indexOf(stat.category);
      this.incomeValue[index].push(stat.amount);
      // console.log(this.expenseValue);
    }


    this.calculateChartValues();
  }

  calculateChartValues = () => {
    this.valuesToChartExpense = this.expenseValue.map(item => item.reduce((acc, curr) => {
      acc += parseFloat(curr);
      return acc;
    }, 0));

    this.valuesToChartIncome = this.incomeValue.map(item => item.reduce((acc, curr) => {
      acc += parseFloat(curr);
      return acc;
    }, 0));
  }

  updateCharts = () => {
    // console.log(this.chart1);
    // console.log(this.chart2);
    //chart1
    this.chart1.data.datasets[0].data = this.valuesToChartExpense;
    this.chart1.data.labels = this.expenseCategories;
    this.chart1.update(this.chart1.config)

    //chart2
    this.chart2.data.datasets[0].data = this.valuesToChartIncome;
    this.chart2.data.labels = this.incomeCategories;
    this.chart2.update(this.chart2.config)
  }

  destroyCharts = () => {
    this.chart1.destroy();
    this.chart2.destroy();
  }

}



//----------------------------------------------------------------------------------------

class Categories {
  constructor() {

    this.categoryUl = document.querySelector('.categoryList__ul')

    this.categoryName = document.querySelector('.categoryName');

    this.operationCategory = document.querySelector('.operationCategory');

    this.categories = ['jedzenie', 'rozrywka', 'samochód', 'dom', 'odzież', 'elektronika', 'zdrowie i uroda', 'dzieci', 'praca']
  }

  renderCategoryList = () => {
    // clean lists before appending
    this.categoryUl.innerHTML = '';
    this.operationCategory.innerHTML = '';

    // generate lists
    this.categories.forEach((item, index) => {
      // creating elements
      const li = document.createElement('li');
      const option = document.createElement('option');

      //adding attributes and content to elements
      li.innerHTML = `<span>${item}</span><button class='category__delete'><i class="fas fa-times"></i></button>`;
      li.dataset.key = index;
      option.value = item;
      option.innerHTML = item;

      //appending elements to lists
      this.categoryUl.appendChild(li);
      this.operationCategory.appendChild(option);
    })
  }

  addCategory = () => {
    if (this.categoryName.value !== '') {
      const categoryValue = this.categoryName.value;
      this.categories.push(categoryValue);
      this.renderCategoryList();
      this.categoryName.value = ''
    } else alert('nazwa kategorii nie może być pusta')

  }

  removeCategory = (li) => {
    // catching li key value
    const key = parseInt(li.dataset.key);

    //creating new array without clicked element
    const newCategoryList = this.categories.filter((item, index) => index !== key);

    // replacing this.categories on actula categories list
    this.categories = newCategoryList;

    //removing li from DOM
    li.remove();

    //rendering list
    this.renderCategoryList();
  }
}


//----------------------------------------------------------------------------------------


// manage created wallets
startApp = (money, name) => {
  const app = new App(money, name);

  if (obiect.length > 0) {
    obiect[0].destroyCharts();
  }


  wallets.push(app);

  obiect = wallets.filter(wallet => wallet.name === name);

  // console.log(obiect);

  obiect[0].showFirstMoney();
  obiect[0].renderList();
  renderWalletsList();
}

//creating wallets
firstMoneyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const money = firstMoneyInput.value;
  const name = firstNameInput.value;

  //checked is wallet name diffrent than others
  let wasIt = false;

  if (name !== '' && money !== '') {
    if (checkName.length === 0) {
      checkName.push(name);
      wasIt = true;
    } else if (checkName.length > 0) {
      wasIt = checkName.every(checked => checked !== name);
    }

    // console.log(wasIt);

    if (wasIt && money >= 0) {
      checkName.push(name);
      startApp(money, name);
      modalWrapperFirstMoney.classList.remove('active');
      firstMoneyInput.value = '';
      firstNameInput.value = '';
    } else alert('3)PORTFELE NIE MOGĄ NAZYWAĆ SIĘ TAK SAMO');
  } else alert('1)POLE NIE MOŻE BYĆ PUSTE 2)WARTOŚC MUSI BYĆ WIĘKSZA LUB RÓWNA 0');


})

//add transaction
formTransaction.addEventListener('submit', (e) => {
  e.preventDefault();
  obiect[0].addTransaction();
  modalWrapperTransaction.classList.remove('active');

})



//delete and edit transactions
ulMain.addEventListener('click', (e) => {

  if (e.target.parentElement.classList.contains('li__button--delete')) {
    obiect[0].removeTransaction(e.target.parentElement.parentElement)
  }
  if (e.target.parentElement.classList.contains('li__button--edit')) {
    obiect[0].showEditTransaction(e.target.parentElement.parentElement);
    modalWrapperTransaction.classList.add('active');

  }
})




//create new categoryy obiect when DOM is loaded and manage categories, create and delete
startCategories = () => {
  const category = new Categories();

  category.renderCategoryList();

  categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    category.addCategory()
    modalWrapperCategory.classList.remove('active');
  })

  categoryUl.addEventListener('click', (e) => {

    if (e.target.parentElement.classList.contains('category__delete')) {
      category.removeCategory(e.target.parentNode.parentNode);
    }
  })
}

// refreshing wallets list
renderWalletsList = () => {
  walletListUl.innerHTML = '';

  wallets.forEach(wallet => {
    const li = document.createElement('li');
    li.innerHTML = `<button>${wallet.name}</button>`
    li.dataset.name = wallet.name;
    walletListUl.appendChild(li);
  })
}


//toggle wallets 
toggleWallet = (e) => {

  if (e.target.parentNode.dataset.name) {
    const name = e.target.parentNode.dataset.name;

    obiect[0].destroyCharts();

    obiect = wallets.filter(wallet => wallet.name === name);


    obiect[0].showFirstMoney();
    obiect[0].renderList();
    obiect[0].calculateFinances();
    obiect[0].updateCharts();
  }
}


window.addEventListener('DOMContentLoaded', startCategories);
walletListUl.addEventListener('click', toggleWallet);


