console.log("Vanilla JS is alive");
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((i) => i.classList.remove("active"));

    item.classList.add("active");
  });
});

const calendarGrid = document.getElementById("calendarGrid");

// start with current month
let currentDate = new Date();

function renderCalendarDays() {
  calendarGrid.innerHTML = "";

  const year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  // month math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  let count = 0;
  for (let i = 0; i < 35; i++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";

    let dayNumber;

    // previous month
    if (i < firstDayOfMonth) {
      dayNumber = daysInPrevMonth - firstDayOfMonth + i + 1;
      cell.classList.add("muted");
    }
    // next month
    else if (i >= firstDayOfMonth + daysInCurrentMonth) {
      dayNumber = i - (firstDayOfMonth + daysInCurrentMonth) + 1;
      cell.classList.add("muted");
    }
    // current month
    else {
      dayNumber = i - firstDayOfMonth + 1;
      cell.dataset.date = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
    }

    // injects number
    const number = document.createElement("span");
    number.className = "day-number";
    if (dayNumber === 1 && count == 0) {
      count += 1;

      console.log(month);

      let dm = new Date(2025, month);
      number.textContent = `${dm.toLocaleDateString("default", { month: "short" })} ${dayNumber}`;
      cell.appendChild(number);
      calendarGrid.appendChild(cell);
    } else if (dayNumber === 1 && count == 1) {
      let dm = new Date(year, month + 1);
      number.textContent = `${dm.toLocaleDateString("default", { month: "short" })} ${dayNumber}`;
      cell.appendChild(number);
      calendarGrid.appendChild(cell);
    } else {
      number.textContent = dayNumber;

      cell.appendChild(number);
      calendarGrid.appendChild(cell);
    }
  }
}

// initial render
renderCalendarDays();

renderDashboardTable(getAppointments());

renderAppointments();

const dateInput = document.getElementById("appointment-date");

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

dateInput.min = `${yyyy}-${mm}-${dd}`;

const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const monthLabel = document.getElementById("currentMonthLabel");
const todayBtn = document.getElementById("todayBtn");
function updateMonthLabel() {
  monthLabel.textContent = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
function highlightCurrentWeekday() {
  const weekdayEls = document.querySelectorAll(".calendar-weekdays div");
  const todayIndex = new Date().getDay();

  weekdayEls.forEach((el, index) => {
    el.classList.toggle("active-day", index === todayIndex);
  });

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  document.querySelectorAll(".day-cell").forEach((cell) => {
    const numberEl = cell.querySelector(".day-number");
    if (!numberEl) return;

    const cellDate = Number(numberEl.textContent);

    const isToday =
      !cell.classList.contains("muted") &&
      cellDate === todayDate &&
      currentDate.getMonth() === todayMonth &&
      currentDate.getFullYear() === todayYear;

    cell.classList.toggle("active-day-cell", isToday);
  });

  syncMonthSelect();
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateMonthLabel();
  renderCalendarDays();
  syncMonthSelect();
  highlightCurrentWeekday();
  renderAppointments();
});

// next month
nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateMonthLabel();
  renderCalendarDays();
  syncMonthSelect();
  highlightCurrentWeekday();
  renderAppointments();
});

todayBtn.addEventListener("click", () => {
  currentDate = new Date();
  updateMonthLabel();
  renderCalendarDays();
  syncMonthSelect();
  highlightCurrentWeekday();
  renderAppointments();
});

const monthSelect = document.getElementById("monthSelect");

function syncMonthSelect() {
  monthSelect.value = currentDate.getMonth();
}

monthSelect.addEventListener("change", (e) => {
  const selectedMonth = Number(e.target.value);

  currentDate.setMonth(selectedMonth);
  updateMonthLabel();
  renderCalendarDays();
  syncMonthSelect();
  highlightCurrentWeekday();
  renderAppointments();
});

// initial label
updateMonthLabel();

highlightCurrentWeekday();

const bookBtn = document.getElementById("book");
const modal = document.getElementById("appointment-modal");
const backdrop = document.getElementById("modal-backdrop");
const closeBtn = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel-modal");

function openModal() {
  modal.classList.remove("hidden");
  backdrop.classList.remove("hidden");
}

function openCreateModal() {
  const form = document.getElementById("appointment-form");

  delete form.dataset.editId;

  form.reset();

  openModal();
}

function closeModal() {
  modal.classList.add("hidden");
  backdrop.classList.add("hidden");
}

bookBtn.addEventListener("click", openCreateModal);
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);

const saveBtn = document.getElementById("save-modal");

function saveAppointmentToLocalStorage(appointment) {
  const existing = JSON.parse(localStorage.getItem("appointments")) || [];

  console.log("existing value from savetolocal" + existing);

  existing.push(appointment);

  localStorage.setItem("appointments", JSON.stringify(existing));
  alert("Appointment Saved Successfully");
}

saveBtn.addEventListener("click", () => {
  const form = document.getElementById("appointment-form");
  const editId = form.dataset.editId;

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  const appointmentData = {
    patientName: document.getElementById("patient-name").value.trim(),
    doctorName: document.getElementById("doctor-name").value.trim(),
    hospitalName: document.getElementById("hospital-name").value.trim(),
    speciality: document.getElementById("speciality").value.trim(),
    date: document.getElementById("appointment-date").value,
    time: document.getElementById("appointment-time").value,
    reason: document.getElementById("reason").value.trim(),
  };

  if (editId) {
    appointments = appointments.map((appt) =>
      appt.id === editId ? { ...appt, ...appointmentData } : appt,
    );

    delete form.dataset.editId;
  } else {
    appointments.push({
      id: Date.now().toString(),
      ...appointmentData,
    });
  }

  localStorage.setItem("appointments", JSON.stringify(appointments));

  closeModal();
  renderCalendarDays();
  renderAppointments();
  highlightCurrentWeekday();
  renderDashboardTable(getAppointments());
});

function getAppointments() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

console.log(getAppointments());

function testAppointmentMatching() {
  const appointments = getAppointments();

  appointments.forEach((appt) => {
    const cell = document.querySelector(`.day-cell[data-date="${appt.date}"]`);

    console.log("Looking for:", appt.date, "→ Found:", !!cell);
  });
}

// testAppointmentMatching();

function renderAppointments() {
  document
    .querySelectorAll(".appointment-indicator")
    .forEach((el) => el.remove());
  const appointments = getAppointments();

  appointments.forEach((appt) => {
    const cell = document.querySelector(
      `.day-cell[data-date="${appt.date}"]:not(.muted)`,
    );

    if (!cell) return;

    const indicator = document.createElement("div");
    indicator.className = "appointment-indicator";

    indicator.innerHTML = `
  <div class="appt-text">
    ${appt.patientName}  ${appt.time}
  </div>

  <div class="appt-actions">
    <button class="edit-btn" data-id="${appt.id}"><img src="assets/edit.svg" alt=""></button>
    <button class="delete-btn" data-id="${appt.id}"><img src="assets/delete.svg" alt=""></button>
  </div>
`;

    cell.appendChild(indicator);
  });
}

calendarGrid.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return;
  console.log("entered the delete");

  const id = deleteBtn.dataset.id;

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments = appointments.filter((appt) => appt.id !== id);

  localStorage.setItem("appointments", JSON.stringify(appointments));
  console.log(getAppointments());

  renderCalendarDays();
  renderAppointments();
  highlightCurrentWeekday();
  renderDashboardTable(getAppointments());
});

calendarGrid.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;

  const id = editBtn.dataset.id;

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  console.log(appointments);

  const appointment = appointments.find((a) => a.id === id);
  console.log(appointment);

  if (!appointment) return;

  openEditModal(appointment);
});

function openEditModal(appt) {
  document.getElementById("patient-name").value = appt.patientName;
  document.getElementById("doctor-name").value = appt.doctorName;
  document.getElementById("hospital-name").value = appt.hospitalName;
  document.getElementById("speciality").value = appt.speciality;
  document.getElementById("appointment-date").value = appt.date;
  document.getElementById("appointment-time").value = appt.time;
  document.getElementById("reason").value = appt.reason;

  const form = document.getElementById("appointment-form");
  form.dataset.editId = appt.id;

  openModal();
}

//dashboard stuff

const calendarView = document.getElementById("calendarView");
const dashboardView = document.getElementById("dashboardView");

const navCalendar = document.getElementById("nav-calendar");
const navDashboard = document.getElementById("nav-dashboard");

function setActiveNav(activeEl) {
  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));

  activeEl.classList.add("active");
}

navCalendar.addEventListener("click", (e) => {
  e.preventDefault();

  calendarView.hidden = false;
  dashboardView.hidden = true;

  setActiveNav(navCalendar);
});

navDashboard.addEventListener("click", (e) => {
  e.preventDefault();

  calendarView.hidden = true;
  dashboardView.hidden = false;

  setActiveNav(navDashboard);

  // renderDashboard();
});

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB");
}

function renderDashboardTable(appointments) {
  const tbody = document.getElementById("dashboardTableBody");
  tbody.innerHTML = "";

  if (appointments.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:16px;">
          No appointments found
        </td>
      </tr>
    `;
    return;
  }

  appointments.forEach((appt) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class = "td-blue">${appt.patientName}</td>
      <td>${appt.doctorName}</td>
      <td>${appt.hospitalName}</td>
      <td>${appt.speciality}</td>
      <td>${formatDate(appt.date)}</td>
      <td class= "td-blue" id="time">${appt.time}</td>
      <td class="td-actions">
        <button class="edit-btn" data-id="${appt.id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21h18"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"/></path><path stroke-dasharray="48" stroke-dashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"/></path></g></svg></button>
        <button class="delete-btn" data-id="${appt.id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg></button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function deleteAppointmentById(id) {
  console.log(id);
  console.log(typeof id);

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  console.log(appointments[0].id);

  appointments = appointments.filter((appt) => appt.id !== id);

  localStorage.setItem("appointments", JSON.stringify(appointments));
  console.log(getAppointments());
}

document.getElementById("dashboardTableBody").addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  const editBtn = e.target.closest(".edit-btn");

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    console.log(id);

    deleteAppointmentById(id);
    renderDashboardTable(getAppointments());
    renderCalendarDays();
    renderAppointments();
  }

  if (editBtn) {
    const id = editBtn.dataset.id;
    const appt = getAppointments().find((a) => a.id === id);
    if (appt) openEditModal(appt);
  }
});

function applyDashboardFilters() {
  const patientQuery = document
    .getElementById("patientSearch")
    .value.trim()
    .toLowerCase();

  const doctorQuery = document
    .getElementById("doctorSearch")
    .value.trim()
    .toLowerCase();

  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  let appointments = getAppointments();

  // patient filter
  if (patientQuery) {
    appointments = appointments.filter((appt) =>
      appt.patientName.toLowerCase().includes(patientQuery),
    );
  }

  // doctor filter
  if (doctorQuery) {
    appointments = appointments.filter((appt) =>
      appt.doctorName.toLowerCase().includes(doctorQuery),
    );
  }

  // date range filter
  if (fromDate) {
    appointments = appointments.filter((appt) => appt.date >= fromDate);
  }

  if (toDate) {
    appointments = appointments.filter((appt) => appt.date <= toDate);
  }

  return appointments;
}

document.getElementById("update-btn").addEventListener("click", () => {
  const filtered = applyDashboardFilters();
  renderDashboardTable(filtered);
});
