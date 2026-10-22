// ========================================
// 1. BMI CALCULATOR
// ========================================

const bmiForm = document.getElementById("bmiForm");
const bmiResult = document.getElementById("bmiResult");

bmiForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);

    if (
        !Number.isFinite(height) ||
        !Number.isFinite(weight) ||
        height <= 0 ||
        weight <= 0
    ) {
        bmiResult.textContent = "Please enter a valid height and weight.";
        return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category;

    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi < 25) {
        category = "Normal weight";
    } else {
        category = "Overweight";
    }

    bmiResult.textContent =
        `Your BMI is ${bmi.toFixed(2)}. Category: ${category}.`;
});


// ========================================
// 2. SIGNUP FORM VALIDATION
// ========================================

const signupForm = document.getElementById("signupForm");
const signupResult = document.getElementById("signupResult");

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (fullName.length < 2) {
        signupResult.textContent =
            "Please enter a name with at least 2 characters.";
        return;
    }

    if (password.length < 8) {
        signupResult.textContent =
            "Password must contain at least 8 characters.";
        return;
    }

    if (password !== confirmPassword) {
        signupResult.textContent = "Passwords do not match.";
        return;
    }

    signupResult.textContent =
        `Signup successful! Welcome, ${fullName}.`;

    signupForm.reset();
});


// ========================================
// 3. LIGHT AND DARK THEME CHANGER
// ========================================

const themeToggle = document.getElementById("themeToggle");
const themeStatus = document.getElementById("themeStatus");

function updateThemeButton() {
    const isDark = document.body.classList.contains("dark");

    themeToggle.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    themeStatus.textContent = isDark
        ? "Current theme: Dark"
        : "Current theme: Light";
}

try {
    if (localStorage.getItem("preferredTheme") === "dark") {
        document.body.classList.add("dark");
    }
} catch (error) {
    // The theme switch still works if storage is unavailable.
}

updateThemeButton();

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    try {
        localStorage.setItem(
            "preferredTheme",
            isDark ? "dark" : "light"
        );
    } catch (error) {
        // Continue without saving the preference.
    }

    updateThemeButton();
});


// ========================================
// 4. DIGITAL CLOCK
// ========================================

const clock = document.getElementById("clock");
const clockDate = document.getElementById("clockDate");

function updateClock() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    clockDate.textContent = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

updateClock();
setInterval(updateClock, 1000);


// ========================================
// 5. TO-DO LIST
// ========================================

const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const todoCount = document.getElementById("todoCount");
const clearCompleted = document.getElementById("clearCompleted");

let tasks = [];

try {
    const savedTasks = localStorage.getItem("todoTasks");

    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks.filter(function (task) {
                return (
                    task &&
                    typeof task.id === "string" &&
                    typeof task.text === "string" &&
                    typeof task.completed === "boolean"
                );
            });
        }
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    try {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    } catch (error) {
        console.warn("Tasks could not be saved in this browser.");
    }
}

function renderTasks() {
    taskList.replaceChildren();

    const remaining = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    todoCount.textContent =
        `${remaining} task${remaining === 1 ? "" : "s"} remaining`;

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No tasks yet. Add your first task!";
        taskList.appendChild(emptyMessage);
        return;
    }

    tasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });
}

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        return;
    }

    tasks.push({
        id: crypto.randomUUID(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    todoForm.reset();
    taskInput.focus();
});

clearCompleted.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});

renderTasks();