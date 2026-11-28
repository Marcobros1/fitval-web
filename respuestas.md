# Respuestas

## Parte 0

**Pregunta 1:** ¿qué ves al abrir `https://fitval-tunombre.netlify.app/lo-que-sea` y recargar? Borra mentalmente el `_redirects`: ¿qué verías y por qué?

Respuesta: Con el `_redirects`, la web sigue mostrando la aplicación: el título "Hola, FitVal" y la URL no cambia, aunque `/lo-que-sea` no existe como fichero. Netlify manda cualquier ruta a `index.html` con código 200 y deja que React Router decida qué pintar. Sin el `_redirects`, Netlify buscaría el fichero `/lo-que-sea` en su servidor, no lo encontraría y devolvería un 404 de Netlify, antes de que llegue a cargar React. Por eso al recargar en `/classes` también hace falta: la ruta solo existe en el navegador, no en el servidor.

## Parte 1

**Pregunta 2:** ¿qué pasaría si no devolvieras la limpieza en `Loading` y el usuario cambiara de página antes de los 5 segundos?

Respuesta: El temporizador seguiría activo y, a los 5 segundos, llamaría a `setSlow` en un componente que ya no está en pantalla. React ya no avisa de eso (desde la versión 18), así que no falla a la vista, pero el timer queda en memoria para nada y, si el usuario va y vuelve muchas veces, se acumulan. Devolver `clearTimeout` lo cancela en cuanto el componente se desmonta.

## Parte 2

**Pregunta 3:** ¿qué pasa con el texto del buscador al recargar y al ir atrás? ¿Pasaría lo mismo si `activity` fuera un `useState`?

Respuesta: Al recargar, el buscador sigue con el texto (`yoga`) y el horario muestra sus 2 clases, porque el texto está en la URL (`?activity=yoga`) y la página lo lee al cargar. Al ir atrás, el navegador vuelve a la URL anterior (`?activity=spin`) y el campo muestra `spin`: cada cambio del buscador queda en el historial. Con un `useState` nada de eso pasaría: recargar pondría el campo vacío y "atrás" no cambiaría nada, porque el estado vive solo en memoria y no en la dirección.

**Pregunta 4:** ¿cuántas peticiones salen la segunda vez? ¿Por qué?

Respuesta: Ninguna. La primera vez, escribir `spin` letra a letra hizo 4 peticiones (`activity:contains=s`, `sp`, `spi` y `spin`), una por cada cambio. Al borrar y escribir `spin` de nuevo, RTK Query ya tiene esas consultas en su caché y las sirve desde memoria. Solo pide datos de nuevo si la consulta no está guardada o si se invalida con un `invalidatesTags` (por ejemplo, tras crear una clase).

## Parte 3

**Pregunta 5:** ¿sigues dentro después de recargar? ¿Qué hay guardado en `localStorage`? ¿Por qué ese token no le serviría a una API de verdad?

Respuesta: Sí, sigues dentro. Al recargar, la app lee el token de `localStorage` y pide `/users/2` para saber quién eres. Lo único guardado es la clave `token`, con el valor `token-fake-2`: no hay datos del usuario, solo el texto del que se saca el id. Ese token no le serviría a una API de verdad porque es un texto inventado y no está firmado. Una API real (con JWT) comprueba la firma con su clave secreta, y `token-fake-2` no la tiene, así que respondería `401`. Además, al guardarse en `localStorage`, cualquier script que se ejecute en la página puede leerlo.

## Parte 4

**Pregunta 6:** ¿se ha borrado el Crossfit? Entonces, `ProtectedRoute` ¿basta para que un socio no pueda borrar clases? ¿Quién tiene que protegerlas de verdad?

Respuesta: Sí, el Crossfit se borró. Probé `DELETE /classes/7` sin ningún token y json-server respondió `200`: las clases pasaron de 7 a 6. `ProtectedRoute` no basta, porque solo decide qué página se pinta en el navegador. Cualquiera puede llamar a la API con `curl` o con Postman, y el navegador no interviene. La protección de verdad tiene que estar en la API: debe comprobar el token en cada petición de escritura y el rol de staff. Eso lo tendrá que hacer tu API de NestJS en la Parte 5.

**Pregunta 7:** ¿quién hace que la tabla (y el horario de `/classes`) muestre la clase nueva? Explícalo con las palabras `providesTags` e `invalidatesTags`.

Respuesta: RTK Query. Las consultas de lectura (`getClasses`, `getClass`) declaran `providesTags: ["Class"]`: dicen "mis datos pertenecen a la etiqueta Class". Las mutaciones de escritura (`createClass`, `deleteClass`) declaran `invalidatesTags: ["Class"]`: dicen "al terminar, los datos de la etiqueta Class están viejos". Al crear una clase, RTK Query marca esas consultas como desactualizadas y vuelve a pedirlas; por eso la tabla y el horario se actualizan sin recargar. Lo comprobé quitando `invalidatesTags` de `createClass`: la clase nueva no aparecía en la tabla hasta recargar.
