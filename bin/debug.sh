#!/bin/bash
# Останавливаем все фоновые процессы при выходе из скрипта
trap 'kill $(jobs -p) 2>/dev/null' EXIT

# Запускаем Vite в фоновом режиме
echo "Starting Vite dev server..."
bin/vite dev &
VITE_PID=$!
sleep 2  # Даем время Vite запуститься

# Запускаем Rails с включенным дебаггером
echo "Starting Rails with debugger..."
RUBY_DEBUG_OPEN=true bin/rails s

# При выходе из Rails, убиваем процесс Vite
# (trap EXIT сделает это автоматически) 