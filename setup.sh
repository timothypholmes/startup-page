
# setup enviorment file
echo " --- copying env file --- "
FILE=.env
if [ -f "$FILE" ]; then
    echo "$FILE already exists."
else 
    cp .env.example .env
fi

# setup bookmark files
echo " --- copying bookmark files --- "
for i in {1..5}
do
echo "import React from \"react\"; 
class List$i extends React.Component {
  render() {
    return(
      <>
        <ul class=\" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2\">
            <li class=\"font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center\">example</li>
            <li class=\"\"><a href=\"https://news.ycombinator.com/\">example</a></li>
        </ul>
      </>
    );
  }
}

export default List$i" > src/assets/lists/list$i.jsx
done

# install requierments
echo " --- installing requierments --- "
npm install

# build package
echo " --- building site --- "
npm run build

# run
echo " --- running site --- "
serve -s dist -p 8000