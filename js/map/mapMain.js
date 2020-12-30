
const fieldset = document.querySelectorAll('fieldset');
const noticeForm = document.querySelector('.notice__form');
const map = document.querySelector('.map');
const mapPinMain = document.querySelector('.map__pin--main');
const inputAddress= document.getElementById('address');

// const offersList = [];
// renderOfferList(8);

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
            data.forEach(el => {
                showPins(el.location.x, el.location.y, el.offer.title, el.offer.address, el.offer.price, el.offer.type, el.offer.rooms, el.offer.guests, el.offer.checkin, el.offer.checkout, el.offer.features, el.offer.description, el.author.avatar)
            });
        })
        .catch();
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
        showPins();
        map.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
    map.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

const pins = document.querySelector('.map__pins');
//отрисовка пинов
function showPins(x, y, title, address, price, type, rooms, guests, checkin, checkout, features, description, avatar) {
    let pinFragment = document.createDocumentFragment();
        pinFragment.append(fillTemplate(x, y, title, address, price, type, rooms, guests, checkin, checkout, features, description, avatar));
    pins.append(pinFragment);
}

function showPopup(title, address, price, type, rooms, guests, checkin, checkout, features, description, avatar) {
    let popupFragment = document.createDocumentFragment();
    popupFragment.append(fillPopup(title, address, price, type, rooms, guests, checkin, checkout, features, description, avatar));
    map.append(popupFragment);
    const popupClose = document.querySelector('.popup__close');
    const popup = document.querySelectorAll('.popup');
    function hidePopup (ev){
        if (ev.target === popupClose) {
            popup.forEach(el => map.removeChild(el));
            document.addEventListener('click', hidePopup);
        }
    }
    document.addEventListener('click', hidePopup);
}
function fillTemplate (x, y, title, address, price, type, rooms, guests, checkin, checkout, features, description, avatar){
    let pinClone = document.querySelector("template").content.querySelector('.map__pin').cloneNode(true);
    pinClone.querySelector('img').src = `${avatar}`;
    pinClone.style = `left: ${x}px; top: ${y}px;`;
    pinClone.querySelector('img').alt = title;

    pinClone.addEventListener('click', ()=> {
        showPopup(title, address, price, type, rooms, guests, checkin, checkout, features, description, avatar);
        document.removeEventListener('click', hidePopup);
    });
    return pinClone;
}

//заполнение шаблона пина и отрисовка попапа при нажатии

//заполнение информации внутри попапа
function fillPopup (title, address, price, type, rooms, guests, checkin, checkout, features, description, avatar){
    let popupClone = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);
    popupClone.querySelector('.popup__title').textContent = title;
    popupClone.querySelector('.popup__text--address').textContent = address;
    popupClone.querySelector('.popup__text--price').textContent = `${price}₽/ночь`;
    popupClone.querySelector('.popup__type').textContent = type;
    popupClone.querySelector('.popup__text--capacity').textContent = `${rooms} комнаты для ${guests} гостей`;
    popupClone.querySelector('.popup__text-time').textContent = `Заезд после ${checkin}, выезд до ${checkout}`;
    showFeatures(features, popupClone);
    popupClone.querySelector('.popup__description').textContent = description;
    popupClone.querySelector('.popup__avatar').src = avatar;
    return popupClone;
}
function showFeatures (feature, popupClone){
    let ul = popupClone.querySelector('.popup__features');
    for(let i = 0; i < feature.length; i++){
        let liElem = document.createElement('li');
        liElem.classList.add('feature');
        liElem.classList.add(`feature--${feature[i]}`);
        ul.appendChild(liElem);
    }
}
// function showPhotos (pics, popupClone){
//     let ul = popupClone.querySelector('.popup__pictures');
//     for(let i = 0; i < pics.length; i++){
//         let photo = document.createElement('img');
//         photo.src = pics[i];
//         photo.style = 'width: 60px; height: 60px; padding: 2px;';
//         ul.appendChild(photo);
//     }
// }

const getResources = async (url) => {
    const result = await fetch(url);

    if(!result.ok){
        throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
}