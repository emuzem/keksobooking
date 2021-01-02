const fieldset = document.querySelectorAll('fieldset');
const noticeForm = document.querySelector('.notice__form');
const map = document.querySelector('.map');
const mapPinMain = document.querySelector('.map__pin--main');
const inputAddress= document.getElementById('address');
const mapFilters = document.querySelector('.map__filters');

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
        const element = document.createElement('div');
        element.innerHTML = ` 
            <article class="map__card popup">
    <img src="${this.avatar}" class="popup__avatar" width="70" height="70">
    <button class="popup__close">Закрыть</button>
    <h3 class="popup__title">${this.title}</h3>
    <p class="popup__text--address"><small>${this.address}</small></p>
    <p class="popup__text--price">${this.price}</p>
    <h4 class="popup__type">${this.type}</h4>
    <p class="popup__text--capacity">${this.rooms} комнаты для ${this.guests} гостей</p>
    <p class="popup__text-time">Заезд после ${this.checkin}, выезд до ${this.checkout}</p>
    <ul class="popup__features"> </ul>
    <p class="popup__description">${this.description}</p>
  </article>`
        document.querySelector('.map').append(element);
        const close = document.querySelector('.popup__close');
        element.addEventListener('click', (ev) => {
            if (ev.target === close){
                document.querySelector('.map').removeChild(element);
            }
        });
    }
}

function showPopup(author, offer) {
    new Popup(author.avatar, offer.title, offer.address, offer.price, offer.type, offer.rooms, offer.guests, offer.checkin, offer.checkout, offer.features, offer.description).render();
    showFeatures(offer.features);
}

function showFeatures(features) {
    console.log(features);
    for (let i = 0; i < features.length; i++) {
        let liElem = document.createElement('li');
        liElem.classList.add('feature');
        liElem.classList.add(`feature--${features[i]}`);
        document.querySelector('.popup__features').append(liElem);
    }
}

disableForms();
function disableForms (){
    fieldset.forEach((el) => {
        el.setAttribute('disabled', 'disabled');
    });
}

const updateFilters = (data) => {
    document.querySelector('.map__filters').addEventListener('change', ()=> {
        document.querySelector('.map__pins-placing').innerHTML = ' ';
        const type = document.querySelector('#housing-type');
        let types = ['flat', 'house', 'bungalo'];

            for (let i = 0; i < types.length; i++) {
                if (type.value === types[i]) {
                    window.filteredType = data.filter(el => {
                        return el.offer.type === types[i];
                    });
                    window.filtered = window.filteredType;
                 }
            }

        filtered.forEach(el => {
            new Pin(el, '.map__pins-placing').render();
        });
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
            updateFilters(data);
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