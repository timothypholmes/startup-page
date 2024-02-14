/*eslint-disable*/
import React from "react";

import { readSettings } from '../components/readSettings';
const settings = readSettings();

// components
import Clock from "../components/Clock";
import Unsplash from "../components/Unsplash";
import SearchBox from "../components/Search";
import SolarGraph from "../components/SolarGraph";
import WeatherBox from "../components/Weather";
import Toggle from "../components/ThemeToggle";
import ThemeProvider from "../components/ThemeContext";
import News from "../components/News";
import Windy from "../components/Windy";
import Bookmark from "../components/Bookmark";
import SettingsButton from "../components/SettingsButton";

// assets
import desert from "../assets/img/desert.mp4"

export default function Index() {
  return (
    <>
      <section className={`bg-off-white1 dark:bg-blue5 min-h-screen flex items-center justify-center pt-10 pb-10 font-helvetica`}>
        <div class="grid xl:grid-cols-7 md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-2 gap-y-6 gap-x-6 grid-flow-row-dense content-center">

          {/* row 1 */}
          <div class="overflow-hidden rounded-xl col-span-1 row-span-2 h-80 w-36 shadow-4xl dark:shadow-none">
            <div class="sticky rounded-xl overflow-hidden h-80 w-36 border-0 dark:border-4 dark:border-off-white2"> 
              <video class="relative object-cover min-h-full max-w-xl -left-12" src={ desert } type="video/mp4" autoPlay muted loop/>
            </div>
          </div>
          <div class="rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none">
            <div class="sticky rounded-xl overflow-hidden h-36 w-36 border-0 dark:border-4 dark:border-off-white2"> 
              <video class="relative object-cover min-h-full max-w-sm right-48" src={ desert } type="video/mp4" autoPlay muted loop/>
            </div>
          </div>
          <div class="bg-blue5 text-black rounded-xl col-span-2 h-36 w-80 shadow-4xl dark:shadow-none border-0 dark:border-4 dark:border-off-white2"><SearchBox /></div>
          <Bookmark title={ settings.bookmark[0].title } content={ settings.bookmark[0].content } />
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none"><Unsplash search={ settings.unsplash.unsplashBox1 }/></div>
          <div class="bg-green2 dark:bg-green1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none border-0 dark:border-4 dark:border-off-white2"><WeatherBox /></div>
          
          {/* row 2 */}
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none"><Unsplash search={ settings.unsplash.unsplashBox2 }/></div>
          <Bookmark title={ settings.bookmark[1].title } content={ settings.bookmark[1].content } />
          <div class="overflow-hidden rounded-xl col-span-3 row-span-2 h-80 shadow-4xl dark:shadow-none "><Windy /></div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none"><Unsplash search={ settings.unsplash.unsplashBox3 }/></div>

          {/* row 3 */}
          <Bookmark title={ settings.bookmark[2].title } content={ settings.bookmark[2].content } />
          <div class="bg-[#000000] rounded-xl col-span-2 row-span-2 shadow-4xl dark:shadow-none border-0 dark:border-4 dark:border-off-white2"><SolarGraph /></div>
          <Bookmark title={ settings.bookmark[3].title } content={ settings.bookmark[3].content } />

          {/* row 4 */}
          <Bookmark title={ settings.bookmark[4].title } content={ settings.bookmark[4].content } />
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none"><Unsplash search={ settings.unsplash.unsplashBox4 }/></div>
          <div class="flex items-center justify-center bg-blue5 text-white rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none border-0 dark:border-4 dark:border-off-white2">
            <ThemeProvider>
              <Toggle />
            </ThemeProvider>
            <SettingsButton />
          </div>
          <div class="text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none"><Unsplash search={ settings.unsplash.unsplashBox5 }/></div>
          <div class="bg-red2 dark:bg-red1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none border-0 dark:border-4 dark:border-off-white2"><Clock /></div>
        </div>
      </section>
    </>
  );
}