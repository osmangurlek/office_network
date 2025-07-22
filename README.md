# Project Title

Who's in the office

## Project Description

Designed and developed a web-based data analytics platform for monitoring office staff. The system automatically tracks daily in-office presence of employees, presents entry-exit data in tabular format, and performs statistical analyses. By collecting data based on MAC addresses from network devices, the platform provides strategic insights aimed at optimizing workforce efficiency.

## Features

- Feature 1: Gettting MAC addresses from modem interface using selenium in .asp extension web URL
- Feature 2: Getting MAC addresses from modem interface using selenium in API
- Feature 3: Monitoring the status of employeer

## Technologies Used

- **Frontend**: React, Next.js, Ant Design, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Selenium

## Installation

1. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

### Prerequisites

- Node.js (version >= 20)
- Python (version >= 3.8)
- PostgreSQL (version >= 15)
- APScheduler (version >= 3.10.4)
- psycopg2-binary (version >= 2.9.9)
- pydantic (version >= 2.10.6)
- python-dotenv (version >= 1.0.1)
- selenium (version >= 4.28.1)
- SQLAlchemy (version >= 2.0.38)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
4. If the giving node version error:
   ```bash
   nvm install 20
   nvm use 20
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn <file_name>:app --reload
   ```
   file_name depends on what you use if you use API for getting MAC addresses use 'main',
   use .aps extension URL for getting MAC addresses use 'main2'

## Usage

First run the frontend using 'npm run dev' then run the backend using 'uvicorn <file_name>:app --reload' 
and the MAC addresses, IP addresses, Host Name and status are monitoring.
