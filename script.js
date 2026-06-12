// PayNexa E-Wallet Prototype
// HTML + Bootstrap 5 + Vanilla JavaScript

const state = {
  balance: 2450000,
  selectedTopupAmount: 0,
  activeHistoryFilter: "all",
  transactions: [
    {
      id: "TRX-20260612-0920",
      title: "QRIS Rexy Coffee Space",
      type: "qris",
      flow: "keluar",
      date: "12 Jun 2026, 09:20",
      amount: -35000,
      status: "success",
      icon: "bi-qr-code-scan"
    },
    {
      id: "TRX-20260612-0830",
      title: "Top Up VA BCA",
      type: "topup",
      flow: "masuk",
      date: "12 Jun 2026, 08:30",
      amount: 250000,
      status: "success",
      icon: "bi-plus-circle"
    },
    {
      id: "TRX-20260611-2101",
      title: "Transfer ke Andi",
      type: "transfer",
      flow: "keluar",
      date: "11 Jun 2026, 21:01",
      amount: -125000,
      status: "success",
      icon: "bi-arrow-left-right"
    },
    {
      id: "TRX-20260611-1850",
      title: "Transfer dari Maya",
      type: "transfer",
      flow: "masuk",
      date: "11 Jun 2026, 18:50",
      amount: 75000,
      status: "success",
      icon: "bi-arrow-down-circle"
    },
    {
      id: "TRX-20260610-1512",
      title: "QRIS Alpha Store",
      type: "qris",
      flow: "keluar",
      date: "10 Jun 2026, 15:12",
      amount: -88000,
      status: "failed",
      icon: "bi-x-circle"
    },
    {
      id: "TRX-20260610-1010",
      title: "Top Up Minimarket",
      type: "topup",
      flow: "masuk",
      date: "10 Jun 2026, 10:10",
      amount: 100000,
      status: "pending",
      icon: "bi-hourglass-split"
    }
  ],
  favorites: [
    { name: "Andi", phone: "0812****4421", seed: "Andi" },
    { name: "Maya", phone: "0821****2100", seed: "Maya" },
    { name: "Dina", phone: "0857****8801", seed: "Dina" },
    { name: "Budi", phone: "0895****9931", seed: "Budi" },
    { name: "CS", phone: "PayNexa", seed: "Support" }
  ]
};

let pendingAction = null;

document.addEventListener("DOMContentLoaded", () => {
  initSplash();
  initAuth();
  initNavigation();
  initPasswordToggle();
  initDashboard();
  initTopup();
  initTransfer();
  initQRIS();
  initHistory();
  initChat();
  initAdminTables();
  initDrawer();
  initLogout();
  updateBalanceUI();
});

function initSplash() {
  const splash = document.getElementById("splashScreen");
  setTimeout(() => {
    splash.classList.add("hide");
  }, 1200);
}

function initAuth() {
  const authLinks = document.querySelectorAll("[data-auth-target]");
  authLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showAuthPage(link.dataset.authTarget);
    });
  });

  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm(loginForm)) {
      showToast("Lengkapi email/nomor HP dan password.", "danger");
      return;
    }

    showLoading(true);
    setTimeout(() => {
      showLoading(false);
      document.getElementById("authLayout").classList.add("d-none");
      document.getElementById("appLayout").classList.remove("d-none");
      navigateTo("dashboardPage");
      showToast("Login berhasil. Selamat datang di PayNexa.", "success");
    }, 850);
  });

  const registerForm = document.getElementById("registerForm");
  const regPassword = document.getElementById("regPassword");
  const regConfirm = document.getElementById("regConfirm");

  regPassword.addEventListener("input", updatePasswordStrength);

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (regPassword.value !== regConfirm.value) {
      regConfirm.setCustomValidity("Password tidak sama");
    } else {
      regConfirm.setCustomValidity("");
    }

    if (!validateForm(registerForm)) {
      showToast("Periksa kembali data pendaftaran.", "danger");
      return;
    }

    showToast("Pendaftaran berhasil. Silakan login.", "success");
    showAuthPage("loginPage");
    registerForm.reset();
    updatePasswordStrength();
  });
}

function showAuthPage(pageId) {
  document.querySelectorAll(".auth-page").forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });
}

function validateForm(form) {
  let isValid = true;

  Array.from(form.elements).forEach((field) => {
    if (!field.checkValidity()) {
      isValid = false;
      field.classList.add("is-invalid");
    } else {
      field.classList.remove("is-invalid");
    }
  });

  return isValid;
}

function updatePasswordStrength() {
  const input = document.getElementById("regPassword");
  const bar = document.querySelector(".password-strength span");
  const value = input.value || "";
  let width = 0;
  let color = "#EF4444";

  if (value.length >= 1) width = 30;
  if (value.length >= 6) {
    width = 65;
    color = "#F59E0B";
  }
  if (value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value)) {
    width = 100;
    color = "#22C55E";
  }

  bar.style.width = width + "%";
  bar.style.background = color;
}

function initPasswordToggle() {
  document.querySelectorAll(".btn-toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      const icon = button.querySelector("i");

      if (target.type === "password") {
        target.type = "text";
        icon.className = "bi bi-eye-slash";
      } else {
        target.type = "password";
        icon.className = "bi bi-eye";
      }
    });
  });
}

function initNavigation() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo(button.dataset.page);
    });
  });
}

function navigateTo(pageId) {
  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;

  document.querySelectorAll(".app-page").forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll(".nav-btn, .bottom-nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  const title = targetPage.dataset.title || "PayNexa";
  document.getElementById("pageTitle").textContent = title;

  closeDrawer();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initDrawer() {
  const openBtn = document.getElementById("mobileMenuBtn");
  const closeBtn = document.getElementById("closeDrawerBtn");
  const backdrop = document.getElementById("drawerBackdrop");

  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
}

function openDrawer() {
  document.getElementById("mobileDrawer").classList.add("show");
  document.getElementById("drawerBackdrop").classList.add("show");
}

function closeDrawer() {
  document.getElementById("mobileDrawer").classList.remove("show");
  document.getElementById("drawerBackdrop").classList.remove("show");
}

function initDashboard() {
  renderRecentTransactions();
  renderFavorites("favoriteRecipients");
  renderFavorites("transferFavorites", true);
}

function updateBalanceUI() {
  const formatted = formatCurrency(state.balance);
  const ids = ["balanceText", "topupBalanceText"];

  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.textContent = formatted;
  });

  const banner = document.getElementById("lowBalanceBanner");
  if (state.balance < 100000) {
    banner.classList.remove("d-none");
  } else {
    banner.classList.add("d-none");
  }
}

function renderRecentTransactions() {
  const container = document.getElementById("recentTransactions");
  container.innerHTML = state.transactions
    .slice(0, 4)
    .map((transaction) => transactionItemTemplate(transaction))
    .join("");

  bindTransactionClicks(container);
}

function renderFavorites(containerId, selectable = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = state.favorites
    .map((fav) => `
      <div class="favorite-item" ${selectable ? `data-phone="${fav.phone}" data-name="${fav.name}"` : ""}>
        <img src="https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(fav.seed)}" alt="${fav.name}">
        <span>${fav.name}</span>
      </div>
    `)
    .join("");

  if (selectable) {
    container.querySelectorAll(".favorite-item").forEach((item) => {
      item.addEventListener("click", () => {
        document.getElementById("transferReceiver").value = `${item.dataset.name} - ${item.dataset.phone}`;
        showToast(`Penerima ${item.dataset.name} dipilih.`, "success");
      });
    });
  }
}

function transactionItemTemplate(transaction) {
  const isPositive = transaction.amount > 0;
  const amountClass = isPositive ? "success" : "danger";
  const iconClass = transaction.status === "failed" ? "danger" : transaction.status === "pending" ? "warning" : isPositive ? "success" : "";
  const statusText = transaction.status === "success" ? "Berhasil" : transaction.status === "failed" ? "Gagal" : "Pending";

  return `
    <div class="transaction-item" data-page="transactionDetailPage">
      <div class="transaction-icon ${iconClass}">
        <i class="bi ${transaction.icon}"></i>
      </div>
      <div class="transaction-info">
        <strong>${transaction.title}</strong>
        <span>${transaction.date} · ${statusText}</span>
      </div>
      <div class="transaction-amount ${amountClass}">
        ${isPositive ? "+" : "-"}${formatCurrency(Math.abs(transaction.amount))}
      </div>
    </div>
  `;
}

function bindTransactionClicks(container) {
  container.querySelectorAll(".transaction-item").forEach((item) => {
    item.addEventListener("click", () => navigateTo("transactionDetailPage"));
  });
}

function initTopup() {
  const amountInput = document.getElementById("topupAmount");
  const methodSelect = document.getElementById("topupMethod");

  document.querySelectorAll(".amount-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".amount-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");

      state.selectedTopupAmount = Number(button.dataset.amount);
      amountInput.value = state.selectedTopupAmount;
      updateTopupSummary();
    });
  });

  amountInput.addEventListener("input", () => {
    document.querySelectorAll(".amount-chip").forEach((chip) => chip.classList.remove("active"));
    state.selectedTopupAmount = Number(amountInput.value);
    updateTopupSummary();
  });

  methodSelect.addEventListener("change", updateTopupSummary);

  document.getElementById("btnTopupContinue").addEventListener("click", () => {
    const amount = Number(amountInput.value);

    if (!amount || amount < 10000) {
      showToast("Minimal top up Rp10.000.", "danger");
      return;
    }

    openConfirmModal(
      "Konfirmasi Top Up",
      `
        <div class="summary-line"><span>Nominal</span><strong>${formatCurrency(amount)}</strong></div>
        <div class="summary-line"><span>Biaya Admin</span><strong>Rp 1.000</strong></div>
        <div class="summary-line"><span>Metode</span><strong>${methodSelect.value}</strong></div>
        <hr>
        <div class="summary-line total"><span>Total Bayar</span><strong>${formatCurrency(amount + 1000)}</strong></div>
      `,
      () => {
        processTransaction(() => {
          state.balance += amount;
          state.transactions.unshift({
            id: "TRX-" + Date.now(),
            title: "Top Up " + methodSelect.value,
            type: "topup",
            flow: "masuk",
            date: "Baru saja",
            amount: amount,
            status: "success",
            icon: "bi-plus-circle"
          });
          updateBalanceUI();
          renderRecentTransactions();
          renderHistory();
          showToast("Top up berhasil diproses.", "success");
          navigateTo("dashboardPage");
        });
      }
    );
  });

  updateTopupSummary();
}

function updateTopupSummary() {
  const amount = Number(document.getElementById("topupAmount").value) || 0;
  const method = document.getElementById("topupMethod").value;

  document.getElementById("summaryTopupAmount").textContent = formatCurrency(amount);
  document.getElementById("summaryTopupMethod").textContent = method;
  document.getElementById("summaryTopupTotal").textContent = amount ? formatCurrency(amount + 1000) : "Rp 0";
}

function initTransfer() {
  const form = document.getElementById("transferForm");
  const amountInput = document.getElementById("transferAmount");
  const error = document.getElementById("transferError");

  amountInput.addEventListener("input", () => {
    const amount = Number(amountInput.value);
    error.classList.toggle("d-none", !(amount > state.balance));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm(form)) {
      showToast("Lengkapi data transfer.", "danger");
      return;
    }

    const receiver = document.getElementById("transferReceiver").value.trim();
    const amount = Number(amountInput.value);
    const note = document.getElementById("transferNote").value.trim();

    if (amount <= 0) {
      showToast("Nominal transfer tidak valid.", "danger");
      return;
    }

    if (amount > state.balance) {
      error.classList.remove("d-none");
      showToast("Saldo tidak cukup.", "danger");
      return;
    }

    openConfirmModal(
      "Konfirmasi Transfer",
      `
        <div class="summary-line"><span>Penerima</span><strong>${receiver}</strong></div>
        <div class="summary-line"><span>Nominal</span><strong>${formatCurrency(amount)}</strong></div>
        <div class="summary-line"><span>Catatan</span><strong>${note || "-"}</strong></div>
      `,
      () => {
        processTransaction(() => {
          state.balance -= amount;
          state.transactions.unshift({
            id: "TRX-" + Date.now(),
            title: "Transfer ke " + receiver,
            type: "transfer",
            flow: "keluar",
            date: "Baru saja",
            amount: -amount,
            status: "success",
            icon: "bi-arrow-left-right"
          });
          updateBalanceUI();
          renderRecentTransactions();
          renderHistory();
          form.reset();
          showToast("Transfer berhasil.", "success");
          navigateTo("transactionDetailPage");
        });
      }
    );
  });
}

function initQRIS() {
  const empty = document.getElementById("qrisEmpty");
  const merchant = document.getElementById("merchantInfo");

  document.getElementById("btnScanQR").addEventListener("click", () => {
    showLoading(true, "Membaca QRIS...");
    setTimeout(() => {
      showLoading(false);
      empty.classList.add("d-none");
      merchant.classList.remove("d-none");
      showToast("QRIS berhasil terbaca.", "success");
    }, 750);
  });

  document.getElementById("btnPayQRIS").addEventListener("click", () => {
    const amount = Number(document.getElementById("qrisAmount").value);

    if (!amount || amount <= 0) {
      showToast("Nominal pembayaran tidak valid.", "danger");
      return;
    }

    if (amount > state.balance) {
      showToast("Saldo tidak cukup untuk pembayaran QRIS.", "danger");
      return;
    }

    openConfirmModal(
      "Konfirmasi Pembayaran QRIS",
      `
        <div class="summary-line"><span>Merchant</span><strong>Rexy Coffee Space</strong></div>
        <div class="summary-line"><span>Nominal</span><strong>${formatCurrency(amount)}</strong></div>
        <div class="summary-line"><span>Metode</span><strong>QRIS</strong></div>
      `,
      () => {
        processTransaction(() => {
          state.balance -= amount;
          state.transactions.unshift({
            id: "TRX-" + Date.now(),
            title: "QRIS Rexy Coffee Space",
            type: "qris",
            flow: "keluar",
            date: "Baru saja",
            amount: -amount,
            status: "success",
            icon: "bi-qr-code-scan"
          });
          updateBalanceUI();
          renderRecentTransactions();
          renderHistory();
          showToast("Pembayaran QRIS berhasil.", "success");
          navigateTo("transactionDetailPage");
        });
      }
    );
  });
}

function initHistory() {
  const search = document.getElementById("historySearch");

  document.querySelectorAll(".filter-chip[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip[data-filter]").forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      state.activeHistoryFilter = chip.dataset.filter;
      renderHistory();
    });
  });

  search.addEventListener("input", renderHistory);
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("historyList");
  if (!container) return;

  const keyword = (document.getElementById("historySearch")?.value || "").toLowerCase();

  const filtered = state.transactions.filter((trx) => {
    const matchesFilter =
      state.activeHistoryFilter === "all" ||
      trx.flow === state.activeHistoryFilter ||
      trx.type === state.activeHistoryFilter;

    const matchesKeyword =
      trx.title.toLowerCase().includes(keyword) ||
      trx.id.toLowerCase().includes(keyword) ||
      trx.date.toLowerCase().includes(keyword);

    return matchesFilter && matchesKeyword;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-inbox"></i>
        <h3>Transaksi Tidak Ditemukan</h3>
        <p>Coba ubah filter atau kata kunci pencarian.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((transaction) => transactionItemTemplate(transaction)).join("");
  bindTransactionClicks(container);
}

function initChat() {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();

    if (!message) return;

    appendChatBubble(message, "user");
    chatInput.value = "";

    setTimeout(() => {
      appendChatBubble("Terima kasih, kami sedang cek informasinya ya.", "cs");
    }, 650);
  });

  function appendChatBubble(message, type) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = message;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function initAdminTables() {
  const tbody = document.getElementById("adminLatestTable");
  if (!tbody) return;

  tbody.innerHTML = state.transactions
    .slice(0, 6)
    .map((trx) => {
      const status = trx.status === "success" ? "success" : trx.status === "failed" ? "danger" : "warning";
      const statusText = trx.status === "success" ? "Berhasil" : trx.status === "failed" ? "Gagal" : "Pending";

      return `
        <tr>
          <td>${trx.id}</td>
          <td>Rexy</td>
          <td>${trx.type.toUpperCase()}</td>
          <td>${formatCurrency(Math.abs(trx.amount))}</td>
          <td><span class="status-badge ${status}">${statusText}</span></td>
          <td>${trx.date}</td>
        </tr>
      `;
    })
    .join("");
}

function initLogout() {
  document.getElementById("btnLogout").addEventListener("click", () => {
    document.getElementById("appLayout").classList.add("d-none");
    document.getElementById("authLayout").classList.remove("d-none");
    showAuthPage("loginPage");
    showToast("Anda berhasil logout.", "success");
  });
}

function openConfirmModal(title, body, action) {
  pendingAction = action;

  document.getElementById("confirmModalTitle").textContent = title;
  document.getElementById("confirmModalBody").innerHTML = body;

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmModal"));
  modal.show();
}

document.getElementById("confirmModalAction")?.addEventListener("click", () => {
  const modalElement = document.getElementById("confirmModal");
  const modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();

  if (typeof pendingAction === "function") {
    pendingAction();
  }

  pendingAction = null;
});

function processTransaction(callback) {
  showLoading(true);

  setTimeout(() => {
    showLoading(false);
    callback();
  }, 900);
}

function showLoading(show, message = "Memproses transaksi...") {
  const overlay = document.getElementById("loadingOverlay");
  const title = overlay.querySelector("strong");
  title.textContent = message;
  overlay.classList.toggle("d-none", !show);
}

function showToast(message, type = "success") {
  const toastElement = document.getElementById("appToast");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  toastMessage.textContent = message;

  const iconMap = {
    success: ["bi-check-circle-fill", "text-success"],
    danger: ["bi-x-circle-fill", "text-danger"],
    warning: ["bi-exclamation-triangle-fill", "text-warning"],
    info: ["bi-info-circle-fill", "text-primary"]
  };

  const [icon, color] = iconMap[type] || iconMap.success;
  toastIcon.className = `bi ${icon} ${color}`;

  const toast = bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3000 });
  toast.show();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}
