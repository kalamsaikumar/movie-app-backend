// CHECK TOKEN
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

// ELEMENTS

const movieTableBody = document.getElementById("movieTableBody");

const movieModal = document.getElementById("movieModal");

const addMovieBtn = document.getElementById("addMovieBtn");

const movieForm = document.getElementById("movieForm");

const logoutBtn = document.getElementById("logoutBtn");

const loader = document.getElementById("loader");

const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const heroFilter = document.getElementById("heroFilter");

const ratingFilter = document.getElementById("ratingFilter");

const directorFilter = document.getElementById("directorFilter");

const yearFilter = document.getElementById("yearFilter");

const emptyAddBtn = document.getElementById("emptyAddBtn");

const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const menuBtn = document.getElementById("menuBtn");

const sidebar = document.getElementById("sidebar");

const themeToggle = document.getElementById("themeToggle");

const sidebarOverlay = document.getElementById("sidebarOverlay");

const appLogo = document.getElementById("appLogo");

// LOGO CLICK HOME PAGE

appLogo.addEventListener("click", () => {
  window.location.href = "/index.html";
});

// MOBILE SIDEBAR

// OPEN/CLOSE SIDEBAR

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");   

  sidebarOverlay.classList.toggle("hidden");
});

// CLOSE SIDEBAR WHEN CLICKING OVERLAY

sidebarOverlay.addEventListener("click", () => {
  sidebar.classList.remove("active");

  sidebarOverlay.classList.add("hidden");
});

// LOAD THEME

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");

  themeToggle.innerText = "☀";
}

// TOGGLE THEME

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");

    themeToggle.innerText = "☀";
  } else {
    localStorage.setItem("theme", "dark");

    themeToggle.innerText = "🌙";
  }
});

// STAR RATING

const stars = document.querySelectorAll("#starRating span");

let selectedRating = 0;
let editMovieId = null;
let allMovies = [];

stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;

    stars.forEach((s) => {
      s.classList.remove("active");

      if (s.dataset.value <= selectedRating) {
        s.classList.add("active");
      }
    });
  });
});

// ADD MOVIE

movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  showLoader();

  const movieData = {
    movieName: document.getElementById("movieName").value,

    hero: document.getElementById("hero").value,

    director: document.getElementById("director").value,

    releaseYear: document.getElementById("releaseYear").value,

    genre: document.getElementById("genre").value,

    runtime: document.getElementById("runtime").value,

    rating: selectedRating,
  };

  try {
    // CHECK MODE

    const isEditMode = editMovieId !== null;

    // URL
    const url = isEditMode ? `/api/movies/${editMovieId}` : "/api/movies";

    // METHOD
    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",

        Authorization: token,
      },

      body: JSON.stringify(movieData),
    });

    const data = await response.json();

    hideLoader();

    if (response.ok) {
      showToast(
        isEditMode ? "Movie Updated Successfully" : "Movie Added Successfully",
        "success",
      );      

      movieModal.classList.add("hidden");

      movieForm.reset();

      // RESET EDIT MODE

      editMovieId = null;

      document.getElementById("modalTitle").innerText = "Add Movie";

      document.getElementById("saveBtnText").innerText = "Save Movie";

      selectedRating = 0;

      stars.forEach((star) => {
        star.classList.remove("active");
      });

      fetchMovies();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    hideLoader();

    console.log(error);

    showToast("Something went wrong", "error");
  }
});

// FETCH MOVIES
// FETCH MOVIES

async function fetchMovies() {
  showLoader();

  try {
    // SEARCH VALUE
    const search = searchInput.value;

    // FILTER VALUES
    const hero = heroFilter.value;

    const rating = ratingFilter.value;

    const director = directorFilter.value;

    const year = yearFilter.value;

    // QUERY PARAMS
    const query = new URLSearchParams({
      search,
      hero,
      rating,
      director,
      year,
    });

    const response = await fetch(`/api/movies?${query}`, {
      headers: {
        Authorization: token,
      },
    });

    const movies = await response.json();

    allMovies = movies;

    hideLoader();

    renderMovies(movies);

    populateHeroFilter(allMovies);

    populateDirectorFilter(allMovies);

    populateYearFilter(allMovies);
  } catch (error) {
    hideLoader();

    console.log(error);

    showToast("Failed to fetch movies", "error");
  }
}

// LIVE SEARCH

searchInput.addEventListener("input", () => {
  fetchMovies();
});

// POPULATE HERO FILTER

function populateHeroFilter(movies) {
  // SAVE CURRENT VALUE
  const selectedHero = heroFilter.value;

  // UNIQUE HEROES
  const heroes = [...new Set(movies.map((movie) => movie.hero))];

  // RESET
  heroFilter.innerHTML = `

        <option value="">
            Hero
        </option>
    `;

  // ADD HEROES
  heroes.forEach((hero) => {
    heroFilter.innerHTML += `

            <option value="${hero}">
                ${hero}
            </option>
        `;
  });

  // RESTORE VALUE
  heroFilter.value = selectedHero;
}

// POPULATE DIRECTOR FILTER

function populateDirectorFilter(movies) {
  const selectedDirector = directorFilter.value;

  const directors = [...new Set(movies.map((movie) => movie.director))];

  directorFilter.innerHTML = `

        <option value="">
            Director
        </option>
    `;

  directors.forEach((director) => {
    directorFilter.innerHTML += `

            <option value="${director}">
                ${director}
            </option>
        `;
  });

  directorFilter.value = selectedDirector;
}

// POPULATE YEAR FILTER

function populateYearFilter(movies) {
  const selectedYear = yearFilter.value;

  const years = [...new Set(movies.map((movie) => movie.releaseYear))];

  years.sort((a, b) => b - a);

  yearFilter.innerHTML = `

        <option value="">
            Year
        </option>
    `;

  years.forEach((year) => {
    yearFilter.innerHTML += `

            <option value="${year}">
                ${year}
            </option>
        `;
  });

  yearFilter.value = selectedYear;
}
// FILTER EVENTS

heroFilter.addEventListener("change", fetchMovies);

ratingFilter.addEventListener("change", fetchMovies);

directorFilter.addEventListener("change", fetchMovies);

yearFilter.addEventListener("change", fetchMovies);

// simply written as below
// [heroFilter, ratingFilter, directorFilter, yearFilter]
//   .forEach(filter => filter.addEventListener("change", fetchMovies));

// CLEAR ALL FILTERS

clearFiltersBtn.addEventListener("click", () => {
  // RESET INPUTS

  searchInput.value = "";

  heroFilter.value = "";

  directorFilter.value = "";

  yearFilter.value = "";

  ratingFilter.value = "";

  // FETCH ALL MOVIES

  fetchMovies();

  // TOAST

  showToast("Filters Cleared", "success");
});

// RENDER MOVIES

function renderMovies(movies) {
  movieTableBody.innerHTML = "";

  // EMPTY STATE  

  if (movies.length === 0) {
    emptyState.classList.remove("hidden");

    return;
  }

  emptyState.classList.add("hidden");

  movies.forEach((movie, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `

            <td>${index + 1}</td>

            <td>

                <a
                    href="
            https://en.wikipedia.org/wiki/${encodeURIComponent(movie.movieName)}
                    "
                    target="_blank"
                    class="movie-link"
                >

                    ${movie.movieName}

                </a>

            </td>

            <td>${movie.hero}</td>

            <td>${movie.director}</td>

            <td>${movie.releaseYear}</td>

            <td>${movie.genre}</td>

            <td>${movie.runtime}</td>

            <td class="stars">
                ${"★".repeat(movie.rating)}
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editMovie('${movie._id}')">

                    Edit

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteMovie('${movie._id}')">

                    Delete

                </button>

            </td>
        `;

    movieTableBody.appendChild(row);
  });
}

// DELETE MOVIE

async function deleteMovie(id) {
  const confirmDelete = confirm("Are you sure you want to delete?");

  if (!confirmDelete) return;

  showLoader();

  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    hideLoader();

    if (response.ok) {
      showToast("Movie Deleted Successfully", "success");

      fetchMovies();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    hideLoader();

    console.log(error);

    showToast("Delete failed", "error");
  }
}

// EDIT MOVIE

async function editMovie(id) {
  showLoader();

  try {
    const response = await fetch("/api/movies", {
      headers: {
        Authorization: token,
      },
    });

    const movies = await response.json();

    hideLoader();

    const movie = movies.find((m) => m._id === id);

    if (!movie) {
      return showToast("Movie not found", "error");
    }

    // STORE ID
    editMovieId = id;

    // CHANGE TITLE
    document.getElementById("modalTitle").innerText = "Edit Movie";

    // CHANGE BUTTON TEXT
    document.getElementById("saveBtnText").innerText = "Update Movie";

    // PREFILL INPUTS

    document.getElementById("movieName").value = movie.movieName;

    document.getElementById("hero").value = movie.hero;

    document.getElementById("director").value = movie.director;

    document.getElementById("releaseYear").value = movie.releaseYear;

    document.getElementById("genre").value = movie.genre;

    document.getElementById("runtime").value = movie.runtime;

    // PREFILL RATING

    selectedRating = movie.rating;

    stars.forEach((star) => {
      star.classList.remove("active");

      if (star.dataset.value <= selectedRating) {
        star.classList.add("active");
      }
    });

    // OPEN MODAL

    movieModal.classList.remove("hidden");
  } catch (error) {
    hideLoader();

    console.log(error);

    showToast("Failed to load movie", "error");
  }
}

// OPEN MODAL

addMovieBtn.addEventListener("click", () => {
  movieModal.classList.remove("hidden");
});

// EMPTY BUTTON OPEN MODAL

if (emptyAddBtn) {
  emptyAddBtn.addEventListener("click", () => {
    movieModal.classList.remove("hidden");
  });
}

// CLOSE MODAL

movieModal.addEventListener("click", (e) => {
  if (e.target === movieModal) {
    movieModal.classList.add("hidden");
  }
});

// LOGOUT

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // REMOVE TOKEN
    localStorage.removeItem("token");

    // REDIRECT
    window.location.href = "/login.html";
  });
}

// LOADER

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

// TOAST CONTAINER

let toastContainer = document.querySelector(".toast-container");

if (!toastContainer) {
  toastContainer = document.createElement("div");

  toastContainer.classList.add("toast-container");

  document.body.appendChild(toastContainer);
}

// SHOW TOAST

function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.classList.add("toast", type);

  toast.innerHTML = `

        <div>
            ${type === "success" ? "✔" : "✖"}
        </div>

        <div>
            ${message}
        </div>

        <div class="toast-progress"></div>
    `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// INITIAL LOAD

fetchMovies();
