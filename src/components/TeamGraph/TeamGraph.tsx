import React from 'react';
import { GraphDisplay } from '../../helpers/ConfigParser/types';
import { Bar } from 'react-chartjs-2';

interface TeamGraphProps {
  displays: Array<GraphDisplay>;
}

export const TeamGraph = (props: TeamGraphProps): JSX.Element => {
  var data = {
    labels: [] as string[] ,
    datasets: [
      {
        label: '',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [] as number[]
      },
    ]
  }

  for (const display of props.displays) {
    data.labels.push(display.title)
    data.datasets[0].data.push(display.value)
  }

  return (
    <Bar
      options={{
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                // @ts-ignore
                beginAtZero: true,
                min: 0,
                max: 30,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
            },
          ],
        },
      }}
      data={data}
    />
  )
}
