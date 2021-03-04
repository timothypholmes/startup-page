import React, { Component } from "react";
import { render } from 'react-dom';
import Chart from "react-apexcharts";
import axios from "axios";
import dayjs from "dayjs";


export default class TDMarketData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [{
                name: 'candle',
                data: []
            }],
            options: {
                tooltip: {
                    enabled: true,
                },
                xaxis: {
                    type: 'datetime'
                  },
                yaxis: {
                    tooltip: {
                        enabled: true
                    },
                },
                noData: {
                    text: 'Loading...'
                  },
                chart: {
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                            enabled: false,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 500
                        }
                    }
                }
            },
        };
    }

    
    componentDidMount() {
        const consumerKey = process.env.REACT_APP_TD_CONSUMER_KEY; 
        const symbol = 'GME';
        const periodType = 'day';
        const period = '1';
        const frequencyType = 'minute';
        const frequency = '10';
        var candle_array = [];
        var i = 0;

        axios.get(`https://api.tdameritrade.com/v1/marketdata/${symbol}/pricehistory?apikey=${consumerKey}` +
                  `&periodType=${periodType}&period=${period}&frequencyType=${frequencyType}&frequency=${frequency}`)
        .then(res => {
            //1console.log(res)
            for (const dataObj of res.data.candles) {
                candle_array[i] = ({
                    'x': Date(dataObj.datetime),
                    'y': [dataObj.open, dataObj.high, dataObj.low, dataObj.close]
                })
                i += 1;
            }
            //console.log(candle_array)
            this.setState({
                series: [{
                    name: 'candle',
                    data: candle_array,
                }],
                options: {
                    candlestick: {
                        colors: {
                          upward: '#3C90EB',
                          downward: '#DF7D46'
                        }
                    },
                    title: {
                      text: symbol,
                      align: 'center',
                      fontSize: "140px",
                    },
                    tooltip: {
                      enabled: true,
                      //content: `Date: ${candle_array.x}<br /><strong>Price:</strong><br />Open: ${candle_array.y[0]}, Close: ${candle_array.y[3]}<br />High: ${candle_array.y[1]}, Low: ${candle_array.y[2]}`
                    },
                    xaxis: {
                      type: 'category',
                      labels: {
                        formatter: function(val) {
                          return dayjs(val).format('MMM DD HH:mm')
                        }
                      }
                    },
                    grid: {
                        row: {
                            colors: ['#e5e5e5', 'transparent'],
                            opacity: 0.5
                        }, 
                        column: {
                            colors: ['#f8f8f8', 'transparent'],
                        }, 
                        xaxis: {
                          lines: {
                            show: true
                          }
                        }
                      },
                      chart: {
                        animations: {
                            enabled: true,
                            easing: 'linear',
                            speed: 10000,
                            animateGradually: {
                                enabled: false,
                                delay: 150
                            },
                            dynamicAnimation: {
                                enabled: true,
                                speed: 1
                            }
                        }
                    }
                    
                  },
            });
    
            //console.log(this.state.series)
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    render() {
        return (
            <div className="app">
                <div className="row">
                    <Chart
                        options={this.state.options}
                        series={this.state.series}
                        type="candlestick"
                        width="1100"
                        height="700"
                        />
                </div>
            </div>
        );
    }
}