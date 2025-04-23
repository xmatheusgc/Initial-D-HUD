window.addEventListener('message', function(event) {
    const { type, isHudOn, speed, gear, rpm, turbo, isVehicleTurboInstaled, IsVehicleHeadlightsOn } = event.data

    if (type === "showHud") {
        toggleHudVisibility(isHudOn)
    }

    if (type === "showNightMode") {
        toggleNightMode(IsVehicleHeadlightsOn)
    }

    if (type === "updateVehStats") {
        updateSpeedImages(speed)
        updateGearImages(gear)
        updateRpmPointer(rpm)
        updateTurboPointer(turbo)
    }

    if (type === "showTurboGauge") {
        toggleTurboGaugeVisibility(isVehicleTurboInstaled)
    }
})

function toggleHudVisibility(isHudOn) {
    const hud = document.getElementById('hud')

    if (isHudOn) {  
        hud.style.display = 'block'

    } else {
        hud.style.display = 'none'
    } 
}

function toggleNightMode(IsVehicleHeadlightsOn) {
    const rpm_labels = document.getElementById('rpm-labels')
    const rpm_bar = document.getElementById('rpm-bar')
    const boost_labels = document.getElementById('boost-labels')
    const boost_bar = document.getElementById('boost-bar')

    if (IsVehicleHeadlightsOn) {
        rpm_labels.src = 'img/background/night_labels_8k.png'
        rpm_bar.src = 'img/rpm_bar/night_rpm_bar.png'
        boost_labels.src = 'img/boost-background/night_labels_bar.png'
        boost_bar.src = 'img/boost_bar/night_boost_bar.png'
    } else {
        rpm_labels.src = 'img/background/labels_8k.png'
        rpm_bar.src = 'img/rpm_bar/rpm_bar.png'
        boost_labels.src = 'img/boost-background/labels_bar.png'
        boost_bar.src = 'img/boost_bar/boost_bar.png'
    }
}

function toggleTurboGaugeVisibility(isVehicleTurboInstaled) {
    const boostGauge = document.getElementById('boost-gauge')

    if (isVehicleTurboInstaled) {  
        boostGauge.style.display = 'block'

    } else {
        boostGauge.style.display = 'none'
    } 
}

function updateSpeedImages(speed) {
    const speedStr = speed.toString().padStart(3, '0')
    const digits = ['digit1', 'digit2', 'digit3']

    digits.forEach((id, index) => {
        const digit = document.getElementById(id)
        const char = speedStr.charAt(index)

        if (speed === 0) {
            digit.style.visibility = index === 2 ? 'visible' : 'hidden' // Only show the last digit if speed is 0
        } else {
            digit.style.visibility = char !== '0' || speedStr.slice(0, index).includes('1') || speedStr.slice(0, index).includes('2') || speedStr.slice(0, index).includes('3') || speedStr.slice(0, index).includes('4') || speedStr.slice(0, index).includes('5') || speedStr.slice(0, index).includes('6') || speedStr.slice(0, index).includes('7') || speedStr.slice(0, index).includes('8') || speedStr.slice(0, index).includes('9') ? 'visible' : 'hidden'
        }

        digit.src = `img/speed_digits/speed_digits_${char}.png`
    })
}

function updateRpmPointer(rpm) {
    const pointer = document.getElementById('rpm-bar')
    const maxAngle = 120
    const minAngle = -120

    const rotation = minAngle + (rpm * (maxAngle - minAngle))
    pointer.style.transform = `rotate(${rotation}deg)`
}

function updateGearImages(gear) {
    const gearElement = document.getElementById('gear-digit')
    gearElement.src = `img/gears/gear_${gear}.png`
}

function updateTurboPointer(turbo) {
    const pointer = document.getElementById('boost-bar')
    const minAngle = -133
    const maxAngle = 0
    const minPressure = -1
    const maxPressure = 1

    const rotation = minAngle + ((turbo - minPressure) * (maxAngle - minAngle) / (maxPressure - minPressure))
    pointer.style.transform = `rotate(${rotation}deg)`
}
 