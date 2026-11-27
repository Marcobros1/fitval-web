# Respuestas

## Parte 0

**Pregunta 1:** ¿qué ves al abrir `https://fitval-tunombre.netlify.app/lo-que-sea` y recargar? Borra mentalmente el `_redirects`: ¿qué verías y por qué?

Respuesta: Con el `_redirects`, la web sigue mostrando la aplicación: el título "Hola, FitVal" y la URL no cambia, aunque `/lo-que-sea` no existe como fichero. Netlify manda cualquier ruta a `index.html` con código 200 y deja que React Router decida qué pintar. Sin el `_redirects`, Netlify buscaría el fichero `/lo-que-sea` en su servidor, no lo encontraría y devolvería un 404 de Netlify, antes de que llegue a cargar React. Por eso al recargar en `/classes` también hace falta: la ruta solo existe en el navegador, no en el servidor.

## Parte 1

**Pregunta 2:** ¿qué pasaría si no devolvieras la limpieza en `Loading` y el usuario cambiara de página antes de los 5 segundos?

Respuesta: El temporizador seguiría activo y, a los 5 segundos, llamaría a `setSlow` en un componente que ya no está en pantalla. React ya no avisa de eso (desde la versión 18), así que no falla a la vista, pero el timer queda en memoria para nada y, si el usuario va y vuelve muchas veces, se acumulan. Devolver `clearTimeout` lo cancela en cuanto el componente se desmonta.
