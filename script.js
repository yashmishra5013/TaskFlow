// ========================================
// TASKFLOW
// STEP 18
// Notifications / Reminders System
// ========================================


// ========================================
// DOM ELEMENTS
// ========================================

const taskInput =
    document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priorityInput");

const dueDateInput =
    document.getElementById("dueDateInput");

const categoryInput =
    document.getElementById("categoryInput");

const tagsInput =
    document.getElementById("tagsInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const taskCount =
    document.getElementById("taskCount");

const searchInput =
    document.getElementById("searchInput");

const sortInput =
    document.getElementById("sortInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");


// Dashboard

const productivityPercent =
    document.getElementById(
        "productivityPercent"
    );

const progressFill =
    document.getElementById(
        "progressFill"
    );

const productivityText =
    document.getElementById(
        "productivityText"
    );

const upcomingTasks =
    document.getElementById(
        "upcomingTasks"
    );

const highPriorityTasks =
    document.getElementById(
        "highPriorityTasks"
    );


// Notification

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );

const notificationStatus =
    document.getElementById(
        "notificationStatus"
    );


// Edit modal

const editModal =
    document.getElementById(
        "editModal"
    );

const editForm =
    document.getElementById(
        "editForm"
    );

const editTaskInput =
    document.getElementById(
        "editTaskInput"
    );

const editPriorityInput =
    document.getElementById(
        "editPriorityInput"
    );

const editDueDateInput =
    document.getElementById(
        "editDueDateInput"
    );

const editCategoryInput =
    document.getElementById(
        "editCategoryInput"
    );

const editTagsInput =
    document.getElementById(
        "editTagsInput"
    );

const closeModalBtn =
    document.getElementById(
        "closeModalBtn"
    );

const cancelEditBtn =
    document.getElementById(
        "cancelEditBtn"
    );


// ========================================
// TASK DATA
// ========================================

let tasks =
    JSON.parse(
        localStorage.getItem(
            "taskflowTasks"
        )
    ) || [];


// Make old tasks compatible

tasks =
    tasks.map(function(task) {

        return {

            ...task,

            dueDate:
                task.dueDate || "",

            category:
                task.category || "Other",

            tags:
                Array.isArray(task.tags)
                    ? task.tags
                    : []

        };

    });


let currentFilter = "all";

let searchText = "";

let currentSort = "newest";

let editingTaskId = null;


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// ADD TASK
// ========================================

function addTask() {

    const taskText =
        taskInput.value.trim();

    const priority =
        priorityInput.value;

    const dueDate =
        dueDateInput.value;

    const category =
        categoryInput.value;

    const tagsText =
        tagsInput.value.trim();


    // Empty task

    if (taskText === "") {

        alert(
            "Please enter a task!"
        );

        return;
    }


    // Due date

    if (dueDate === "") {

        alert(
            "Please select a due date!"
        );

        return;
    }


    // Convert tags

    const tags =
        parseTags(tagsText);


    // Create task

    const newTask = {

        id: Date.now(),

        text: taskText,

        priority: priority,

        dueDate: dueDate,

        category: category,

        tags: tags,

        completed: false,

        createdAt: Date.now()

    };


    // Add

    tasks.push(newTask);


    // Save

    saveTasks();


    // Clear

    taskInput.value = "";

    dueDateInput.value = "";

    tagsInput.value = "";


    // Render

    renderTasks();

}


// ========================================
// PARSE TAGS
// ========================================

function parseTags(text) {

    if (!text) {

        return [];

    }


    return text
        .split(",")
        .map(function(tag) {

            return tag.trim();

        })
        .filter(function(tag) {

            return tag !== "";

        })
        .slice(0, 8);

}


// ========================================
// TOGGLE TASK
// ========================================

function toggleTask(id) {

    tasks =
        tasks.map(function(task) {

            if (task.id === id) {

                task.completed =
                    !task.completed;

            }

            return task;

        });


    saveTasks();

    renderTasks();

}


// ========================================
// DELETE TASK
// ========================================

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {

        return;

    }


    tasks =
        tasks.filter(function(task) {

            return task.id !== id;

        });


    saveTasks();

    renderTasks();

}


// ========================================
// OPEN EDIT MODAL
// ========================================

function openEditModal(id) {

    const task =
        tasks.find(function(task) {

            return task.id === id;

        });


    if (!task) {

        return;

    }


    editingTaskId = id;


    // Fill form

    editTaskInput.value =
        task.text;

    editPriorityInput.value =
        task.priority;

    editDueDateInput.value =
        task.dueDate || "";

    editCategoryInput.value =
        task.category || "Other";

    editTagsInput.value =
        (task.tags || []).join(", ");


    // Show modal

    editModal.classList.add(
        "show"
    );


    // Focus

    setTimeout(function() {

        editTaskInput.focus();

        editTaskInput.select();

    }, 100);

}


// ========================================
// CLOSE EDIT MODAL
// ========================================

function closeEditModal() {

    editModal.classList.remove(
        "show"
    );


    editingTaskId = null;

}


// ========================================
// SAVE EDIT
// ========================================

editForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        if (editingTaskId === null) {

            return;

        }


        const task =
            tasks.find(function(task) {

                return task.id ===
                    editingTaskId;

            });


        if (!task) {

            closeEditModal();

            return;

        }


        const newText =
            editTaskInput.value.trim();

        const newPriority =
            editPriorityInput.value;

        const newDueDate =
            editDueDateInput.value;

        const newCategory =
            editCategoryInput.value;

        const newTags =
            parseTags(
                editTagsInput.value
            );


        // Validate

        if (newText === "") {

            alert(
                "Task cannot be empty!"
            );

            editTaskInput.focus();

            return;

        }


        if (newDueDate === "") {

            alert(
                "Please select a due date!"
            );

            editDueDateInput.focus();

            return;

        }


        // Update

        task.text =
            newText;

        task.priority =
            newPriority;

        task.dueDate =
            newDueDate;

        task.category =
            newCategory;

        task.tags =
            newTags;


        // Save

        saveTasks();


        // Close

        closeEditModal();


        // Render

        renderTasks();

    }
);


// ========================================
// CLOSE BUTTON
// ========================================

closeModalBtn.addEventListener(
    "click",
    closeEditModal
);


cancelEditBtn.addEventListener(
    "click",
    closeEditModal
);


// ========================================
// CLICK OUTSIDE MODAL
// ========================================

editModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


// ========================================
// ESCAPE KEY
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            editModal.classList.contains(
                "show"
            )
        ) {

            closeEditModal();

        }

    }
);


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

    if (!dateString) {

        return "No deadline";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Invalid date";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ========================================
// GET TODAY
// ========================================

function getToday() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


// ========================================
// GET DUE DATE CLASS
// ========================================

function getDueDateClass(task) {

    if (task.completed) {

        return "completed-date";

    }


    if (!task.dueDate) {

        return "";

    }


    const today =
        getToday();


    if (
        task.dueDate < today
    ) {

        return "overdue";

    }


    if (
        task.dueDate === today
    ) {

        return "today";

    }


    return "";

}


// ========================================
// GET DUE DATE TEXT
// ========================================

function getDueDateText(task) {

    if (task.completed) {

        return "Completed";

    }


    if (!task.dueDate) {

        return "No deadline";

    }


    const today =
        getToday();


    if (
        task.dueDate < today
    ) {

        return (
            "Overdue • " +
            formatDate(
                task.dueDate
            )
        );

    }


    if (
        task.dueDate === today
    ) {

        return "Due Today";

    }


    return (
        "Due • " +
        formatDate(
            task.dueDate
        )
    );

}


// ========================================
// SORT TASKS
// ========================================

function sortTasks(taskArray) {

    const sorted =
        [...taskArray];


    sorted.sort(
        function(a, b) {


            // NEWEST

            if (
                currentSort ===
                "newest"
            ) {

                return (
                    (b.createdAt || b.id) -
                    (a.createdAt || a.id)
                );

            }


            // OLDEST

            if (
                currentSort ===
                "oldest"
            ) {

                return (
                    (a.createdAt || a.id) -
                    (b.createdAt || b.id)
                );

            }


            // PRIORITY

            const priorityValue = {

                High: 3,

                Medium: 2,

                Low: 1

            };


            if (
                currentSort ===
                "priority-high"
            ) {

                return (
                    priorityValue[b.priority] -
                    priorityValue[a.priority]
                );

            }


            if (
                currentSort ===
                "priority-low"
            ) {

                return (
                    priorityValue[a.priority] -
                    priorityValue[b.priority]
                );

            }


            // DUE DATE SOONEST

            if (
                currentSort ===
                "due-soonest"
            ) {

                if (
                    !a.dueDate &&
                    !b.dueDate
                ) {

                    return 0;

                }

                if (!a.dueDate) {

                    return 1;

                }

                if (!b.dueDate) {

                    return -1;

                }

                return (
                    a.dueDate.localeCompare(
                        b.dueDate
                    )
                );

            }


            // DUE DATE LATEST

            if (
                currentSort ===
                "due-latest"
            ) {

                if (
                    !a.dueDate &&
                    !b.dueDate
                ) {

                    return 0;

                }

                if (!a.dueDate) {

                    return 1;

                }

                if (!b.dueDate) {

                    return -1;

                }

                return (
                    b.dueDate.localeCompare(
                        a.dueDate
                    )
                );

            }


            return 0;

        }
    );


    return sorted;

}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";


    // FILTER

    let filteredTasks =
        tasks.filter(
            function(task) {


                // STATUS

                if (
                    currentFilter ===
                    "pending" &&
                    task.completed
                ) {

                    return false;

                }


                if (
                    currentFilter ===
                    "completed" &&
                    !task.completed
                ) {

                    return false;

                }


                // SEARCH

                if (
                    searchText !== ""
                ) {

                    const search =
                        searchText.toLowerCase();


                    const searchableText =

                        (
                            task.text +
                            " " +
                            task.category +
                            " " +
                            (task.tags || [])
                                .join(" ")
                        ).toLowerCase();


                    if (
                        !searchableText.includes(
                            search
                        )
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    // SORT

    filteredTasks =
        sortTasks(
            filteredTasks
        );


    // EMPTY

    if (
        filteredTasks.length === 0
    ) {

        taskList.innerHTML = `

            <div class="empty-message">

                No tasks found.

            </div>

        `;

    }


    // TASK CARDS

    filteredTasks.forEach(
        function(task) {


            const taskItem =
                document.createElement(
                    "div"
                );


            taskItem.classList.add(
                "task-item"
            );


            if (task.completed) {

                taskItem.classList.add(
                    "completed"
                );

            }


            // Priority

            const priorityClass =
                task.priority
                    .toLowerCase();


            // Due date

            const dueDateClass =
                getDueDateClass(
                    task
                );


            const dueDateText =
                getDueDateText(
                    task
                );


            // Tags HTML

            let tagsHTML = "";


            if (
                task.tags &&
                task.tags.length > 0
            ) {

                tagsHTML =
                    task.tags.map(
                        function(tag) {

                            return `
                                <span class="tag">
                                    #${escapeHTML(tag)}
                                </span>
                            `;

                        }
                    ).join("");

            }


            // HTML

            taskItem.innerHTML = `

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${
                        task.completed
                            ? "checked"
                            : ""
                    }
                >


                <div class="task-content">

                    <div class="task-text">

                        ${escapeHTML(
                            task.text
                        )}

                    </div>


                    <div class="task-meta">


                        <span
                            class="priority
                            ${priorityClass}"
                        >

                            ${escapeHTML(
                                task.priority
                            )}

                        </span>


                        <span
                            class="due-date
                            ${dueDateClass}"
                        >

                            📅
                            ${escapeHTML(
                                dueDateText
                            )}

                        </span>


                        <span class="category">

                            ${getCategoryDisplay(
                                task.category
                            )}

                        </span>


                        ${tagsHTML}


                    </div>

                </div>


                <div class="task-actions">


                    <button
                        class="edit-btn"
                        type="button"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-btn"
                        type="button"
                    >
                        Delete
                    </button>


                </div>

            `;


            // CHECKBOX

            const checkbox =
                taskItem.querySelector(
                    ".task-checkbox"
                );


            checkbox.addEventListener(
                "change",
                function() {

                    toggleTask(
                        task.id
                    );

                }
            );


            // EDIT

            const editBtn =
                taskItem.querySelector(
                    ".edit-btn"
                );


            editBtn.addEventListener(
                "click",
                function() {

                    openEditModal(
                        task.id
                    );

                }
            );


            // DELETE

            const deleteBtn =
                taskItem.querySelector(
                    ".delete-btn"
                );


            deleteBtn.addEventListener(
                "click",
                function() {

                    deleteTask(
                        task.id
                    );

                }
            );


            taskList.appendChild(
                taskItem
            );

        }
    );


    // Update

    updateStats();

    updateDashboard();

}


// ========================================
// CATEGORY DISPLAY
// ========================================

function getCategoryDisplay(
    category
) {

    const categories = {

        Study: "📚 Study",

        Work: "💼 Work",

        Personal: "👤 Personal",

        Health: "❤️ Health",

        Other: "📌 Other"

    };


    return (
        categories[category] ||
        "📌 Other"
    );

}


// ========================================
// UPDATE STATS
// ========================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;


    taskCount.textContent =
        total +
        (
            total === 1
                ? " task"
                : " tasks"
        );

}


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );

    }


    productivityPercent.textContent =
        percentage + "%";


    progressFill.style.width =
        percentage + "%";


    productivityText.textContent =

        completed +
        " of " +
        total +
        " tasks completed";


    updateUpcomingTasks();

    updateHighPriorityTasks();

}


// ========================================
// UPCOMING TASKS
// ========================================

function updateUpcomingTasks() {

    const today =
        getToday();


    const upcoming =
        tasks
            .filter(function(task) {

                return (
                    !task.completed &&
                    task.dueDate &&
                    task.dueDate >= today
                );

            })
            .sort(function(a, b) {

                return a.dueDate.localeCompare(
                    b.dueDate
                );

            })
            .slice(0, 3);


    if (
        upcoming.length === 0
    ) {

        upcomingTasks.innerHTML = `

            <div class="dashboard-empty">
                No upcoming deadlines
            </div>

        `;

        return;

    }


    upcomingTasks.innerHTML =
        upcoming.map(
            function(task) {

                return `

                    <div class="dashboard-task">

                        <span
                            class="dashboard-task-name"
                        >
                            ${escapeHTML(
                                task.text
                            )}
                        </span>

                        <span
                            class="dashboard-task-date"
                        >
                            ${formatDate(
                                task.dueDate
                            )}
                        </span>

                    </div>

                `;

            }
        ).join("");

}


// ========================================
// HIGH PRIORITY TASKS
// ========================================

function updateHighPriorityTasks() {

    const highPriority =
        tasks
            .filter(function(task) {

                return (
                    !task.completed &&
                    task.priority === "High"
                );

            })
            .slice(0, 3);


    if (
        highPriority.length === 0
    ) {

        highPriorityTasks.innerHTML = `

            <div class="dashboard-empty">
                No high priority tasks
            </div>

        `;

        return;

    }


    highPriorityTasks.innerHTML =
        highPriority.map(
            function(task) {

                return `

                    <div class="dashboard-task">

                        <span
                            class="dashboard-task-name"
                        >
                            ${escapeHTML(
                                task.text
                            )}
                        </span>

                        <span
                            class="dashboard-priority high"
                        >
                            HIGH
                        </span>

                    </div>

                `;

            }
        ).join("");

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    function() {

        searchText =
            searchInput.value.trim();

        renderTasks();

    }
);


// ========================================
// SORT
// ========================================

sortInput.addEventListener(
    "change",
    function() {

        currentSort =
            sortInput.value;

        renderTasks();

    }
);


// ========================================
// FILTER BUTTONS
// ========================================

filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {


                filterButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


// ========================================
// ADD BUTTON
// ========================================

addTaskBtn.addEventListener(
    "click",
    addTask
);


// ========================================
// ENTER KEY
// ========================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ========================================
// NOTIFICATION SUPPORT
// ========================================

function updateNotificationUI() {

    if (
        !("Notification" in window)
    ) {

        notificationStatus.textContent =
            "This browser does not support notifications.";

        notificationBtn.disabled =
            true;

        notificationBtn.textContent =
            "Not Supported";

        return;

    }


    if (
        Notification.permission ===
        "granted"
    ) {

        notificationStatus.textContent =
            "Notifications are enabled.";

        notificationBtn.textContent =
            "Notifications Enabled";

        notificationBtn.disabled =
            false;

        return;

    }


    if (
        Notification.permission ===
        "denied"
    ) {

        notificationStatus.textContent =
            "Notifications are blocked. Allow them from browser settings.";

        notificationBtn.textContent =
            "Notifications Blocked";

        notificationBtn.disabled =
            true;

        return;

    }


    notificationStatus.textContent =
        "Enable notifications to receive task reminders.";

    notificationBtn.textContent =
        "Enable Notifications";

    notificationBtn.disabled =
        false;

}


// ========================================
// REQUEST NOTIFICATION PERMISSION
// ========================================

async function requestNotificationPermission() {

    if (
        !("Notification" in window)
    ) {

        alert(
            "Your browser does not support notifications."
        );

        return;

    }


    try {

        const permission =
            await Notification.requestPermission();


        updateNotificationUI();


        if (
            permission === "granted"
        ) {

            showNotification(
                "TaskFlow Notifications",
                "Task reminders are now enabled."
            );


            checkTaskReminders();

        }

    }
    catch (error) {

        console.error(
            "Notification permission error:",
            error
        );

    }

}


// ========================================
// SHOW NOTIFICATION
// ========================================

function showNotification(
    title,
    message
) {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return;

    }


    new Notification(
        title,
        {
            body: message,

            icon: "",

            tag:
                "taskflow-" +
                title
        }
    );

}


// ========================================
// NOTIFICATION BUTTON
// ========================================

notificationBtn.addEventListener(
    "click",
    requestNotificationPermission
);


// ========================================
// GET REMINDER DATE
// ========================================

function getReminderDateKey() {

    return (
        "taskflowReminder-" +
        getToday()
    );

}


// ========================================
// CHECK TASK REMINDERS
// ========================================

function checkTaskReminders() {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return;

    }


    const today =
        getToday();


    const reminderKey =
        getReminderDateKey();


    let remindersSent =
        JSON.parse(
            localStorage.getItem(
                reminderKey
            )
        ) || [];


    // ====================================
    // DUE TODAY
    // ====================================

    const dueToday =
        tasks.filter(
            function(task) {

                return (
                    !task.completed &&
                    task.dueDate === today
                );

            }
        );


    dueToday.forEach(
        function(task) {

            const id =
                "today-" +
                task.id;


            if (
                remindersSent.includes(id)
            ) {

                return;

            }


            showNotification(
                "📅 Task Due Today",
                task.text +
                " is due today."
            );


            remindersSent.push(id);

        }
    );


    // ====================================
    // OVERDUE
    // ====================================

    const overdue =
        tasks.filter(
            function(task) {

                return (
                    !task.completed &&
                    task.dueDate &&
                    task.dueDate < today
                );

            }
        );


    overdue.forEach(
        function(task) {

            const id =
                "overdue-" +
                task.id;


            if (
                remindersSent.includes(id)
            ) {

                return;

            }


            showNotification(
                "⚠️ Overdue Task",
                task.text +
                " is overdue."
            );


            remindersSent.push(id);

        }
    );


    // Save sent reminders

    localStorage.setItem(
        reminderKey,
        JSON.stringify(
            remindersSent
        )
    );

}


// ========================================
// AUTOMATIC REMINDER CHECK
// ========================================

setInterval(
    function() {

        checkTaskReminders();

    },
    60000
);


// ========================================
// INITIAL NOTIFICATION UI
// ========================================

updateNotificationUI();


// ========================================
// INITIAL LOAD
// ========================================

renderTasks();


// ========================================
// INITIAL REMINDER CHECK
// ========================================

setTimeout(
    function() {

        checkTaskReminders();

    },
    1500
);