/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

//import IndexNavbar from "components/Navbars/IndexNavbar.js";
//import Footer from "components/Footers/Footer.js";
import Clock from "../components/Clock.js";
import Unsplash from "../components/Unsplash.js";


export default function Index() {
  return (
    <>
      <section className="bg-[#0d1a26] items-center flex h-screen max-h-860-px p-20">
        <div class="grid grid-rows-3 gap-8">
          <div class="bg-[#0d1a26] text-white rounded-md col-start-1 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">
            <video src="./assets/img/chicago3.mp4" width="600" height="600" autoplay="true" />
          </div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-2 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">02</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-5 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">05</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-span-1 shrink-0 h-36 w-36">
            <Unsplash />
          </div>
          <div class="bg-[#0d1a26] text-white rounded-md col-span-1 shrink-0 h-36 w-36">
            <Clock />
          </div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-2 col-span-1 shrink-0 h-36 w-36 border-dashed border-2 border-[#00000]">02</div>
          <div class="bg-[#0d1a26] text-white rounded-md col-start-2 col-span-1 shrink-0 h-36 w-80 border-dashed border-2 border-[#00000]">04</div>
        </div>
      </section>
    </>
  );
}