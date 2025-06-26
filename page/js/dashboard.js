const table = document.getElementById("dashboard-table");
const apiUrl =
  "https://script.google.com/macros/s/AKfycbw2ZJTNI-c7OwBMate84JHsq_fyb_d0PqEMSb85scdlHyJggU6ZA4U_AIuUGid8oxiy/exec";
// Configure fetch options with CORS headers
const fetchOptions = {
  redirect: "follow",
  Method: "GET",
  headers: {
    "Content-Type": "text/plain; charset=UTF-8",
  },
};

// Function to fetch data with error handling
async function fetchData() {
  try {
    const response = await fetch(
      `${apiUrl}?action=read&sheet=customer`,
      fetchOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // You might want to show an error message to the user here
    throw error;
  }
}
