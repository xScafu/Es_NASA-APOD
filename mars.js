let ctx = document.querySelector("#myChart");
let ctx2 = document.querySelector("#midChart");

const API_MARS_URL =
  "https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json";
const MARS_DAYS = 30;

async function getMarsData() {
  const response = await fetch(API_MARS_URL);
  const marsData = await response.json();

  let lastMartianMonth = marsData.soles.slice(0, MARS_DAYS).reverse();
  let updatedMarsData = lastMartianMonth.map((solData) => {
    let midTemp = (Number(solData.max_temp) + Number(solData.min_temp)) / 2;
    return { ...solData, mid_temp: midTemp.toString() };
  });
  return updatedMarsData;
}

async function startProgram() {
  let marsMonthData = await getMarsData();
  drawChart(marsMonthData);
}

startProgram();

function drawChart(weatherData) {
  console.log(weatherData);
  new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Max temp",
          data: weatherData,
          borderColor: "red",
          pointHoverRadius: 8,
        },
        {
          label: "Min temp",
          data: weatherData,
          borderColor: "blue",
          pointHoverRadius: 8,
        },
        {
          label: "Mid temp",
          data: weatherData,
          borderColor: "orange",
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          titleFont: {
            size: 15,
            weight: "bold",
          },
          callbacks: {
            // aggiorniamo la tooltip per mostrare l'unità di misura.
            // lo facciamo ricostruendo la stringa mostrata nella tooltip:
            // mettiamo l'etichetta del dataset, la temperatura e l'unità di misura
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y} °C`;
            },
          },
        },
        legend: {
          labels: {
            font: {
              size: 15,
              weight: "bold",
            },
          },
        },
      },
      layout: {
        padding: {
          left: 200,
          right: 200,
          top: 100,
          bottom: 100,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Mars's soles",
          },
          ticks: {
            font: {
              size: 18,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: "Temperature in °C",
          },
          ticks: {
            font: {
              size: 18,
            },
          },
        },
      },
      // scelgo la chiave dell'oggetto da estrarre e mostrare nel grafico
      parsing: {
        yAxisKey: ["max_temp", "min_temp", "mid_temp"],
        xAxisKey: ["sol"],
      },
    },
  });
}
