const themeToggle =
    document.getElementById("themeToggle");


// LOAD SAVED THEME
const savedTheme =
    localStorage.getItem("theme");

if(savedTheme === "light"){

    document.body.classList.add("light");

    themeToggle.innerText = "☀";
}


// TOGGLE THEME
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    // SAVE THEME
    if(document.body.classList.contains("light")){

        localStorage.setItem("theme", "light");

        themeToggle.innerText = "☀";

    }else{

        localStorage.setItem("theme", "dark");

        themeToggle.innerText = "🌙";
    }
});