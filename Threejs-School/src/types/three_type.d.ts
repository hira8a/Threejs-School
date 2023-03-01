export interface tWeather {
    sunny: boolean,
    cloudy: boolean,
    rain: boolean,
    lightning: boolean,
}

export interface tTime {
    morning: boolean,
    noon: boolean,
    afternoon: boolean
}

export interface tOptions {
    timeName: string,
    time: tTime,
    weatherName: string,
    weather: tWeather,
    theFirstPerson: boolean
}