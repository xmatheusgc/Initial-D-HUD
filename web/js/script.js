const hud = document.getElementById('hud');
const boostGauge = document.getElementById('boost-gauge');
const rpmLabels = document.getElementById('rpm-labels');
const rpmBar = document.getElementById('rpm-bar');
const boostLabels = document.getElementById('boost-labels');
const boostBar = document.getElementById('boost-bar');
const gearElement = document.getElementById('gear-digit');
const speedDigits = [
    document.getElementById('digit1'),
    document.getElementById('digit2'),
    document.getElementById('digit3')
];

function setVisibility(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
}

window.addEventListener('message', function(event) {
    const {
        type,
        isHudOn,
        speed,
        gear,
        rpm,
        turbo,
        isVehicleTurboInstaled,
        IsVehicleHeadlightsOn
    } = event.data;

    switch (type) {
        case "showHud":
            toggleHudVisibility(isHudOn);
            break;

        case "showNightMode":
            toggleNightMode(IsVehicleHeadlightsOn);
            break;

        case "updateVehStats":
            updateSpeedImages(speed);
            updateGearImages(gear);
            updateRpmPointer(rpm);
            updateTurboPointer(turbo);
            break;

        case "showTurboGauge":
            toggleTurboGaugeVisibility(isVehicleTurboInstaled);
            break;
    }
});

function toggleHudVisibility(isHudOn) {
    setVisibility(hud, isHudOn);
}

function toggleTurboGaugeVisibility(isInstalled) {
    setVisibility(boostGauge, isInstalled);
}

function toggleNightMode(headlightsOn) {
    rpmLabels.src = headlightsOn ? 'img/background/night_labels_8k.png' : 'img/background/labels_8k.png';
    rpmBar.src = headlightsOn ? 'img/rpm_bar/night_rpm_bar.png' : 'img/rpm_bar/rpm_bar.png';
    boostLabels.src = headlightsOn ? 'img/boost-background/night_labels_bar.png' : 'img/boost-background/labels_bar.png';
    boostBar.src = headlightsOn ? 'img/boost_bar/night_boost_bar.png' : 'img/boost_bar/boost_bar.png';
}

function updateSpeedImages(speed) {
    const speedStr = speed.toString().padStart(3, '0');

    for (let i = 0; i < 3; i++) {
        const char = speedStr.charAt(i);
        const digit = speedDigits[i];

        const isVisible = (speed !== 0 && speedStr.slice(0, i).match(/[1-9]/)) || i === 2 || char !== '0';
        digit.style.visibility = isVisible ? 'visible' : 'hidden';
        digit.src = `img/speed_digits/speed_digits_${char}.png`;
    }
}

function updateGearImages(gear) {
    gearElement.src = `img/gears/gear_${gear}.png`;
}

function updateRpmPointer(rpm) {
    const minAngle = -120;
    const maxAngle = 120;
    const rotation = minAngle + (rpm * (maxAngle - minAngle));

    rpmBar.style.transition = 'transform 0.5s';
    rpmBar.style.transform = `rotate(${rotation}deg)`;
}

function updateTurboPointer(turbo) {
    const minTurbo = -1.0;
    const maxTurbo = 3.0;

    const minAngle = -133;
    const maxAngle = 133;   

    const clamped = Math.max(minTurbo, Math.min(maxTurbo, turbo));
    const normalized = (clamped - minTurbo) / (maxTurbo - minTurbo);
    const rotation = minAngle + normalized * (maxAngle - minAngle);

    boostBar.style.transform = `rotate(${rotation}deg)`;
}
