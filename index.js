const scheduleURL = "https://ergast.com/api/f1/current.json"

const calendar = document.querySelector(".calendar")
const nextRaceContainer = document.querySelector(".nextRaceContainer")

const currentDate = new Date().toISOString()
    .slice(0, 10)

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".standings-link").classList.remove("selected-page")
    document.querySelector(".index-link").classList.add("selected-page")
})

fetch(scheduleURL)
    .then(response => response.json())
    .then(raceListObject => {
        const raceList = raceListObject.MRData.RaceTable.Races
        raceList.forEach(race => {
            addRaceToCalendar(createRaceForCalendar(race))
        })
        addNextRace(createNextRace(findNextRace(raceist)))
    })
    .catch(error => {
        console.error(error.message)
        window.location.href = "404.html"
    })

function findNextRace(raceList) {
    return raceList.find(event => event.date >= currentDate)
}

function createNextRace(race) {
    const nextRace = document.createElement("div")
    nextRace.classList.add("nextRace")
    if (Object.keys(race).includes("Sprint")) {
        nextRace.innerHTML = `
            <h2>${race.raceName}</h2>
            <p>Round ${race.round}</p>
            <p>${race.Circuit.circuitName}</p>
            <date>${convertDateAndTimeToLocal(race.date, race.time)}</date>
            <div class="weekend-schedule">
                <div>FP1
                    <date>${convertDateAndTimeToLocal(race.FirstPractice.date,
            race.FirstPractice.time)}</date>
                </div>
                <div>Qualifying
                    <date>${convertDateAndTimeToLocal(race.Qualifying.date,
                race.Qualifying.time)}</date>
                </div>
                <div>FP2
                    <date>${convertDateAndTimeToLocal(race.SecondPractice.date,
                    race.SecondPractice.time)}</date>
                </div>
                <div>Sprint
                    <date>${convertDateAndTimeToLocal(race.Sprint.date,
                        race.Sprint.time)}</date>
                </div>
            </div>
        `
    } else {
        nextRace.innerHTML = `
        <h2>${race.raceName}</h2>
        <p>Round ${race.round}</p>
        <p>${race.Circuit.circuitName}</p>
        <date>${convertDateAndTimeToLocal(race.date, race.time)}</date>
        <div class="weekend-schedule">
            <div>FP1
                <date>${convertDateAndTimeToLocal(race.FirstPractice.date,
            race.FirstPractice.time)}</date>
            </div>
            <div>FP2
                <date>${convertDateAndTimeToLocal(race.SecondPractice.date,
                race.SecondPractice.time)}</date>
            </div>
            <div>FP3
                <date>${convertDateAndTimeToLocal(race.ThirdPractice.date,
                    race.ThirdPractice.time)}</date>
            </div>
            <div>Qualifying
                <date>${convertDateAndTimeToLocal(race.Qualifying.date,
                        race.Qualifying.time)}</date>
            </div>
        </div>
    `
    }
    return nextRace
}

function addNextRace(nextRace) {
    nextRaceContainer.append(nextRace)
}

function createRaceForCalendar(event) {
    const race = document.createElement("div")
    race.classList.add("race")
    if (event.date < currentDate) {
        race.classList.add("pastRace")
    }
    race.innerHTML = `
        <h3>${event.raceName}</h3>
        <date>${convertDate(event.date)}</date>
        <p>${event.Circuit.circuitName}</p>
    `
    return race
}

function addRaceToCalendar(raceEvent) {
    calendar.append(raceEvent)
}


function convertDateAndTimeToLocal(date, time) {
    const formattedDate = new Date(`${date} ${time}`)
    return `${formattedDate
        .toString()
        .slice(0, 10)} ${formattedDate
            .toString()
            .slice(16, 21)}`
}

function convertDate(date) {
    const formattedDate = new Date(`${date}T00:00:00`)
    return formattedDate.toString().slice(3, 15)
}