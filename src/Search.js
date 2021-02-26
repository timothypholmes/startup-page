function sendSearch(e) {
  const input = document.querySelector('.search-input');

  if (e.key === 'Enter') {

    var buttons = document.querySelectorAll('button');

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].disabled === true) {

          const  address = buttons[i].getAttribute("address")
          const input = encodeURIComponent(document.getElementById('search-input').value)
          const url = `${address}${input}`;

          window.open(url);
        }
    }
  }
}

export { sendSearch };