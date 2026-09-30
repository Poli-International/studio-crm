# Guía de usuario de Studio CRM

Studio CRM funciona en un solo ordenador de su estudio. El personal lo abre en un navegador web en ese ordenador o en cualquier dispositivo de la red del estudio. Sus datos permanecen en un archivo en ese ordenador. No se envía nada a Poli International.

## Instalación y puesta en marcha

1. Instale Node.js 20 o una versión más reciente.
2. Descargue los archivos de Studio CRM y abra una terminal en la carpeta `studio-crm`.
3. Ejecute `npm install` una vez, luego `npm start`.
4. Abra `http://localhost:3000` en el navegador. Otros dispositivos usan la dirección de red del ordenador en lugar de `localhost`.

Para usar un puerto distinto, defina `PORT` en un archivo `.env` (copie `.env.example`). Defina también `STUDIO_MANAGER_EMAIL` ahí, para que las alertas se dirijan a usted.

## Primer inicio: datos de demostración

Una instalación nueva se abre con clientes, citas, stock y personal de demostración, para que pueda probar cada pantalla. Cuando esté listo para el trabajo real, haga clic en **Empezar con un estudio vacío** en el panel principal. Esto elimina los registros de demostración y conserva la lista de servicios, categorías, plantillas, estaciones y ajustes. Esto no se puede deshacer.

## Idioma

Elija inglés, francés, italiano, alemán, español, neerlandés, portugués o tailandés en el menú de idioma de la parte superior. Las herramientas Poli dentro del CRM se abren en el mismo idioma cuando lo ofrecen (las herramientas sin tailandés se abren en inglés).

## Ajustes del estudio

Abra **Ajustes** para introducir sus precios, la regla de depósito, el tipo de impuesto (IVA), la política de retoques y los umbrales de stock. El estimador de precios, los presupuestos y las facturas usan estos valores, así que defínalos primero. **Exportar CSV** descarga su lista de precios; edítela y use **Importar CSV** para volver a cargarla. También puede subir el logotipo de su estudio; aparece en la barra superior.

## Clientes

**Clientes** enumera a todos con sus datos de contacto, alergias y notas médicas, consentimientos firmados y total gastado. Use **Nuevo cliente** para añadir uno. La búsqueda filtra la lista mientras escribe. **Ver perfil** abre el registro completo.

## Citas y programación

**Nueva cita** reserva una sesión única con artista, estación, precio y depósito. Para trabajos de varias sesiones, el **Programador automático** busca los huecos libres del artista en un día elegido y reserva hasta seis sesiones separadas por un número fijo de semanas. El panel principal muestra las cifras del día, las próximas reservas, el estado de las estaciones y el stock bajo.

## Consentimientos digitales

Abra el formulario de consentimiento, elija el cliente de la lista (sus alergias se completan automáticamente), confirme la verificación de edad y haga que el cliente firme en la tableta. El consentimiento se guarda con la imagen de la firma. No se guarda sin un cliente y una firma.

## Mensajes: el CRM prepara, usted envía

Studio CRM no envía por sí mismo correos, SMS ni mensajes de chat. Cuando prepara un correo de cuidados posteriores, un recordatorio o un pedido a un proveedor, aparece un panel **Mensaje listo**. Haga clic en **Correo**, **WhatsApp** o **LINE** para abrirlo en su propia app con el texto ya escrito, y pulse enviar allí, o haga clic en **Copiar**.

## Stock, escáner y pedidos de compra

**Inventario** hace seguimiento de cantidades, lotes, fechas de caducidad y proveedores. Los artículos en su nivel de reposición o por debajo cuentan como stock bajo.

El escáner en **Registro de actividad** usa la cámara del dispositivo. Escanee un SKU de stock o un número de lote para ver el artículo, o un código `CLIENT-<number>` para abrir un cliente. También puede escanear un código desde una foto. Los códigos desconocidos se listan en **Registro de errores**.

**Pedido de compra** enumera sus proveedores y sus artículos con stock bajo, crea un número de pedido, descarga un PDF y prepara el correo del pedido.

## Galería

**Portafolio** contiene fotos de trabajos terminados, vinculadas al cliente y al artista. **Diseños flash** contiene diseños con precio y depósito; marque uno como reservado cuando un cliente lo reserve. **Compartir** prepara un mensaje para WhatsApp, LINE, X o correo; el menú de compartir del teléfono puede incluir la foto.

## Dinero y personal

La **Calculadora de propinas** reparte una propina 80% artista, 15% aprendiz, 5% recepción y la registra. El personal registra la entrada y salida con el botón de turno. Las exportaciones le dan el registro de actividad, el stock bajo, los turnos y las duraciones de sesión en CSV o PDF.

## Registros de cumplimiento

La **lista de cierre** registra qué tareas se hicieron, el supervisor, el número de ciclo del autoclave y sus notas. El **Registro del autoclave** enumera los ciclos de esterilización, y el panel principal avisa sobre el stock pasado su fecha de caducidad. Estos son sus propios registros: consulte las normas de su autoridad sanitaria local sobre lo que debe conservar.

## Herramientas Poli

La pantalla **Herramientas** abre las herramientas de Poli International (calendarios de cuidados posteriores, creador de formularios de consentimiento, convertidor de calibre, estimador de precios y más) dentro del CRM.

## Copias de seguridad

Todo se almacena en `data/studio_crm.sqlite` (o en la ruta definida en `SQLITE_DB_PATH`). Copie ese archivo para hacer una copia de seguridad del estudio. El botón de instantánea también escribe una copia en `storage/backups/`.
