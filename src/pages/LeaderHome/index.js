import Bar from "@/components/Bar"
import Chart from "@/components/Chart"
import { http } from "@/utils";
import { Card } from "antd";
import { useEffect, useState } from "react";


const Home = () => {

  const [chartData, setChartData] = useState([])
  const [barData, setBarData] = useState({
    xData: [],
    yData: []
  })

  const chartDataChange = (chartData) => {
    let res = []
    for (let i = 0; i < chartData.length; i++) {
      res.push({
        name: chartData[i].typeName,
        value: chartData[i].quantity
      })
    }
    return res
  }

  const barDataChange = (barData) => {
    let res = {
      xData: [],
      yData: []
    }
    barData.sort((a, b) => b.count - a.count)
    const length = barData.length >= 10 ? 10 : barData.length
    for (let i = 0; i < length; i++) {
      res.xData.push(barData[i].chapterName)
      res.yData.push(barData[i].count)
    }
    return res
  }



  useEffect(() => {
    const getData = async () => {
      const chartRes = await http.get('/typeratio')
      const barRes = await http.get('/views/count')
      setChartData(chartDataChange(chartRes.data.res))
      setBarData(barDataChange(barRes.data.res))

    }
    getData()
  }, [])

  return (
    <div>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>

          <Chart
            data={chartData}
            title='各类型占比情况'

          ></Chart>
          <Bar
            title='视频观看次数Top10'
            xData={barData.xData}
            yData={barData.yData}
          >
          </Bar>
        </div>

      </Card>

    </div>
  )
}

export default Home