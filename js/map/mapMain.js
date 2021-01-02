
const fieldset = document.querySelectorAll('fieldset');
const noticeForm = document.querySelector('.notice__form');
const map = document.querySelector('.map');
const mapPinMain = document.querySelector('.map__pin--main');
const inputAddress= document.getElementById('address');

class Pin {
    constructor(src, left, top, title, parentSelector, author, offer) {
        this.src = src;
        this.left = left;
        this.top = top;
        this.title = title;
        this.parent = document.querySelector(parentSelector);
        this.author = author;
        this.offer = offer;
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
    constructor(avatar, title, address, price, type, rooms, guests, checkin, checkout, features, description, parent) {
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
        this.parent = parent;
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
        })
    }
}


mapPinMain.addEventListener('mousedown', () => {
    ableForms();
    let startCoords = {
        x:  mapPinMain.getBoundingClientRect().left + 30,
        y: mapPinMain.getBoundingClientRect().bottom + 12
    };
    console.log(map.getBoundingClientRect().left);
    const onMouseMove = (evMove) => {
        const shift = {
            x: startCoords.x - evMove.clientX,
            y: startCoords.y - evMove.clientY
        };

        startCoords = {
            x: evMove.clientX,
            y: evMove.clientY
        };
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
    }
    const onMouseUp = (evUp) => {
        evUp.preventDefault();
        inputAddress.value = `${Math.floor(startCoords.x)}, ${Math.floor(startCoords.y)}`;
        //showPins();
        map.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
    map.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

disableForms();
function disableForms (){
    fieldset.forEach((el) => {
        el.setAttribute('disabled', 'disabled');
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
            data.forEach(({author, offer, location}) => {
                new Pin(author.avatar, location.x, location.y, offer.title, '.map', author, offer).render();
            });
        })
        .catch();
}

// const pins = document.querySelector('.map__pins');
// //отрисовка пинов
// function showPins(author, offer, location) {
//     let pinFragment = document.createDocumentFragment();
//         pinFragment.append(fillTemplate(author, offer, location));
//     pins.append(pinFragment);
// }
//
function showPopup(author, offer) {
    new Popup(author.avatar, offer.title, offer.address, offer.price, offer.type, offer.rooms, offer.guests, offer.checkin, offer.checkout, offer.features, offer.description, '.map').render();
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


const getResources = async (url) => {
    const result = await fetch(url);

    if(!result.ok){
        throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
}