// To see this message, add the following to the `<head>` section in your
// views/layouts/application.html.erb
//
//    <%= vite_client_tag %>
//    <%= vite_javascript_tag 'application' %>
console.log('Vite ⚡️ Rails')

// If using a TypeScript entrypoint file:
//     <%= vite_typescript_tag 'application' %>
//
// If you want to use .jsx or .tsx, add the extension:
//     <%= vite_javascript_tag 'application.jsx' %>

console.log('Visit the guide for more information: ', 'https://vite-ruby.netlify.app/guide/rails')

// Example: Load Rails libraries in Vite.
//
import * as Turbo from '@hotwired/turbo'
Turbo.start()

import * as ActiveStorage from '@rails/activestorage'
ActiveStorage.start()

// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
// import '~/index.css'
// Импортируем и запускаем Stimulus контроллеры через index.js
import "../controllers/index.js"

// Импортируйте CSS, если ещё не импортирован
import "../application.css"

// Импортируем GSAP и анимации для Ceramir страницы
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'

// Делаем GSAP глобально доступным
window.gsap = gsap
window.ScrollTrigger = ScrollTrigger
window.LocomotiveScroll = LocomotiveScroll

import "../../javascript/ceramir_animations.js"