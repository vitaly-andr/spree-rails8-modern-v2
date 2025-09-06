// Импорт и регистрация всех контроллеров
import { Application } from "@hotwired/stimulus"

// Импортируем контроллеры напрямую
import DropdownController from "./spree/storefront/dropdown_controller"
import ModernDropdownController from "./modern_dropdown_controller"
import SwitchImageController from "./switch_image_controller" 
import CounterController from "./counter_controller"
import NavbarComponentController from "./navbar_component_controller"
import SidebarMenuController from "./sidebar_menu_controller"
import LocomotiveController from "./locomotive_controller"
import SlideoverController from "./spree/storefront/slideover_controller"         
import CarouselComponentController from "../../components/carousel/carousel_component_controller"
import CatalogCardComponentController from "../../components/catalog_card/catalog_card_component_controller"
import MediaGalleryComponentController from "../../components/media_gallery/media_gallery_component_controller"
import ProductDetailComponentController from "../../components/product_detail/product_detail_component_controller"

// Создаем приложение Stimulus
const application = Application.start()

// Регистрируем контроллеры
application.register("dropdown", DropdownController)
application.register("modern-dropdown", ModernDropdownController)
application.register("switch-image", SwitchImageController) 
application.register("counter", CounterController)
application.register("navbar-component", NavbarComponentController)
application.register("sidebar-menu", SidebarMenuController)
application.register("locomotive", LocomotiveController)
application.register("slideover", SlideoverController)           

// Регистрируем ViewComponent контроллеры
application.register("carousel--carousel-component", CarouselComponentController)
application.register("catalog-card", CatalogCardComponentController)
application.register("media-gallery", MediaGalleryComponentController)
application.register("product-detail", ProductDetailComponentController)

// Экспортируем для доступа из других модулей
export { application }
