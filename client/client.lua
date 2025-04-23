Citizen.CreateThread(function()
    while true do
        Citizen.Wait(100)
        local ped = GetPlayerPed(-1)
        
        if IsPedInAnyVehicle(ped, false) then
            local vehicle = GetVehiclePedIsIn(ped, false)
            local speed = GetEntitySpeed(vehicle) * 3.6
            local rpm = GetVehicleCurrentRpm(vehicle)
            local gear = GetVehicleCurrentGear(vehicle)
            local turbo = GetVehicleTurboPressure(vehicle)

            if 	GetIsVehicleEngineRunning(vehicle) == false then
                rpm = 0
                gear = 1
                turbo = -1
            end

            local retval, lightsOn, highbeamsOn = GetVehicleLightsState(vehicle)

            if GetIsVehicleEngineRunning(vehicle) then
                if lightsOn == 1 or highbeamsOn == 1 then 
                    SendNUIMessage({
                        type = "showNightMode",
                        IsVehicleHeadlightsOn = true
                    })
                else
                    SendNUIMessage({
                        type = "showNightMode",
                        IsVehicleHeadlightsOn = false
                    })
                end
            end
            
            SendNUIMessage({
                type = "showHud",
                isHudOn = true
            })

            SendNUIMessage({
                type = "updateVehStats",
                speed = math.ceil(speed),
                rpm = rpm,
                gear = gear,
                turbo = turbo
            })

            if turbo ~= 0 then
                SendNUIMessage({
                    type = "showTurboGauge",
                    isVehicleTurboInstaled = true
                })
            else
                SendNUIMessage({
                    type = "showTurboGauge",
                    isVehicleTurboInstaled = false
                })
            end
        else
            SendNUIMessage({
                type = "showHud",
                isHudOn = false
            })
        end
    end
end)
