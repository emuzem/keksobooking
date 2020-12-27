
const fieldset = document.querySelectorAll('fieldset');
const noticeForm = document.querySelector('.notice__form');
const map = document.querySelector('.map');
const mapPinMain = document.querySelector('.map__pin--main');
const inputAddress= document.getElementById('address');

const offersList = [];
renderOfferList(8);

disableForms();
function disableForms (){
    fieldset.forEach((el) => {
        el.setAttribute('disabled', 'disabled');
    });
}
function ableForms (){
    fieldset.forEach((el) => {
        el.removeAttribute('disabled');
    })
    noticeForm.classList.remove('notice__form--disabled');
    map.classList.remove('map--faded');
}

document.addEventListener('click', (ev)=>{
    console.log(ev.clientX);
    console.log(ev.clientY);
});
mapPinMain.addEventListener('mousedown', (evDown) => {
    console.log(evDown.clientY);
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
function showPins() {
    let pinFragment = document.createDocumentFragment();
    for (let i = 0; i < 8; i++) {
        pinFragment.append(fillTemplate(offersList[i], i));
    }
    pins.append(pinFragment);
}
function showPopup(i) {
    let popupFragment = document.createDocumentFragment();
    popupFragment.append(fillPopup(offersList[i]));
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
function fillTemplate (obj, i){
    let pinClone = document.querySelector("template").content.querySelector('.map__pin').cloneNode(true);
    pinClone.querySelector('img').src = obj.author.avatar;
    pinClone.style = `left: ${obj.location.x}px; top: ${obj.location.y}px;`;
    pinClone.querySelector('img').alt = obj.offer.title;

    pinClone.addEventListener('click', ()=> {
        showPopup(i);
        document.removeEventListener('click', hidePopup);
    });
    return pinClone;
}

//заполнение шаблона пина и отрисовка попапа при нажатии

//заполнение информации внутри попапа
function fillPopup (obj){
    let popupClone = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);
    popupClone.querySelector('.popup__title').textContent = obj.offer.title;
    popupClone.querySelector('.popup__text--address').textContent = obj.offer.address;
    popupClone.querySelector('.popup__text--price').textContent = `${obj.offer.price}₽/ночь`;
    popupClone.querySelector('.popup__type').textContent = obj.offer.type;
    popupClone.querySelector('.popup__text--capacity').textContent = `${obj.offer.rooms} комнаты для ${obj.offer.guests} гостей`;
    popupClone.querySelector('.popup__text-time').textContent = `Заезд после ${obj.offer.checkin}, выезд до ${obj.offer.checkout}`;
    showFeatures(obj.offer.features, popupClone);
    popupClone.querySelector('.popup__description').textContent = obj.offer.description;
    showPhotos(obj.offer.photos, popupClone);
    popupClone.querySelector('.popup__avatar').src = obj.author.avatar;
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
function showPhotos (pics, popupClone){
    let ul = popupClone.querySelector('.popup__pictures');
    for(let i = 0; i < pics.length; i++){
        let photo = document.createElement('img');
        photo.src = pics[i];
        photo.style = 'width: 60px; height: 60px; padding: 2px;';
        ul.appendChild(photo);
    }
}