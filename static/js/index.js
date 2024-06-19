// Had to write this part in JS as I couldn't get match media to work in Rust
const rootElement = document.documentElement;

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  rootElement.setAttribute("data-theme", savedTheme);
}

function handleThemeChange(event) {
  if (rootElement.getAttribute("data-theme") === "light") {
    rootElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    rootElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

let currentlyDarkMode =
  rootElement.getAttribute("data-theme") === "light" ? false : true;

let isDarkMode = currentlyDarkMode;
let themeChangerCallback = () => {
  console.log("Called");
  let newTheme;
  if (!isDarkMode) {
    isDarkMode = true;
    localStorage.setItem("theme", "dark");
    document.querySelector("#themeToggle").innerHTML =
      '<i class="fa-solid fa-moon"></i>';
    newTheme = "dark";
  } else {
    isDarkMode = false;
    localStorage.setItem("theme", "light");
    document.querySelector("#themeToggle").innerHTML =
      '<i class="fa-solid fa-sun"></i>';
    newTheme = "light";
  }

  rootElement.setAttribute("data-theme", newTheme);
};

darkModeQuery.addEventListener("change", handleThemeChange);
