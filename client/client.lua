-- =============================================================================
-- INITIAL-D HUD CLIENT SCRIPT
-- =============================================================================
-- This script manages the Initial-D themed HUD display for FiveM servers
-- It continuously monitors vehicle data and sends updates to the NUI (web interface)
-- Features: Speed display, RPM gauge, gear indicator, turbo pressure, night mode
-- =============================================================================

-- Create a continuous thread that runs every 100ms to update the HUD
Citizen.CreateThread(function()
    while true do
        -- Wait 100ms before next iteration (prevents lag and excessive updates)
        Citizen.Wait(100)
        
        -- Get the player's character/ped entity
        local ped = GetPlayerPed(-1)
        
        -- Check if the player is currently inside a vehicle
        if IsPedInAnyVehicle(ped, false) then
            -- Get the vehicle the player is in
            local vehicle = GetVehiclePedIsIn(ped, false)
            
            -- Calculate vehicle speed: multiply by 3.6 to convert m/s to km/h
            local speed = GetEntitySpeed(vehicle) * 3.6
            
            -- Get the current RPM value from the vehicle engine
            local rpm = GetVehicleCurrentRpm(vehicle)
            
            -- =========================================================================
            -- GEAR DETECTION SYSTEM
            -- =========================================================================
            -- This script supports two gear systems:
            -- 1. Native GTA5 gear system: 0=Reverse, 1=1st gear, 2=2nd gear, etc.
            -- 2. MX-Gear resource: -1=Reverse, 0=Neutral, 1+=Gear numbers
            -- The script automatically detects which system is active and adapts
            -- =========================================================================
            
            -- Start with the native GTA5 gear value
            local gear = GetVehicleCurrentGear(vehicle)
            local isMxGearActive = false
            
            -- Check if the mx-gear resource is available and running on the server
            if GetResourceState('mx-gear') == 'started' then
                -- Try to safely get the current gear from mx-gear using pcall
                -- pcall = protected call, prevents script crash if mx-gear export fails
                local success, gearValue = pcall(function()
                    return exports['mx-gear']:GetCurrentGear(vehicle)
                end)
                
                -- If the export was successful and returned a valid value, use it
                if success and gearValue ~= nil then
                    gear = gearValue
                    isMxGearActive = true
                -- Uncomment below for debugging:
                --     print(string.format("^2[HUD] MX-GEAR gear: %s (tipo: %s)^0", tostring(gear), type(gear)))
                -- else
                --     print(string.format("^1[HUD] Failed to get gear from mx-gear. Success: %s, Value: %s^0", tostring(success), tostring(gearValue)))
                end
            -- Uncomment below for debugging:
            -- else
            --     print("^3[HUD] MX-GEAR is not active^0")
            end
            
            -- Get the turbo pressure value (if vehicle has turbo: 0-1.0, if no turbo: 0)
            local turbo = GetVehicleTurboPressure(vehicle)

            -- =========================================================================
            -- GEAR DISPLAY CONVERSION
            -- =========================================================================
            -- This section converts the raw gear value into a display format
            -- that matches the HUD images (gear_0.png, gear_1.png, gear_N.png, etc)
            -- This MUST happen before checking if engine is off
            -- =========================================================================
            
            local displayGear = gear
            
            -- If MX-Gear resource is active, convert gear values to display format
            if isMxGearActive then
                -- MX-Gear format conversion:
                -- -1 (Reverse) becomes "0" (displays gear_0.png)
                -- 0 (Neutral) becomes "N" (displays gear_N.png)
                -- 1+ (Gears) become strings "1", "2", "3", etc.
                if type(gear) == 'number' then
                    if gear == -1 then
                        displayGear = '0'  -- Image file: gear_0.png (Reverse)
                    elseif gear == 0 then
                        displayGear = 'N'  -- Image file: gear_N.png (Neutral)
                    else
                        -- Convert number to string for image matching (1, 2, 3, etc.)
                        displayGear = tostring(gear)
                    end
                end
            else
                -- Native GTA5 format conversion:
                -- The native game already provides the correct index (0=Reverse, 1=1st, 2=2nd)
                -- Simply convert the number to string for display
                if type(gear) == 'number' then
                    displayGear = tostring(gear)
                end
            end

            -- =========================================================================
            -- ENGINE OFF STATE HANDLING
            -- =========================================================================
            -- When the engine is off, reset all dynamic values to their idle state
            -- This ensures the HUD displays correctly when the vehicle is parked/off
            -- =========================================================================
            
            if GetIsVehicleEngineRunning(vehicle) == false then
                rpm = 0                -- Set RPM to zero
                displayGear = 'N'      -- Display "N" (Neutral) as gear indicator
                turbo = -1             -- Set turbo value to -1 to hide the gauge
            end

            -- =========================================================================
            -- HEADLIGHTS DETECTION & NIGHT MODE
            -- =========================================================================
            -- Detect if headlights are on to trigger night mode in the HUD
            -- Night mode typically darkens/changes the HUD appearance for visibility
            -- =========================================================================
            
            -- Get the current state of the vehicle's headlights
            -- Returns: success_flag, lightsOn (0/1), highbeamsOn (0/1)
            -- =========================================================================
            -- HEADLIGHTS DETECTION & NIGHT MODE
            -- =========================================================================
            -- Detect if headlights are on to trigger night mode in the HUD
            -- Night mode typically darkens/changes the HUD appearance for visibility
            -- =========================================================================
            
            local retval, lightsOn, highbeamsOn = GetVehicleLightsState(vehicle)
            local headlightsOn = lightsOn == 1 or highbeamsOn == 1
            
            -- =========================================================================
            -- HUD DISPLAY & NUI UPDATES (CONSOLIDATED)
            -- =========================================================================
            -- Consolidate all NUI messages into ONE message per frame for better performance
            -- This reduces bandwidth and CPU usage by sending all data at once
            -- The web interface (web/index.html) receives these messages and updates
            -- =========================================================================
            
            -- Send all vehicle data and HUD states in a single consolidated message
            -- This is more efficient than sending 4+ separate messages per frame
            local nui_message = {
                type = "updateHUD",
                -- HUD visibility states
                isHudOn = true,
                isTurboInstalled = turbo ~= 0,
                headlightsOn = headlightsOn,
                -- Main vehicle statistics
                speed = math.ceil(speed),
                rpm = rpm,
                gear = displayGear,
                turbo = turbo
            }
            
            -- Send the consolidated message with error handling
            local success = pcall(function()
                SendNUIMessage(nui_message)
            end)
            
            if not success then
                -- Uncomment below for debugging NUI message failures:
                -- print("^1[HUD] Warning: Failed to send NUI message^0")
            end
        else
            -- Player is not in a vehicle - hide the HUD completely
            local success = pcall(function()
                SendNUIMessage({
                    type = "updateHUD",
                    isHudOn = false
                })
            end)
        end
    end
end)
