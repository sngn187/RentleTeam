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

// Load chart page via AJAX
fetch("Dashbord.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("content").innerHTML = html;
    // Wait a short time or use MutationObserver
    setTimeout(() => {
      drawChart(); // call your chart logic
      drawPieChart();
      drwMap(); // call your map logic
    }, 100);
  });

// Your chart drawing function
function drawChart() {
  const ctx = document.getElementById("myChart")?.getContext("2d");
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
      labels: ["Red", "Blue", "Yellow"],
      datasets: [
        {
          label: "My Pie Chart",
          data: [10, 20, 30],
          backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

google.charts.load("current", {
  packages: ["geochart"],
  // Note: mapsApiKey is only needed for some features like markers, not basic GeoChart
  // 'mapsApiKey': 'YOUR_API_KEY' // optional
});

function drwMap() {
  const map = L.map("map").setView([12.5, 105], 7);
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; CartoDB, OpenStreetMap",
      maxZoom: 18,
    }
  ).addTo(map);

}
