const loader = document.getElementById("loader");
// CREATE TOAST CONTAINER
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

  // ICONS
  let icon = "✔";

  if (type === "error") {
    icon = "✖";
  }

  if (type === "warning") {
    icon = "⚠";
  }

  toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div class="toast-content">

            <div class="toast-message">
                ${message}
            </div>

        </div>

        <div class="toast-progress"></div>
    `;

  toastContainer.appendChild(toast);

  // REMOVE TOAST
  setTimeout(() => {
    toast.style.animation = "toastHide 0.4s ease forwards";

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

// SHOW LOADER
function showLoader() {
  loader.classList.remove("hidden");
}

// HIDE LOADER
function hideLoader() {
  loader.classList.add("hidden");
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    showLoader();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      hideLoader();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        showToast("Login Successful", "success");

        setTimeout(() => {
          window.location.href = "/dashboard.html";
        }, 1000);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      hideLoader();

      console.log(error);

      showToast("Something went wrong", "error");
    }
  });
}

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    showLoader();

    const username = document.getElementById("username").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    // PASSWORD CHECK
    if (password !== confirmPassword) {
      hideLoader();

      return showToast("Passwords do not match", "error");
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      hideLoader();

      if (response.ok) {
        showToast("Registration Successful", "success");

        setTimeout(() => {
          window.location.href = "/login.html";
        }, 1500);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      hideLoader();

      console.log(error);

      showToast("Something went wrong", "error");
    }
  });
}

// FORGOT PASSWORD

const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");

    const email = emailInput.value.trim();

    console.log(email);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.log(error);

      showToast("Something went wrong", "error");
    }
  });
}

  // RESET PASSWORD

  const resetForm = document.getElementById("resetForm");

  if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newPassword = document.getElementById("newPassword").value;

      const confirmPassword = document.getElementById("confirmPassword").value;

      // PASSWORD CHECK

      if (newPassword !== confirmPassword) {
        return showToast("Passwords do not match", "error");
      }

      // GET EMAIL FROM URL

      const params = new URLSearchParams(window.location.search);

      const email = params.get("email");

      try {       
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,

            newPassword,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          showToast(data.message, "success");

          resetForm.reset();

          setTimeout(() => {
            window.location.href = "/login.html";
          }, 1500);
        } else {
          showToast(data.message, "error");
        }
      } catch (error) {
        console.log(error);

        showToast("Something went wrong", "error");
      }
    });
  }
