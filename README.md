# Rails 8 + Vite + Tailwind 4 Project Template

**Rails 8 Template** — This is a starter template for modern web applications using Ruby on Rails 8, leveraging Vite for frontend bundling, Tailwind CSS for styling, and Hotwired (Turbo/Stimulus) for interactivity.

## Purpose

-   Quick start for development on Ruby on Rails 8 with a configured modern frontend stack.
-   A foundation for building web applications with convenient frontend asset management via Vite.
-   Integration with PostgreSQL as the primary database.
-   A ready-made structure for adding background jobs, logging, and other standard Rails application components.
-   All logic and infrastructure are implemented in Ruby on Rails using modern frontend tools.

## Core Features (Starter)

-   Modern frontend stack (Vite, Tailwind CSS, Stimulus, Turbo).
-   Web interface using UI components and templates (examples can be added).
-   Example page for testing frontend technologies.
-   Support for background jobs via ActiveJob (Solid Queue).
-   Basic structure for models, services, controllers.
-   Flexible architecture to extend for your specific tasks.

## Technologies & Stack

-   Ruby on Rails 8, PostgreSQL (primary database)
-   ActiveJob (Solid Queue), Rake tasks
-   Vite, Tailwind CSS, Stimulus, Turbo (frontend via npm)
-   SQLite (for Solid Queue, Solid Cable, Solid Cache by default)
-   Documentation and change tracking (e.g., `doc/changelog.md`)

## Architecture & Structure (Example)

-   Models: (Your application models)
-   Services: (Your application services)
-   ActiveJob: (Your background jobs)
-   Controllers: (Your UI and API controllers)
-   Frontend assets (app/frontend)
-   Rake tasks (lib/tasks)
-   `doc/` — documentation

---

## Test Step: Comprehensive Frontend Stack Check (Turbo, Hotwired, Stimulus, Tailwind, Vite, static assets)

-   The test page at `/test_frontend` demonstrates:
    -   Turbo Frame (content replacement without a full page reload).
    -   Stimulus controller (button with an action).
    -   Tailwind CSS for styling.
    -   Importing images and static assets via Vite (`app/frontend/assets/`).
-   Implemented using Slim.
-   Verification is done through the UI and browser dev tools (inspecting `data-controller`, `data-action`).

## Technology Stack (Rails Way)

**Frontend:**
-   Vite (`vite_rails`) — Modern JS bundler for Rails 8.
-   Tailwind CSS 4 (or latest) — via npm and Vite.
-   PostCSS, Autoprefixer — via npm.
-   Hotwired (Turbo, Stimulus) — via npm and `vite_rails`.
-   Slim (`slim-rails`) — for all views.

**Backend:**
-   Ruby on Rails 8
-   PostgreSQL (primary database)
-   SQLite (Solid Queue, Solid Cable, Solid Cache)
-   Other Rails-way gems (see Gemfile).

---

## Transition to Modern Frontend (Vite, Turbo, Stimulus, Tailwind, Slim)

-   Uses `vite_rails` for modern asset management.
-   Includes `turbo-rails`, `@hotwired/stimulus`, `tailwindcss`, `slim-rails`.
-   All new views are recommended to be written in Slim.

---

## Quick Start / Getting Started

-   Ensure you have Ruby, Rails, Node.js, npm (or Yarn), and PostgreSQL installed.
-   Clone the repository.
-   Install dependencies:
    ```sh
    bundle install
    npm install
    ```
-   Configure `config/database.yml` to connect to your primary PostgreSQL database.
-   Create the databases:
    ```sh
    rails db:create
    ```
-   Run migrations (if any):
    ```sh
    rails db:migrate
    ```
-   Start the development server (including Vite):
    ```sh
    bin/dev 
    ```
    (Or, for debugging, see the debugging section below.)


### SQLite Usage (for Solid Components)

By default, `database.yml` is configured to use SQLite for Solid Queue, Solid Cable, and Solid Cache. The database files will be created in the `db/` directory. `rails db:create` should handle this if these components are set up to use SQLite.

---

## Debugging with VS Code / Cursor (Using `bin/debug.sh`)

This project is set up for easy debugging in VS Code (and compatible editors like Cursor) using a pre-configured launch task that utilizes the `bin/debug.sh` script. This script is designed to start your Rails server and Vite dev server with the Ruby debugger attached.

### Prerequisites

1.  **Ruby Extension:** Ensure you have a Ruby extension installed in VS Code/Cursor. Extensions like "Ruby LSP" (by Shopify) or "Ruby" (by Peng Lv) are recommended as they often provide debugger integration.
2.  **`debug` Gem:** The `debug` gem should be in your `Gemfile` (it usually is by default in new Rails projects) and installed via `bundle install`.
3.  **`launch.json` Configuration:** The project should include a `.vscode/launch.json` file with a configuration similar to this:

    ```json
    {
      "version": "0.2.0",
      "configurations": [
        // ... other configurations might be present ...
        {
          "type": "node-terminal", // Uses the integrated terminal
          "name": "▶ Rails+Vite+Debug (all in one)", // The display name in the debug menu
          "request": "launch",
          "command": "${workspaceRoot}/bin/debug.sh", // Command to execute
          "cwd": "${workspaceRoot}", // Working directory
          "env": {
            "RAILS_ENV": "development" // Ensures development environment
          }
        }
        // ... other configurations might be present ...
      ]
    }
    ```
    If this file or specific configuration is missing, you can create/update `.vscode/launch.json` with the content above. The `${workspaceRoot}` variable will automatically resolve to your project's root directory.

### Running the Debugger

1.  **Open the "Run and Debug" view** in VS Code/Cursor.
    *   You can find this by clicking the icon that looks like a play button with a bug on the Activity Bar (the far left sidebar).
    *   Alternatively, use the shortcut `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac).

2.  **Select the "▶ Rails+Vite+Debug (all in one)" configuration** from the dropdown menu at the top of the "Run and Debug" panel.

3.  **Click the green play button** (Start Debugging) next to the selected configuration, or press `F5`.

This will execute the `${workspaceRoot}/bin/debug.sh` script in VS Code's integrated terminal. The script should handle starting Vite and the Rails server with the Ruby debugger (`rdbg`) attached.

*   You'll see output from both Vite and Rails in the integrated terminal.
*   The debugger will be active. You can set breakpoints in your Ruby code (`.rb` files in `app/controllers`, `app/models`, etc.) by clicking in the gutter to the left of the line numbers.
*   When your application execution hits a breakpoint, it will pause, and you can use the debug controls (step over, step into, step out, continue), inspect variables in the "Variables" panel, and use the "Debug Console" for interactive debugging.

**Troubleshooting:**
*   Ensure `bin/debug.sh` is executable: `chmod +x bin/debug.sh`.
*   Check the output in the integrated terminal for any error messages from the script, Vite, Rails, or the debugger.

---

## Documentation & Changelog (Examples)

-   `doc/CHANGELOG.md` (for tracking changes in your project)
-   `doc/SETUP.md` (project-specific deployment/setup instructions)

---

## Additional Information (Standard for `rails new`)

*   Ruby version (see `.ruby-version` or `Gemfile`)
*   System dependencies (PostgreSQL, Node.js, etc.)
*   Configuration (`config/database.yml`, `config/credentials.yml.enc`)
*   Database creation (`rails db:create`)
*   Database initialization (`rails db:migrate`, `rails db:seed`)
*   How to run the test suite (`rails test`, `rails test:system`)
*   Services (job queues like Solid Queue, cache servers like Solid Cache)
*   Deployment instructions



kamal app logs --follow