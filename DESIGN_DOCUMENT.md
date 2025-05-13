# Personal Growth Website - Design Document

## 1. Overall Architecture

*   **Framework**: React (using `create_react_app` template with Tailwind CSS, shadcn/ui, Lucide icons, Recharts)
*   **Data Storage**: Browser LocalStorage. All data will be namespaced by `userId` to support multiple users on the same browser.
*   **Styling**: Fresh and clean aesthetic, card-based layout for content display.

## 2. Core Components and Structure

*   `App.js`: Main application component, handles routing and global layout.
*   `components/`:
    *   `Auth/`: Components for Login, Registration.
    *   `Layout/`: Components like Navbar, Sidebar, Card.
    *   `Insights/`: Components for displaying, creating, editing insights. (Rich Text Editor integration)
    *   `Health/`: Components for calendar, daily log entry, charts.
    *   `Bookmarks/`: Components for displaying, adding, filtering bookmarks.
    *   `Goals/`: Components for goal setting and tracking.
    *   `Todos/`: Components for todo list management.
*   `contexts/` or `hooks/`: For managing global state like authenticated user, and potentially for managing data operations with LocalStorage.
*   `utils/`: Helper functions, e.g., for LocalStorage interaction, date formatting.
*   `pages/`: Top-level components for each main section, e.g., `DashboardPage`, `InsightsPage`, `HealthPage`, etc.

## 3. User Authentication

*   **Workflow**:
    1.  User registers with username and password.
    2.  User profile (username, hashed password - though client-side hashing has limitations and is mainly for obfuscation here) stored in LocalStorage.
    3.  User logs in with username and password.
    4.  On successful login, `userId` (can be the username or a generated UUID) is stored in LocalStorage/sessionStorage to indicate active session.
    5.  All subsequent data operations will use the active `userId` to read/write namespaced data.
*   **LocalStorage Structure (Example)**:
    *   `users`: `[{userId: "user1_uuid", username: "user1", hashedPassword: "xxx"}, {userId: "user2_uuid", username: "user2", hashedPassword: "yyy"}]`
    *   `currentUserId`: `"user1_uuid"`
    *   `insights_user1_uuid`: `[{id: "insight1", title: "...", content: "..."}, ...]`
    *   `health_user1_uuid`: `[{date: "2025-05-13", exercises: [...], diet: [...]}, ...]`
    *   And so on for other modules for `user1_uuid`. Similar structure for `user2_uuid`.

## 4. Feature Modules Design

### 4.1. Personal Insights (个人感悟记录)

*   **UI**:
    *   List view: Cards displaying insight title and snippet.
    *   Editor: Rich text editor (e.g., ReactQuill or a component from shadcn/ui if available, or build a simple one). Buttons for "Save", "Cancel", "Upload Local File" (for importing text content).
*   **Data**: `insight { id, userId, title, contentHtml, createdAt, updatedAt }`
*   **Functionality**: CRUD operations. File upload will parse text content into the editor.

### 4.2. Health Tracking (健康打卡)

*   **UI**:
    *   Calendar: (e.g., using a library compatible with React like `react-calendar` or a shadcn/ui calendar component). Highlight dates with entries. Click to view/edit.
    *   Daily Log Form: Inputs for exercise (name, duration), diet (name, calories).
    *   Charts: Bar chart for exercise frequency, line chart for calorie intake over time. (Using Recharts).
*   **Data**: `dailyLog { id, userId, date, exercises: [{name: String, duration: String}], dietItems: [{name: String, calories: Number}], totalCalories: Number }`
*   **Functionality**: Add/edit daily logs. Auto-calculate total calories. Generate charts.

### 4.3. Bookmarks (收藏空间)

*   **UI**:
    *   Grid/List of bookmark cards (title, URL, notes snippet, tags).
    *   Add/Edit Form: Fields for URL, title, notes, tags (input allowing multiple tags, possibly with suggestions or a multi-select component).
    *   Filter: By tags.
*   **Data**: `bookmark { id, userId, url, title, notes, tags: [String], createdAt }`
*   **Functionality**: CRUD operations. Tag-based filtering.

### 4.4. Goal Setting (目标设定)

*   **UI**:
    *   List of goal cards (description, target date, progress bar).
    *   Add/Edit Form: Fields for description, target date.
    *   Progress Update: Slider or input field for progress percentage.
*   **Data**: `goal { id, userId, description, targetDate, status: String, progressPercent: Number, createdAt, updatedAt }` (status could be 'To Do', 'In Progress', 'Completed')
*   **Functionality**: CRUD operations. Update progress and status.

### 4.5. Todo List (待办事项)

*   **UI**:
    *   List of tasks with checkboxes.
    *   Input field to add new tasks.
*   **Data**: `todo { id, userId, description, isCompleted: Boolean, createdAt }`
*   **Functionality**: Add, complete/uncomplete, delete tasks.

## 5. Styling and Layout

*   **Theme**: Light, fresh colors (as requested by user).
*   **Layout**:
    *   Main navigation (e.g., a responsive sidebar or top navigation bar).
    *   Content area displaying modules primarily using card-based elements.
    *   Responsive design for desktop, tablet, and mobile.

## 6. Next Steps (Implementation Outline)

1.  Set up project structure (folders, basic components as outlined above).
2.  Implement User Authentication (LocalStorage based - registration, login, logout, session management).
3.  Develop the main layout (Navbar/Sidebar) and routing.
4.  Implement each feature module one by one, including UI components and LocalStorage data handling:
    *   Personal Insights (with Rich Text Editor)
    *   Health Tracking (with Calendar and Charts)
    *   Bookmarks (with Tagging)
    *   Goal Setting
    *   Todo List
5.  Refine styling across all components to ensure a cohesive "fresh, card-style" look and feel.
6.  Thorough testing of all functionalities, including multi-user data isolation.

