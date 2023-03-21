var config = {
  
  latitude: import.meta.env.VITE_LATITUDE,
  longitude: import.meta.env.VITE_LONGITUDE,
  units: "metric", // metric, standard

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
        },
        {
          name: "bitbucket",
          url: "https://bitbucket.com"
        },
        {
          name: "gmail",
          url: "https://gmail.com"
        }
      ]
    },
    {
      title: 'life',
      content: [
        {
          name: "hotstar",
          url: "https://hotstar.com/"
        },
        {
          name: "axis",
          url: "https://axisbank.com"
        },
        {
          name: "kite",
          url: "https://kite.com"
        },
        {
          name: "marketwatch",
          url: "https://www.marketwatch.com"
        },
        {
          name: "calendar",
          url: "https://tradingeconomics.com/calendar"
        },
        {
          name: "screener",
          url: "https://finviz.com"
        }
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
        {
          name: "twitter",
          url: "https://twitter.com/home"
        },
        {
          name: "tweetdeck",
          url: "https://tweetdeck.twitter.com"
        }
      ]
    },
    {
      title: 'other',
      content: [
        {
          name: "homebridge",
          url: "http://10.0.0.182:8581/login"
        },
        {
          name: "pi-hole",
          url: "http://10.0.0.182/admin/index.php"
        },
        {
          name: "maps",
          url: "https://www.google.com/maps/"
        },
      ]
    },
  ],

  unsplash: {
    box1: ['chicago', 'miami', 'new york', 'seattle', 'austin'],
    box2: ['florida', 'alaska', 'california', 'washington', 'maine', 'montana'],
    box3: ['sea', 'ocean', 'lake', 'glacier', 'ice field', 'mountains', 'volcanos'],
    box4: ['aircraft', 'f35', 'skyscraper', 'bridge', 'architecture'],
    box5: ['japan', 'chile', 'angola', 'namibia', 'mauritius', 'botswana', 'tanzania'],
    box6: ['elephant', 'monkey', 'lion', 'bear', 'owl', 'giraffe']
  },
  style: {
    background: 'bg-[#F2F2F2]',
    navBackground: 'bg-[#F2F2F2]',
    underline: 'decoration-blue-500'
  }
}

export default config