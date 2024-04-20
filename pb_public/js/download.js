const pb = new PocketBase("http://127.0.0.1:8090");

async function fetchData() {
  return await pb.collection("measurements").getFullList({
    sort: "ts",
  });
}
function downloadFile() {
  console.log("Downloading...");
  pb.collection("measurements")
    .getFullList({
      sort: "ts",
    })
    .then((data) => {
      console.log(data);
      // Export to CSV and download
      const rows = data.map((item) => [item.ts, item.value]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");
      // Downlaod CSV
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
    });
}
