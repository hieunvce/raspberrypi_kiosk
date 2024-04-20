const mqtt = require("mqtt");
const PocketBase = require("pocketbase/cjs");
const pb = new PocketBase("http://127.0.0.1:8090");
const url = "mqtt://localhost:1883";

function getConfig(configs, name) {
  const v = configs.find((config) => config.name == name);
  return v;
}
function getLevelConfig(configs, name) {
  const v = configs.find((config) => config.name == name);
  if (v) {
    return parseInt(v.value);
  }
  return null;
}

async function fetchConfigs() {
  return await pb.collection("configs").getFullList({
    sort: "name",
  });
}

async function getLevelConfigs(configs) {
  const levels = [
    "level_0",
    "level_1",
    "level_2",
    "level_3",
    "level_4",
    "level_5",
    "level_6",
    "level_7",
  ];

  return levels.map((level) => getLevelConfig(configs, level));
}

/**
 *
 * @param {*} level number 0 - 7
 * @param {*} state number 1 | 0
 */
async function addRecord(value) {
  const ts = Date.now();
  const response = pb.collection("measurements").create({
    ts,
    value,
  });
  return response;
}

const options = {
  keepalive: 1000,
};

const client = mqtt.connect(url, options);
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
  const configs = await fetchConfigs();
  const levels = getLevelConfigs(configs);

  let value = 0;
  if (state == 1) {
    // The water is rising
    value = levels[level];
  } else {
    // The water is falling
    const temp = level - 1;
    if (temp >= 0) {
      value = levels[temp];
    }
    value = 0;
  }

  if (value) {
    return value;
  }
  return 0;
}

async function processMessage(topic, message) {
  const match = topic.match(/\d+/); // Match one or more digits
  const level = match ? parseInt(match[0]) : null;

  if (level) {
    // level: number 0 - 7
    const state = message.toString() == "ON" ? 1 : 0;
    // const value = await calculateLevel(level, state);
    const value = 3;
    await addRecord(value);
  }
}

// Receive messages
client.on("message", function (topic, message) {
  processMessage(topic, message);
});
