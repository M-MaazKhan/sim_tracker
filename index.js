function searchItem() {
  e.preventDefault();
  alert("Search icon clicked!");
}
function trackWhatsappClick(e, url) {
  e.preventDefault();
  fetch("track_whatsapp.php")
    .then(() => {
      window.open(url, "_blank");
    })
    .catch(() => {
      window.open(url, "_blank");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  const searchInput = document.querySelector(".search-input");

  toggleBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      toggleBtns.forEach(b => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      // Update placeholder based on the clicked button
      if (index === 0) {
        searchInput.placeholder = "e.g. 03231234567";
      } else if (index === 1) {
        searchInput.placeholder = "e.g. 3520112345678";
      }
    });
  });
});
