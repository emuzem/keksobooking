const fieldset = document.querySelectorAll('fieldset');
const noticeForm = document.querySelector('.notice__form');
const map = document.querySelector('.map');
const mapPinMain = document.querySelector('.map__pin--main');
const inputAddress= document.getElementById('address');
const mapFilters = document.querySelector('.map__filters');
const popupElement = document.createElement('div');

mapPinMain.addEventListener('mousedown', ableForms);

class Pin {
    constructor(obj, parent) {
        this.src = obj.author.avatar;
        this.left = obj.location.x;
        this.top = obj.location.y;
        this.title = obj.offer.title;
        this.parent = document.querySelector(parent);
        this.author = obj.author;
        this.offer = obj.offer;
    }
    render(){
        const element = document.createElement('div');
        element.innerHTML = ` 
            <button style="left: ${this.left}px; top: ${this.top}px;" class="map__pin">
            <img src="${this.src}" alt="${this.title}" width="40" height="40" draggable="false">
            </button>`
        this.parent.append(element);
        element.addEventListener('click', ()=> {
            showPopup(this.author, this.offer);
        });
    }
}

class Popup {
    constructor(avatar, title, address, price, type, rooms, guests, checkin, checkout, features, description) {
        this.avatar = avatar;
        this.title = title;
        this.address = address;
        this.price = price;
        this.type = type;
        this.rooms = rooms;
        this.guests = guests;
        this.checkin = checkin;
        this.checkout = checkout;
        this.features = features;
        this.description = description;
    }

    render(){
        popupElement.innerHTML = ` 
            <article class="map__card popup">
    <img src="${this.avatar}" class="popup__avatar" width="70" height="70">
    <button class="popup__close">Закрыть</button>
    <h3 class="popup__title">${this.title}</h3>
    <p class="popup__text--address"><small>${this.address}</small></p>
    <p class="popup__text--price">${this.price}</p>
    <h4 class="popup__type">${this.type}</h4>
    <p class="popup__text--capacity">${this.rooms} комнаты для ${this.guests} гостей</p>
    <p class="popup__text-time">Заезд после ${this.checkin}, выезд до ${this.checkout}</p>
    <ul class="popup__features">
     ${showFeatures(this.features)}</ul>
    <p class="popup__description">${this.description}</p>
  </article>`
        document.querySelector('.map').append(popupElement);
        const close = document.querySelector('.popup__close');
        popupElement.addEventListener('click', (ev) => {
            if (ev.target === close){
                document.querySelector('.map').removeChild(popupElement);
            }
        });
    }
}

function showPopup(author, offer) {
    new Popup(author.avatar, offer.title, offer.address, offer.price, offer.type, offer.rooms, offer.guests, offer.checkin, offer.checkout, offer.features, offer.description).render();
    showFeatures(offer.features);
}

function showFeatures(features) {
        const featuresList = document.createElement("ul");
        features.forEach(el => {
            const featureElement = document.createElement("li");
            featureElement.classList.add("feature");
            featureElement.classList.add(`feature--${el}`);
            featuresList.append(featureElement);
        });
        return featuresList.innerHTML;
}

disableForms();
function disableForms (){
    fieldset.forEach((el) => {
        el.setAttribute('disabled', 'disabled');
    });
}

function filter(data) {
        const houseTypeInput = document.querySelector('#housing-type');
        let offerType = data.filter(el => {
            if (houseTypeInput.value === 'any')
            {return el;}
                return el.offer.type === houseTypeInput.value;
            });
        const housingPrice = document.querySelector('#housing-price');
        let offerPrice = data.filter(el => {
             if (housingPrice.value === 'any'){
                 return el;
             }
             else if (housingPrice.value === 'high'){
                 return el.offer.price > 50000;
             }
             else if (housingPrice.value === 'middle'){
                 if (el.offer.price > 10000 && el.offer.price < 50000) {
                     return el;
                 }
             }
             else {
                 return el.offer.price < 10000;
             }
        });
        const housingRooms = document.querySelector('#housing-rooms');
        let offerRooms = data.filter(el => {
            if (housingRooms.value === 'any') {
                return el;
            }
            return el.offer.rooms === +housingRooms.value;
        });

        const housingGuests = document.querySelector('#housing-guests');
        let offerGuests = data.filter(el => {
            if (housingGuests.value === 'any') {
                return el;
            }
            return el.offer.guests === +housingGuests.value;
        });
    const mapFeatures = mapFilters.elements.features;
    let offerFeatures = [];
    mapFeatures.forEach(el => {
        if(el.checked){
            offerFeatures.push(el.value);
        }
    });
    console.log(data[0].offer.features);
    console.log(offerFeatures);
    let dataFeaturesList = [];
    data.forEach(el => {
        for (let i = 0; i < offerFeatures.length; i++){
            if(el.offer.features.includes(offerFeatures[i])){
                dataFeaturesList.push(el);
            }
        }
    });
    console.log(dataFeaturesList);

    let commonList = [];
    for (let i = 0; i < offerType.length; i++){
        if (offerPrice.includes(offerType[i]) && offerRooms.includes(offerType[i]) && offerGuests.includes(offerType[i]) && dataFeaturesList.includes(offerType[i])){
            commonList.push(offerType[i]);
        }
    }
    updatePins(commonList);
    }
function updatePins (pins){
    document.querySelector('.map__pins-placing').innerHTML = '';
    pins.forEach(el => {
        new Pin(el, '.map__pins-placing').render();
    });

}

function ableForms () {
    fieldset.forEach((el) => {
        el.removeAttribute('disabled');
    })
    noticeForm.classList.remove('notice__form--disabled');
    map.classList.remove('map--faded');
    getResources('http://localhost:3000/offers')
        .then(data => {
            window.mapPinData = data;
            data.forEach(el => {
                new Pin(el, '.map__pins-placing').render();
            });
        })
        .catch();
}

const getResources = async (url) => {
    const result = await fetch(url);

    if(!result.ok){
        throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
}

mapFilters.addEventListener('change', () => {
    filter(window.mapPinData);
    mapPinMain.removeEventListener('mousedown', ableForms);
});