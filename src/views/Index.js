/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

//import IndexNavbar from "components/Navbars/IndexNavbar.js";
//import Footer from "components/Footers/Footer.js";
import Clock from "../components/Clock.js";
import Unsplash from "../components/Unsplash.js";
import SearchBox from "../components/Search.js";
import SolarGraph from "../components/SolarGraph.js";


export default function Index() {
  return (
    <>
      <section className="bg-[#0d1a26] items-center flex h-screen max-h-860-px p-20">
        <div class="grid grid-rows-3 gap-11">

          {/* row 1 */}
          <div class="bg-[#0d1a26] text-white rounded-md col-start-1 col-span-1 row-span-2 shrink-0 h-92 w-36 border-dashed border-2 border-[#00000]">01</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-2 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">02</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-3 col-span-2 shrink-0 h-36 w-92 border-dashed border-2 border-[#00000]"><SearchBox /></div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-5 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">05</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-6 col-span-1 shrink-0 h-36 w-36"><Unsplash /></div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-7 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">07</div>
         
          {/* row 2 */}
          
          <div class="bg-[#0d1a26] text-white rounded-md col-start-2 col-span-1 shrink-0 h-36 w-36"><Unsplash /></div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-3 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">03</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-4 col-span-1 shrink-0 h-36 w-36"><Unsplash /></div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-5 col-span-2 row-span-2 shrink-0 h-92 w-92 border-dashed border-2 border-[#00000]">05</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-7 col-span-1 shrink-0 h-36 w-36"><Unsplash /></div>

          {/* row 3 */}
          <div class="bg-[#0d1a26] text-white rounded-md col-start-1 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">01</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-2 col-span-2 row-span-2 shrink-0 h-92 w-92 border-dashed border-2 border-[#00000]">02</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-4 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">04</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-7 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">07</div>

          {/* row 4 */}
          <div class="bg-[#0d1a26] text-white rounded-md col-start-1 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">01</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-4 col-span-1 shrink-0 h-36 w-36"><Unsplash /></div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-5 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">05</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-6 col-span-1 shrink-0 h-36 w-36"><Unsplash /></div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-7 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]"><Clock /></div>

          {/* row 5 */}
          {/*
          <div class="bg-[#0d1a26] text-white rounded-md col-start-1 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]"></div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-2 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">02</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-3 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">05</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-4 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]"></div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-5 col-span-2 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">02</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-7 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">05</div>
          */}

        </div>
      </section>
    </>
  );
}