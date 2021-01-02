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