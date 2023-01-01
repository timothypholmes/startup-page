var config = {
  
  latitude: 41.881832,
  longitude: -87.623177,
  units: "imperial", // metric, standard

  bookmark: [
    {
      title: 'news',
      content: [
        {
          name: "hacker news",
          url: "https://news.ycombinator.com/"
        },
        {
          name: "medium",
          url: "https://medium.com"
        },
        {
          name: "12ft",
          url: "https://12ft.io"
        }
      ]
    },
    {
      title: 'work',
      content: [
        {
          name: "stackoverflow",
          url: "https://stackoverflow.com"
        },
        {
          name: "github",
          url: "https://github.com"
        }
      ]
    },
    {
      title: 'finance',
      content: [
        {
          name: "tdameritrade",
          url: "https://secure.tdameritrade.com/"
        },
        {
          name: "options",
          url: "https://secure.tdameritrade.com/trade/options"
        },
        {
          name: "stocks/etfs",
          url: "https://secure.tdameritrade.com/trade"
        },
        {
          name: "marketwatch",
          url: "https://www.marketwatch.com"
        },
      ]
    },
    {
      title: 'social',
      content: [
        {
          name: "reddit",
          url: "https://www.reddit.com"
        },
        {
          name: "youtube",
          url: "https://www.youtube.com"
        },
        {
          name: "linkedin",
          url: "https://www.linkedin.com"
        },
      ]
    },
    {
      title: 'home lab',
      content: [
        {
          name: "homebridge",
          url: "http://10.0.0.182:8581/login"
        },
        {
          name: "pi-hole",
          url: "http://10.0.0.182/admin/index.php"
        },
      ]
    },
  ],

  unsplash: {
    city: ['chicago', 'miami', 'new york', 'seattle', 'austin'],
    states: ['florida', 'alaska', 'california', 'washington', 'maine', 'montana'],
    nature: ['sea', 'ocean', 'lake', 'glacier', 'ice field', 'mountains', 'volcanos'],
    manMade: ['aircraft', 'f35', 'skyscraper', 'bridge', 'computer', 'architecture'],
    animal: ['elephant', 'monkey', 'lion', 'bear', 'owl', 'giraffe'],
    countries: ['japan', 'chile', 'angola', 'namibia', 'mauritius', 'botswana', 'tanzania']
  },

  // credentials
  unsplashCredential: "",
  openWeatherCredential: "",
  
  style: {
    background: 'bg-[#F2F2F2]',
    navBackground: 'bg-[#F2F2F2]',
    underline: 'decoration-blue-500'
  }
}

export default config