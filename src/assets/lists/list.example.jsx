import React from "react";

class Example extends React.Component {
  render() {
    return(
      <>
        <ul class=" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2">
            <li class="font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center">example</li>
            <li class=""><a href="https://news.ycombinator.com/">example</a></li>
        </ul>
      </>
    );
  }
}

export default Example