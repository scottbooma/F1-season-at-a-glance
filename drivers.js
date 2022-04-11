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
        const driverInfo = driverStatsResponseArray[0].MRData.RaceTable.Races[0].Results[0].Driver
        const raceResults = driverStatsResponseArray[0].MRData.RaceTable.Races
        const qualiResults = driverStatsResponseArray[1].MRData.RaceTable.Races
        const sprintResults = driverStatsResponseArray[2].MRData.RaceTable.Races
        console.log(driverInfo, raceResults, qualiResults, sprintResults)
        addToDriverInfoContainer(getDriverImage(driverInfo))
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

function addToDriverInfoContainer(element) {
    driverInfoContainer.append(element)
}

function getDriverImage(driverInfo) {
    const img = document.createElement("img")
    img.classList.add("driver-image")
    img.src = `images/drivers/${driverInfo.driverId}.jpg`
    img.alt = `${driverInfo.givenName} ${driverInfo.familyName}`
    return img
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

