/* eslint-disable */
(function () {
    "use strict";
  
    if (typeof jQuery === "undefined") {
      const script = document.createElement("script");
      script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
      script.onload = function () {
        initEcommerce(jQuery);
      };
      document.head.appendChild(script);
    } else {
      initEcommerce(jQuery);
    }
  
    function initEcommerce($) {
      const classes = {
        style: "mini-ecommerce-style",
        wrapper: "ecommerce-wrapper",
        productCard: "product-card",
        addToCartBtn: "add-to-cart-btn",
        addToFavBtn: "add-to-fav-btn",
        showDetailsBtn: "show-details-btn",
        cartItem: "cart-item",
        favItem: "fav-item",
        searchForm: "search-form",
        carousel: "hero-carousel",
        templateCard: "template-card",
        header: "ecommerce-header",
        footer: "ecommerce-footer",
      };
  
      const selectors = {
        style: `.${classes.style}`,
        wrapper: `.${classes.wrapper}`,
        productCard: `.${classes.productCard}`,
        addToCartBtn: `.${classes.addToCartBtn}`,
        addToFavBtn: `.${classes.addToFavBtn}`,
        showDetailsBtn: `.${classes.showDetailsBtn}`,
        cartItem: `.${classes.cartItem}`,
        favItem: `.${classes.favItem}`,
        searchForm: `.${classes.searchForm}`,
        carousel: `.${classes.carousel}`,
        templateCard: `.${classes.templateCard}`,
        header: `.${classes.header}`,
        footer: `.${classes.footer}`,
        pageHeader: "#pageHeader",
        pageFooter: "#pageFooter",
        heroCarousel: "#heroCarousel",
        searchBar: "#searchBar",
        productList: "#productList",
        cart: "#cart",
        favorites: "#favorites",
        clearCartBtn: "#clearCartBtn",
        clearFavBtn: "#clearFavBtn",
      };
  
      const self = {};
      let products = [];
      let searchTimeout;
      let $templateCard;
  
      self.init = () => {
        self.reset();
        self.createContainers();
        self.loadExternalLibraries();
        self.buildCSS();
        self.buildHeader();
        self.buildFooter();
        self.buildSearchBar();
        self.createTemplateCard();
        self.extendJQuery();
        self.loadProducts();
        self.loadCartFromStorage();
        self.loadFavoritesFromStorage();
        self.updateCartSummary();
        self.updateFavoritesSummary();
        self.setEvents();
      };
  
      self.createContainers = () => {
        if ($("#container").length === 0) {
          $("body").append('<div id="container"></div>');
        }
        const $root = $("#container");
  
        if ($("#ecommerce-content-wrapper").length === 0) {
          $root.append('<div id="ecommerce-content-wrapper"></div>');
        }
        const $wrapper = $("#ecommerce-content-wrapper");
  
        if ($("#pageHeader").length === 0) {
          $wrapper.append(
            '<header id="pageHeader" class="' + classes.header + '"></header>',
          );
        }
        if ($("#heroCarousel").length === 0) {
          $wrapper.append('<div id="heroCarousel"></div>');
        }
        if ($("#searchBar").length === 0) {
          $wrapper.append('<div id="searchBar"></div>');
        }
        if ($("#productList").length === 0) {
          $wrapper.append('<div id="productList"></div>');
        }
        if ($("#cart").length === 0) {
          $wrapper.append('<div id="cart"></div>');
        }
  
        if ($("#favorites").length === 0) {
          $wrapper.append('<div id="favorites"></div>');
        }
  
        if ($("#clearFavBtn").length === 0) {
          $wrapper.append('<button id="clearFavBtn">Favorileri Temizle</button>');
        }
  
        if ($("#clearCartBtn").length === 0) {
          $wrapper.append('<button id="clearCartBtn">Sepeti Temizle</button>');
        }
  
        if ($("#pageFooter").length === 0) {
          $wrapper.append(
            '<footer id="pageFooter" class="' + classes.footer + '"></footer>',
          );
        }
      };
  
      self.reset = () => {
        $(selectors.style).remove();
        $(selectors.wrapper).remove();
        $(selectors.header).remove();
        $(selectors.footer).remove();
        $(document).off(".ecommerce");
        if (window.slickLoaded && $.fn.slick) {
          try {
            $(selectors.heroCarousel).slick("unslick");
          } catch (e) {}
        }
      };
  
      self.loadExternalLibraries = () => {
        if (!window.jqueryUILoaded) {
          $("head").append(
            '<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/ui-lightness/jquery-ui.css">',
          );
          $.getScript(
            "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js",
            () => {
              window.jqueryUILoaded = true;
            },
          );
        }
  
        if (!$('link[href*="slick"]').length) {
          $("head").append(
            '<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>',
          );
          $("head").append(
            '<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"/>',
          );
        }
  
        if (!window.slickLoaded) {
          $.getScript(
            "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
            () => {
              window.slickLoaded = true;
            },
          );
        }
  
        if (!$('link[href*="fancybox"]').length) {
          $("head").append(
            '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css"/>',
          );
        }
  
        if (!window.fancyboxLoaded) {
          $.getScript(
            "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js",
            () => {
              window.fancyboxLoaded = true;
            },
          );
        }
  
        if (!$('link[href*="fonts.googleapis.com/css2?family=Inter"]').length) {
          $("head").append('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">');
        }
      };
  
      self.buildCSS = () => {
        const customStyle = `
                <style class="${classes.style}">
                    body {
                        margin: 0;
                        padding: 0px;
                    } 
                    
                    #ecommerce-content-wrapper {
                        font-family: 'Inter', 'Arial', sans-serif;
                        background-color: var(--light,rgb(255, 255, 255));
                        padding: 15px;
                        box-sizing: border-box;
                        border-radius: 8px;
                    }
                    
                    :root {
                        --primary: #6366f1;
                        --primary-dark: #4f46e5; 
                        --secondary: #06b6d4; 
                        --secondary-dark: #0891b2;
                        --danger: #f87171;
                        --danger-dark: #ef4444;   
                        --surface: #ffffff;
                        --surface-alt: #f9fafb;
                        --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
                        --light: #ffffff;
                        --dark: #0f172a;
                    }
                    
                    .${classes.wrapper} {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    
                    
                    .${classes.templateCard} {
                        display: none;
                    }
                    
                    
                    .${classes.searchForm} {
                        display: flex;
                        gap: 10px;
                        margin-bottom: 20px;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 8px;
                    }
                    
                    .${classes.searchForm} input {
                         flex: 1;
                         padding: 10px;
                         border: 1px solid #ddd;
                         border-radius: 4px;
                         font-size: 14px;
                         color: #333; 
                         transition: box-shadow 0.2s, border-color 0.2s;
                    }
  
                    .${classes.searchForm} input:focus {
                        outline: none;
                        border-color: var(--primary);
                        box-shadow: 0 0 0 3px rgba(79,70,229,0.2);
                    }
                    
                    .${classes.searchForm} button {
                        padding: 10px 20px;
                        background: var(--primary);
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background 0.3s;
                    }
                    
                    .${classes.searchForm} button:hover {
                        background: var(--primary-dark);
                    }
                    
                    
                    ${selectors.heroCarousel} {
                        margin-bottom: 30px;
                        border-radius: 8px;
                        background: white;
                    }
                    
                    .carousel-item {
                        height: 300px;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .carousel-item img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        background: white;
                    }
  
                    
                    .${classes.header} {
                        backdrop-filter: blur(10px);
                        background: rgba(255, 255, 255, 0.7);
                        color: var(--dark);
                        padding: 20px 32px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: sticky;
                        top: 0;
                        z-index: 1000;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                    }
   
                     .${classes.header} h1 {
                        font-size: 26px;
                        margin: 0;
                        font-weight: 600;
                    }
   
                    .${classes.header} .cart-summary,
                    .${classes.header} .fav-summary {
                        font-size: 13px;
                        background: rgba(0,0,0,0.05);
                        border-radius: 16px;
                        padding: 4px 12px;
                        margin-left: 8px;
                        cursor: pointer;
                    }
                    
                    
                    .${classes.footer} {
                        backdrop-filter: blur(10px);
                        background: rgba(255,255,255,0.7);
                        color: var(--dark);
                        text-align: center;
                        padding: 24px;
                        margin-top: 60px;
                        border-top: 1px solid rgba(0,0,0,0.05);
                    }
                    
                    
                    ${selectors.productList} {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    
                    
                    .${classes.productCard} {
                        border: 1px solid rgba(0,0,0,0.05);
                        border-radius: 12px;
                        padding: 15px;
                        padding-bottom: 80px; 
                        background: #fff;
                        box-shadow: var(--shadow-md);
                        transition: transform 0.3s, box-shadow 0.3s;
                        display: none;
                        position: relative;
                    }
                    
                    .${classes.productCard}:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }
                    
                    .${classes.productCard}.highlighted {
                        border-color: #007bff;
                        box-shadow: 0 0 15px rgba(0,123,255,0.3);
                        background-color: #e3f2fd;
                    }
                    
                    .product-image {
                        width: 100%;
                        height: 200px;
                        object-fit: contain;
                        border-radius: 4px;
                        margin-bottom: 10px;
                        background: white;
                        transition: transform 0.3s ease;
                    }
  
                    .product-image {
                        transition: transform 0.3s ease;
                    }
  
                    .${classes.productCard}:hover .product-image {
                        transform: scale(1.05);
                    }
                    
                    .product-title {
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 8px;
                        color: #333;
                        line-height: 1.4;
                        min-height: 40px;
                    }
                    
                    .product-price {
                        font-size: 18px;
                        color: #e74c3c;
                        font-weight: bold;
                        margin-bottom: 8px;
                    }
                    
                    .product-description {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 15px;
                        line-height: 1.4;
                        min-height: 60px;
                    }
                    
                    .product-buttons {
                        display: flex;
                        gap: 10px;
                        position: absolute;
                        left: 15px;
                        right: 15px;
                        bottom: 15px;
                    }
  
                    .${classes.addToCartBtn}, .${classes.showDetailsBtn} {
                        flex: 1;
                        padding: 10px 12px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: transform 0.2s, background 0.3s;
                    }
  
                    .${classes.addToCartBtn}:hover, .${classes.showDetailsBtn}:hover {
                        transform: translateY(-2px);
                    }
                    
                    .${classes.addToCartBtn} {
                        background: var(--secondary);
                        color: #fff;
                    }
                    
                    .${classes.addToCartBtn}:hover {
                        background: var(--secondary-dark);
                    }
                    
                    .${classes.showDetailsBtn} {
                        background: var(--primary);
                        color: #fff;
                    }
                    
                    .${classes.showDetailsBtn}:hover {
                        background: var(--primary-dark);
                    }
                    
                    
                    ${selectors.cart} {
                        background: #f8f9fa;
                        border: 1px solid #dee2e6;
                        border-radius: 8px;
                        padding: 20px;
                        margin-bottom: 20px;
                        min-height: 100px;
                        color: #333; 
                    }
                    
                    .cart-header {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        color: #333;
                    }
                    
                    .${classes.cartItem} {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        padding: 10px;
                        background: white;
                        border-radius: 4px;
                        margin-bottom: 10px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        position: relative;
                        display: none;
                        color: #333; 
                    }
                    
                    .cart-item-image {
                        width: 50px;
                        height: 50px;
                        object-fit: contain;
                        border-radius: 4px;
                        background: white;
                    }
                    
                    .cart-item-info {
                        flex: 1;
                    }
                    
                    .cart-item-title {
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 4px;
                    }
  
                    #ecommerce-content-wrapper{
                      background-color: var(--light, #f5f5f5);
                      padding: 0px;
                    }
                    
                    .cart-item-price {
                        font-size: 14px;
                        color: #e74c3c;
                        font-weight: bold;
                    }
                    
                    .remove-from-cart {
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                    }
  
  
                    .cart-item-qty {
                        display: flex;  
                        align-items: center;
                        gap: 6px;
                    }
  
                    .cart-item-qty button {
                        background: #f1f5f9;
                        border: none;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        border-radius: 4px;
                        font-weight: bold;
                    }
                    .cart-item-qty .qty-count {
                        min-width: 20px;
                        text-align: center;
                    }
                    
                    ${selectors.clearCartBtn} {
                        background: var(--danger);
                        color: #fff;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.3s;
                        margin-top: 10px;
                    }
                    
                    ${selectors.clearCartBtn}:hover {
                        background: var(--danger-dark);
                    }
                    
                    
                    @media (max-width: 768px) {
                        ${selectors.productList} {
                            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                            gap: 15px;
                        }
                        
                        .product-buttons {
                            flex-direction: column;
                        }
                    }
                </style>
            `;
        $("head").append(customStyle);
  
        $("head").append(`
          <style class="${classes.style}-favorites">
            ${selectors.favorites} {
              background: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              min-height: 100px;
              color: #333;
            }
  
            .fav-header {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #333;
            }
  
            .${classes.favItem} {
              display: flex;
              align-items: center;
              gap: 15px;
              padding: 10px;
              background: white;
              border-radius: 4px;
              margin-bottom: 10px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              position: relative;
              display: none;
              color: #333;
            }
  
            .fav-item-image {
              width: 50px;
              height: 50px;
              object-fit: contain;
              border-radius: 4px;
              background: white;
            }
  
            .remove-from-fav {
              background: #dc3545;
              color: white;
              border: none;
              padding: 5px 10px;
              border-radius: 3px;
              cursor: pointer;
              font-size: 12px;
            }
  
            ${selectors.clearFavBtn} {
              background: var(--danger);
              color: #fff;
              margin-right: 1rem;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: background 0.3s;
              margin-top: 10px;
            }
  
            ${selectors.clearFavBtn}:hover {
              background: var(--danger-dark);
            }
  
            .${classes.addToFavBtn} {
              position: absolute;
              top: 10px;
              right: 10px;
              background: transparent;
              border: none;
              color: #bbb;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
              cursor: pointer;
              transition: transform 0.2s ease, color 0.2s ease;
            }
  
            .${classes.addToFavBtn} svg {
              width: 70%;
              height: 70%;
              fill: currentColor;
              pointer-events: none;
            }
  
            .${classes.addToFavBtn}:hover {
              transform: scale(1.2);
            }
  
            .${classes.addToFavBtn}.favorited {
              color: var(--danger);
              animation: pop 0.3s ease;
            }
  
            @keyframes pop {
              0% { transform: scale(1); }
              50% { transform: scale(1.4); }
              100% { transform: scale(1); }
            }
          </style>
        `);
  
        $("head").append(`
          <style class="${classes.style}-rating">
            .rating-stars {
              margin-bottom: 8px;
              font-size: 16px;
            }
            .rating-stars .star {
              margin-right: 2px;
            }
  
            .product-modal {
              display: flex;
              flex-direction: column;
              align-items: center;
              max-width: 600px;
            }
            @media (min-width: 600px) {
              .product-modal {
                flex-direction: row;
              }
            }
  
            .modal-image {
              width: 100%;
              max-width: 300px;
              object-fit: contain;
              background: white;
              margin-bottom: 20px;
            }
            @media (min-width: 600px) {
              .modal-image {
                margin-right: 20px;
                margin-bottom: 0;
              }
            }
  
            .modal-price {
              font-size: 20px;
              color: #e74c3c;
              font-weight: bold;
              margin: 10px 0;
            }
          </style>
        `);
  
        $("head").append(`
          <style class="${classes.style}-carousel-hover">
            ${selectors.heroCarousel} .slick-slide {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
  
            ${selectors.heroCarousel} .slick-slide:hover {
              transform: scale(1.05);
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              z-index: 2;
            }
          </style>
        `);
      };
  
      self.buildSearchBar = () => {
        const searchHTML = `
                <form class="${classes.searchForm}">
                    <input type="text" placeholder="ID (1-20) girerseniz ilgili api'ye get atılır succes durumunda ürün vurgulanır, metin girerseniz ürün adı mevcut ürünler arasında aranır" />
                    <button type="submit">Ara</button>
                </form>
            `;
        $(selectors.searchBar).html(searchHTML);
      };
  
      self.createTemplateCard = () => {
        const templateHTML = `
                <div class="${classes.productCard} ${classes.templateCard}">
                    <img src="/placeholder.svg" alt="" class="product-image" />
                    <div class="product-title"></div>
                    <div class="product-price"></div>
                    <div class="rating-stars"></div>
                    <div class="product-description"></div>
                    <button class="${classes.addToFavBtn}" aria-label="Favorilere ekle">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                    <div class="product-buttons">
                        <button class="${classes.addToCartBtn}">Sepete Ekle</button>
                        <button class="${classes.showDetailsBtn}">Detay</button>
                    </div>
                </div>
            `;
        $("#container").append(templateHTML);
        $templateCard = $(selectors.templateCard);
      };
  
      self.extendJQuery = () => {
        $.extend({
          saveCart: function (cartData) {
            try {
              localStorage.setItem("miniCart", JSON.stringify(cartData));
            } catch (e) {
              console.error("Cart save failed:", e);
            }
          },
  
          loadCart: function () {
            try {
              const data = localStorage.getItem("miniCart");
              return data ? JSON.parse(data) : [];
            } catch (e) {
              console.error("Cart load failed:", e);
              return [];
            }
          },
  
          clearCart: function () {
            try {
              localStorage.removeItem("miniCart");
            } catch (e) {
              console.error("Cart clear failed:", e);
            }
          },
  
          saveFavorites: function(favData) {
            try {
              localStorage.setItem("miniFavorites", JSON.stringify(favData));
            } catch (e) {
              console.error("Favorites save failed:", e);
            }
          },
  
          loadFavorites: function() {
            try {
              const data = localStorage.getItem("miniFavorites");
              return data ? JSON.parse(data) : [];
            } catch (e) {
              console.error("Favorites load failed:", e);
              return [];
            }
          },
  
          clearFavorites: function() {
            try {
              localStorage.removeItem("miniFavorites");
            } catch (e) {
              console.error("Favorites clear failed:", e);
            }
          },
        });
      };
  
      self.loadProducts = () => {
        $.ajax({
          url: "https://fakestoreapi.com/products",
          method: "GET",
          dataType: "json",
          success: function (data) {
            products = data;
            self.buildCarousel();
            self.renderProductsWithCloning();
          },
          error: function (xhr, status, error) {
            console.error("Failed to load products:", error);
            $(selectors.productList).html(
              '<p style="text-align: center; color: #dc3545;">Ürünler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.</p>',
            );
          },
        });
      };
  
      self.buildCarousel = () => {
        const carouselItems = products
          .slice(0, 6)
          .map(
            (product) => `
                <div class="carousel-item">
                    <img src="${product.image}" alt="${product.title}" />
                </div>
            `,
          )
          .join("");
  
        $(selectors.heroCarousel).html(carouselItems);
  
        setTimeout(() => {
          if (window.slickLoaded && $.fn.slick) {
            try {
              $(selectors.heroCarousel).slick({
                slidesToShow: 3,
                autoplay: true,
                autoplaySpeed: 3000,
                dots: true,
                arrows: false,
                infinite: true,
                speed: 500,
              });
            } catch (e) {
              console.log(
                "Slick initialization failed, continuing without carousel",
              );
            }
          }
        }, 1000);
      };
  
      self.renderProductsWithCloning = () => {
        $(selectors.productList).empty();
  
        $.each(products, function (index, product) {
          const $clonedCard = $templateCard.clone(true, true);
  
          $clonedCard
            .removeClass(classes.templateCard)
            .attr("data-product-id", product.id);
  
          $clonedCard
            .find(".product-image")
            .attr("src", product.image)
            .attr("alt", product.title);
  
          $clonedCard.find(".product-title").text(product.title);
          $clonedCard.find(".product-price").text(`$${product.price}`);
  
          const ratingVal = Math.round(product.rating.rate);
          let starsMarkup = "";
          for (let i = 1; i <= 5; i++) {
            starsMarkup += `<span class="star" style="color:${i <= ratingVal ? '#facc15' : '#e2e8f0'}">★</span>`;
          }
          $clonedCard.find(".rating-stars").html(starsMarkup);
  
          const truncatedDescription =
            product.description.length > 80
              ? product.description.substring(0, 80) + "..."
              : product.description;
          $clonedCard.find(".product-description").text(truncatedDescription);
  
          $clonedCard
            .find(`.${classes.addToCartBtn}, .${classes.showDetailsBtn}, .${classes.addToFavBtn}`)
            .attr(
              "data-product",
              JSON.stringify(product).replace(/'/g, "&apos;"),
            );
  
          const favs = $.loadFavorites();
          if (favs.some(f => f.id === product.id)) {
            $clonedCard.find(`.${classes.addToFavBtn}`).addClass('favorited');
          }
  
          $(selectors.productList).append($clonedCard);
  
          $clonedCard.delay(index * 250).slideDown(800);
        });
      };
  
      self.renderCart = () => {
        const cartData = $.loadCart();
        if (cartData.length === 0) {
          $(selectors.cart).html('<div class="cart-header">Sepetim</div><p>Sepetiniz boş</p>');
          self.updateCartSummary();
          return;
        }
  
        const grouped = {};
        cartData.forEach(p => {
          if (!grouped[p.id]) grouped[p.id] = { product: p, qty: 0 };
          grouped[p.id].qty += 1;
        });
  
        $(selectors.cart).html('<div class="cart-header">Sepetim</div>');
  
        Object.values(grouped).forEach(({ product, qty }) => {
          const itemHTML = `
            <div class="${classes.cartItem}" data-product-id="${product.id}" style="display:block;">
                <img src="${product.image}" alt="${product.title}" class="cart-item-image" />
                <div class="cart-item-info">
                    <div class="cart-item-title">${product.title}</div>
                    <div class="cart-item-price">$${product.price}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="dec-qty" data-product-id="${product.id}">-</button>
                    <span class="qty-count">${qty}</span>
                    <button class="inc-qty" data-product-id="${product.id}">+</button>
                </div>
                <button class="remove-from-cart" data-product-id="${product.id}">Sil</button>
            </div>`;
          $(selectors.cart).append(itemHTML);
        });
  
        self.updateCartSummary();
      };
  
      self.loadCartFromStorage = () => {
        self.renderCart();
      };
  
      self.loadFavoritesFromStorage = () => {
        const favData = $.loadFavorites();
        if (favData.length > 0) {
          $(selectors.favorites).html('<div class="fav-header">Favorilerim</div>');
          $.each(favData, function(index, item){
            self.addToFavoritesDOM(item, false);
          });
        } else {
          $(selectors.favorites).html('<div class="fav-header">Favorilerim</div><p>Listeniz boş</p>');
        }
        self.updateFavoritesSummary();
      };
  
      self.addToFavoritesDOM = (product, animate = true) => {
        const favItemHTML = `
                <div class="${classes.favItem}">
                    <img src="${product.image}" alt="${product.title}" class="fav-item-image" />
                    <div class="fav-item-info">
                        <div class="fav-item-title">${product.title}</div>
                        <div class="fav-item-price">$${product.price}</div>
                    </div>
                    <button class="remove-from-fav" data-product-id="${product.id}">Sil</button>
                </div>
            `;
  
        if ($(selectors.favorites).find('.fav-header').length === 0) {
          $(selectors.favorites).html('<div class="fav-header">Favorilerim</div>');
        }
  
        const $favItem = $(favItemHTML);
        $(selectors.favorites).append($favItem);
  
        if (animate) {
          $favItem.hide().fadeIn(300);
        } else {
          $favItem.show();
        }
      };
  
      self.addProductToFavorites = (product) => {
        self.addToFavoritesDOM(product, true);
        const currentFav = $.loadFavorites();
        currentFav.push(product);
        $.saveFavorites(currentFav);
        self.updateFavoritesSummary();
      };
  
      self.updateFavoritesSummary = () => {
        const favData = $.loadFavorites();
        const total = favData.length;
        const summaryText = total > 0 ? `Favoriler: ${total}` : 'Favoriler boş';
        $(selectors.pageHeader).find('.fav-summary').text(summaryText);
      };
  
      self.addToCartDOM = (product, animate = true) => {
        const cartItemHTML = `
                <div class="${classes.cartItem}">
                    <img src="${product.image}" alt="${product.title}" class="cart-item-image" />
                    <div class="cart-item-info">
                        <div class="cart-item-title">${product.title}</div>
                        <div class="cart-item-price">$${product.price}</div>
                    </div>
                    <div class="cart-item-qty">
                        <button class="dec-qty" data-product-id="${product.id}">-</button>
                        <span class="qty-count">1</span>
                        <button class="inc-qty" data-product-id="${product.id}">+</button>
                    </div>
                    <button class="remove-from-cart" data-product-id="${product.id}">Sil</button>
                </div>
            `;
  
        if ($(selectors.cart).find(".cart-header").length === 0) {
          $(selectors.cart).html('<div class="cart-header">Sepetim</div>');
        }
  
        const $cartItem = $(cartItemHTML);
        $(selectors.cart).append($cartItem);
  
        if (animate) {
          $cartItem.hide().fadeIn(300);
        } else {
          $cartItem.show();
        }
      };
  
      self.addProductToCart = (product) => {
        const currentCart = $.loadCart();
        currentCart.push(product);
        $.saveCart(currentCart);
        self.renderCart();
      };
  
      self.searchProduct = (productId) => {
        $.ajax({
          url: `https://fakestoreapi.com/products/${productId}`,
          method: "GET",
          dataType: "json",
          success: function (product) {
            const $productCard = $(selectors.productCard).filter(
              `[data-product-id="${productId}"]`,
            );
            if ($productCard.length > 0) {
              $(selectors.productCard).removeClass("highlighted");
  
              $productCard.addClass("highlighted");
  
              if (window.jqueryUILoaded && $.fn.effect) {
                $productCard.effect("highlight", { color: "#007bff" }, 1500);
              }
  
              $("html, body").animate(
                {
                  scrollTop: $productCard.offset().top - 100,
                },
                800,
              );
  
              setTimeout(() => {
                $productCard.removeClass("highlighted");
              }, 3000);
            } else {
              alert("Ürün bulunamadı!");
            }
          },
          error: function () {
            alert("Ürün bulunamadı veya hata oluştu!");
          },
        });
      };
  
      self.handleSearch = (query) => {
        if (!query) {
          $(selectors.productCard).not(selectors.templateCard).show();
          return;
        }
  
        const num = Number(query);
        if (!isNaN(num) && num >= 1 && num <= 20 && /^\d+$/.test(query)) {
          self.searchProduct(num);
        } else {
          self.searchByText(query);
        }
      };
  
      self.searchByText = (text) => {
        const q = text.toLowerCase();
        let matchCount = 0;
  
        $(selectors.productCard)
          .not(selectors.templateCard)
          .each(function () {
            const title = $(this).find(".product-title").text().toLowerCase();
            const isMatch = title.includes(q);
            $(this).toggle(isMatch);
            if (isMatch) matchCount++;
          });
  
        if (matchCount === 0) {
          if (!$("#noResultsMsg").length) {
            $(selectors.productList).append(
              '<p id="noResultsMsg" style="grid-column:1/-1;text-align:center;color:var(--danger);">Sonuç bulunamadı</p>',
            );
          }
        } else {
          $("#noResultsMsg").remove();
        }
      };
  
      self.setEvents = () => {
        $(selectors.productList).on(
          "click.ecommerce",
          selectors.addToCartBtn,
          function () {
            const productData = $(this)
              .attr("data-product")
              .replace(/&apos;/g, "'");
            const product = JSON.parse(productData);
  
            self.addProductToCart(product);
  
            $(this).fadeTo(150, 0.5).fadeTo(150, 1);
          },
        );
  
        $(selectors.cart)
          .on("click.ecommerce", ".remove-from-cart", function () {
            const productId = $(this).attr("data-product-id");
            const updatedCart = $.loadCart().filter(item => item.id != productId);
            $.saveCart(updatedCart);
            self.renderCart();
          })
          .on("click.ecommerce", ".inc-qty", function(){
            const productId = $(this).attr("data-product-id");
            const all = $.loadCart();
            const productObj = all.find(p => p.id == productId);
            if (productObj) {
              all.push(productObj);
              $.saveCart(all);
              self.renderCart();
            }
          })
          .on("click.ecommerce", ".dec-qty", function(){
            const productId = $(this).attr("data-product-id");
            const all = $.loadCart();
            const index = all.findIndex(p => p.id == productId);
            if (index > -1) {
              all.splice(index,1);
              $.saveCart(all);
              self.renderCart();
            }
          });
  
        $(selectors.productList).on(
          "click.ecommerce",
          selectors.showDetailsBtn,
          function () {
            const productData = $(this)
              .attr("data-product")
              .replace(/&apos;/g, "'");
            const product = JSON.parse(productData);
  
            const showModal = () => {
              if (window.Fancybox) {
                const ratingShow = Math.round(product.rating.rate);
                let starsHtml = "";
                for (let i = 1; i <= 5; i++) {
                  starsHtml += `<span class="star" style="color:${i <= ratingShow ? '#facc15' : '#e2e8f0'}">★</span>`;
                }
                window.Fancybox.show([
                  {
                    src: `
                      <div class="product-modal">
                        <img src="${product.image}" alt="${product.title}" class="modal-image" />
                        <div class="modal-info">
                          <h2>${product.title}</h2>
                          <div class="rating-stars">${starsHtml}</div>
                          <div class="modal-price">$${product.price}</div>
                          <p><strong>Kategori:</strong> ${product.category}</p>
                          <p style="margin-top:10px;">${product.description}</p>
                        </div>
                      </div>
                    `,
                    type: "html",
                  },
                ]);
              } else {
                alert(
                  `${product.title}\n\nFiyat: $${product.price}\nKategori: ${product.category}\nRating: ${product.rating.rate}/5\n\n${product.description}`,
                );
              }
            };
  
            if (window.fancyboxLoaded && window.Fancybox) {
              showModal();
            } else {
              setTimeout(showModal, 2000);
            }
  
            $(this).fadeTo(150, 0.5).fadeTo(150, 1);
          },
        );
  
        $(selectors.clearCartBtn).on("click.ecommerce", function () {
          $(selectors.cart)
            .empty()
            .html('<div class="cart-header">Sepetim</div><p>Sepetiniz boş</p>');
          $.clearCart();
          self.updateCartSummary();
        });
  
        const triggerSearch = function (query) {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            self.handleSearch(query.trim());
          }, 400);
        };
  
        $(selectors.searchBar).on(
          "submit.ecommerce",
          selectors.searchForm,
          function (e) {
            e.preventDefault();
            const query = $(this).find("input").val();
            triggerSearch(query);
          },
        );
  
        $(selectors.searchBar).on(
          "input.ecommerce",
          `${selectors.searchForm} input`,
          function () {
            const query = $(this).val();
            triggerSearch(query);
          },
        );
  
        $(document)
          .on(
            "mouseenter.ecommerce",
            `${selectors.addToCartBtn}, ${selectors.showDetailsBtn}, ${selectors.addToFavBtn}`,
            function () {
              $(this).fadeTo(150, 0.7);
            },
          )
          .on(
            "mouseleave.ecommerce",
            `${selectors.addToCartBtn}, ${selectors.showDetailsBtn}, ${selectors.addToFavBtn}`,
            function () {
              $(this).fadeTo(150, 1);
            },
          );
  
        $(selectors.cart)
          .on("mouseenter.ecommerce", selectors.cartItem, function () {
            $(this).animate(
              {
                backgroundColor: "#e9ecef",
              },
              200,
            );
          })
          .on("mouseleave.ecommerce", selectors.cartItem, function () {
            $(this).animate(
              {
                backgroundColor: "#ffffff",
              },
              200,
            );
          });
  
        $(selectors.favorites)
          .on("mouseenter.ecommerce", selectors.favItem, function () {
            $(this).animate(
              {
                backgroundColor: "#e9ecef",
              },
              200,
            );
          })
          .on("mouseleave.ecommerce", selectors.favItem, function () {
            $(this).animate(
              {
                backgroundColor: "#ffffff",
              },
              200,
            );
          });
  
        $(selectors.productList).on(
          "click.ecommerce",
          selectors.addToFavBtn,
          function () {
            const productData = $(this)
              .attr("data-product")
              .replace(/&apos;/g, "'");
            const product = JSON.parse(productData);
  
            const favorites = $.loadFavorites();
            const isInFav = favorites.some(f => f.id === product.id);
  
            if (isInFav) {
              const updated = favorites.filter(f => f.id !== product.id);
              $.saveFavorites(updated);
              $(selectors.favorites)
                .find(`.${classes.favItem}:has([data-product-id='${product.id}'])`)
                .slideUp(300, function(){ $(this).remove(); });
  
              $(this).removeClass('favorited'); 
            } else {
              self.addProductToFavorites(product);
  
              $(this).addClass('favorited'); 
            }
  
            self.updateFavoritesSummary();
  
            $(this).fadeTo(150,0.5).fadeTo(150,1);
          }
        );
  
        $(selectors.favorites).on("click.ecommerce", ".remove-from-fav", function(){
          const productId = $(this).attr("data-product-id");
          $(this).closest(`.${classes.favItem}`).slideUp(300, function(){ $(this).remove(); });
  
          const currentFav = $.loadFavorites();
          const updatedFav = currentFav.filter(item => item.id != productId);
          $.saveFavorites(updatedFav);
          self.updateFavoritesSummary();
        });
  
        $(selectors.clearFavBtn).on("click.ecommerce", function(){
          $(selectors.favorites).empty().html('<div class="fav-header">Favorilerim</div><p>Listeniz boş</p>');
          $.clearFavorites();
          self.updateFavoritesSummary();
        });
  
        $(selectors.pageHeader).on("click.ecommerce keypress.ecommerce", ".cart-summary, .fav-summary", function(e){
          if(e.type === 'keypress' && e.key !== 'Enter' && e.key !== ' ') return;
          const target = $(this).hasClass('cart-summary') ? $(selectors.cart) : $(selectors.favorites);
          if(target.length){
            $('html, body').animate({ scrollTop: target.offset().top - 80 }, 600);
          }
        });
      };
  
      self.buildHeader = () => {
        const headerHTML = `
                <h1>Mini E-Ticaret</h1>
                <div class="cart-summary" role="button" tabindex="0">Sepetiniz boş</div>
                <div class="fav-summary" role="button" tabindex="0">Favoriler boş</div>
            `;
        $(selectors.pageHeader).html(headerHTML);
      };
  
      self.updateCartSummary = () => {
        const cartData = $.loadCart();
        const totalItems = cartData.length;
        const totalPrice = cartData
          .reduce((sum, item) => sum + parseFloat(item.price), 0)
          .toFixed(2);
        const summaryText =
          totalItems > 0
            ? `Sepet: ${totalItems} ürün / $${totalPrice}`
            : "Sepetiniz boş";
        $(selectors.pageHeader).find(".cart-summary").text(summaryText);
      };
  
      self.buildFooter = () => {
        const footerHTML = `
                <p>Insider Bootcamp · 3. Hafta Ödevi · Tüm işlevler tek .js dosyasında, jQuery ile ve self-invoking (IIFE) fonksiyonla geliştirilmiş, doğrudan konsolda çalıştırılmaya uygundur.</p>
            `;
        $(selectors.pageFooter).html(footerHTML);
      };
  
      $(document).ready(self.init);
    }
  })();
  