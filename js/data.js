const offerTitleList = ["Большая уютная квартира", "Маленькая неуютная квартира",
    "Огромный прекрасный дворец", "Маленький ужасный дворец",
    "Красивый гостевой домик", "Некрасивый негостеприимный домик",
    "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
const typeList = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
const checkTimeList = ['12:00', '13:00', '14:00'];
const featuresList = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
const photosList = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

function renderOfferList (number) {
    for (let i = 0; i < number; i++) {
        offersList[i] = {
            counter: i,
            author: {
                avatar: `img/avatars/user0${i + 1}.png`
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