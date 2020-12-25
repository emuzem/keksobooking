'use strict'

const selectType = document.querySelector('#type');
const price = document.querySelector('#price');
selectType.addEventListener('change', () => {
    syncTypeAndPrice(selectType, price);
});

function syncTypeAndPrice(select, price){
    if (select.value === 'bungalo'){
        price.placeholder = "0";
        price.min = 0;
    } else if (select.value === 'flat'){
        price.placeholder = "1000";
        price.min = 1000;
    } else if (select.value === 'house'){
        price.placeholder = '5000';
        price.min = 5000;
    } else if (select.value === 'palace'){
        price.placeholder = '10000';
        price.min = 10000;
    }
}
const timeIn = document.querySelector('#timein');
const timeOut = document.querySelector('#timeout');

timeOut.addEventListener('change', () => timeIn.value = timeOut.value);
timeIn.addEventListener('change', () => timeOut.value = timeIn.value);

const roomNumbers = document.querySelector('#room_number');
const capacity = document.querySelector('#capacity');
const people = capacity.querySelectorAll('option');
people[2].setAttribute('disabled', 'disabled');
people[3].setAttribute('disabled', 'disabled');
roomNumbers.addEventListener('change', disableCapacitySelect);

function disableCapacitySelect () {
    if(roomNumbers.value === '100'){
        people[2].removeAttribute('disabled');
        people[3].removeAttribute('disabled');
    }
    console.log('f');
    for (let i = 3; i > +roomNumbers.value; i--){
        addDisabled(i);
        if (i === 3){
            people[2].removeAttribute('disabled');
        }
    }
    function addDisabled(i){
        people[i].setAttribute('disabled', 'disabled');
    }
}
