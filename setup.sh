
# setup enviorment file
echo " --- copying env file --- "
FILE=.env
if [ -f "$FILE" ]; then
    echo "$FILE already exists."
else 
    cp .env.example .env
fi

# setup config file
echo " --- copying env file --- "
FILE=src/config/index.js
if [ -f "$FILE" ]; then
    echo "$FILE already exists."
else 
    cp src/config/index.example.js src/config/index.js
fi

# install requierments
echo " --- installing requierments --- "
npm install

# build package
echo " --- building site --- "
npm run build

# run
echo " --- running site --- "
serve -s dist -p 8000