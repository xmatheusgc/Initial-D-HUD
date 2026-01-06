Citizen.CreateThread(function()
    while true do
        Citizen.Wait(100)
        local ped = GetPlayerPed(-1)
        
        if IsPedInAnyVehicle(ped, false) then
            local vehicle = GetVehiclePedIsIn(ped, false)
            local speed = GetEntitySpeed(vehicle) * 3.6
            local rpm = GetVehicleCurrentRpm(vehicle)
            
            -- Tenta usar a marcha do mx-gear, se disponível
            local gear = GetVehicleCurrentGear(vehicle)
            local isMxGearActive = false
            if GetResourceState('mx-gear') == 'started' then
                local success, gearValue = pcall(function()
                    return exports['mx-gear']:GetCurrentGear(vehicle)
                end)
                if success and gearValue ~= nil then
                    gear = gearValue
                    isMxGearActive = true
                --     print(string.format("^2[HUD] MX-GEAR gear: %s (tipo: %s)^0", tostring(gear), type(gear)))
                -- else
                --     print(string.format("^1[HUD] Falha ao obter gear do mx-gear. Success: %s, Value: %s^0", tostring(success), tostring(gearValue)))
                end
            -- else
            --     print("^3[HUD] MX-GEAR não está ativo^0")
            end
            
            local turbo = GetVehicleTurboPressure(vehicle)

            -- Converte marcha numérica para display ANTES de verificar se motor está desligado
            -- mx-gear: -1=R, 0=N, 1+=marchas
            -- jogo nativo: 0=R, 1=1ª, 2=2ª, etc (SEM NEUTRO)
            local displayGear = gear
            if isMxGearActive then
                -- Conversão para mx-gear: -1=R, 0=N, 1+=números
                if type(gear) == 'number' then
                    if gear == -1 then
                        displayGear = '0'  -- Imagem gear_0.png = R
                    elseif gear == 0 then
                        displayGear = 'N'  -- Imagem gear_N.png = N
                    else
                        displayGear = tostring(gear)  -- Marchas 1,2,3... como string
                    end
                end
            else
                -- Conversão para jogo nativo: já usa índice correto (0=R, 1=1ª, 2=2ª, etc)
                if type(gear) == 'number' then
                    displayGear = tostring(gear)
                end
            end

            if 	GetIsVehicleEngineRunning(vehicle) == false then
                rpm = 0
                displayGear = 'N'  -- Exibe N quando motor desligado
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
                gear = displayGear,
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
