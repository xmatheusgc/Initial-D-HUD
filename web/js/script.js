// =============================================================================
// INITIAL-D HUD - WEB INTERFACE SCRIPT
// =============================================================================
// This script manages all NUI message handling and DOM updates for the HUD
// It receives data from the Lua client script and updates the visual elements
// =============================================================================

// =============================================================================
// DOM ELEMENT CACHING
// =============================================================================
// Cache frequently accessed DOM elements to avoid repeated queries
// This improves performance by storing references to elements used every frame
// =============================================================================

const hud = document.getElementById('hud');
const boostGauge = document.getElementById('boost-gauge');

// RPM gauge elements
const rpmLabels = document.getElementById('rpm-labels');
const rpmBar = document.getElementById('rpm-bar');

// Turbo/Boost gauge elements
const boostLabels = document.getElementById('boost-labels');
const boostBar = document.getElementById('boost-bar');

// Gear indicator element
const gearElement = document.getElementById('gear-digit');

// Speed digit display elements (3 digits: hundreds, tens, ones)
const speedDigits = [
    document.getElementById('digit1'),
    document.getElementById('digit2'),
    document.getElementById('digit3')
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Sets the visibility of a DOM element
 * @param {HTMLElement} element - The element to show/hide
 * @param {boolean} isVisible - True to show, false to hide
 */
function setVisibility(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
}

// =============================================================================
// NUI MESSAGE LISTENER
// =============================================================================
/**
 * Main event listener for messages from the Lua client script
 * The Lua script uses SendNUIMessage() to communicate with this interface
 * This listener receives all messages and routes them to appropriate handlers
 */
window.addEventListener('message', function(event) {
    const data = event.data;
    
    // Validate that we have valid data before processing
    if (!data || typeof data !== 'object') return;
    
    try {
        const { type } = data;
        
        // Route message to appropriate handler based on type
        switch (type) {
            // Consolidated HUD update message - handles all HUD state changes
            case "updateHUD":
                handleHUDUpdate(data);
                break;
                
            // Legacy message types for backward compatibility
            case "showHud":
                toggleHudVisibility(data.isHudOn);
                break;
                
            case "showNightMode":
                toggleNightMode(data.IsVehicleHeadlightsOn);
                break;
                
            case "updateVehStats":
                updateSpeedImages(data.speed);
                updateGearImages(data.gear);
                updateRpmPointer(data.rpm);
                updateTurboPointer(data.turbo);
                break;
                
            case "showTurboGauge":
                toggleTurboGaugeVisibility(data.isVehicleTurboInstaled);
                break;
                
            default:
                console.warn(`[HUD] Unknown message type: ${type}`);
        }
    } catch (error) {
        console.error('[HUD] Error processing message:', error);
    }
});

// =============================================================================
// MESSAGE HANDLERS
// =============================================================================

/**
 * Consolidated HUD update handler
 * Processes all HUD state updates in a single message (more efficient)
 * @param {Object} data - Message data from Lua client
 */
function handleHUDUpdate(data) {
    // Handle HUD visibility
    if (typeof data.isHudOn !== 'undefined') {
        toggleHudVisibility(data.isHudOn);
    }
    
    // Handle vehicle statistics update
    if (typeof data.speed !== 'undefined') {
        updateSpeedImages(data.speed);
    }
    if (typeof data.gear !== 'undefined') {
        updateGearImages(data.gear);
    }
    if (typeof data.rpm !== 'undefined') {
        updateRpmPointer(data.rpm);
    }
    if (typeof data.turbo !== 'undefined') {
        updateTurboPointer(data.turbo);
    }
    
    // Handle turbo gauge visibility
    if (typeof data.isTurboInstalled !== 'undefined') {
        toggleTurboGaugeVisibility(data.isTurboInstalled);
    }
    
    // Handle night mode
    if (typeof data.headlightsOn !== 'undefined') {
        toggleNightMode(data.headlightsOn);
    }
}

/**
 * Toggle main HUD visibility
 * @param {boolean} isHudOn - True to show HUD, false to hide
 */
function toggleHudVisibility(isHudOn) {
    setVisibility(hud, isHudOn);
}

/**
 * Toggle turbo/boost gauge visibility
 * @param {boolean} isInstalled - True if vehicle has turbo
 */
function toggleTurboGaugeVisibility(isInstalled) {
    setVisibility(boostGauge, isInstalled);
}

/**
 * Toggle night mode - changes HUD colors/images when headlights are on
 * This improves visibility and gives a different aesthetic at night
 * @param {boolean} headlightsOn - True if vehicle headlights are on
 */
function toggleNightMode(headlightsOn) {
    // Switch between day and night mode images
    rpmLabels.src = headlightsOn ? 'img/background/night_labels_8k.png' : 'img/background/labels_8k.png';
    rpmBar.src = headlightsOn ? 'img/rpm_bar/night_rpm_bar.png' : 'img/rpm_bar/rpm_bar.png';
    boostLabels.src = headlightsOn ? 'img/boost-background/night_labels_bar.png' : 'img/boost-background/labels_bar.png';
    boostBar.src = headlightsOn ? 'img/boost_bar/night_boost_bar.png' : 'img/boost_bar/boost_bar.png';
}

// =============================================================================
// SPEED DISPLAY FUNCTIONS
// =============================================================================

/**
 * Update speed digit display
 * Shows 3 digits (hundreds, tens, ones) with intelligent visibility
 * Leading zeros are hidden, but the last digit (ones place) is always shown
 * Example: speed=5 displays as "  5", speed=150 displays as "150"
 * @param {number} speed - Vehicle speed in km/h
 */
function updateSpeedImages(speed) {
    // Convert speed to 3-digit string with leading zeros (e.g., "005", "150")
    const speedStr = speed.toString().padStart(3, '0');

    // Update each of the 3 speed digit elements
    for (let i = 0; i < 3; i++) {
        const char = speedStr.charAt(i);
        const digit = speedDigits[i];

        // Determine if this digit should be visible using a clearer logic:
        // - Position 0 (hundreds): show only if current digit is non-zero (speed >= 100)
        // - Position 1 (tens): show if any previous position has non-zero, or current is non-zero
        // - Position 2 (ones): always show (every number has ones place)
        let isVisible = false;
        
        if (i === 2) {
            // Ones place - always visible
            isVisible = true;
        } else if (char !== '0') {
            // Current digit is non-zero - show it
            isVisible = true;
        } else if (i === 1 && speedStr.charAt(0) !== '0') {
            // Tens place AND hundreds is non-zero - show it
            isVisible = true;
        }
        // else: leading zero - hide it
        
        digit.style.visibility = isVisible ? 'visible' : 'hidden';
        digit.src = `img/speed_digits/speed_digits_${char}.png`;
    }
}

// =============================================================================
// GEAR DISPLAY FUNCTIONS
// =============================================================================

/**
 * Update gear indicator image
 * Displays the current gear (N, 0-Reverse, 1-6) based on gear value from Lua
 * @param {string|number} gear - Gear value from vehicle (N, 0, 1, 2, 3, 4, 5, 6, etc.)
 */
function updateGearImages(gear) {
    gearElement.src = `img/gears/gear_${gear}.png`;
}

// =============================================================================
// RPM GAUGE FUNCTIONS
// =============================================================================

/**
 * Update RPM gauge pointer rotation
 * Rotates the RPM gauge needle based on engine RPM (0 to 1.0)
 * Range: -120° (idle) to +120° (max)
 * Uses CSS transition for smooth animation
 * @param {number} rpm - Current RPM value (0.0 - 1.0 scale)
 */
function updateRpmPointer(rpm) {
    const minAngle = -120;  // Angle at 0 RPM
    const maxAngle = 120;   // Angle at max RPM
    
    // Calculate rotation angle based on RPM percentage
    const rotation = minAngle + (rpm * (maxAngle - minAngle));

    // Apply rotation with smooth transition animation (0.5 seconds)
    rpmBar.style.transition = 'transform 0.5s';
    rpmBar.style.transform = `rotate(${rotation}deg)`;
}

// =============================================================================
// TURBO/BOOST GAUGE FUNCTIONS
// =============================================================================

/**
 * Update turbo/boost gauge pointer rotation
 * Rotates the turbo gauge needle based on turbo pressure
 * Range: -133° to +133° 
 * Clamps values to valid range (if turbo = -1, it's hidden)
 * @param {number} turbo - Turbo pressure value (-1.0 to 3.0 scale)
 */
function updateTurboPointer(turbo) {
    const minTurbo = -1.0;   // Minimum turbo value
    const maxTurbo = 3.0;    // Maximum turbo value

    const minAngle = -133;   // Angle at minimum turbo
    const maxAngle = 133;    // Angle at maximum turbo

    // Clamp turbo value to valid range (ensures it doesn't go out of bounds)
    const clamped = Math.max(minTurbo, Math.min(maxTurbo, turbo));
    
    // Normalize turbo value to 0-1 range
    const normalized = (clamped - minTurbo) / (maxTurbo - minTurbo);
    
    // Calculate rotation angle based on normalized value
    const rotation = minAngle + normalized * (maxAngle - minAngle);

    // Apply rotation to turbo gauge
    boostBar.style.transform = `rotate(${rotation}deg)`;
}
