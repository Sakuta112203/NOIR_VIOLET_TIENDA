NOIR VIOLET - TIENDA DE ROPA (PROYECTO DE DEMOSTRACIÓN)
=======================================================

COMO ABRIR LA PAGINA
1. Descomprime esta carpeta.
2. Abre index.html con Chrome, Edge o Firefox.
3. No necesitas instalar programas ni iniciar un servidor.

ARCHIVOS PRINCIPALES Y PARA QUE SIRVE CADA UNO
----------------------------------------------

index.html
- Contiene la estructura de la página.
- Está dividido con comentarios: encabezado, menú, barra lateral,
  productos destacados, catálogo, pie de página y carrito.
- Aquí puedes cambiar textos, títulos, nombres de secciones y enlaces.

css/tienda.css
- Controla el diseño visual de la tienda.
- Los comentarios separan colores, encabezado, menú, panel lateral,
  catálogo, tarjetas, carrito y diseño para celulares.
- Para cambiar el morado principal, busca la variable --purple al inicio.

js/products.js
- Contiene los productos de ejemplo.
- Para cambiar un producto, modifica su nombre, categoría, género,
  precio, imagen o etiqueta.
- Para agregar otro, copia un bloque completo y cambia el id por uno nuevo.
- El precio se escribe como número, sin puntos ni signo peso: 49990.

js/tienda.js
- Controla las acciones de la tienda.
- Sus comentarios explican filtros, búsqueda, tarjetas, carrito,
  botones para sumar/restar y productos destacados.
- Si estás comenzando, es mejor modificar primero products.js y los textos
  de index.html antes de cambiar las funciones de este archivo.

assets/products/
- Contiene las imágenes SVG de ejemplo que aparecen en los productos.
- Si reemplazas una imagen, conserva el nombre del archivo o actualiza
  la ruta correspondiente en js/products.js.

OTROS ARCHIVOS
- css/styles.css y js/scripts.js pertenecen a la plantilla original de
  Start Bootstrap y se conservan como referencia.

IMPORTANTE
- El carrito permite agregar, quitar y cambiar cantidades; guarda su
  contenido en el navegador.
- Esta versión es una demostración: no procesa pagos ni registra pedidos
  reales y no controla inventario.
- Los productos e imágenes son de ejemplo. Antes de publicar, reemplázalos
  por fotografías, precios, tallas, datos de contacto y políticas reales.
