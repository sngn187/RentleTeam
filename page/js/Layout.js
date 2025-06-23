function loadPage(page, element = null) {
  fetch(page)
    .then(res => {
      if (!res.ok) throw new Error("Page not found");
      return res.text();
    })
    .then(html => {
      document.getElementById("content").innerHTML = html;

      // Set hash in URL (without refreshing)
      const pageName = page.replace('.html', '');
      window.location.hash = pageName;

      // Update active class
      document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
      // update header to display the current page name
      document.getElementById("header_title").innerHTML = `<h3>${pageName}</h3>`;  
      });
      if (element) {
        element.classList.add("active");
      } else {
        // Auto-match active link by href content
        document.querySelectorAll(".nav-link").forEach(link => {
          if (link.getAttribute("onclick").includes(pageName)) {
            link.classList.add("active");
          }
        });
      }
    })
    .catch(err => {
      document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
    });
}


window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace('#', '') || 'Dashbord';
  loadPage(`${hash}.html`);
});

