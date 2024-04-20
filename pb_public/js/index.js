// const pb = new PocketBase("http://127.0.0.1:8090");

// let metrics = [];
// let latestValues = {};
// let measurements = [];
// let chart;

// // ------------------------------------------------------------
// async function fetchConfigs() {
//   return await pb.collection("configs").getFullList({
//     sort: "name",
//   });
// }
// function getConfig(configs, name) {
//   if (!configs || !Array.isArray(configs)) return null;
//   const config = configs.find((v) => v.name === name);
//   if (!config) return null;

//   const value = config.value;
//   const dataType = config.data_type;
//   switch (dataType) {
//     case "S":
//       return value;

//     case "N":
//       return

//     case "BOOL":
//       break;

//     default:
//       return null; // Not support data type
//   }
// }
// // ------------------------------------------------------------

// async function getMetrics() {
//   return await pb.collection("metrics").getFullList({
//     sort: "name",
//   });
// }

// async function getMetric(id) {
//   return await pb.collection("metrics").getOne(id);
// }

// async function getMeasurements() {
//   return await pb.collection("measurements").getList(1, 10, {
//     sort: "-ts",
//     skipTotal: true,
//   });
// }

// async function getLatestMeasurement() {
//   return await pb.collection("measurements").getFirstListItem("", {
//     sort: "-ts",
//   });
// }

// function renderText(id, value) {
//   const ctx = document.getElementById(id);
//   ctx.innerText = value;
// }

// function to2Digits(n) {
//   if (n <= 10) return `0${n}`;
//   return n;
// }

// function roundDecimal(v, decimal = 0) {
//   const a = Number(v);
//   return Number(a.toFixed(decimal));
// }

// function formatTs(timestamp) {
//   const ts = new Date(timestamp);
//   const date = to2Digits(ts.getUTCDate());
//   const month = to2Digits(ts.getUTCMonth());
//   const hour = to2Digits(ts.getUTCHours());
//   const minute = to2Digits(ts.getUTCMinutes());
//   return `${date}/${month} ${hour}:${minute}`;
// }

// /**
//  * @param {*} id: string
//  * @param {*} name: string
//  * @param {*} timeseries: [{ts: string, value: number}]
//  */
// function drawChart(id, name, timeseries) {
//   const ctx = document.getElementById(id);

//   const labels = timeseries.items.map((v) => formatTs(v.ts)).reverse();
//   const values = timeseries.items
//     .map((v) => roundDecimal(v.value, 2))
//     .reverse();

//   if (!chart) {
//     const data = {
//       labels: labels,
//       datasets: [
//         {
//           label: name,
//           data: values,
//           fill: false,
//           borderColor: "#eee",
//           tension: 0.1,
//         },
//       ],
//     };

//     chart = new Chart(ctx, {
//       type: "line",
//       data: data,
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   } else {
//     chart.data.labels = labels;
//     chart.data.datasets[0].data = values;
//     chart.update();
//   }
// }

// async function reRender() {
//   const latestRecord = await getLatestMeasurement();
//   renderText("latest_value", roundDecimal(latestRecord.value, 2));
//   renderText("latest_ts", formatTs(latestRecord.ts));

//   measurements = await getMeasurements();
//   drawChart("chart", "Water", measurements);
// }

// async function main() {
//   const data = await getMetrics();
//   if (!data || !Array.isArray(data)) data = [];

//   Chart.defaults.color = "#eee";

//   setInterval(() => {
//     reRender();
//   }, 3000);

//   // Toggle measuring
//   setInterval(() => {
//     const measuring = document.getElementById("measuring");
//     measuring.classList.toggle("hidden");
//   }, 1000);
// }

// ready(main);

// pb.collection("measurements").subscribe("*", function (e) {
//   try {
//     renderText("latest_value", e.record.value);
//   } catch (error) {
//     console.log(error);
//   }
// });
const WS_URL = "ws://localhost:8080";
const LEVELS = [1, 5, 27957, 15, 20, 25, 30];

const options = {
  keepalive: 1000,
};

const client = mqtt.connect(WS_URL, options);
client.on("connect", function () {
  console.log("Connected");
  // Subscribe to a topic
  client.subscribe("i2c_mqtt_sensor/binary_sensor/+/state", function (err) {
    if (!err) {
      console.log("Subscribed to i2c_mqtt_sensor/binary_sensor/+/state");
    }
  });
});

client.on("reconnect", () => {
  console.log("Reconnecting...");
});

client.on("disconnect", () => {
  console.log("Disconnect from broker");
});

client.on("close", () => {
  console.log("Close from broker");
});

client.on("error", () => {
  console.log("Error from broker");
});

async function calculateLevel(level, state) {
  let value = 0;
  if (state == 1) {
    // The water is rising
    value = LEVELS[level];
  } else {
    // The water is falling
    const temp = level - 1;
    if (temp >= 0) {
      value = LEVELS[temp];
    }
    value = 0;
  }

  if (value) {
    return value;
  }
  return 0;
}

function to2Digits(n) {
  if (n <= 10) return `0${n}`;
  return n;
}

function formatTs(timestamp) {
  const ts = new Date(timestamp);
  const date = to2Digits(ts.getUTCDate());
  const month = to2Digits(ts.getUTCMonth());
  const hour = to2Digits(ts.getUTCHours());
  const minute = to2Digits(ts.getUTCMinutes());
  return `${date}/${month} ${hour}:${minute}`;
}

function renderText(id, value) {
  const ctx = document.getElementById(id);
  ctx.innerText = value;
}

async function processMessage(topic, message) {
  const match = topic.match(/\d+/); // Match one or more digits
  const level = match ? parseInt(match[0]) : null;

  console.log(level);

  if (level) {
    // level: number 0 - 7
    const state = message.toString() == "ON" ? 1 : 0;
    console.log(state);
    const value = await calculateLevel(level, state);

    // TODO: Show value to screen
    console.log(value);
    renderText("latest_value", value);
  }
}

// Receive messages
client.on("message", function (topic, message) {
  processMessage(topic, message);
});

// Toggle measuring
setInterval(() => {
  const measuring = document.getElementById("measuring");
  measuring.classList.toggle("hidden");
}, 1000);
