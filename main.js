/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/HelpDesk.js
class HelpDesk {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.ticketsContainer = document.getElementById("ticketsContainer");
    this.addTicketButton = document.getElementById("addTicket");
    this.addModal = document.getElementById("addModal");
    this.editModal = document.getElementById("editModal");
    this.deleteModal = document.getElementById("deleteModal");
    this.submitAddTicket = document.getElementById("submitAddTicket");
    this.cancelAddTicket = document.getElementById("cancelAddTicket");
    this.submitEditTicket = document.getElementById("submitEditTicket");
    this.cancelEditTicket = document.getElementById("cancelEditTicket");
    this.confirmDeleteTicket = document.getElementById("confirmDeleteTicket");
    this.cancelDeleteTicket = document.getElementById("cancelDeleteTicket");
    this.ticketNameInput = document.getElementById("ticketName");
    this.ticketDescriptionInput = document.getElementById("ticketDescription");
    this.editTicketNameInput = document.getElementById("editTicketName");
    this.editTicketDescriptionInput = document.getElementById("editTicketDescription");
    this.addModalError = document.getElementById("addModalError");
    this.editModalError = document.getElementById("editModalError");
    this.currentEditId = null;
    this.currentDeleteId = null;
    this.initEventListeners();
    this.fetchTickets();
    this.closeModal(this.addModal);
    this.closeModal(this.editModal);
    this.closeModal(this.deleteModal);
  }
  initEventListeners() {
    this.addTicketButton.addEventListener("click", () => this.openModal(this.addModal));
    this.cancelAddTicket.addEventListener("click", () => this.closeModal(this.addModal));
    this.cancelEditTicket.addEventListener("click", () => this.closeModal(this.editModal));
    this.cancelDeleteTicket.addEventListener("click", () => this.closeModal(this.deleteModal));
    this.submitAddTicket.addEventListener("click", () => this.addTicket());
    this.submitEditTicket.addEventListener("click", () => this.updateTicket());
    this.confirmDeleteTicket.addEventListener("click", () => this.deleteTicket());
  }
  openModal(modal) {
    modal.style.display = "block";
  }
  closeModal(modal) {
    modal.style.display = "none";
  }
  showError(element, message) {
    element.textContent = message;
    element.style.display = "block";
  }
  hideError(element) {
    element.textContent = "";
    element.style.display = "none";
  }
  fetchTickets() {
    fetch(`${this.baseURL}?method=allTickets`).then(response => response.json()).then(tickets => {
      this.ticketsContainer.innerHTML = "";
      tickets.forEach(ticket => this.renderTicket(ticket));
    });
  }
  renderTicket(ticket) {
    const ticketElement = document.createElement("div");
    ticketElement.className = "ticket";
    const description = ticket.description || "Описание отсутствует.";
    const formattedDate = new Date(ticket.created).toLocaleString("ru-RU", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(",", "");
    ticketElement.innerHTML = `
      <div class="ticket-content">
        <input type="checkbox" ${ticket.status ? "checked" : ""}>
        <span>${ticket.name}</span>
        <span class="ticket-time">${formattedDate}</span>
        <button class="edit-btn"></button>
        <button class="delete-btn"></button>
      </div>
      <div class="ticket-details" style="display: none;">${description}</div>
    `;
    ticketElement.querySelector(".ticket-content").addEventListener("click", e => {
      if (!e.target.classList.contains("edit-btn") && !e.target.classList.contains("delete-btn")) {
        this.toggleTicketDetails(ticketElement);
      }
    });
    ticketElement.querySelector("input").addEventListener("click", e => this.toggleTicketStatus(ticket.id, e));
    ticketElement.querySelector(".edit-btn").addEventListener("click", e => this.openEditModal(ticket.id, e));
    ticketElement.querySelector(".delete-btn").addEventListener("click", e => this.openDeleteModal(ticket.id, e));
    this.ticketsContainer.appendChild(ticketElement);
  }
  toggleTicketDetails(ticketElement) {
    const details = ticketElement.querySelector(".ticket-details");
    details.style.display = details.style.display === "none" ? "block" : "none";
  }
  toggleTicketStatus(id, event) {
    event.stopPropagation();
    fetch(`${this.baseURL}?method=updateTicket&id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: event.target.checked
      })
    }).then(() => this.fetchTickets());
  }
  addTicket() {
    const name = this.ticketNameInput.value;
    const description = this.ticketDescriptionInput.value;
    if (!name || !description) {
      this.showError(this.addModalError, "Краткое и подробное описание обязательны для заполнения.");
      return;
    }
    fetch(`${this.baseURL}?method=createTicket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        description
      })
    }).then(() => {
      this.closeModal(this.addModal);
      this.fetchTickets();
    });
  }
  openEditModal(id, event) {
    event.stopPropagation();
    this.currentEditId = id;
    fetch(`${this.baseURL}?method=ticketById&id=${id}`).then(response => response.json()).then(ticket => {
      this.editTicketNameInput.value = ticket.name;
      this.editTicketDescriptionInput.value = ticket.description;
      this.openModal(this.editModal);
    });
  }
  updateTicket() {
    const name = this.editTicketNameInput.value;
    const description = this.editTicketDescriptionInput.value;
    if (!name || !description) {
      this.showError(this.editModalError, "Краткое и подробное описание обязательны для заполнения.");
      return;
    }
    fetch(`${this.baseURL}?method=updateTicket&id=${this.currentEditId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        description
      })
    }).then(() => {
      this.closeModal(this.editModal);
      this.fetchTickets();
    });
  }
  openDeleteModal(id, event) {
    event.stopPropagation();
    this.currentDeleteId = id;
    this.openModal(this.deleteModal);
  }
  deleteTicket() {
    fetch(`${this.baseURL}?method=deleteTicket&id=${this.currentDeleteId}`).then(() => {
      this.closeModal(this.deleteModal);
      this.fetchTickets();
    });
  }
}
/* harmony default export */ const js_HelpDesk = (HelpDesk);
;// CONCATENATED MODULE: ./src/js/app.js

document.addEventListener("DOMContentLoaded", () => {
  // const baseURL = "http://localhost:3000";
  const baseURL = "https://ahj-homeworks-7-1.onrender.com";
  new js_HelpDesk(baseURL);
});
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;