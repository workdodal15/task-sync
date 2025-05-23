# Task Sync Hub

Task Sync Hub is a modern, collaborative task management application designed to streamline workflow and enhance team productivity. Built with React, TypeScript, and Vite, it features a clean UI using Shadcn/ui and Tailwind CSS.



## Features

*   **User Authentication:** Secure registration and login using mock authentication (easily adaptable for backend integration).
*   **Profile Management:** View user profile details (name, email, avatar).
*   **Task Viewing:** Display tasks fetched asynchronously using React Query (demonstrated with mock data).
*   **Responsive Design:** Components styled with Tailwind CSS and Shadcn/ui for adaptability.
*   **Robust Tooling:** Built with Vite, TypeScript, ESLint, and Prettier for a great developer experience.
*   **Testing:** Unit tests for critical services (Auth, Tasks) using Jest and React Testing Library.
*   **Containerization:** Docker setup for easy deployment and consistent environments.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **UI:** Tailwind CSS, Shadcn/ui, Lucide Icons
*   **Routing:** React Router DOM
*   **State Management / Caching:** React Query (`@tanstack/react-query`)
*   **Forms:** React Hook Form, Zod (for validation)
*   **Testing:** Jest, React Testing Library, ts-jest
*   **Linting/Formatting:** ESLint, Prettier

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (usually comes with Node.js)
*   Docker (for containerized deployment)

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/task-synctask-sync.git # Replace with your repo URL
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:8080` (or the port specified in `vite.config.ts`).

### Running Tests

To run the unit tests:

```bash
npm test
```

### Building for Production

To create a production build in the `dist` folder:

```bash
npm run build
```

### Docker Deployment

1.  **Build the Docker image:**
    ```bash
    docker build -t task-sync-hub .
    ```
2.  **Run the Docker container:**
    ```bash
    docker run -p 8080:80 task-sync-hub
    ```
    This maps port 80 inside the container (where Nginx runs) to port 8080 on your host machine. Access the application at `http://localhost:8080`.

#   t a s k - s y n c 
 
 