let offerTitleList = ["Большая уютная квартира", "Маленькая неуютная квартира",
    "Огромный прекрасный дворец", "Маленький ужасный дворец",
    "Красивый гостевой домик", "Некрасивый негостеприимный домик",
    "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
let typeList = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
let checkTimeList = ['12:00', '13:00', '14:00'];
let featuresList = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
let photosList = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

// обьявление переменных
const map = document.querySelector('.map');
const pins = document.querySelector('.map__pins');
const fieldset = document.querySelectorAll('fieldset');
const noticeForm = document.querySelector('.notice__form');
const mapPinMain = document.querySelector('.map__pin--main');
const coordinates = {};
const inputAddress = document.getElementById('address');

// генерирование списка предложений
const offersList = [];
renderOfferList(8);

//блокировка и активация форм
disableForms();
mapPinMain.addEventListener('mouseup', (ev)=> {
    ableForms();
    findCoordinates(ev);
    inputAddress.value = `${coordinates.x}, ${coordinates.y}`;
    showPins();
});
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

//отрисовка пинов
function showPins() {
    let pinFragment = document.createDocumentFragment();
    for (let i = 0; i < 8; i++) {
        pinFragment.append(fillTemplate(offersList[i], i));
    }
    pins.append(pinFragment);
}

//отрисовка попапа при вызове
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

//заполнение шаблона пина и отрисовка попапа при нажатии
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
function findCoordinates(ev){
    coordinates.x = ev.screenX;
    coordinates.y = ev.screenY + 50;
    return coordinates;
}

//генерация самого массива данных
function renderOfferList (number){
    for (let i = 0; i < number; i++){
        offersList[i] = {
            counter: i,
            author: {
                avatar: `img/avatars/user0${i+1}.png`
            },
            offer: {
                title: offerTitleList[i],
                address: `${getRandomIntInclusive(0, 600)}, ${getRandomIntInclusive(0, 600)}`,
                price: getRandomIntInclusive(1000, 1000000),
                type: `${typeList[getRandomIntInclusive(0, 3)]}`,
                rooms: getRandomIntInclusive(1, 5),
                guests: getRandomIntInclusive(0, 5),
                checkin: `${checkTimeList[getRandomIntInclusive(0, 2)]}`,
                checkout: `${checkTimeList[getRandomIntInclusive(0, 2)]}`,
                features: generateFeaturesList(),
                description: ' ',
                photos: [photosList[1], photosList[2], photosList[0]],
            },
            location: {
                x: getRandomIntInclusive(100, 1200),
                y: getRandomIntInclusive(130, 630),
            },
        }
    }
    return offersList;
}
function generateFeaturesList (){
    let array = [];
    let number = getRandomIntInclusive(1, 5);
    for (let i = 0; i < number; i++){
        array[i] = featuresList[getRandomIntInclusive(0, 5)];
    }
    return array;
}
//
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

