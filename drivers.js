const standingsURL = "https://ergast.com/api/f1/current/driverStandings.json"
const driverStatsBaseURL = "https://ergast.com/api/f1/current/drivers/"  // need to append ${driver}/(results for race)(qualifying for quali)(sprint for sprint).json

const driverSelector = document.querySelector("#drivers")
const form = document.querySelector("form")
const driverInfoContainer = document.querySelector(".driver-info-container")


form.addEventListener("change", event => {
    event.preventDefault()
    const driverStatsRequestArray = [
        `${driverStatsBaseURL}${event.target.value}/results.json`,
        `${driverStatsBaseURL}${event.target.value}/qualifying.json`,
        `${driverStatsBaseURL}${event.target.value}/sprint.json`
    ]
    Promise.all(driverStatsRequestArray.map(url => {
        return fetch(url)
            .then(response => response.json())
    })).then(driverStatsResponseArray => {
        const driverInfo = driverStatsResponseArray[0].MRData.RaceTable.Races[0].Results[0]
        const raceResults = driverStatsResponseArray[0].MRData.RaceTable.Races
        const sprintResults = driverStatsResponseArray[2].MRData.RaceTable.Races
        getDriverImage(driverInfo)
        getDriverInfo(driverInfo)
        raceResults.forEach(raceResult => {
            addRaceResults(getRaceResults(raceResult))
        })
        sprintResults.forEach(sprintResult => {
            addSprintResults(getSprintResults(sprintResult))
        })
    })
})


fetch(standingsURL)
    .then(response => response.json())
    .then(standingsObject => {
        const standingsList = standingsObject.MRData.StandingsTable.StandingsLists[0].DriverStandings
        standingsList.forEach(driverStanding => {
            addDriverSelection(createDriverSelection(driverStanding))
            addStandingListing(createStandingListing(driverStanding))
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
    if (raceResult.Results[0].status === "Finished") {
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

function createDriverSelection(driverStanding) {
    const driver = document.createElement("option")
    driver.value = `${driverStanding.Driver.driverId} `
    driver.textContent = `${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName} `
    return driver
}

function addDriverSelection(driver) {
    driverSelector.append(driver)
}

function createStandingListing(driverStanding) {
    const driver = document.createElement("tr")
    driver.innerHTML = `
        <td> ${driverStanding.position}</td>
        <td>${driverStanding.Driver.code}</td>
        <td>${driverStanding.points}</td>
    `
    return driver
}

function addStandingListing(driver) {
    document.querySelector(".standings-table-body").append(driver)
}

