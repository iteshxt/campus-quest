@echo off
echo 🚀 Starting CampusQuest Development Environment...

:: Start Frontend
start cmd /k "title Frontend && echo Starting Vite... && npm run dev"

:: Start Backend API
start cmd /k "title Backend API && cd backend && echo Starting Laravel... && php artisan serve"

:: Start Queue Worker
start cmd /k "title Queue Worker && cd backend && echo Starting Queue... && php artisan queue:work"

echo ✨ All services are starting in separate windows!
pause
