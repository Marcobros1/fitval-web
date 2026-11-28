# Respuestas

## Parte 0

**Pregunta 1:** ¿qué ves al abrir `https://fitval-tunombre.netlify.app/lo-que-sea` y recargar? Borra mentalmente el `_redirects`: ¿qué verías y por qué?

Respuesta: Al abrir `https://fitval-web-marcodemiguel.netlify.app/lo-que-sea` y recargar, veo la aplicación con normalidad: el título "Hola, FitVal", y la URL no cambia aunque `/lo-que-sea` no existe como fichero. Gracias al `_redirects`, Netlify manda cualquier ruta a `index.html` con código 200 y deja que React Router decida qué pintar. Sin el `_redirects`, Netlify buscaría el fichero `/lo-que-sea` en su servidor, no lo encontraría y me devolvería su propio 404 antes de cargar React. Por eso también hace falta para recargar en `/classes`: esa ruta solo existe en el navegador, no en el servidor.

## Parte 1

**Pregunta 2:** ¿qué pasaría si no devolvieras la limpieza en `Loading` y el usuario cambiara de página antes de los 5 segundos?

Respuesta: Si no devolviera la limpieza, el temporizador seguiría activo y, a los 5 segundos, llamaría a `setSlow` en un componente que ya no está en pantalla. React ya no avisa de eso (desde la versión 18), así que no vería ningún fallo, pero el temporizador se quedaría en memoria para nada y, si el usuario fuera y volviera muchas veces, se irían acumulando. Por eso devuelvo `clearTimeout`: lo cancela en cuanto el componente se desmonta.

## Parte 2

**Pregunta 3:** ¿qué pasa con el texto del buscador al recargar y al ir atrás? ¿Pasaría lo mismo si `activity` fuera un `useState`?

Respuesta: Al buscar `yoga` y recargar, el buscador sigue con el texto y el horario me muestra sus 2 clases, porque el texto está en la URL (`?activity=yoga`) y la página lo lee al cargar. Al pulsar "Atrás", el navegador vuelve a la URL anterior (en mi prueba, `?activity=spin`) y el campo muestra `spin`: cada cambio del buscador queda en el historial. Con un `useState` no pasaría nada de eso: al recargar el campo saldría vacío y "Atrás" no cambiaría la búsqueda, porque el estado vive solo en memoria y no en la dirección.

**Pregunta 4:** ¿cuántas peticiones salen la segunda vez? ¿Por qué?

Respuesta: Ninguna. La primera vez, al escribir `spin` letra a letra, conté 4 peticiones en la pestaña Red (`activity:contains=s`, `sp`, `spi` y `spin`), una por cada cambio. Al borrar y volver a escribir `spin`, no salió ninguna: RTK Query ya tenía esas consultas en su caché y las sirvió desde memoria. Solo vuelve a pedir los datos si la consulta no está guardada o si se invalida con `invalidatesTags` (por ejemplo, al crear una clase).

## Parte 3

**Pregunta 5:** ¿sigues dentro después de recargar? ¿Qué hay guardado en `localStorage`? ¿Por qué ese token no le serviría a una API de verdad?

Respuesta: Sí, sigo dentro. Al recargar, la app lee el token de `localStorage` y pide `/users/2` para saber quién soy. En `localStorage` solo veo la clave `token`, con el valor `token-fake-2`: no hay ningún dato del usuario, solo el texto del que se saca el id. Ese token no le serviría a una API de verdad porque es un texto inventado y no está firmado. Una API real (con JWT) comprueba la firma con su clave secreta, y `token-fake-2` no la tiene, así que respondería `401`. Además, al estar en `localStorage`, cualquier script que se ejecute en la página podría leerlo.

## Parte 4

**Pregunta 6:** ¿se ha borrado el Crossfit? Entonces, `ProtectedRoute` ¿basta para que un socio no pueda borrar clases? ¿Quién tiene que protegerlas de verdad?

Respuesta: Sí, el Crossfit se borró. Lancé `DELETE /classes/7` sin ningún token y json-server respondió `200`: las clases pasaron de 7 a 6. `ProtectedRoute` no basta, porque solo decide qué página se pinta en el navegador. Cualquiera puede llamar a la API directamente con `curl` o con Postman, sin pasar por la web. La protección de verdad tiene que estar en la API: debe comprobar el token y el rol de staff en cada petición que crea o borra. Eso lo hará mi API de NestJS en la Parte 5.

**Pregunta 7:** ¿quién hace que la tabla (y el horario de `/classes`) muestre la clase nueva? Explícalo con las palabras `providesTags` e `invalidatesTags`.

Respuesta: RTK Query. Las consultas de lectura (`getClasses` y `getClass`) declaran `providesTags: ["Class"]`, es decir, "mis datos pertenecen a la etiqueta Class". Las mutaciones de escritura (`createClass` y `deleteClass`) declaran `invalidatesTags: ["Class"]`, es decir, "al terminar, los datos de la etiqueta Class están viejos". Cuando creo una clase, RTK Query marca esas consultas como desactualizadas y las vuelve a pedir, y por eso la tabla y el horario se actualizan sin recargar. Lo comprobé en el ejercicio 4.2: al quitar `invalidatesTags` de `createClass`, la clase nueva no aparecía en la tabla hasta que recargaba.
