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
    let dataFeaturesList = [];
    data.forEach(el => {
        for (let i = 0; i < offerFeatures.length; i++){
            if(el.offer.features.includes(offerFeatures[i])){
                dataFeaturesList.push(el);
            }
        }
    });
    if (dataFeaturesList[0] == null){
        data.forEach((el, i) => {
            dataFeaturesList[i] = el;
        });
    }
    let commonList = [];
    for (let i = 0; i < offerType.length; i++){
        if (offerPrice.includes(offerType[i]) && offerRooms.includes(offerType[i]) && offerGuests.includes(offerType[i])){
            if(dataFeaturesList.includes(offerType[i])) {
                commonList.push(offerType[i]);
            }
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