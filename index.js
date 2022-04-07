const scheduleURL = "https://ergast.com/api/f1/current.json"
const calendar = document.querySelector(".calendar")
const nextRaceContainer = document.querySelector(".nextRaceContainer")

const currentDate = new Date().toISOString().slice(0, 10)

fetch(scheduleURL)
    .then(response => response.json())
    .then(raceListObject => {
        const raceList = raceListObject.MRData.RaceTable.Races
        createRaceCalendar(raceList)
        addNextRace(createNextRace(findNextRace(raceList)))
    })

function findNextRace(raceList) {
    return raceList.find(event => event.date >= currentDate)
}

function createNextRace(race) {
    const nextRace = document.createElement("div")
    nextRace.classList.add("nextRace")
    console.log(race)
    nextRace.innerHTML = `
                        <h2>${race.raceName}</h2>
                        <p>Round ${race.round}</p>
                        <p>${race.Circuit.circuitName}</p>
                        <date>${convertDateAndTimeToLocal(race.date, race.time)}</date>
                        <div class="weekend-schedule">
                            <div>FP1
                                <date>${convertDateAndTimeToLocal(race.FirstPractice.date, race.FirstPractice.time)}</date>
                            </div>
                            <div>FP2
                                <date>${convertDateAndTimeToLocal(race.SecondPractice.date, race.SecondPractice.time)}</date>
                            </div>
                            <div>FP3
                                <date>${convertDateAndTimeToLocal(race.ThirdPractice.date, race.ThirdPractice.time)}</date>
                            </div>
                            <div>Qualifying
                                <date>${convertDateAndTimeToLocal(race.Qualifying.date, race.Qualifying.time)}</date>
                            </div>
                        </div>`
    return nextRace
}

function addNextRace(nextRace) {
    nextRaceContainer.append(nextRace)
}

function createRaceCalendar(raceList) {
    raceList.forEach(event => {
        const race = document.createElement("div")
        race.classList.add("race")
        race.innerHTML = `
                        <h3>${event.raceName}</h3>
                        <date>${convertDate(event.date)}</date>
                        <p>${event.Circuit.circuitName}</p>`
        calendar.append(race)
        if (event.date < currentDate) {
            race.classList.add("pastRace")
        }
    })
}

function convertDateAndTimeToLocal(date, time) {
    date = new Date(`${date} ${time}`)
    return `${date.toString().slice(0, 10)} ${date.toString().slice(16, 21)}`
}

function convertDate(date) {
    date = new Date(date)
    return date.toString().slice(3, 15)
}