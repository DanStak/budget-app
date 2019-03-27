//motive
const sun = document.querySelector('.fa-sun');
const moon = document.querySelector('.fa-moon');
const body = document.querySelector('body');


//add transaction
const addTransaction = document.querySelector('.aside__option--operation');
const transaction = document.querySelector('.modalWrapper--transaction');
const operationDate = document.querySelector('.operationDate');


//add category
const addCategory = document.querySelector('.aside__option--category');
const category = document.querySelector('.modalWrapper--category');


//add wallet
const addWallet = document.querySelector('.aside__option--wallet');
const wallet = document.querySelector('.modalWrapper--firstMoney')



//show wallets list
const showWalletList = document.querySelector('.walletButton');
const walletList = document.querySelector('.walletList__ul');



//show categories list
const showCategoryList = document.querySelector('.categoryButton');
const categoryList = document.querySelector('.categoryList__ul');




//show modals
addTransaction.addEventListener('click', () => {
  transaction.classList.add('active');
})

addCategory.addEventListener('click', () => {
  category.classList.add('active');
})

addWallet.addEventListener('click', () => {
  wallet.classList.add('active');
})




//show lists
showWalletList.addEventListener('click', () => {

  walletList.classList.toggle('show');

  if (walletList.classList.contains('show')) {
    showWalletList.innerHTML = 'lista portfeli <i class="fas fa-caret-up"></i>'
  } else {
    showWalletList.innerHTML = 'lista portfeli <i class="fas fa-caret-down"></i>'
  }
})
showCategoryList.addEventListener('click', () => {

  categoryList.classList.toggle('show');

  if (categoryList.classList.contains('show')) {
    showCategoryList.innerHTML = 'lista kategorii <i class="fas fa-caret-up"></i>'
  } else {
    showCategoryList.innerHTML = 'lista kategorii <i class="fas fa-caret-down"></i>'
  }
})




//toggle motive
sun.addEventListener('click', () => {
  body.style.color = 'white';
  body.style.backgroundColor = '#333333';
  sun.classList.toggle('hide');
  moon.classList.toggle('hide');
})

moon.addEventListener('click', () => {
  body.style.color = '#333333';
  body.style.backgroundColor = 'white';
  sun.classList.toggle('hide');
  moon.classList.toggle('hide');
})