[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/8dHAom8r)

### Para instalar dependencias
````
npm install
````

### Antes de comenzar
En el backend correr
```
node generateVAPID.js
```

Generar `.env` tanto en frontend como en backend.

El del backend debe ser:
```

VAPID_PUBLIC=BOr2…tuClavePública…XjY
VAPID_PRIVATE=5Yz…tuClavePrivada…Qn8

```
El del frontend debe ser:
```
VITE_VAPID_PUBLIC_KEY=BOr2…tuClavePública…XjY
```

### Para correr el proyecto
backend
```
node index.js
```

frontend
```
npm run dev
```

### Para visualizar el las funcionalidades offline con estilos

se debe correr el codigo en produccion. Para esto primero debemos hacer un build del proyecto en el frontend
```
npm run build
```

y despues se debe ver el preview en el puerto que se corrió
```
npm run preview
```

si lo corremos en el modo dev ```npm run dev``` entonces todo lo que sea offline se verá sin estilos.


Informacion acerca de la entrega: Finalmente en la rama feat/adding-ngrok-to-project esta casi listo el funcionamiento para los moviles. Presentamos problemas de con las videollamadas y las entregas de informacion (post) de los endpoints nuevos con ngrok. En local lo que esta entregado en main contempla todas las funcionalidades correctamente.

Se uso ChatGPT-4o para contexto y ayuda de implementacion de algunas funcionalidades

