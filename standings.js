const driverStandingsURL = "https://ergast.com/api/f1/current/driverStandings.json"
const constructorStandingsURL = "https://ergast.com/api/f1/current/constructorstandings.json"
const driverStatsBaseURL = "https://ergast.com/api/f1/current/drivers/"  // need to append ${driver}/(results for race)(qualifying for quali)(sprint for sprint).json

const driverSelector = document.querySelector("#drivers")
const form = document.querySelector("form")
const driverInfoContainer = document.querySelector(".driver-info-container")


form.addEventListener("change", event => {
    event.preventDefault()
    const driverStatsRequestArray = [
        `${driverStatsBaseURL}${event.target.value}/results.json`,
        `${driverStatsBaseURL}${event.target.value}/sprint.json`
    ]
    Promise.all(driverStatsRequestArray.map(url => {
        return fetch(url)
            .then(response => response.json())
    })).then(driverStatsResponseArray => {
        const driverInfo = driverStatsResponseArray[0].MRData.RaceTable.Races[0].Results[0]
        const raceResults = driverStatsResponseArray[0].MRData.RaceTable.Races
        const sprintResults = driverStatsResponseArray[1].MRData.RaceTable.Races
        getDriverImage(driverInfo)
        getDriverInfo(driverInfo)
        clearResultsTables()
        raceResults.forEach(raceResult => {
            addRaceResults(getRaceResults(raceResult))
        })
        sprintResults.forEach(sprintResult => {
            addSprintResults(getSprintResults(sprintResult))
        })
    })
        .catch(error => {
            console.error(error.message)
            window.open("404.html", _self)
        })
})


fetch(driverStandingsURL)
    .then(response => response.json())
    .then(driverStandingsObject => {
        const driverStandingsList = driverStandingsObject.MRData.StandingsTable.StandingsLists[0].DriverStandings
        driverStandingsList.forEach(driverStanding => {
            addDriverSelection(createDriverSelection(driverStanding))
            addDriverStandingListing(createDriverStandingListing(driverStanding))
        }
        )
    })
    .catch(error => {
        console.error(error.message)
        window.open("404.html", _self)
    })

fetch(constructorStandingsURL)
    .then(response => response.json())
    .then(constructorStandingsObject => {
        const constructorStandingsList = constructorStandingsObject.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
        constructorStandingsList.forEach(constructorStanding => {
            addConstructorStandingListing(createConstructorStandingListing(constructorStanding))
        }
        )
    })

function getDriverImage(driverInfo) {
    const img = document.querySelector(".driver-image")
    img.src = `images/drivers/${driverInfo.Driver.driverId}.jpg`
    img.alt = `${driverInfo.Driver.givenName} ${driverInfo.Driver.familyName}`
}

function getDriverInfo(driverInfo) {
    const div = document.querySelector(".driver-info")
    div.innerHTML = `
        <h2>${driverInfo.Driver.givenName} ${driverInfo.Driver.familyName}</h2>
        <table>
            <tr>
                <td>Team</td>
                <td>${driverInfo.Constructor.name}</td>
            </tr>
            <tr>
                <td>Number</td>
                <td>${driverInfo.Driver.permanentNumber}</td>
            </tr>
            <tr>
                <td>Nationality</td>
                <td>${driverInfo.Driver.nationality}</td>
            </tr>
            <tr>
                <td>Date of Birth</td>
                <td>${driverInfo.Driver.dateOfBirth}</td>
            </tr>
        </table>
    `
}

function getRaceResults(raceResult) {
    document.querySelector(".race-table").classList.remove("hidden")
    const tr = document.createElement("tr")
    tr.innerHTML = `
        <td>${raceResult.raceName}</td>
        <td>${accountForRaceDNF(raceResult)}</td>
        <td>${raceResult.Results[0].points}</td>
    `
    return tr
}

function accountForRaceDNF(raceResult) {
    if (raceResult.Results[0].status === "Finished" || raceResult.Results[0].status.includes("Lap")) {
        return raceResult.Results[0].position
    } else {
        return "DNF"
    }
}

function getSprintResults(sprintResult) {
    document.querySelector(".sprint-table").classList.remove("hidden")
    const tr = document.createElement("tr")
    tr.innerHTML = `
        <td>${sprintResult.raceName}</td>
        <td>${accountForSprintDNF(sprintResult)}</td>
        <td>${sprintResult.SprintResults[0].points}</td>
    `
    return tr
}

function accountForSprintDNF(sprintResult) {
    if (sprintResult.SprintResults[0].status === "Finished") {
        return sprintResult.SprintResults[0].position
    } else {
        return "DNF"
    }
}

function addRaceResults(element) {
    document.querySelector(".race-table-body").append(element)
}

function addSprintResults(element) {
    document.querySelector(".sprint-table-body").append(element)
}

function clearResultsTables() {
    document.querySelector(".race-table-body").innerHTML = ``
    document.querySelector(".sprint-table-body").innerHTML = ``
}

function createDriverSelection(driverStanding) {
    const driverSelection = document.createElement("option")
    driverSelection.value = `${driverStanding.Driver.driverId} `
    driverSelection.textContent = `${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName} `
    return driverSelection
}

function addDriverSelection(driver) {
    driverSelector.append(driver)
}

function createDriverStandingListing(driverStanding) {
    const driver = document.createElement("tr")
    driver.innerHTML = `
        <td> ${driverStanding.position}</td>
        <td><img src="images/constructors/${driverStanding.Constructors[0].constructorId}.png" alt="${driverStanding.Constructors[0].constructorId}" class="standings-logo"/></td>
        <td>${driverStanding.Driver.code}</td>
        <td>${driverStanding.points}</td>
    `
    return driver
}

function addDriverStandingListing(driver) {
    document.querySelector(".driver-standings-table-body").append(driver)
}

function createConstructorStandingListing(constructorStanding) {
    const constructor = document.createElement("tr")
    constructor.innerHTML = `
        <td> ${constructorStanding.position}</td>
        <td><img src="images/constructors/${constructorStanding.Constructor.constructorId}.png" alt="${constructorStanding.Constructor.constructorId}" class="standings-logo"/></td>
        <td>${constructorStanding.Constructor.name}</td>
        <td>${constructorStanding.points}</td>
    `
    return constructor
}

function addConstructorStandingListing(constructor) {
    document.querySelector(".constructor-standings-table-body").append(constructor)
}

