const Bookmark = ({ title, content }) => {

  return (
    <div class="bg-blue5 text-black rounded-xl col-span-1 h-36 w-36 shadow-4xl dark:shadow-none border-0 dark:border-4 dark:border-off-white2 overflow-y-auto">
      <ul class=" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2">
        <li class="font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center">{ title }</li>
        {content.map(({name, url}, key) => (
            <li><a key={key} href={url}>{name}</a></li>
        ))}
      </ul>
    </div>
  );
}
export default Bookmark;