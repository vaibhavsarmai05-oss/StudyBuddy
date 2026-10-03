document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       AI BACKEND
    ========================================= */

    const AI_API_URL = "http://127.0.0.1:8000";


    /* =========================================
       TASK MANAGEMENT
    ========================================= */

    const taskInput = document.getElementById("taskInput");
    const priorityInput = document.getElementById("priorityInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    const completedTasks = document.getElementById("completedTasks");
    const totalTasks = document.getElementById("totalTasks");
    const progressPercentage = document.getElementById("progressPercentage");
    const visibleTaskCount = document.getElementById("visibleTaskCount");

    const filterButtons = document.querySelectorAll(".filter-btn");

    let tasks = JSON.parse(
        localStorage.getItem("studyBuddyTasks")
    ) || [];

    let currentFilter = "all";


    /* =========================================
       NORMALIZE OLD TASK DATA
    ========================================= */

    tasks = tasks.map(task => ({
        id: task.id || Date.now() + Math.random(),
        text: task.text || "",
        completed: Boolean(task.completed),
        priority: ["high", "medium", "low"].includes(task.priority)
            ? task.priority
            : "medium"
    }));


    /* =========================================
       SAVE TASKS
    ========================================= */

    function saveTasks() {
        localStorage.setItem(
            "studyBuddyTasks",
            JSON.stringify(tasks)
        );
    }


    /* =========================================
       RENDER TASKS
    ========================================= */

    function renderTasks() {

        taskList.innerHTML = "";

        let filteredTasks = tasks;

        if (currentFilter === "active") {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        if (currentFilter === "completed") {
            filteredTasks = tasks.filter(task => task.completed);
        }

        if (currentFilter === "high") {
            filteredTasks = tasks.filter(
                task => task.priority === "high"
            );
        }


        if (filteredTasks.length === 0) {

            const emptyMessage = document.createElement("li");

            emptyMessage.className = "empty-state";

            emptyMessage.textContent =
                tasks.length === 0
                    ? "No study tasks yet. Add your first task above!"
                    : "No tasks match this filter.";

            taskList.appendChild(emptyMessage);

        } else {

            filteredTasks.forEach(task => {

                const li = document.createElement("li");

                li.className = "task-item";

                if (task.completed) {
                    li.classList.add("completed");
                }


                /* Checkbox */

                const checkbox = document.createElement("input");

                checkbox.type = "checkbox";

                checkbox.className = "task-checkbox";

                checkbox.checked = task.completed;

                checkbox.setAttribute(
                    "aria-label",
                    "Mark task as completed"
                );


                checkbox.addEventListener("change", () => {

                    task.completed = checkbox.checked;

                    saveTasks();

                    renderTasks();

                });


                /* Content */

                const content = document.createElement("div");

                content.className = "task-content";


                const text = document.createElement("div");

                text.className = "task-text";

                text.textContent = task.text;


                const priority = document.createElement("span");

                priority.className = "priority-badge";

                priority.classList.add(
                    `priority-${task.priority}`
                );


                const priorityNames = {
                    high: "High Priority",
                    medium: "Medium Priority",
                    low: "Low Priority"
                };

                priority.textContent =
                    priorityNames[task.priority];


                content.appendChild(text);

                content.appendChild(priority);


                /* Delete button */

                const deleteButton =
                    document.createElement("button");

                deleteButton.className = "delete-task";

                deleteButton.textContent = "🗑️";

                deleteButton.setAttribute(
                    "aria-label",
                    "Delete task"
                );


                deleteButton.addEventListener("click", () => {

                    tasks = tasks.filter(
                        item => item.id !== task.id
                    );

                    saveTasks();

                    renderTasks();

                });


                li.appendChild(checkbox);

                li.appendChild(content);

                li.appendChild(deleteButton);

                taskList.appendChild(li);

            });

        }


        updateProgress();

        updateVisibleTaskCount(filteredTasks.length);

    }


    /* =========================================
       ADD TASK
    ========================================= */

    function addTask() {

        const text = taskInput.value.trim();

        if (!text) {
            taskInput.focus();
            return;
        }


        const newTask = {

            id: Date.now(),

            text: text,

            completed: false,

            priority: priorityInput.value

        };


        tasks.push(newTask);

        saveTasks();

        taskInput.value = "";

        priorityInput.value = "medium";

        renderTasks();

        taskInput.focus();

    }


    addTaskBtn.addEventListener(
        "click",
        addTask
    );


    taskInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                addTask();
            }

        }
    );


    /* =========================================
       FILTERS
    ========================================= */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            renderTasks();

        });

    });


    /* =========================================
       PROGRESS
    ========================================= */

    function updateProgress() {

        const total = tasks.length;

        const completed =
            tasks.filter(
                task => task.completed
            ).length;


        completedTasks.textContent = completed;

        totalTasks.textContent = total;


        const percentage =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );


        progressPercentage.textContent =
            `${percentage}%`;


        const degrees =
            (percentage / 100) * 360;


        document.querySelector(
            ".progress-circle"
        ).style.background =
            `conic-gradient(
                white ${degrees}deg,
                rgba(255, 255, 255, 0.2) ${degrees}deg
            )`;

    }


    /* =========================================
       VISIBLE TASK COUNT
    ========================================= */

    function updateVisibleTaskCount(count) {

        visibleTaskCount.textContent =
            `${count} ${count === 1 ? "task" : "tasks"}`;

    }


    /* =========================================
       FOCUS TIMER
    ========================================= */

    const timerDisplay =
        document.getElementById("timer");

    const startTimerBtn =
        document.getElementById("startTimerBtn");

    const resetTimerBtn =
        document.getElementById("resetTimerBtn");


    const DEFAULT_TIME = 25 * 60;

    let timeLeft = DEFAULT_TIME;

    let timerInterval = null;


    function updateTimerDisplay() {

        const minutes =
            Math.floor(timeLeft / 60);

        const seconds =
            timeLeft % 60;


        timerDisplay.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    }


    function startTimer() {

        if (timerInterval !== null) {
            return;
        }


        startTimerBtn.textContent = "Pause";


        timerInterval =
            setInterval(() => {

                if (timeLeft > 0) {

                    timeLeft--;

                    updateTimerDisplay();

                } else {

                    clearInterval(timerInterval);

                    timerInterval = null;

                    startTimerBtn.textContent =
                        "Start";

                    alert(
                        "🎉 Focus session complete! Take a short break."
                    );

                }

            }, 1000);

    }


    function pauseTimer() {

        clearInterval(timerInterval);

        timerInterval = null;

        startTimerBtn.textContent =
            "Start";

    }


    startTimerBtn.addEventListener(
        "click",
        () => {

            if (timerInterval === null) {
                startTimer();
            } else {
                pauseTimer();
            }

        }
    );


    resetTimerBtn.addEventListener(
        "click",
        () => {

            pauseTimer();

            timeLeft = DEFAULT_TIME;

            updateTimerDisplay();

        }
    );


    /* =========================================
       NOTES
    ========================================= */

    const notes =
        document.getElementById("notes");

    const saveNotesBtn =
        document.getElementById("saveNotesBtn");

    const notesStatus =
        document.getElementById("notesStatus");


    const savedNotes =
        localStorage.getItem(
            "studyBuddyNotes"
        );


    if (savedNotes !== null) {
        notes.value = savedNotes;
    }


    saveNotesBtn.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "studyBuddyNotes",
                notes.value
            );


            notesStatus.textContent =
                "✓ Notes saved locally.";


            setTimeout(() => {

                notesStatus.textContent =
                    "Your notes are saved locally.";

            }, 2000);

        }
    );


    /* =========================================
       DARK MODE
    ========================================= */

    const themeToggle =
        document.getElementById("themeToggle");


    const savedTheme =
        localStorage.getItem(
            "studyBuddyTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent = "☀️";

    }


    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            localStorage.setItem(
                "studyBuddyTheme",
                isDark ? "dark" : "light"
            );


            themeToggle.textContent =
                isDark ? "☀️" : "🌙";

        }
    );


    /* =========================================
       AI STUDY PLANNER
    ========================================= */

    const aiGoal =
        document.getElementById("aiGoal");

    const aiDeadline =
        document.getElementById("aiDeadline");

    const generatePlanBtn =
        document.getElementById(
            "generatePlanBtn"
        );

    const aiStatus =
        document.getElementById("aiStatus");

    const aiResult =
        document.getElementById("aiResult");

    const aiPlan =
        document.getElementById("aiPlan");


    async function generateStudyPlan() {

        const goal =
            aiGoal.value.trim();

        const deadline =
            aiDeadline.value.trim();


        /* Validate input */

        if (!goal) {

            aiStatus.textContent =
                "Please enter what you need to study.";

            aiGoal.focus();

            return;

        }


        if (!deadline) {

            aiStatus.textContent =
                "Please enter your deadline.";

            aiDeadline.focus();

            return;

        }


        /* Loading state */

        generatePlanBtn.disabled = true;

        generatePlanBtn.textContent =
            "⏳ Creating your plan...";


        aiStatus.textContent =
            "StudyBuddy AI is creating your study plan...";


        aiResult.hidden = true;

        aiPlan.textContent = "";


        try {

            const response =
                await fetch(
                    `${AI_API_URL}/generate-plan`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            goal: goal,
                            deadline: deadline
                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            if (!data.plan) {

                throw new Error(
                    "No study plan was returned."
                );

            }


            /* Display AI result */

            aiPlan.textContent =
                data.plan;

            aiResult.hidden = false;

            aiStatus.textContent =
                "✓ Your study plan is ready!";


        } catch (error) {

            console.error(
                "AI planner error:",
                error
            );


            aiStatus.textContent =
                "⚠️ Could not connect to the AI backend. Make sure your FastAPI server is running.";

            aiResult.hidden = true;

        } finally {

            generatePlanBtn.disabled =
                false;

            generatePlanBtn.textContent =
                "✨ Generate Study Plan";

        }

    }


    generatePlanBtn.addEventListener(
        "click",
        generateStudyPlan
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    updateTimerDisplay();

    renderTasks();

});