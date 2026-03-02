// HASH FUNCTION USING SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}


// SIGNUP FORM VALIDATION
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    console.log("Signup clicked");
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        let isValid = true;

        // Clear old errors
        document.getElementById("nameError").textContent = "";
        document.getElementById("emailError").textContent = "";
        document.getElementById("passwordError").textContent = "";
        document.getElementById("confirmError").textContent = "";

        if (name === "") {
            document.getElementById("nameError").textContent = "Name is required";
            isValid = false;
        }

        if (email === "") {
            document.getElementById("emailError").textContent = "Email is required";
            isValid = false;
        }

        if (password === "") {
            document.getElementById("passwordError").textContent = "Password is required";
            isValid = false;
        }

        if (confirmPassword === "") {
            document.getElementById("confirmError").textContent = "Confirm your password";
            isValid = false;
        }

        if (password !== confirmPassword) {
            document.getElementById("confirmError").textContent = "Passwords do not match";
            isValid = false;
        }

        if (isValid) {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const emailExists = users.some(function (u) {
        return u.email === email;
    });

    if (emailExists) {
        emailError.textContent = "Email already registered";
        return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
        name: name,
        email: email,
        password: hashedPassword
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");
    signupForm.reset();
}
    });
}
    

// LOGIN FORM LOGIC
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const loginEmail = document.getElementById("loginEmail").value.trim();
        const loginPassword = document.getElementById("loginPassword").value.trim();

        const hashedLoginPassword = await hashPassword(loginPassword);

        const users = JSON.parse(localStorage.getItem("users")) || [];

const matchedUser = users.find(function (user) {
    return user.email === loginEmail && user.password === hashedLoginPassword;
});

if (matchedUser) {

    const rememberMe = document.getElementById("rememberMe").checked;

    if (rememberMe) {
        localStorage.setItem("isLoggedIn", "true");
    } else {
        sessionStorage.setItem("isLoggedIn", "true");
    }

window.location.href = "dashboard.html";

} else {
    document.getElementById("loginPasswordError").textContent = "Invalid email or password";
}
    });
}


// DASHBOARD LOGIC
const usernameSpan = document.getElementById("username");
const logoutBtn = document.getElementById("logoutBtn");

if (usernameSpan) {

    const isLoggedIn =
    localStorage.getItem("isLoggedIn") ||
    sessionStorage.getItem("isLoggedIn");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!isLoggedIn || !currentUser) {
    window.location.href = "login.html";
} else {
    usernameSpan.textContent = currentUser.name;
}
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}