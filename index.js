function trackWhatsappClick(e, url) {
  e.preventDefault();
  fetch("track_whatsapp.php")
    .then(() => { window.open(url, "_blank"); })
    .catch(() => { window.open(url, "_blank"); });
}

/* ─── Network prefix → operator name ────────────────────────────────────── */
function detectNetwork(mobile) {
  const num = String(mobile).replace(/^92/, "0");
  const prefix4 = num.slice(0, 4);
  const map = {
    "0300":"Jazz","0301":"Jazz","0302":"Jazz","0303":"Jazz","0304":"Jazz",
    "0305":"Jazz","0306":"Jazz","0307":"Jazz","0308":"Jazz","0309":"Jazz",
    "0320":"Jazz","0321":"Jazz","0322":"Jazz","0323":"Jazz","0324":"Jazz",
    "0325":"Jazz","0326":"Jazz",
    "0340":"Telenor","0341":"Telenor","0342":"Telenor","0343":"Telenor",
    "0344":"Telenor","0345":"Telenor","0346":"Telenor","0347":"Telenor",
    "0348":"Telenor","0349":"Telenor",
    "0310":"Zong","0311":"Zong","0312":"Zong","0313":"Zong","0314":"Zong",
    "0315":"Zong","0316":"Zong","0317":"Zong","0318":"Zong",
    "0330":"Ufone","0331":"Ufone","0332":"Ufone","0333":"Ufone","0334":"Ufone",
    "0335":"Ufone","0336":"Ufone","0337":"Ufone",
    "0339":"Onic",
    "0355":"SCOM",
  };
  return map[prefix4] || "Unknown";
}

/* ─── Network → CSS class ────────────────────────────────────────────────── */
function networkColorClass(net) {
  const c = {
    Jazz:"net-jazz", Telenor:"net-telenor", Zong:"net-zong",
    Ufone:"net-ufone", Onic:"net-onic", SCOM:"net-scom",
  };
  return c[net] || "net-unknown";
}

/* ─── Format mobile ──────────────────────────────────────────────────────── */
function formatMobile(mobile) {
  const num = String(mobile).replace(/^92/, "0");
  return num.replace(/(\d{4})(\d{3})(\d{4})/, "$1-$2-$3");
}

/* ─── Initials from name ─────────────────────────────────────────────────── */
function initials(name) {
  return (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ══════════════════════════════════════════════════════════════════
   MOBILE SEARCH  → single result card
══════════════════════════════════════════════════════════════════ */
function renderMobileResult(records) {
  const record = Array.isArray(records) ? records[0] : records;
  const network  = detectNetwork(record.Mobile || "");
  const netClass = networkColorClass(network);
  const formatted = formatMobile(record.Mobile || "");

  return `
    <div class="result-card result-success" id="result-card">
      <div class="result-glow"></div>

      <div class="result-header ${netClass}">
        <div class="result-avatar">${initials(record.Name)}</div>
        <div class="result-header-info">
          <h3 class="result-name">${record.Name || "—"}</h3>
          <span class="result-network-badge">${network}</span>
        </div>
        <div class="result-verified">
          <i class="fas fa-shield-check"></i>
          <span>Verified</span>
        </div>
      </div>

      <div class="result-body">
        <div class="result-field">
          <div class="field-icon"><i class="fas fa-mobile-alt"></i></div>
          <div class="field-content">
            <span class="field-label">Mobile Number</span>
            <span class="field-value">${formatted}</span>
          </div>
        </div>
        <div class="result-field">
          <div class="field-icon"><i class="fas fa-id-card"></i></div>
          <div class="field-content">
            <span class="field-label">CNIC</span>
            <span class="field-value">${record.CNIC || "—"}</span>
          </div>
        </div>
        <div class="result-field">
          <div class="field-icon"><i class="fas fa-map-marker-alt"></i></div>
          <div class="field-content">
            <span class="field-label">Address</span>
            <span class="field-value">${record.ADDRESS || "—"}</span>
          </div>
        </div>
      </div>

      <div class="result-footer">
        <i class="fas fa-lock"></i>
        <span>This information is fetched securely via SSL</span>
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════════
   CNIC SEARCH  → summary header + one row-card per registered SIM
══════════════════════════════════════════════════════════════════ */
function renderCnicResult(records) {
  const first   = records[0];
  const ownerName = first.Name || "Unknown Owner";
  const cnic      = first.CNIC || "—";
  const address   = first.ADDRESS || "—";
  const simCount  = records.length;

  /* Build individual SIM rows */
  const simRows = records.map((rec, idx) => {
    const network  = detectNetwork(rec.Mobile || "");
    const netClass = networkColorClass(network);
    const formatted = formatMobile(rec.Mobile || "");

    return `
      <div class="sim-row ${netClass}">
        <div class="sim-index">${idx + 1}</div>
        <div class="sim-avatar">${initials(rec.Name)}</div>
        <div class="sim-info">
          <span class="sim-number">${formatted}</span>
          <span class="sim-network-badge">${network}</span>
        </div>
        <div class="sim-verified">
          <i class="fas fa-check-circle"></i>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="result-card result-cnic" id="result-card">
      <div class="result-glow"></div>

      <!-- Owner summary header -->
      <div class="cnic-header">
        <div class="cnic-avatar">${initials(ownerName)}</div>
        <div class="cnic-header-info">
          <h3 class="result-name">${ownerName}</h3>
          <div class="cnic-meta">
            <span class="cnic-chip"><i class="fas fa-id-card"></i> ${cnic}</span>
          </div>
          <div class="cnic-meta" style="margin-top:4px">
            <span class="cnic-chip"><i class="fas fa-map-marker-alt"></i> ${address}</span>
          </div>
        </div>
        <div class="cnic-count-badge">
          <span class="count-num">${simCount}</span>
          <span class="count-label">SIM${simCount > 1 ? "s" : ""}</span>
        </div>
      </div>

      <!-- Section title -->
      <div class="sim-list-title">
        <i class="fas fa-sim-card"></i>
        Registered SIM Numbers
      </div>

      <!-- SIM rows -->
      <div class="sim-list">
        ${simRows}
      </div>

      <div class="result-footer">
        <i class="fas fa-lock"></i>
        <span>This information is fetched securely via SSL</span>
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════════
   ERROR / LOADING
══════════════════════════════════════════════════════════════════ */
function renderError(message) {
  return `
    <div class="result-card result-error" id="result-card">
      <div class="result-error-icon"><i class="fas fa-exclamation-circle"></i></div>
      <h3 class="result-error-title">No Record Found</h3>
      <p class="result-error-msg">${message || "No information found for the provided query."}</p>
      <p class="result-error-hint">Please check the number and try again.</p>
    </div>
  `;
}

function renderLoading() {
  return `
    <div class="result-card result-loading" id="result-card">
      <div class="loading-spinner">
        <span></span><span></span><span></span>
      </div>
      <p class="loading-text">Searching database…</p>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtns  = document.querySelectorAll(".toggle-btn");
  const searchInput = document.getElementById("search-input");
  const form        = document.getElementById("search-form");
  const resultBox   = document.getElementById("search-result");

  /* Track active mode: 0 = Mobile, 1 = CNIC */
  let searchMode = 0;

  toggleBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      searchMode = index;
      searchInput.placeholder =
        index === 0 ? "e.g. 03231234567" : "e.g. 3520112345678";
      /* Clear old result when switching modes */
      resultBox.innerHTML = "";
      resultBox.classList.remove("visible");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (!query) {
      searchInput.classList.add("shake");
      setTimeout(() => searchInput.classList.remove("shake"), 500);
      return;
    }

    /* Show loading */
    resultBox.innerHTML = renderLoading();
    resultBox.classList.add("visible");
    setTimeout(() => {
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);

    try {
      const res  = await fetch(
        `https://simowners.org/api/search_data.php?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data && data.status === "error") {
        resultBox.innerHTML = renderError(data.message);

      } else if (Array.isArray(data) && data.length > 0) {
        /* API returned an array — use mode to pick renderer */
        if (searchMode === 1) {
          resultBox.innerHTML = renderCnicResult(data);
        } else {
          resultBox.innerHTML = renderMobileResult(data);
        }

      } else if (data && data.Mobile) {
        /* Single object response (mobile search) */
        resultBox.innerHTML = renderMobileResult(data);

      } else {
        resultBox.innerHTML = renderError("No information found for: " + query);
      }

    } catch (err) {
      resultBox.innerHTML = renderError(
        "Network error. Please check your connection and try again."
      );
    }

    /* Trigger entry animation */
    const card = document.getElementById("result-card");
    if (card) card.classList.add("animate-in");
  });
});
