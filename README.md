# Servidor para recargas

## Sinopsis

Esta es la api utilizada por **piker-recargas**, incluye funcionalidad para contactar a un servidor SOAP y guardar información en una base de datos utilizando mongodb.

## Instalación

Para instalar, simplemente clona este repositorio y corre el comando  `npm install` dentro de la carpeta. Para correr el servidor corre el comando `npm start`, el servidor deberá empezar a correr en `http://localhost:8888/`.

## API
- ` GET /api/recargas` devuelve la lista entera de pedidos en la base de datos
- ` POST /api/recargas` instancia un nuevo pedido en la base de datos si la llamada al servidor SOAP regresa un código **200**

(Esta funcionalidad cambiara al implementar usuarios en un futuro).

## Tests

Describe and show how to run the tests with code examples.

## Contributors

1. Eduardo Picazo
2. Bernardo Mondragon

## Licencia

MIT.
