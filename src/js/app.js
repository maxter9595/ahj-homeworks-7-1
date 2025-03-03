import HelpDesk from "./HelpDesk.js";

document.addEventListener("DOMContentLoaded", () => {
  const baseURL = "http://localhost:3000";
  // const baseURL = "https://your-app.render.com/";
  new HelpDesk(baseURL);
});
