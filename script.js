let price = 8.08; //Equivalent to Ghc100 on 01/27/2024
let cid = [
    ['CENT', 1.1],
    ['NICKEL', 5],
    ['DIME', 9],
    ['QUARTER', 20],
    ['ONE', 70],
    ['TWO', 120],
    ['FIVE', 250],
    ['TEN', 400],
    ['TWENTY', 600],
    ['FIFTY', 1000],
    ['ONE HUNDRED', 1000]
];

const displayChangeDue = document.getElementById('change-due');
const cash = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const displayPrice = document.getElementById('price');
const displayCashInDrawer = document.getElementById('cash-in-drawer');

const displayResults = (status, change) => {
    displayChangeDue.innerHTML = `<h3>Status: ${status}</h3>`;
    change.map(
        money => (displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
    );
    return;
};

const checkCashRegister = () => {
    if (Number(cash.value) < price) {
        alert('Customer does not have enough money to purchase the item');
        cash.value = '';
        return;
    }

    if (Number(cash.value) === price) {
        displayChangeDue.innerHTML =
        '<h3>No change due - customer paid with exact cash</h3>';
        cash.value = '';
        return;
    }

    let changeDue = Number(cash.value) - price;
    let reversedCid = [...cid].reverse();
    let denominations = [100, 50, 20, 10, 5, 2, 1, 0.25, 0.1, 0.05, 0.01];
    let result = { status: 'OPEN', change: [] };
    let totalCID = parseFloat(
        cid
        .map(total => total[1])
        .reduce((prev, curr) => prev + curr)
        .toFixed(2)
    );

    if (totalCID < changeDue) {
        return (displayChangeDue.innerHTML = '<h3>Status: INSUFFICIENT_FUNDS</h3>');
    }

    if (totalCID === changeDue) {
        formatResults('CLOSED', cid);
    }

    for (let i = 0; i < reversedCid.length; i++) {
        if (changeDue > denominations[i] && changeDue > 0) {
        let count = 0;
        let total = reversedCid[i][1];
        while (total > 0 && changeDue >= denominations[i]) {
            total -= denominations[i];
            changeDue = parseFloat((changeDue -= denominations[i]).toFixed(2));
            count++;
        }
        result.change.push([reversedCid[i][0], count * denominations[i]]);
        }
    }
    if (changeDue > 0) {
        return (displayChangeDue.innerHTML = '<h3>Status: INSUFFICIENT_FUNDS</h3>');
    }

    displayResults(result.status, result.change);
    updateUI(result.change);
};

const checkResults = () => {
  if (!cash.value) {
    return;
  }
  checkCashRegister();
};

const updateUI = change => {
  const currencyNameMap = {
    CENT: 'Cents',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    TWO: "Twos",
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    FIFTY: "Fifties",
    'ONE HUNDRED': 'Hundreds',
  };
  // Update cid if change is passed in
  if (change) {
    change.forEach(changeArr => {
      const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
      targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
    });
  }

  cash.value = '';
  displayPrice.textContent = `Total cost: $${price}`;
  displayCashInDrawer.innerHTML = `<h3><strong>Cash in drawer:</strong></h3>
    ${cid
      .map(money => `<p>${currencyNameMap[money[0]]}: $${money[1]}</p>`)
      .join('')}  
  `;
};

purchaseBtn.addEventListener('click', checkResults);

cash.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    checkResults();
  }
});

updateUI();
