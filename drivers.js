const standingsURL = "https://ergast.com/api/f1/current/driverStandings.json"
const driverStatsBaseURL = "https://ergast.com/api/f1/current/drivers/"  // need to append ${driver}/(results for race)(qualifying for quali)(sprint for sprint).json



fetch(standingsURL)
    .then(response => response.json())
    .then(standingsObject => {
        const standingsList = standingsObject.MRData.StandingsTable.StandingsLists[0].DriverStandings
        standingsList.forEach(driverStanding => {
            addStandingListing(createStandingListing(driverStanding))
        }
        )
    })

function createStandingListing(driverStanding) {
    const driver = document.createElement("tr")
    driver.innerHTML = `
        <td>${driverStanding.position}</td>
        <td>${driverStanding.Driver.code}</td>
        <td>${driverStanding.points}</td>
    `
    return driver
}

function addStandingListing(driver) {
    document.querySelector(".standings-table-body").append(driver)
}

