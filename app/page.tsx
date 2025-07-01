'use client'

/** Components */
import Navbar from "./components/Navbar";
import Container from "./components/Container";
import WeatherIcon from "./components/WeatherIcon";
import WeatherDetails  from './components/WeatherDetails'

/** Utils */
import { getDayOrNightIcon } from "./utils/getDayOrNightIcon";
import { convertKilvenToCelsius } from "./utils/convertKilvenToCelsius";
import { metersToKilometers } from './utils/metersToKilometers'
import { convertWindSpeed } from "./utils/convertWindSpeed";

/** Fetch Wheather API  */
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

/** Interfcaces */
export interface WeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: City;
}

export interface ForecastItem {
  dt: number;
  main: MainDetails;
  weather: WeatherDescription[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

export interface MainDetails {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Clouds {
  all: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Sys {
  pod: string;
}

export interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface Coordinates {
  lat: number;
  lon: number;
}




export default function Home() {

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<WeatherForecastResponse, Error>({
    queryKey: ['forecast', 'gaza'],
    queryFn: async () => {
      const res = await axios.get<WeatherForecastResponse>(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            q: 'gaza',
            appid: '8c3e55bf03d31b2dca13d9ea1440c400',
            cnt: 56,
          },
        }
      )
      return res.data
    },
    staleTime: 1000 * 60 * 5, // cache for 5 min
  })

  if (isLoading) return <div className="flex items-center justify-center min-h-screen "><p className="animate-bounce">Loading weather…</p></div>
  if (isError) return <p>Error: {error.message}</p>

  const firstData = data?.list[0]

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4">
        <section>
          <div>
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})</p>
            </h2>
            <Container className=" gap-10 px-6 items-center mt-4">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKilvenToCelsius(firstData?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels  Like </span>
                  <span>{convertKilvenToCelsius(firstData?.main.feels_like ?? 0)}°</span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKilvenToCelsius(firstData?.main.temp_min ?? 0)}
                    °↓ {" "}
                  </span>
                  <span>
                    {" "}
                    {convertKilvenToCelsius(firstData?.main.temp_max ?? 0)}
                    °↑
                  </span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) =>
                  <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                    <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), 'h:mm a')}</p>
                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                    <p>{convertKilvenToCelsius(d?.main.temp ?? 0)}°</p>
                  </div>
                )}
              </div>
            </Container>
          </div>
          <div className="flex gap-4 mt-4">
            <Container className="w-fit  justify-center flex-col px-4 items-center ">
              <p className="capitalize text-center">
                {firstData?.weather[0].description}{" "}
              </p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData?.weather[0].icon ?? "",
                  firstData?.dt_txt ?? ""
                )}
              />
            </Container>

            <Container className="bg-yellow-300/80  px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visability={metersToKilometers(
                  firstData?.visibility ?? 10000
                )}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(data?.city.sunrise ?? 1702949452, "H:mm")}
                // sunrise={}
                sunset={format(data?.city.sunset ?? 1702517657, "H:mm")}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
              />
            </Container>
          </div>
        </section>
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forcast (7 days)</p>
        </section>
      </main>
    </div>
  );
}
