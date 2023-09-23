'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Aakash Verma',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-09-08T21:31:17.178Z',
    '2023-09-06T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2023-09-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Sumiran Rawat',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////
//////////////////
// function

const formateMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDay() + 3}`.padStart(2, 0); // max lenght 0 and with 0
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const displaymovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  //slice is used to create the copy of the array so it is not mutatedt to the original array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]); //need to convert these string into javascript obj to
    // use methods
    const displayDates = formateMovementDate(date);
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${i} ${type}</div>
          <div class="movements__date">${displayDates}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
      </div>
      
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};
//console.log(account1);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(inc => inc > 0)
    .reduce((total, inc) => total + inc, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(inc => inc < 0)
    .reduce((total, inc) => total + inc, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(deposit => deposit > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const creatUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(a => a[0])
      .join('');
  });
};
creatUsernames(accounts);

const updateUI = function (acc) {
  calcDisplaySummary(acc);
  calcDisplayBalance(acc);
  displaymovements(acc);
};

const startLogOutTimer = function () {
  // set the time to 2 min
  let time = 120;

  // call the timer every second
  const timer = setInterval(function () {
    // we need to convert it into the string so we can call padStart
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call print the time to the user interface
    labelTimer.textContent = `${min}:${sec}`;
    time--;

    //when the timer zero stop the timer and log out user
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Login to get started`;
    }
  }, 1000);

  return timer;
};

///////////////////////
////////Even handler//
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    //clear the inputs
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur(); // to blure the curser after the login

    containerApp.style.opacity = 100;
    // update UI

    const now = new Date();
    const day = `${now.getDay() + 3}`.padStart(2, 0); // max lenght 0 and with 0
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes() - 8}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year} ${hour}:${min}`;

    if (timer) clearInterval(timer);
    // This is because when we second time login the timer is incremented  twice so we need
    // to remove the previous one

    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add the transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //udate ui
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  // the loan is only granted if the loan amount is greater or equal to the 10% of the loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // update ui
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const uName = inputCloseUsername.value;
  const Pin = Number(inputClosePin.value);
  if (uName === currentAccount.username && currentAccount.pin === Pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //delete account
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = true; // to flip the sort when we click again
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displaymovements(currentAccount, sorted);
  sorted = !sorted; // to flip the sort when we click again
});
//or
// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   displaymovements(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();

//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.username === currentAccount.username
//     );
//     console.log(index);
//     // .indexOf(23)

//     // Delete account
//     accounts.splice(index, 1);

//     // Hide UI
//     containerApp.style.opacity = 0;
//   }

//   inputCloseUsername.value = inputClosePin.value = '';
// });

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////

// ///////////////////////////////////////
// // Looping Arrays: forEach
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`movement ${i + 1} you deposute ${mov}`);
//   } else {
//     console.log(`movement ${i + 1} you withdrawal ${mov}`);
//   }
// }

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`movement ${i + 1} you deposute ${mov}`);
//   } else {
//     console.log(`movement ${i + 1} you withdrawal ${mov}`);
//   }
// });

///////////////////////////////////////
// forEach With Maps and Sets
// Map
// const courses = new Map([
//   ['It', 100],
//   ['CT', 500],
//   ['Biotech', 'NULL'],
// ]);

// courses.forEach(function (val, i, whythese) {
//   console.log(`${i}: ${val}`);
// });

// // Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });
//there is no significant of index in set

// const arr = [1, 2, 3, 4, 5, 6];

// console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr.splice(-1));
// console.log(arr);
// arr.splice(0, 1);
// arr.splice(-3);
// console.log(arr);

// ////////////////////////
// // The Map  //
// const rupeeTodoll = 80;
// let ans;

// ans = movements.map(function (mov) {
//   return mov * rupeeTodoll;
// });
// console.log(movements);
// console.log(ans);

// //by the arrow function
// const arrowWala = movements.map(mov => mov * rupeeTodoll);
// console.log(arrowWala);

// ///////////////////////////
// ////////////////////////////////
// // The filter method//

// const arr = [12, 34, -56, 67, -20, -79, 80, -39];

// const negativewala = arr.filter(el => el < 0);
// console.log(negativewala);

// const positivewala = arr.filter(function (el, i, arr) {
//   return el > 0;
// });

// console.log(positivewala);

// ////////////////////////////////////
// //The reduce Method
// console.log(movements);

// const balance = movements.reduce(function (acc, mov, i, arr) {
//   return acc + mov;
// }, 0);
// console.log(balance);

// //by arrow function
// const balance = movements.reduce((acc, mov) => acc + mov, 0);
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) {
//   balance2 = mov + balance2;
// }
// console.log(balance2);
// console.log(balance2 + 100);

// //calculating the maximum from the reduced
// const max = movements.reduce(function (acc, mov, i) {
//   if (acc < mov) {
//     acc = mov;
//     // return acc; wrong
//   }
//   return acc;
// }, 0);

// console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
*/

// const calcHumanAges = function (ages) {
//   const humanAge = ages.map(function (age, i) {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   console.log(humanAge);
//   return humanAge;
// };
// const ages2 = [16, 6, 10, 5, 6, 1, 4];
// const ages1 = [5, 2, 4, 1, 15, 8, 3];
// const human = calcHumanAges(ages1);

// console.log(human);

// const adultage = human.filter(function (age, i) {
//   return age > 18;
// });

// console.log(adultage);

// const averages = function (ages) {
//   const AverageHumanAge = ages.reduce(function (acc, age, i, arr) {
//     return acc + age;
//   }, 0);

//   return AverageHumanAge / adultage.length;
// };

// console.log(averages(adultage));

// ///////////////////////////////////////
// // The Magic of Chaining Methods

// const uroToUsd = 1.1;
// console.log(movements);

// const totalDepositUsd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * uroToUsd)
//   .reduce((total, mov) => total + mov, 0);

// console.log(totalDepositUsd);

// ///////////////////////////////////////
// // The find Method
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// // console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);
// //diff between find and filter
// //1.the find method only return the fist element stisfying the condition
// //while the filter returns the all
// //2. find returns only the the one element while filter the returns the new array
//
//
//
// SOME AND EVERY METHOD////////////////////////////////////////////////
// console.log(movements);

// //equality
// console.log(movements.includes(-130));
// //
// // SOME METHOD
// //condition
// console.log(movements.some(mov => mov === -130));

// const anydeposit = movements.some(mov => mov > 0);
// console.log(anydeposit);
// //
// //EVERY METHOD
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

//the difference between the some and every method is that every method return the true of the all the conditions are true while the
//some method return true if just one element stisfy the condition

//
//
//
//// FLAT AND FLATMAP//////////////////////////////////////////////////////////////
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const deeparr = [[[1, 2, 3, 4]], 10, [[[5, 6, 7, 8], 11], 12], 13];
// console.log(deeparr.flat()); //'flat' flatten the array to only one level

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMove = accountMovements.flat();
// console.log(allMove);
// const overAllBal = allMove.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBal);

// // by chaining
// const overAllBal2 = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBal2);

// //FLAT MAP
// const overAllBal3 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBal3);
// //flatmap has map as well as flat

//
//
///////////////////////////////
// SORITNGS ////

// //string
// const arr = ['ravi', 'shivang', 'aditya', 'sumix', 'aakash'];
// console.log(arr.sort());
// // there is mutaion i.e changes reflected to the original array
// console.log(arr);

// //Number
// console.log(movements);
// console.log(movements.sort());
// // it will not work because it becaouse by defaoult it treats the number as string

// //we have to use callback function for sorting
// //Assending
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });
// // it can be also written as
// movements.sort((a, b) => a - b);
// console.log(movements);

// //descending
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });
// // another way
// movements.sort((a, b) => b - a);
// console.log(movements);

//
////////////////////////////////////////
// //  MORE WAY TO CREATE AND FILLING THE ARRAY
// const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8, 9));

// // empty array + fill method
// const x = new Array(7);
// x.fill(1, 3, 6); // fill with 1 from index 3 to 6;
// console.log(x);

// console.log(arr);
// console.log(arr.fill(23, 2, 6));

// //array.from
// const z = Array.from({ length: 7 }, () => 1);
// console.log(z);

// const y = Array.from({ length: 7 }, (curr, i) => i + 1);
// console.log(y);

//

//////////////////////////////////////////////
//// WORKING WITH NO. AND DATES  /////////////

///// Converting and checking no.//////

// console.log(23 === 23.0); // true beccause every no. is represented in decimal
// console.log(0.1 + 0.2 == 0.3); //false because no. rep in base 2, glitch😁

// //convering no. to string
// console.log(Number('23'));
// console.log(+'23');

// //pasrsing
// console.log(Number.parseInt('230px')); // string should be start  with number
// console.log(Number.parseFloat('2.3rem '));

// console.log(Number.isNaN(30)); // used to check a value is no. or not
// console.log(Number.isNaN('30')); //false
// console.log(Number.isNaN(+'30x')); //true
// console.log(Number.isNaN(+'30')); //false

// // isFinite best to use
// console.log(Number.isFinite('30')); //false
// console.log(Number.isFinite(+'30')); //true
// console.log(Number.isFinite(+'30px')); //false

// //////////////////////// Math and Rounding /////////////////
// console.log(Math.sqrt(25)); //5
// console.log(25 ** (1 / 2)); //square Root
// console.log(8 ** (1 / 3)); //cubic Root

// console.log(Math.max(12, 13, 15, 16, 30, 27, 13, 18)); //30
// console.log(Math.max(12, 13, 15, 16, '30', 27, 13, 18)); //30
// console.log(Math.max(12, 13, 15, 16, '30px', 27, 13, 18)); //NaN
// //same for min

// // Number that gonna stay with min and max
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// console.log(randomInt(0, 6));

// //Rounding integers
// console.log(Math.trunc(3.9)); // 3
// console.log(Math.floor(3.9)); // 3
// // trunc and floor both are same for positive no.

// console.log(Math.ceil(3.2)); //4
// console.log(Math.ceil('3.2')); //4 this method also do type coersion

// //Rounding decimals
// console.log((2.8).toFixed(0)); //3
// console.log((2.7).toFixed(3)); //2.700
// console.log((2.70198).toFixed(3)); //2.701
// console.log(+(2.7008987).toFixed(2)); //2.7

/////////////////////// Numeric seperator ///////////////////
// for developer it is easy to understand 287,460,789
// const diameter = 287_460_789;
// console.log(diameter); //287460789
// // it is not allowed to place at the beggining of the (no.or .) or end of  the (no. or .(point))

// ///////////////////Big int////////////////////////
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(334837492374238742387428374283742837834723n); // or by using big int
// console.log(BigInt(334837492374238742387428374283742837834723));

// //Operations
// //same as the normal no.
// console.log(1000n + 1000n);
// console.log(10000000n * 10000000n);

// console.log(20n > 15); //true
// console.log(20n === 20); //false, in === no type corsion
// console.log(typeof 20n); //bigint

////////////////// Creating dates ///////////////////////

// // create a date
// const now = new Date();
// console.log(now);

// console.log(new Date(account1.movementsDates[0]));

// // Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());  //day of the week, 0 for sunday
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142256980000));

// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

//////////////////////////// Operations on the dates  ////////////////////////

// const future = new Date(2037, 10, 19, 15, 23);

// const daysPassed = (date1, date2) => Math.abs(date2 - date1);
// const days = daysPassed(new Date(2037, 10, 19), new Date(2037, 10, 28));
// console.log(days / (24 * 60 * 60 * 1000));

//////////////////// Timers //////////////////////////////////////////////////

//setTimeout
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`'here is you pizza' with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('waiting...'); //msg print after 5 sec
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);
// if spinach is present then we see the msg otherwise msg will not be printed

//setInterval
// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000); // in every 1 second the time is printed

// let samay = 10;
// const timer = setInterval(function () {
//   console.log(samay);
//   samay--;
//   if (samay === 5) clearInterval(timer);
// }, 1000);
