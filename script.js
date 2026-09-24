// ========================================
// TASKFLOW
// Professional Task Manager
// ========================================


// ========================================
// DOM ELEMENTS
// ========================================

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const categoryInput = document.getElementById("categoryInput");
const tagsInput = document.getElementById("tagsInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const taskCount = document.getElementById("taskCount");

const searchInput = document.getElementById("searchInput");
const sortInput = document.getElementById("sortInput");
const filterButtons = document.querySelectorAll(".filter-btn");


// ========================================
// PROJECT ELEMENTS
// ========================================

const projectInput = document.getElementById("projectInput");
const newProjectBtn = document.getElementById("newProjectBtn");

const projectModal = document.getElementById("projectModal");
const projectForm = document.getElementById("projectForm");
const projectNameInput =
    document.getElementById("projectNameInput");

const closeProjectModalBtn =
    document.getElementById("closeProjectModalBtn");

const cancelProjectBtn =
    document.getElementById("cancelProjectBtn");

const editProjectInput =
    document.getElementById("editProjectInput");


// ========================================
// DASHBOARD
// ========================================

const completionRate =
    document.getElementById("completionRate");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const upcomingDeadlines =
    document.getElementById("upcomingDeadlines");

const highPriorityTasks =
    document.getElementById("highPriorityTasks");


// ========================================
// NOTIFICATIONS
// ========================================

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationStatus =
    document.getElementById("notificationStatus");


// ========================================
// EDIT MODAL
// ========================================

const editModal =
    document.getElementById("editModal");

const editForm =
    document.getElementById("editForm");

const editTaskInput =
    document.getElementById("editTaskInput");

const editPriorityInput =
    document.getElementById("editPriorityInput");

const editDueDateInput =
    document.getElementById("editDueDateInput");

const editCategoryInput =
    document.getElementById("editCategoryInput");

const editTagsInput =
    document.getElementById("editTagsInput");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");


// ========================================
// STORAGE
// ========================================

const TASK_STORAGE_KEY =
    "taskflowTasks";

const PROJECT_STORAGE_KEY =
    "taskflowProjects";


// ========================================
// TASK DATA
// ========================================

let tasks =
    JSON.parse(
        localStorage.getItem(
            TASK_STORAGE_KEY
        )
    ) || [];


// ========================================
// PROJECT DATA
// ========================================

let projects =
    JSON.parse(
        localStorage.getItem(
            PROJECT_STORAGE_KEY
        )
    ) || ["General"];


// ========================================
// NORMALIZE PROJECTS
// ========================================

if (!Array.isArray(projects)) {
    projects = ["General"];
}

projects = projects
    .map(function(project) {
        return String(project).trim();
    })
    .filter(function(project) {
        return project !== "";
    });

if (!projects.includes("General")) {
    projects.unshift("General");
}


// ========================================
// NORMALIZE OLD TASKS
// ========================================

tasks = tasks.map(function(task) {

    return {

        ...task,

        dueDate:
            task.dueDate || "",

        category:
            task.category || "Other",

        tags:
            Array.isArray(task.tags)
                ? task.tags
                : [],

        project:
            typeof task.project === "string" &&
            task.project.trim() !== ""
                ? task.project.trim()
                : "General"

    };

});


// Add projects found inside old tasks

tasks.forEach(function(task) {

    if (
        task.project &&
        !projects.includes(task.project)
    ) {

        projects.push(task.project);

    }

});


// ========================================
// APP STATE
// ========================================

let currentFilter = "all";

let searchText = "";

let editingTaskId = null;


// ========================================
// GET TODAY
// ========================================

function getToday() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// ========================================
// SET MINIMUM DATES
// ========================================

function setMinimumDates() {

    const today = getToday();

    if (dueDateInput) {
        dueDateInput.min = today;
    }

    if (editDueDateInput) {
        editDueDateInput.min = today;
    }

}


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {

    localStorage.setItem(
        TASK_STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


// ========================================
// SAVE PROJECTS
// ========================================

function saveProjects() {

    localStorage.setItem(
        PROJECT_STORAGE_KEY,
        JSON.stringify(projects)
    );

}


// ========================================
// VALIDATE TASK
// ========================================

function isValidTaskText(text) {

    const cleanText =
        text.trim();

    if (cleanText.length < 5) {
        return false;
    }

    if (!/[a-zA-Z]/.test(cleanText)) {
        return false;
    }

    if (/^(.)\1{4,}$/.test(cleanText)) {
        return false;
    }

    if (/^[^a-zA-Z0-9]+$/.test(cleanText)) {
        return false;
    }

    return true;

}


// ========================================
// VALIDATE PROJECT
// ========================================

function isValidProjectName(text) {

    const cleanText =
        text.trim();

    if (
        cleanText.length < 3 ||
        cleanText.length > 60
    ) {

        return false;

    }

    if (!/[a-zA-Z]/.test(cleanText)) {
        return false;
    }

    if (/^(.)\1{4,}$/.test(cleanText)) {
        return false;
    }

    if (/^[^a-zA-Z0-9]+$/.test(cleanText)) {
        return false;
    }

    return true;

}


// ========================================
// VALIDATE DATE
// ========================================

function isValidDueDate(dateString) {

    if (!dateString) {
        return false;
    }

    return dateString >= getToday();

}


// ========================================
// RENDER PROJECT OPTIONS
// ========================================

function renderProjectOptions() {

    const selectedProject =
        projectInput.value || "General";


    projectInput.innerHTML = "";


    projects.forEach(function(project) {

        const option =
            document.createElement("option");

        option.value = project;

        option.textContent =
            `📁 ${project}`;

        projectInput.appendChild(option);

    });


    if (
        projects.includes(
            selectedProject
        )
    ) {

        projectInput.value =
            selectedProject;

    } else {

        projectInput.value =
            "General";

    }


    // EDIT PROJECT DROPDOWN

    if (editProjectInput) {

        const selectedEditProject =
            editProjectInput.value ||
            "General";


        editProjectInput.innerHTML = "";


        projects.forEach(function(project) {

            const option =
                document.createElement("option");

            option.value =
                project;

            option.textContent =
                `📁 ${project}`;

            editProjectInput.appendChild(
                option
            );

        });


        if (
            projects.includes(
                selectedEditProject
            )
        ) {

            editProjectInput.value =
                selectedEditProject;

        } else {

            editProjectInput.value =
                "General";

        }

    }

}


// ========================================
// OPEN PROJECT MODAL
// ========================================

function openProjectModal() {

    projectNameInput.value = "";

    projectModal.classList.add(
        "show"
    );

    setTimeout(function() {

        projectNameInput.focus();

    }, 100);

}


// ========================================
// CLOSE PROJECT MODAL
// ========================================

function closeProjectModal() {

    projectModal.classList.remove(
        "show"
    );

    projectNameInput.value = "";

}


// ========================================
// CREATE PROJECT
// ========================================

function createProject() {

    const projectName =
        projectNameInput.value.trim();


    if (
        !isValidProjectName(
            projectName
        )
    ) {

        alert(
            "Please enter a proper project name.\n\n" +
            "Example:\n" +
            "• Portfolio Website\n" +
            "• E-Commerce Website\n" +
            "• Task Management App"
        );

        projectNameInput.focus();

        return;

    }


    const exists =
        projects.some(function(project) {

            return (
                project.toLowerCase() ===
                projectName.toLowerCase()
            );

        });


    if (exists) {

        alert(
            "This project already exists."
        );

        projectNameInput.focus();

        return;

    }


    projects.push(
        projectName
    );


    saveProjects();

    renderProjectOptions();


    // Automatically select new project

    projectInput.value =
        projectName;


    closeProjectModal();


    alert(
        `Project "${projectName}" created successfully!`
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

    const tags =
        parseTags(
            tagsInput.value
        );

    const project =
        projectInput.value ||
        "General";


    // TASK VALIDATION

    if (
        !isValidTaskText(
            taskText
        )
    ) {

        alert(
            "Please enter a proper task or project name.\n\n" +
            "Example:\n" +
            "• Build portfolio website\n" +
            "• Complete JavaScript project\n" +
            "• Prepare Python API"
        );

        taskInput.focus();

        return;

    }


    // DATE EMPTY

    if (dueDate === "") {

        alert(
            "Please select a due date!"
        );

        dueDateInput.focus();

        return;

    }


    // DATE VALIDATION

    if (
        !isValidDueDate(
            dueDate
        )
    ) {

        alert(
            "Past dates are not allowed.\n" +
            "Please select today or a future date."
        );

        dueDateInput.value = "";

        dueDateInput.focus();

        return;

    }


    // CREATE TASK

    const newTask = {

        id:
            Date.now(),

        text:
            taskText,

        priority:
            priority,

        dueDate:
            dueDate,

        category:
            category,

        tags:
            tags,

        project:
            project,

        completed:
            false

    };


    tasks.push(
        newTask
    );


    saveTasks();


    // CLEAR

    taskInput.value = "";

    dueDateInput.value = "";

    tagsInput.value = "";


    renderTasks();

}


// ========================================
// PARSE TAGS
// ========================================

function parseTags(tagText) {

    if (
        !tagText.trim()
    ) {

        return [];

    }


    return tagText
        .split(",")
        .map(function(tag) {

            return tag.trim();

        })
        .filter(function(tag) {

            return tag !== "";

        })
        .slice(0, 5);

}


// ========================================
// TOGGLE TASK
// ========================================

function toggleTask(id) {

    tasks =
        tasks.map(function(task) {

            if (
                task.id === id
            ) {

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


    editingTaskId =
        id;


    renderProjectOptions();


    editProjectInput.value =
        task.project ||
        "General";


    editTaskInput.value =
        task.text;


    editPriorityInput.value =
        task.priority;


    editDueDateInput.value =
        task.dueDate || "";


    editCategoryInput.value =
        task.category ||
        "Other";


    editTagsInput.value =
        Array.isArray(task.tags)
            ? task.tags.join(", ")
            : "";


    editDueDateInput.min =
        getToday();


    editModal.classList.add(
        "show"
    );


    setTimeout(function() {

        editTaskInput.focus();

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


        if (
            editingTaskId === null
        ) {

            return;

        }


        const task =
            tasks.find(function(task) {

                return (
                    task.id ===
                    editingTaskId
                );

            });


        if (!task) {
            return;
        }


        const updatedProject =
            editProjectInput.value ||
            "General";

        const updatedText =
            editTaskInput.value.trim();

        const updatedPriority =
            editPriorityInput.value;

        const updatedDueDate =
            editDueDateInput.value;

        const updatedCategory =
            editCategoryInput.value;

        const updatedTags =
            parseTags(
                editTagsInput.value
            );


        if (
            !isValidTaskText(
                updatedText
            )
        ) {

            alert(
                "Please enter a proper task or project name."
            );

            editTaskInput.focus();

            return;

        }


        if (
            updatedDueDate === ""
        ) {

            alert(
                "Due date cannot be empty."
            );

            editDueDateInput.focus();

            return;

        }


        if (
            !isValidDueDate(
                updatedDueDate
            )
        ) {

            alert(
                "Past dates are not allowed.\n" +
                "Please select today or a future date."
            );

            editDueDateInput.focus();

            return;

        }


        // UPDATE

        task.project =
            updatedProject;

        task.text =
            updatedText;

        task.priority =
            updatedPriority;

        task.dueDate =
            updatedDueDate;

        task.category =
            updatedCategory;

        task.tags =
            updatedTags;


        saveTasks();

        closeEditModal();

        renderTasks();

    }
);


// ========================================
// CLOSE EDIT BUTTON
// ========================================

closeModalBtn.addEventListener(
    "click",
    closeEditModal
);


// ========================================
// CANCEL EDIT
// ========================================

cancelEditBtn.addEventListener(
    "click",
    closeEditModal
);


// ========================================
// CLICK OUTSIDE EDIT MODAL
// ========================================

editModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


// ========================================
// CLICK OUTSIDE PROJECT MODAL
// ========================================

projectModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            projectModal
        ) {

            closeProjectModal();

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
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            editingTaskId !== null
        ) {

            closeEditModal();

        }


        if (
            projectModal.classList.contains(
                "show"
            )
        ) {

            closeProjectModal();

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
// DUE DATE CLASS
// ========================================

function getDueDateClass(task) {

    if (
        task.completed
    ) {

        return "completed-date";

    }


    if (
        !task.dueDate
    ) {

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
// DUE DATE TEXT
// ========================================

function getDueDateText(task) {

    if (
        task.completed
    ) {

        return "Completed";

    }


    if (
        !task.dueDate
    ) {

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
// PRIORITY VALUE
// ========================================

function getPriorityValue(priority) {

    if (
        priority === "High"
    ) {

        return 3;

    }


    if (
        priority === "Medium"
    ) {

        return 2;

    }


    return 1;

}


// ========================================
// SORT TASKS
// ========================================

function sortTasks(taskArray) {

    const sorted =
        [...taskArray];

    const sortValue =
        sortInput.value;


    if (
        sortValue ===
        "newest"
    ) {

        sorted.sort(
            function(a, b) {

                return b.id - a.id;

            }
        );

    }


    else if (
        sortValue ===
        "oldest"
    ) {

        sorted.sort(
            function(a, b) {

                return a.id - b.id;

            }
        );

    }


    else if (
        sortValue ===
        "priorityHigh"
    ) {

        sorted.sort(
            function(a, b) {

                return (
                    getPriorityValue(
                        b.priority
                    ) -
                    getPriorityValue(
                        a.priority
                    )
                );

            }
        );

    }


    else if (
        sortValue ===
        "priorityLow"
    ) {

        sorted.sort(
            function(a, b) {

                return (
                    getPriorityValue(
                        a.priority
                    ) -
                    getPriorityValue(
                        b.priority
                    )
                );

            }
        );

    }


    else if (
        sortValue ===
        "dueSoon"
    ) {

        sorted.sort(
            function(a, b) {

                if (!a.dueDate) {
                    return 1;
                }

                if (!b.dueDate) {
                    return -1;
                }

                return a.dueDate.localeCompare(
                    b.dueDate
                );

            }
        );

    }


    else if (
        sortValue ===
        "dueLatest"
    ) {

        sorted.sort(
            function(a, b) {

                if (!a.dueDate) {
                    return 1;
                }

                if (!b.dueDate) {
                    return -1;
                }

                return b.dueDate.localeCompare(
                    a.dueDate
                );

            }
        );

    }


    return sorted;

}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";


    let filteredTasks =
        tasks.filter(
            function(task) {


                // FILTER

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

                    const text =
                        task.text.toLowerCase();

                    const category =
                        (
                            task.category ||
                            ""
                        ).toLowerCase();

                    const tags =
                        (
                            task.tags ||
                            []
                        )
                        .join(" ")
                        .toLowerCase();

                    const project =
                        (
                            task.project ||
                            ""
                        ).toLowerCase();

                    const search =
                        searchText.toLowerCase();


                    if (
                        !text.includes(search) &&
                        !category.includes(search) &&
                        !tags.includes(search) &&
                        !project.includes(search)
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    filteredTasks =
        sortTasks(
            filteredTasks
        );


    if (
        filteredTasks.length === 0
    ) {

        taskList.innerHTML = `
            <div class="empty-message">
                No tasks found.
            </div>
        `;

    }


    filteredTasks.forEach(
        function(task) {

            const taskItem =
                document.createElement(
                    "div"
                );


            taskItem.classList.add(
                "task-item"
            );


            if (
                task.completed
            ) {

                taskItem.classList.add(
                    "completed"
                );

            }


            const priorityClass =
                task.priority.toLowerCase();

            const dueDateClass =
                getDueDateClass(task);

            const dueDateText =
                getDueDateText(task);


            const tagsHTML =
                (task.tags || [])
                .map(
                    function(tag) {

                        return `
                            <span class="tag">
                                #${escapeHTML(tag)}
                            </span>
                        `;

                    }
                )
                .join("");


            taskItem.innerHTML = `

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed
                        ? "checked"
                        : ""}
                >


                <div class="task-content">

                    <div class="task-text">

                        ${escapeHTML(
                            task.text
                        )}

                    </div>


                    <div class="task-meta">


                        <span class="project">

                            📁
                            ${escapeHTML(
                                task.project ||
                                "General"
                            )}

                        </span>


                        <span
                            class="
                                priority
                                ${priorityClass}
                            "
                        >

                            ${escapeHTML(
                                task.priority
                            )}

                        </span>


                        <span
                            class="
                                due-date
                                ${dueDateClass}
                            "
                        >

                            📅
                            ${escapeHTML(
                                dueDateText
                            )}

                        </span>


                        <span class="category">

                            ${escapeHTML(
                                getCategoryDisplay(
                                    task.category
                                )
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


    updateStats();

    updateDashboard();

}


// ========================================
// CATEGORY DISPLAY
// ========================================

function getCategoryDisplay(
    category
) {

    if (
        category === "Study"
    ) {

        return "📚 Study";

    }


    if (
        category === "Work"
    ) {

        return "💼 Work";

    }


    if (
        category === "Personal"
    ) {

        return "👤 Personal";

    }


    if (
        category === "Health"
    ) {

        return "❤️ Health";

    }


    return "📌 Other";

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
        total === 1
            ? "1 task"
            : `${total} tasks`;

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


    let rate = 0;


    if (
        total > 0
    ) {

        rate =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );

    }


    completionRate.textContent =
        rate + "%";


    progressFill.style.width =
        rate + "%";


    progressText.textContent =
        `${completed} of ${total} tasks completed`;


    renderUpcomingDeadlines();

    renderHighPriorityTasks();

}


// ========================================
// UPCOMING DEADLINES
// ========================================

function renderUpcomingDeadlines() {

    const today =
        getToday();


    const upcoming =
        tasks
        .filter(
            function(task) {

                return (
                    !task.completed &&
                    task.dueDate &&
                    task.dueDate >= today
                );

            }
        )
        .sort(
            function(a, b) {

                return a.dueDate.localeCompare(
                    b.dueDate
                );

            }
        )
        .slice(0, 3);


    if (
        upcoming.length === 0
    ) {

        upcomingDeadlines.innerHTML = `
            <div class="dashboard-empty">
                No upcoming deadlines
            </div>
        `;

        return;

    }


    upcomingDeadlines.innerHTML =
        upcoming
        .map(
            function(task) {

                return `

                    <div class="dashboard-task">

                        <span
                            class="
                                dashboard-task-title
                            "
                        >

                            ${escapeHTML(
                                task.text
                            )}

                        </span>


                        <span
                            class="
                                dashboard-task-date
                            "
                        >

                            ${escapeHTML(
                                formatDate(
                                    task.dueDate
                                )
                            )}

                        </span>

                    </div>

                `;

            }
        )
        .join("");

}


// ========================================
// HIGH PRIORITY
// ========================================

function renderHighPriorityTasks() {

    const highTasks =
        tasks
        .filter(
            function(task) {

                return (
                    !task.completed &&
                    task.priority === "High"
                );

            }
        )
        .sort(
            function(a, b) {

                if (!a.dueDate) {
                    return 1;
                }

                if (!b.dueDate) {
                    return -1;
                }

                return a.dueDate.localeCompare(
                    b.dueDate
                );

            }
        )
        .slice(0, 3);


    if (
        highTasks.length === 0
    ) {

        highPriorityTasks.innerHTML = `
            <div class="dashboard-empty">
                No high priority tasks
            </div>
        `;

        return;

    }


    highPriorityTasks.innerHTML =
        highTasks
        .map(
            function(task) {

                return `

                    <div class="dashboard-task">

                        <span
                            class="
                                dashboard-task-title
                            "
                        >

                            ${escapeHTML(
                                task.text
                            )}

                        </span>


                        <span
                            class="
                                dashboard-priority
                                high
                            "
                        >
                            HIGH
                        </span>

                    </div>

                `;

            }
        )
        .join("");

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
// ADD TASK BUTTON
// ========================================

addTaskBtn.addEventListener(
    "click",
    addTask
);


// ========================================
// ENTER = ADD TASK
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
// PROJECT BUTTON
// ========================================

newProjectBtn.addEventListener(
    "click",
    openProjectModal
);


// ========================================
// PROJECT FORM
// ========================================

projectForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        createProject();

    }
);


// ========================================
// PROJECT CANCEL
// ========================================

cancelProjectBtn.addEventListener(
    "click",
    closeProjectModal
);


// ========================================
// PROJECT CLOSE
// ========================================

closeProjectModalBtn.addEventListener(
    "click",
    closeProjectModal
);


// ========================================
// ENTER = CREATE PROJECT
// ========================================

projectNameInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            createProject();

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
        String(text);


    return div.innerHTML;

}


// ========================================
// NOTIFICATION SYSTEM
// ========================================

function updateNotificationStatus() {

    if (!notificationBtn ||
        !notificationStatus) {

        return;

    }


    if (
        !("Notification" in window)
    ) {

        notificationStatus.textContent =
            "Notifications are not supported";

        notificationBtn.disabled =
            true;

        return;

    }


    if (
        Notification.permission ===
        "granted"
    ) {

        notificationStatus.textContent =
            "Notifications are enabled";

        notificationBtn.textContent =
            "Notifications Enabled";

        return;

    }


    if (
        Notification.permission ===
        "denied"
    ) {

        notificationStatus.textContent =
            "Notifications are blocked in browser";

        notificationBtn.textContent =
            "Notifications Blocked";

        return;

    }


    notificationStatus.textContent =
        "Notifications are disabled";

    notificationBtn.textContent =
        "Enable Notifications";

}


async function enableNotifications() {

    if (
        !("Notification" in window)
    ) {

        alert(
            "Your browser does not support notifications."
        );

        return;

    }


    const permission =
        await Notification.requestPermission();


    updateNotificationStatus();


    if (
        permission === "granted"
    ) {

        new Notification(
            "TaskFlow",
            {
                body:
                    "Task reminders are now enabled!"
            }
        );

    }

}


if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        enableNotifications
    );

}


// ========================================
// TASK REMINDERS
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


    tasks.forEach(
        function(task) {

            if (
                task.completed ||
                !task.dueDate
            ) {

                return;

            }


            if (
                task.dueDate === today
            ) {

                const reminderKey =
                    `taskflowReminder_${task.id}_${today}`;


                if (
                    localStorage.getItem(
                        reminderKey
                    )
                ) {

                    return;

                }


                new Notification(
                    "TaskFlow Reminder",
                    {
                        body:
                            `${task.text} is due today.`
                    }
                );


                localStorage.setItem(
                    reminderKey,
                    "true"
                );

            }

        }
    );

}


setInterval(
    checkTaskReminders,
    60000
);


// ========================================
// INITIAL LOAD
// ========================================

setMinimumDates();

renderProjectOptions();

saveProjects();

saveTasks();

renderTasks();

updateNotificationStatus();

checkTaskReminders();