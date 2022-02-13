/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";


// compnents

//import IndexNavbar from "components/Navbars/IndexNavbar.js";
//import Footer from "components/Footers/Footer.js";
import Clock from "../components/Clock.js";
import Unsplash from "../components/Unsplash.js";
import SearchBox from "../components/Search.js";
import SolarGraphNew from "../components/SolarGraphNew.js";
import WeatherBox from "../components/Weather.js";
import TDMarketData from "../components/TDMarketData.js";

// assests
import desert from "../assets/img/desert.mp4"

export default function Index() {
  return (
    <>
      {/*<section className="bg-off-white1 flex h-screen v-min-860-px h-min-200-px p-20"> grid-flow-row-dense  */}
      <section className="bg-off-white1 min-h-screen flex items-center justify-center pt-10 pb-10 font-helvetica">
        <div class="grid xl:grid-cols-7 md:grid-cols-5 sm:grid-cols-3 gap-y-6 gap-x-6 grid-flow-row-dense content-center font-">

          {/* row 1 */}
          <div class="overflow-hidden rounded-xl col-span-1 row-span-2 h-80 w-36 shadow-4xl">
            <div class="sticky rounded-xl overflow-hidden h-80 w-36 "> 
              <video class="relative object-cover min-h-full max-w-xl -left-12" src={desert} type="video/mp4" autoPlay muted loop/>
            </div>
          </div>
          <div class="rounded-xl col-span-1 h-36 w-36 shadow-4xl">
            <div class="sticky rounded-xl overflow-hidden h-36 w-36"> 
              <video class="relative object-cover min-h-full max-w-sm right-48" src={desert} type="video/mp4" autoPlay muted loop/>
            </div>
          </div>
          <div class="bg-blue3 text-black rounded-xl col-span-2 h-36 w-80 shadow-4xl"><SearchBox /></div>
          <div class="bg-blue3 rounded-xl col-span-1 h-36 w-36 shadow-4xl">
            <ul class=" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2">
              <li class="font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center">news</li>
              <li class=""><a href="https://news.ycombinator.com/">hacker news</a></li>
              <li><a href="https://medium.com">medium</a></li>
            </ul>
          </div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl"><Unsplash /></div>
          <div class="bg-blue3 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl"><WeatherBox /></div>
         
          {/* row 2 */}
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl"><Unsplash /></div>
          <div class="bg-blue3 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl">
           <ul class=" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2">
              <li class="font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center">work</li>
              <li><a href="https://stackoverflow.com">stackoverflow</a></li>
              <li><a href="https://github.com">github</a></li>
              <li><a href="https://gist.github.com/timothypholmes">gists</a></li>
            </ul>
          </div>
          <div class="bg-blue3 text-black rounded-xl col-span-3 row-span-2 h-80 w-auto shadow-4xl"><TDMarketData /></div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl"><Unsplash /></div>

          {/* row 3 */}
          <div class="bg-blue3 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl">
           <ul class=" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2">
              <li class="font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center">finance</li>
              <li><a href="https://secure.tdameritrade.com/">tdameritrade</a></li>
              <li><a href="https://secure.tdameritrade.com/trade/options">options</a></li>
              <li><a href="https://secure.tdameritrade.com/trade">stonks/etfs</a></li>
              <li><a href="https://www.marketwatch.com">marketwatch</a></li>
            </ul>
          </div>
          <div class="bg-blue3 text-black rounded-xl col-span-2 row-span-2 h-92 w-92 shadow-4xl"><SolarGraphNew /></div>
          <div class="bg-blue3 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl">
           <ul class=" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2">
              <li class="font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center">social</li>
              <li><a href="https://www.reddit.com">reddit</a></li>
              <li><a href="https://www.youtube.com">youtube</a></li>
              <li><a href="https://www.linkedin.com">linkedin</a></li>
            </ul>
          </div>

          {/* row 4 */}
          <div class="bg-blue3 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl">
         <ul class=" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2">
                <li class="font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center">r/</li>
                <li><a href="https://www.reddit.com/r/startpages/">r/startpages</a></li>
                <li><a href="https://www.reddit.com/r/unixporn/">r/unixporn</a></li>
                <li><a href="https://www.reddit.com/r/stocks/">r/stonks</a></li>
            </ul>
          </div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl"><Unsplash /></div>
          <div class="bg-blue3 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl">
           <ul class=" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2">
                <li class="font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center">r/</li>
                <li><a href="https://www.reddit.com/r/startpages/">r/startpages</a></li>
                <li><a href="https://www.reddit.com/r/unixporn/">r/unixporn</a></li>
                <li><a href="https://www.reddit.com/r/stocks/">r/stonks</a></li>
            </ul>
          </div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl"><Unsplash /></div>
          <div class="bg-[#8e412e] text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl"><Clock /></div>

          {/* row 5 */}
          {/*
          <div class="bg-off-white1 text-black rounded-xl col-span-1  h-36 w-36 "></div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1  h-36 w-36 ">02</div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1  h-36 w-36 ">05</div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1  h-36 w-36 "></div>
          <div class="bg-off-white1 text-black rounded-xl col-span-2  h-36 w-36 ">02</div>
          <div class="bg-off-white1 text-black rounded-xl col-span-1  h-36 w-36 ">05</div>
          */}

        </div>
      </section>
    </>
  );
}