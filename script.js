document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       ELEMENTS
       ========================================== */

    const taskInput = document.getElementById("taskInput");
    const priorityInput = document.getElementById("priorityInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    const completedTasks = document.getElementById("completedTasks");
    const totalTasks = document.getElementById("totalTasks");
    const progressPercentage =
        document.getElementById("progressPercentage");

    const progressCircle =
        document.querySelector(".progress-circle");

    const visibleTaskCount =
        document.getElementById("visibleTaskCount");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const timerDisplay =
        document.getElementById("timer");

    const startTimerBtn =
        document.getElementById("startTimerBtn");

    const resetTimerBtn =
        document.getElementById("resetTimerBtn");

    const notes =
        document.getElementById("notes");

    const saveNotesBtn =
        document.getElementById("saveNotesBtn");

    const notesStatus =
        document.getElementById("notesStatus");

    const themeToggle =
        document.getElementById("themeToggle");


    /* ==========================================
       TASK STORAGE
       ========================================== */

    let tasks =
        JSON.parse(
            localStorage.getItem("studyBuddyTasks")
        ) || [];


    let currentFilter = "all";


    /*
       Give older tasks a default priority.
    */

    tasks = tasks.map(function (task) {

        if (
            task.priority !== "high" &&
            task.priority !== "medium" &&
            task.priority !== "low"
        ) {
            task.priority = "medium";
        }

        return task;

    });


    saveTasks();


    function saveTasks() {

        localStorage.setItem(
            "studyBuddyTasks",
            JSON.stringify(tasks)
        );

    }


    /* ==========================================
       DISPLAY TASKS
       ========================================== */

    function displayTasks() {

        taskList.innerHTML = "";


        let filteredTasks = tasks.filter(
            function (task) {

                if (currentFilter === "active") {
                    return !task.completed;
                }

                if (currentFilter === "completed") {
                    return task.completed;
                }

                if (currentFilter === "high") {
                    return task.priority === "high";
                }

                return true;

            }
        );


        /* Visible task count */

        visibleTaskCount.textContent =
            filteredTasks.length +
            (filteredTasks.length === 1
                ? " task"
                : " tasks");


        /* Empty state */

        if (filteredTasks.length === 0) {

            const emptyState =
                document.createElement("li");

            emptyState.classList.add(
                "empty-state"
            );


            const message =
                document.createElement("div");

            message.innerHTML =
                '<div class="empty-state-icon">📚</div>' +
                '<div>No tasks here yet.</div>';


            emptyState.appendChild(message);

            taskList.appendChild(emptyState);

            updateProgress();

            return;
        }


        /* Create each task */

        filteredTasks.forEach(
            function (task) {

                const li =
                    document.createElement("li");


                /* Checkbox */

                const checkbox =
                    document.createElement("input");

                checkbox.type = "checkbox";

                checkbox.checked =
                    task.completed;


                /* Task text */

                const span =
                    document.createElement("span");

                span.textContent =
                    task.text;

                span.classList.add(
                    "task-text"
                );


                if (task.completed) {

                    span.classList.add(
                        "completed"
                    );

                }


                /* Priority */

                const priorityBadge =
                    document.createElement("span");

                priorityBadge.classList.add(
                    "priority-badge",
                    task.priority
                );


                if (task.priority === "high") {

                    priorityBadge.textContent =
                        "🔴 High";

                } else if (
                    task.priority === "medium"
                ) {

                    priorityBadge.textContent =
                        "🟡 Medium";

                } else {

                    priorityBadge.textContent =
                        "🟢 Low";

                }


                /* Delete */

                const deleteButton =
                    document.createElement("button");

                deleteButton.textContent =
                    "Delete";

                deleteButton.classList.add(
                    "delete-btn"
                );


                /* Complete */

                checkbox.addEventListener(
                    "change",
                    function () {

                        task.completed =
                            checkbox.checked;

                        saveTasks();

                        displayTasks();

                    }
                );


                /* Delete */

                deleteButton.addEventListener(
                    "click",
                    function () {

                        tasks =
                            tasks.filter(
                                function (item) {
                                    return item !== task;
                                }
                            );

                        saveTasks();

                        displayTasks();

                    }
                );


                li.appendChild(checkbox);

                li.appendChild(span);

                li.appendChild(priorityBadge);

                li.appendChild(deleteButton);

                taskList.appendChild(li);

            }
        );


        updateProgress();

    }


    /* ==========================================
       ADD TASK
       ========================================== */

    function addTask() {

        const text =
            taskInput.value.trim();


        if (text === "") {

            taskInput.focus();

            return;
        }


        const newTask = {

            text: text,

            completed: false,

            priority: priorityInput.value

        };


        tasks.push(newTask);

        saveTasks();


        taskInput.value = "";


        /*
           Return to All after adding.
        */

        currentFilter = "all";


        filterButtons.forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        const allButton =
            document.querySelector(
                '[data-filter="all"]'
            );


        if (allButton) {

            allButton.classList.add(
                "active"
            );

        }


        displayTasks();

        taskInput.focus();

    }


    addTaskBtn.addEventListener(
        "click",
        addTask
    );


    /* Enter key */

    taskInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                addTask();

            }

        }
    );


    /* ==========================================
       FILTERS
       ========================================== */

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    currentFilter =
                        button.dataset.filter;


                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    displayTasks();

                }
            );

        }
    );


    /* ==========================================
       PROGRESS
       ========================================== */

    function updateProgress() {

        const total =
            tasks.length;


        const completed =
            tasks.filter(
                function (task) {
                    return task.completed;
                }
            ).length;


        completedTasks.textContent =
            completed;

        totalTasks.textContent =
            total;


        let percentage = 0;


        if (total > 0) {

            percentage =
                Math.round(
                    (completed / total) * 100
                );

        }


        progressPercentage.textContent =
            percentage + "%";


        const degrees =
            percentage * 3.6;


        progressCircle.style.background =
            `conic-gradient(
                var(--primary) ${degrees}deg,
                var(--border) ${degrees}deg
            )`;

    }


    /* ==========================================
       FOCUS TIMER
       ========================================== */

    let timeLeft =
        25 * 60;

    let timerInterval =
        null;


    function updateTimerDisplay() {

        const minutes =
            Math.floor(timeLeft / 60);

        const seconds =
            timeLeft % 60;


        timerDisplay.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

    }


    startTimerBtn.addEventListener(
        "click",
        function () {

            if (timerInterval === null) {

                timerInterval =
                    setInterval(
                        function () {

                            if (timeLeft > 0) {

                                timeLeft--;

                                updateTimerDisplay();

                            } else {

                                clearInterval(
                                    timerInterval
                                );

                                timerInterval = null;

                                startTimerBtn.textContent =
                                    "Start";

                                alert(
                                    "🎉 Focus session complete!"
                                );

                            }

                        },
                        1000
                    );


                startTimerBtn.textContent =
                    "Pause";

            } else {

                clearInterval(
                    timerInterval
                );

                timerInterval = null;

                startTimerBtn.textContent =
                    "Start";

            }

        }
    );


    /* Reset */

    resetTimerBtn.addEventListener(
        "click",
        function () {

            clearInterval(
                timerInterval
            );

            timerInterval = null;

            timeLeft =
                25 * 60;

            updateTimerDisplay();

            startTimerBtn.textContent =
                "Start";

        }
    );


    /* ==========================================
       NOTES
       ========================================== */

    const savedNotes =
        localStorage.getItem(
            "studyBuddyNotes"
        );


    if (savedNotes !== null) {

        notes.value =
            savedNotes;

    }


    saveNotesBtn.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "studyBuddyNotes",
                notes.value
            );


            notesStatus.textContent =
                "✓ Notes saved locally";


            setTimeout(
                function () {

                    notesStatus.textContent =
                        "Your notes are saved locally.";

                },
                2000
            );

        }
    );


    /* ==========================================
       DARK MODE
       ========================================== */

    const savedTheme =
        localStorage.getItem(
            "studyBuddyTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeToggle.textContent =
            "☀️";

    }


    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            themeToggle.textContent =
                isDark ? "☀️" : "🌙";


            localStorage.setItem(
                "studyBuddyTheme",
                isDark ? "dark" : "light"
            );

        }
    );


    /* ==========================================
       INITIALIZE
       ========================================== */

    updateTimerDisplay();

    displayTasks();

});