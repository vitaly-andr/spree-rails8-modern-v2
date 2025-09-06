module Spree
  module Admin
    class LocalesController < Spree::Admin::BaseController
      def set
        if params[:locale].present? && I18n.available_locales.include?(params[:locale].to_sym)
          session[:admin_locale] = params[:locale]
          I18n.locale = params[:locale]

          if try_spree_current_user && try_spree_current_user.respond_to?(:selected_locale=)
            try_spree_current_user.update(selected_locale: params[:locale])
          end

          flash[:success] = Spree.t("admin.locale_changed")
        else
          flash[:error] = Spree.t("admin.invalid_locale")
        end

        redirect_back(fallback_location: spree.admin_path)
      end

      private

      def authorize_admin
        authorize! :manage, Spree::Config
      end
    end
  end
end
