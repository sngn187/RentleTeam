function loadPage(page, element = null) {
  fetch(page)
    .then((res) => {
      if (!res.ok) throw new Error("Page not found");
      return res.text();
    })
    .then((html) => {
      document.getElementById("content").innerHTML = html;
      // Set hash in URL (without refreshing)
      const pageName = page.replace(".html", "");
      window.location.hash = pageName;

      // Update active class
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
        // update header to display the current page name
        document.getElementById("header_title").innerHTML =
          `<h3>${pageName}</h3>`;
      });
      if (element) {
        element.classList.add("active");
      } else {
        // Auto-match active link by href content
        document.querySelectorAll(".nav-link").forEach((link) => {
          if (link.getAttribute("onclick").includes(pageName)) {
            link.classList.add("active");
          }
        });
      }
    })
    .catch((err) => {
      document.getElementById("content").innerHTML =
        "<p>Error loading page.</p>";
    });
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("collapsed");
}

window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "") || "Dashbord";
  loadPage(`${hash}.html`);
});

document.getElementById("colape").addEventListener("click", (e) => {
  e.preventDefault();
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
  // Update the header title to match the current page
  const currentPage = window.location.hash.replace("#", "") || "Dashbord";
  document.getElementById("header_title").innerHTML = `<h3>${currentPage}</h3>`;
});

window.addEventListener("click", (e) => {
  // close the sidebar if clicked outside
  const sidebar = document.getElementById("sidebar");
  if (
    !sidebar.contains(e.target) &&
    !document.getElementById("colape").contains(e.target)
  ) {
    sidebar.classList.remove("collapsed");
  }
});

// setInterval(() => {
//   GetTotalRevenue();
//   console.log("111");
// }, 1000);

// Load chart page via AJAX
fetch("Dashbord.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("content").innerHTML = html;
    // Wait a short time or use MutationObserver
    setTimeout(() => {
      drawChart(); // call your chart logic
      drawPieChart();
      Getapi();
      GetTotalRevenue();
      getTotalRoom();
      getTotalBookings();
      getTotalCustomer();
      getMonthlyIncome();
    }, 100);
  });

// Your chart drawing function
function drawChart() {
  const ctx = document.getElementById("myChart")?.getContext("2d");
  fetch(`${apiUrl}?action=read&sheet=`)
  if (!ctx) return;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Red",
        "Blue",
        "Yellow",
        "Green",
        "Purple",
        "Orange",
        "Pink",
        "Cyan",
        "Lime",
        "Teal",
      ],
      datasets: [
        {
          label: "Votes",
          data: [12, 19, 3, 5, 2, 3, 7, 8, 10, 15],
          backgroundColor: [
            "red",
            "blue",
            "yellow",
            "green",
            "purple",
            "orange",
            "pink",
            "cyan",
            "lime",
            "teal",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Axis Center Positioning",
        },
      },
      scales: {
        x: {
          min: 0,
          max: 100,
        },
        y: {
          min: 0,
          max: 20,
        },
      },
    },
  });
}

function drawPieChart() {
  const ctx = document.getElementById("myPieChart")?.getContext("2d");
  if (!ctx) return;

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Yellow", "Blue", "Green"],
      datasets: [
        {
          label: "My Pie Chart",
          data: [20, 10, 30],
          backgroundColor: ["#ffe100", "#1900ff", "#1aff00"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}
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

function GetTotalRevenue() {
  const revenue = document.getElementById("revenue");
  let totalRevenue = 0;
  fetch(`${apiUrl}?action=read&sheet=recipt`, fetchOptions)
    .then((res) => res.json())
    .then((api) => {
      for (let i = 0; i < api.data.length; i++) {
        if (api.data[i][7] == "No") {
          continue;
        } else {
          totalRevenue += parseFloat(api.data[i][6]) || 0;
        }
      }
      revenue.classList.remove("loader1");
      revenue.innerHTML = `$${totalRevenue.toFixed(2)}`;
    })
    .catch((err) => {
      console.error("Error fetching total revenue:", err);
    });
}

function Getapi() {
  const row1 = document.getElementById("row1");
  const loader = document.getElementById("loader-parent");
  loader.innerHTML = '<div class="loader"></div>';
  fetch(`${apiUrl}?action=read&sheet=customer`, fetchOptions)
    .then((res) => res.json())
    .then((api) => {
      loader.innerHTML = "";
      loader.style.display = "none";
      if (!api || !api.data || api.data.length === 0) {
        row1.innerHTML = "<tr><td colspan='8'>No data available</td></tr>";
        return;
      }
      for (let i = 0; i < api.data.length; i++) {
        let date = new Date(api.data[i][6]);
        let date1 = new Date(api.data[i][7]);
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, "0"); // +1 because month is 0-based
        let day = String(date.getDate()).padStart(2, "0");
        let formatted = `${year}/${month}/${day}`;
        let year1 = date1.getFullYear();
        let month1 = String(date1.getMonth() + 1).padStart(2, "0"); // +1 because month is 0-based
        let day1 = String(date1.getDate()).padStart(2, "0");
        let formatted1 = `${year1}/${month1}/${day1}`;
        row1.innerHTML += `
                        <tr>
                <td>${api.data[i][1]}</td>
                <td>${api.data[i][2]}</td>
                <td>${api.data[i][3]}</td>
                <td>${api.data[i][4]}</td>
                <td>${api.data[i][5]}</td>
                <td>${formatted}</td>
                <td>${formatted1}</td>
                <td>${api.data[i][8]}</td>
            </tr>
                    `;
      }

      // console.log(api.data)
    });
}

function getMonthlyIncome() {
  const monthlyIncome = document.getElementById("monthlyIncome");
  fetch(`${apiUrl}?action=read&sheet=recipt`, fetchOptions)
    .then((res) => res.json())
    .then((api) => {
        let total = 0;
        const currentDate = new Date();
        for (let i = 0; i < api.data.length; i++) {
          const element = api.data[i];
          const date = new Date(element[1]);
          if (
            element[7] === "Yes" &&
            date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() === currentDate.getMonth()
          ) {
            console.log(element[7]);
            total += parseFloat(element[6]) || 0;
          } else {
            console.log("continue");
            continue;
          }
        }
        monthlyIncome.innerHTML = `$${total.toFixed(2)}`;
    })
    .catch((err) => {
      console.error("Error fetching monthly income:", err);
      monthlyIncome.innerHTML = "$0.00";
    });
}

function getTotalCustomer() {
  const totalCustomer = document.getElementById("totalCustomer");
  totalCustomer.classList.add("loader1");
  const payingCustomers = document.getElementById("payingCustomers");
  fetch(`${apiUrl}?action=read&sheet=customer`, fetchOptions)
    .then((res) => res.json())
    .then((api) => {
      totalCustomer.classList.remove("loader1");
      if (api.data && api.data.length > 0) {
        totalCustomer.innerHTML = api.data.length;
      } else {
        totalCustomer.innerHTML = "0";
      }
      let payingCount = 0;
      api.data.forEach((customer) => {
        if (customer[8] === "yes") {
          payingCount++;
        }
      });
      payingCustomers.innerHTML = payingCount;
    })
    .catch((err) => {
      console.error("Error fetching total customers:", err);
      totalCustomer.innerHTML = "0";
    });
}


function getTotalBookings(){
  const totalBookings = document.getElementById("totalBookings");
  totalBookings.classList.add("loader1");
  const activeBookings = document.getElementById("activeBookings");
  fetch(`${apiUrl}?action=read&sheet=booking`, fetchOptions)
    .then((res) => res.json())
    .then((api) => {
      totalBookings.classList.remove("loader1");
      if (api.data && api.data.length > 0) {
        totalBookings.innerHTML = api.data.length;
        let activeCount = 0;
        api.data.forEach((booking) => {
          if (booking[9] === "checkin") {
            activeCount++;
          }
        });
        activeBookings.innerHTML = activeCount;
      } else {
        totalBookings.innerHTML = "0";
      }
    })
    .catch((err) => {
      console.error("Error fetching total bookings:", err);
      totalBookings.innerHTML = "0";
    });
}

function getTotalRoom() {
  const totalRoom = document.getElementById("totalRoom");
  totalRoom.classList.add("loader1");
  const availableRooms = document.getElementById("availableRooms");
  fetch(`${apiUrl}?action=read&sheet=room`, fetchOptions)
    .then((res) => res.json())
    .then((api) => {
      totalRoom.classList.remove("loader1");
      if (api.data && api.data.length > 0) {
        totalRoom.innerHTML = api.data.length;
        let availableCount = 0;
        api.data.forEach((room) => {
          if (room[4] === "open") {
            availableCount++;
          }
        });
        availableRooms.innerHTML = availableCount;
      } else {
        totalRoom.innerHTML = "0";
      }
    })
    .catch((err) => {
      console.error("Error fetching total rooms:", err);
      totalRoom.innerHTML = "0";
    });
}