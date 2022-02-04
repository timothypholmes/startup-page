import React, { Component } from "react";
import { render } from 'react-dom';
import Chart from "react-apexcharts";
import axios from "axios";
import dayjs from "dayjs";

class TDMarketData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [
                {
                  name: "candle",
                  data: []
                }
              ],
            options: {
                chart: {
                    type: 'candlestick',
                    animations: {
                        enabled: true,
                        easing: "linear",
                        dynamicAnimation: {
                          enabled: true,
                          speed: 300
                        }
                    }
                },
                noData: {
                    text: 'Loading...'
                  },
            },
        };
    }

    componentDidMount() {
        this.getChartData();
    }

    getChartData() {
        const consumerKey = process.env.REACT_APP_TD_CONSUMER_KEY; 
        const symbol = 'MSFT';
        const periodType = 'day';
        const period = '1';
        const frequencyType = 'minute';
        const frequency = '15';
        var candle_array = [];
        var i = 0;
        var a = 0;
        axios.get(`https://api.tdameritrade.com/v1/marketdata/${symbol}/pricehistory?apikey=${consumerKey}` +
                `&periodType=${periodType}&period=${period}&frequencyType=${frequencyType}` +
                `&frequency=${frequency}`)
        .then(res => {
            //1console.log(res)
            for (const dataObj of res.data.candles) {
                candle_array[i] = ({
                    'x': new Date(dataObj.datetime).toLocaleString(),
                    'y': [dataObj.open, dataObj.high, dataObj.low, dataObj.close]
                })
                i += 1;
            }
            this.setState({
                series: [{
                    name: 'candlestick',
                    data: candle_array,
                }],
            })
        })
        .catch(err => {
            console.log(err);
        });
        
        this.setState({
            series: [{
                name: 'candlestick',
                data: candle_array.x,
                yValueFormatString: "$#,##0.00",
                xValueFormatString: "MMMM",
            }],
            options: {
                chart: {
                    type: 'candlestick',
                    foreColor: '#ffffff',
                    animations: {
                        enabled: true,
                        easing: "easein",
                        speed: 1000,
                        animateGradually: {
                            enabled: true,
                            delay: 10
                        },
                        dynamicAnimation: {
                          enabled: true,
                          speed: 1500
                        }
                    }
                },
                title: {
                  text: symbol,
                  align: 'center',
                  floating: false,
                  style: {
                    fontSize:  '20px',
                    fontWeight:  'bold',
                    fontFamily:  undefined,
                    color:  '#ffffff'
                  },
                },
                tooltip: {
                  enabled: false,
                  //content: `Date: ${candle_array.x}<br /><strong>Price:</strong><br />Open: ${candle_array.y[0]}, Close: ${candle_array.y[3]}<br />High: ${candle_array.y[1]}, Low: ${candle_array.y[2]}`
                },
                xaxis: {
                  type: 'category',
                  labels: candle_array.datetime,
                  labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: false,
                    hideOverlappingLabels: true,
                    showDuplicates: false,
                    trim: false,
                    minHeight: undefined,
                    maxHeight: 120,
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                    },
                    format: undefined,
                    formatter: undefined,
                    datetimeUTC: true,
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: "MMM 'yy",
                        day: 'dd MMM',
                        hour: 'HH:mm',
                    },
                  },
                },
                yaxis: {
                    type: 'category',
                    //labels: candle_array.datetime,
                    labels: {
                      show: true,
                      rotateAlways: false,
                      hideOverlappingLabels: true,
                      showDuplicates: false,
                      floating: false,
                      trim: false,
                      minHeight: undefined,
                      maxHeight: 120,
                      style: {
                          fontSize: '10px',
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          fontWeight: 400,
                          cssClass: 'apexcharts-xaxis-label',
                      },
                    },
                  },
            }
        });
    }
    
  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="candlestick"
        width="500"
        height="315"
      />
    );
  }
}

export default TDMarketData