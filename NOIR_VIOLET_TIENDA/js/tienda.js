// ============================================================
// FUNCIONES PRINCIPALES DE LA TIENDA NOIR VIOLET
// Este archivo controla filtros, productos, carrito y botones.
// ============================================================

(() => {
    "use strict";

    // --------------------------------------------------------
    // 1. DATOS GENERALES Y VARIABLES
    // --------------------------------------------------------
    const products = window.PRODUCTS || [];
    const getElement = (id) => document.getElementById(id);

    // Convierte un número en precio chileno (por ejemplo: $49.990).
    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }).format(price);
    };

    // Filtros seleccionados por el usuario.
    let filters = {
        category: "Todos",
        gender: "Todos",
        sort: "featured",
        search: ""
    };

    // Carrito: guarda producto y talla junto a la cantidad.
    let cart = {};

    // Recuperar el carrito guardado en el navegador.
    try {
        const savedCart = JSON.parse(localStorage.getItem("nv-cart") || "{}");
        if (savedCart && typeof savedCart === "object" && !Array.isArray(savedCart)) {
            cart = savedCart;
        }
    } catch (error) {
        cart = {};
    }

    // Guardar el carrito para que no se pierda al actualizar la página.
    function saveCart() {
        try {
            localStorage.setItem("nv-cart", JSON.stringify(cart));
        } catch (error) {
            // Si el navegador bloquea el almacenamiento, la tienda sigue funcionando.
        }
    }

    // --------------------------------------------------------
    // 2. MENSAJE PEQUEÑO DE CONFIRMACIÓN
    // --------------------------------------------------------
    let toastTimer;

    function showMessage(message) {
        getElement("toast").textContent = message;
        getElement("toast").classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            getElement("toast").classList.remove("show");
        }, 2500);
    }

    // --------------------------------------------------------
    // 3. FILTROS Y CATEGORÍAS
    // --------------------------------------------------------
    function updateFilters() {
        getElement("categoryFilter").value = filters.category;
        getElement("genderFilter").value = filters.gender;
        getElement("sortFilter").value = filters.sort;

        // Marcar visualmente la categoría que está seleccionada.
        document.querySelectorAll(".chip").forEach((button) => {
            button.classList.toggle("active", button.dataset.category === filters.category);
        });

        renderProducts();
    }

    // Aplicar una categoría o colección (hombre, mujer o unisex).
    function setFilter(category, gender) {
        if (category) filters.category = category;
        if (gender) filters.gender = gender;

        updateFilters();
        getElement("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
        closeDropdowns();
    }

    // Cerrar los menús desplegables de la navegación.
    function closeDropdowns() {
        document.querySelectorAll(".dropdown").forEach((dropdown) => {
            dropdown.classList.remove("open");
            const button = dropdown.querySelector(".nav-drop");
            if (button) button.setAttribute("aria-expanded", "false");
        });
    }

    // Activar los botones que llevan a una categoría o colección.
    document.querySelectorAll("[data-category], [data-gender]").forEach((button) => {
        button.addEventListener("click", () => {
            setFilter(button.dataset.category, button.dataset.gender);
        });
    });

    // Abrir y cerrar los menús desplegables del menú superior.
    document.querySelectorAll(".nav-drop").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const dropdown = button.parentElement;
            const shouldOpen = !dropdown.classList.contains("open");
            closeDropdowns();
            dropdown.classList.toggle("open", shouldOpen);
            button.setAttribute("aria-expanded", String(shouldOpen));
        });
    });

    // Cerrar el menú cuando se hace clic fuera de él.
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".dropdown")) closeDropdowns();
    });

    // Cambios realizados desde los selectores de la barra lateral.
    getElement("genderFilter").addEventListener("change", (event) => {
        filters.gender = event.target.value;
        updateFilters();
    });

    getElement("categoryFilter").addEventListener("change", (event) => {
        filters.category = event.target.value;
        updateFilters();
    });

    getElement("sortFilter").addEventListener("change", (event) => {
        filters.sort = event.target.value;
        updateFilters();
    });

    // Buscar por nombre, categoría o colección.
    getElement("searchInput").addEventListener("input", (event) => {
        filters.search = event.target.value.trim().toLocaleLowerCase("es");
        renderProducts();
    });

    // Llevar al usuario directamente al buscador.
    getElement("searchToggle").addEventListener("click", () => {
        getElement("catalogo").scrollIntoView({ behavior: "smooth" });
        setTimeout(() => getElement("searchInput").focus(), 350);
    });

    // Restablecer todos los filtros.
    getElement("resetFilters").addEventListener("click", () => {
        filters = {
            category: "Todos",
            gender: "Todos",
            sort: "featured",
            search: ""
        };
        getElement("searchInput").value = "";
        updateFilters();
    });

    // --------------------------------------------------------
    // 4. TARJETAS Y LISTADO DE PRODUCTOS
    // --------------------------------------------------------
    function createProductCard(product) {
        return `
            <article class="product">
                <div class="product-media">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
                </div>
                <div class="product-info">
                    <div class="meta">${product.category} · ${product.gender}</div>
                    <h3>${product.name}</h3>
                    <div class="price">${formatPrice(product.price)}</div>
                    <div class="product-actions">
                        <select aria-label="Talla para ${product.name}" id="size-${product.id}">
                            <option value="S">S</option>
                            <option value="M" selected>M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                        <button class="add" data-add="${product.id}">+ AGREGAR</button>
                    </div>
                </div>
            </article>
        `;
    }

    // Mostrar los productos que coinciden con los filtros.
    function renderProducts() {
        let results = products.filter((product) => {
            const matchesCategory = filters.category === "Todos" || product.category === filters.category;
            const matchesGender = filters.gender === "Todos"
                || product.gender === filters.gender
                || (product.gender === "Unisex" && filters.gender !== "Unisex");
            const text = `${product.name} ${product.category} ${product.gender}`.toLocaleLowerCase("es");
            const matchesSearch = !filters.search || text.includes(filters.search);

            return matchesCategory && matchesGender && matchesSearch;
        });

        // Ordenar los resultados según la opción elegida.
        if (filters.sort === "asc") results.sort((a, b) => a.price - b.price);
        if (filters.sort === "desc") results.sort((a, b) => b.price - a.price);
        if (filters.sort === "az") results.sort((a, b) => a.name.localeCompare(b.name, "es"));

        getElement("productGrid").innerHTML = results.map(createProductCard).join("");
        getElement("resultsCount").textContent = `${results.length} PRODUCTOS`;
        getElement("emptyMessage").hidden = results.length > 0;

        // Activar el botón Agregar de cada tarjeta.
        getElement("productGrid").querySelectorAll("[data-add]").forEach((button) => {
            button.addEventListener("click", () => {
                const id = Number(button.dataset.add);
                const size = getElement(`size-${id}`).value;
                addToCart(id, size);
            });
        });
    }

    // --------------------------------------------------------
    // 5. CARRITO DE COMPRAS
    // --------------------------------------------------------
    function addToCart(id, size) {
        const key = `${id}-${size}`;
        cart[key] = (Number(cart[key]) || 0) + 1;
        saveCart();
        renderCart();
        showMessage("✦ Producto agregado al carrito");
    }

    // Dibujar los productos que están dentro del carrito.
    function renderCart() {
        let total = 0;
        let count = 0;
        const rows = [];

        Object.entries(cart).forEach(([key, quantityValue]) => {
            const [id, size] = key.split("-");
            const product = products.find((item) => item.id === Number(id));
            const quantity = Number(quantityValue);

            if (!product || !Number.isInteger(quantity) || quantity < 1) return;

            count += quantity;
            total += quantity * product.price;

            rows.push(`
                <div class="cart-row">
                    <img src="${product.image}" alt="">
                    <div>
                        <strong>${product.name}</strong>
                        <small>Talla ${size} · ${formatPrice(product.price)}</small>
                        <div class="qty">
                            <button data-minus="${key}" aria-label="Quitar una unidad">−</button>
                            <span>${quantity}</span>
                            <button data-plus="${key}" aria-label="Agregar una unidad">+</button>
                        </div>
                    </div>
                    <button class="remove" data-remove="${key}" aria-label="Eliminar producto">✕</button>
                </div>
            `);
        });

        getElement("cartCount").textContent = count;
        getElement("cartTotal").textContent = formatPrice(total);
        getElement("cartItems").innerHTML = rows.length
            ? rows.join("")
            : `<div class="cart-empty">✦<p>Tu carrito está vacío.</p><p>Explora el catálogo y elige tus favoritos.</p></div>`;

        getElement("checkoutBtn").disabled = count === 0;
        getElement("checkoutBtn").style.opacity = count ? "1" : ".5";

        // Botón +: aumentar la cantidad de un producto.
        getElement("cartItems").querySelectorAll("[data-plus]").forEach((button) => {
            button.onclick = () => {
                cart[button.dataset.plus]++;
                saveCart();
                renderCart();
            };
        });

        // Botón -: disminuir la cantidad de un producto.
        getElement("cartItems").querySelectorAll("[data-minus]").forEach((button) => {
            button.onclick = () => {
                cart[button.dataset.minus]--;
                if (cart[button.dataset.minus] <= 0) delete cart[button.dataset.minus];
                saveCart();
                renderCart();
            };
        });

        // Botón X: eliminar por completo un producto del carrito.
        getElement("cartItems").querySelectorAll("[data-remove]").forEach((button) => {
            button.onclick = () => {
                delete cart[button.dataset.remove];
                saveCart();
                renderCart();
            };
        });
    }

    // --------------------------------------------------------
    // 6. ABRIR Y CERRAR EL PANEL DEL CARRITO
    // --------------------------------------------------------
    function toggleCart(open) {
        getElement("cartDrawer").classList.toggle("open", open);
        getElement("cartDrawer").setAttribute("aria-hidden", String(!open));
        getElement("scrim").hidden = !open;
        document.body.style.overflow = open ? "hidden" : "";
    }

    getElement("cartToggle").onclick = () => toggleCart(true);
    getElement("cartClose").onclick = () => toggleCart(false);
    getElement("scrim").onclick = () => toggleCart(false);

    // Cerrar el carrito con la tecla Escape.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") toggleCart(false);
    });

    // --------------------------------------------------------
    // 7. PRODUCTOS DESTACADOS DE LA PARTE SUPERIOR
    // --------------------------------------------------------
    getElement("featuredGrid").innerHTML = products.slice(0, 3).map((product) => `
        <div class="feature-card" data-feature="${product.category}">
            <img src="${product.image}" alt="">
            <div>
                <strong>${product.name}</strong>
                <small>${formatPrice(product.price)} ↗</small>
            </div>
        </div>
    `).join("");

    // Al presionar un destacado, mostrar su categoría.
    getElement("featuredGrid").querySelectorAll("[data-feature]").forEach((button) => {
        button.onclick = () => setFilter(button.dataset.feature, null);
    });

    // --------------------------------------------------------
    // 8. INICIAR LA TIENDA
    // --------------------------------------------------------
    renderProducts();
    renderCart();
})();
