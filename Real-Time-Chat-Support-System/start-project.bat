@echo off
echo ========================================
echo  Real-Time Chat Support System
echo ========================================
echo.

echo Starting Backend (Spring Boot)...
cd springapp
start "Backend Server" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Starting Frontend (React)...
cd reactapp
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo  Both servers are starting...
echo  Backend: http://localhost:8080
echo  Frontend: http://localhost:3000
echo ========================================
echo.
echo Default Login Credentials:
echo Customer: customer@example.com / password123
echo Agent: agent@example.com / password123
echo Admin: admin@example.com / admin123
echo.
pause