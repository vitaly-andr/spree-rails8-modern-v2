class DocumentationController < ApplicationController
  before_action :authenticate_user!

  def show
    # Определяем какую документацию показывать в зависимости от роли
    doc_path = determine_doc_path

    # В development проксируем на Mintlify dev server
    # В staging/production отдаем статические файлы из public/doc

    if Rails.env.development?
      redirect_to "http://localhost:4000#{doc_path}", allow_other_host: true
    else
      # Отдаем статические файлы Mintlify из public/doc
      requested_path = params[:path] || "index.html"

      # Если путь не заканчивается на .html, .css, .js и т.д., добавляем .html
      unless requested_path.match?(/\.\w+$/)
        requested_path = "#{requested_path}.html"
      end

      file_path = Rails.root.join("public", "doc", requested_path)

      if File.exist?(file_path)
        send_file file_path, type: content_type_for(file_path), disposition: "inline"
      else
        # Fallback на index.html для SPA роутинга Mintlify
        index_path = Rails.root.join("public", "doc", "index.html")
        if File.exist?(index_path)
          send_file index_path, type: "text/html", disposition: "inline"
        else
          render_documentation_not_built
        end
      end
    end
  end

  private

  def determine_doc_path
    # Проверяем является ли пользователь админом Spree
    if current_user.respond_to?(:spree_admin?) && current_user.spree_admin?
      # Админы видят всю документацию
      request.path.sub("/doc", "")
    else
      # Обычные пользователи видят только User Docs
      path = request.path.sub("/doc", "")
      if path.start_with?("/user/")
        # Разрешаем доступ к User Docs
        path
      else
        # Все остальные пути перенаправляем на User Docs
        "/user/what-is-spree-commerce"
      end
    end
  end

  def content_type_for(file_path)
    case File.extname(file_path)
    when ".html" then "text/html"
    when ".css" then "text/css"
    when ".js" then "application/javascript"
    when ".json" then "application/json"
    when ".png" then "image/png"
    when ".jpg", ".jpeg" then "image/jpeg"
    when ".svg" then "image/svg+xml"
    when ".woff", ".woff2" then "font/woff2"
    when ".ttf" then "font/ttf"
    else "application/octet-stream"
    end
  end

  def render_documentation_not_built
    render html: <<~HTML.html_safe
      <!DOCTYPE html>
      <html>
      <head>
        <title>Documentation Not Available</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 2rem; }
          .container { max-width: 600px; margin: 0 auto; text-align: center; }
          .error { color: #dc3545; }
          .info { background: #e7f3ff; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
          code { background: #f8f9fa; padding: 0.2rem 0.4rem; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="error">📚 Documentation Not Available</h1>
          <div class="info">
            <p>The documentation has not been built yet.</p>
            <p>To build the documentation, run:</p>
            <p><code>npm run docs:build</code></p>
          </div>
          <p>In development, you can also run:</p>
          <p><code>npm run docs:dev</code></p>
        </div>
      </body>
      </html>
    HTML
  end
end
