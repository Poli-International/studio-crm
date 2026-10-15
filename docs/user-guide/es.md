# Guía de usuario de Studio CRM

Studio CRM funciona en un solo ordenador de su estudio. El personal lo abre en un navegador web en ese ordenador o en cualquier dispositivo de la red del estudio. Sus datos permanecen en un archivo en ese ordenador. No se envía nada a Poli International.

## Instalación y puesta en marcha

1. Descargue el ZIP de Studio CRM para su ordenador (Windows, Mac o Linux) desde la página de Studio CRM. Node.js ya está incluido; no hay nada más que instalar.
2. Descomprímalo. Ponga la carpeta `studio-crm` donde pueda quedarse, por ejemplo en Documentos.
3. Haga doble clic en **Start Studio CRM** (`Start Studio CRM.bat` en Windows, `Start Studio CRM.command` en Mac, `./start-studio-crm.sh` en Linux). En Mac, la primera vez, haga clic derecho y elija **Abrir**.
4. Su navegador se abre en `http://localhost:3000`. Mantenga abierta la ventana que apareció mientras usa el CRM; al cerrarla, el CRM se detiene. Los demás dispositivos usan la dirección de red del ordenador en lugar de `localhost`, con `:3000` al final.

Si descargó el código fuente, instale Node.js 22 o posterior, ejecute `npm install` una vez y luego `npm start`. Con Docker: `docker compose up -d`.

Para actualizar, descargue el nuevo ZIP, descomprímalo en una carpeta nueva y copie su carpeta `data` de la carpeta antigua a la nueva.

Para usar un puerto distinto, defina `PORT` en un archivo `.env` (copie `.env.example`). Defina también `STUDIO_MANAGER_EMAIL` ahí, para que las alertas se dirijan a usted.

## Primer inicio: datos de demostración

Una instalación nueva se abre con clientes, citas, stock y personal de demostración, para que pueda probar cada pantalla. Cuando esté listo para el trabajo real, haga clic en **Empezar con un estudio vacío** en el panel principal. Esto elimina los registros de demostración y conserva la lista de servicios, categorías, plantillas, estaciones y ajustes. Esto no se puede deshacer.

## Idioma

Elija inglés, francés, italiano, alemán, español, neerlandés, portugués o tailandés en el menú de idioma de la parte superior. Las herramientas Poli dentro del CRM se abren en el mismo idioma cuando lo ofrecen (las herramientas sin tailandés se abren en inglés).

## Ajustes del estudio

Abra **Ajustes** para introducir sus precios, la regla de depósito, el tipo de impuesto (IVA), la política de retoques y los umbrales de stock. El estimador de precios, los presupuestos y las facturas usan estos valores, así que defínalos primero. **Exportar CSV** descarga su lista de precios; edítela y use **Importar CSV** para volver a cargarla. También puede subir el logotipo de su estudio; aparece en la barra superior.

## Clientes

**Clientes** enumera a todos con sus datos de contacto, alergias y notas médicas, consentimientos firmados y total gastado. Use **Nuevo cliente** para añadir uno. La búsqueda filtra la lista mientras escribe. **Ver perfil** abre el registro completo. En el perfil, **Editar cliente** cambia los datos y **Eliminar** borra al cliente. El perfil también muestra las citas, las notas del personal, los consentimientos firmados, los formularios de consentimiento guardados y las fotos de los trabajos. Para añadir muchos clientes a la vez, abra **Ajustes**, **Import Data** y pegue una lista cuya primera línea sea `name,email,phone,allergies,notes`. El recuento **Signed** incluye los formularios de consentimiento firmados en la tableta. **Healing Pipeline** lista los clientes cuya sesión se marcó como completada en los últimos 90 días, agrupados por días desde la sesión, con **View Profile** y **Download PDF**.

## Personal

Haga clic en el botón del personal, arriba a la derecha, para ver a su equipo. **Añadir miembro** añade una persona, **Editar** cambia sus datos y **Quitar** la retira del equipo. **Seleccionar** muestra el nombre de esa persona en la barra superior, para que todos vean quién está en la pantalla. Una vez establecida la contraseña del estudio, cada persona puede tener también su propio acceso y nivel (ver más abajo). Un miembro nuevo se puede elegir enseguida en cualquier lugar donde se elige un artista, por ejemplo al reservar una cita.

## Tabletas, teléfonos y la contraseña del estudio

Los demás dispositivos del estudio abren el CRM con la dirección que aparece en la ventana que lo inició. Una tableta o un teléfono que necesite la cámara (el escáner) debe usar la dirección que empieza por `https://` y termina en `:3443`. La primera vez, el navegador avisa de que la conexión no es privada, porque el certificado lo creó su propio equipo: elija Avanzado y luego Continuar. Con la dirección `http://` simple funciona todo menos la cámara.

La primera vez que se inicia, el CRM le pide crear la **contraseña del estudio**. Cada ordenador, tableta y teléfono inicia sesión una vez con ella. Puede elegir **Continue without a password** y establecerla más tarde en **Ajustes**, **Contraseña del estudio**. Si la olvida, cree un archivo vacío llamado `reset-password.txt` en la carpeta `data` y vuelva a iniciar el CRM: esto elimina la contraseña del estudio y todos los accesos del personal.

**Bloquear un dispositivo sin usar:** en **Ajustes**, bajo la contraseña del estudio, elija cuánto tiempo puede estar un dispositivo sin usarse (5, 10, 15 o 30 minutos) antes de cerrar la sesión por sí solo. El quiosco de la tableta nunca se bloquea: tiene su propio PIN de salida.

**Accesos y niveles del personal:** con la contraseña del estudio establecida, abra la lista del personal, haga clic en **Editar** en una persona y elija un **Nivel de acceso** y una **Contraseña de acceso** (8 caracteres como mínimo). Asígnese primero el nivel **Administrador**: los accesos del personal funcionan en cuanto un administrador tiene uno. A partir de ahí, la página de inicio de sesión pregunta **Who are you?** y cada persona entra con su propia contraseña. La contraseña del estudio sigue funcionando y entra como administrador.

- **Recepción**: clientes, citas, consentimientos, pagos, fichar entrada y salida.
- **Personal**: todo lo de recepción, más stock, proveedores, registros de cumplimiento, cuidados posteriores, turnos y el diseño de los consentimientos.
- **Administrador**: todo, incluido borrar registros, los informes de dinero, Ajustes, el equipo, los accesos, las copias de seguridad y las importaciones.

Recepción y personal no ven Finanzas ni Ajustes. Si alguien intenta algo que su nivel no permite, el CRM lo indica y no cambia nada. Para quitar un acceso, ponga el nivel en **Sin acceso**.

## Citas y programación

**Nueva cita** reserva una sesión única con artista, estación, precio y depósito. Para trabajos de varias sesiones, el **Programador automático** busca los huecos libres del artista en un día elegido y reserva hasta seis sesiones separadas por un número fijo de semanas. El panel principal muestra las cifras del día, las próximas reservas, el estado de las estaciones y el stock bajo. El Calendario muestra todas las citas reservadas, las próximas primero. **Completada** marca una sesión como hecha, así cuenta en el análisis de duraciones, y **Quitar** la elimina. **Edit** en una cita cambia la hora, el artista, la estación, el precio, el depósito o las notas. Al reservar, escriba el nombre del cliente y elíjalo de la lista, para que la cita aparezca en su perfil. Pulsar dos veces seguidas un botón de guardar guarda una sola vez. La lista muestra también el depósito de cada cita y lo que queda por pagar (precio menos depósito).

## Consentimientos digitales

Abra el formulario de consentimiento, elija el cliente de la lista (sus alergias se completan automáticamente), confirme la verificación de edad y haga que el cliente firme en la tableta. El consentimiento se guarda con la imagen de la firma. No se guarda sin un cliente y una firma. Abierto desde el perfil de un cliente, el formulario ya tiene ese cliente elegido.

Para que el cliente rellene un formulario de consentimiento en una tableta, abra **Clientes**, el creador de formularios de consentimiento, la vista previa del formulario y luego el modo quiosco para tableta. El cliente responde una sección por pantalla, firma en la última y toca el botón para terminar. El formulario se guarda con la firma y se descarga un PDF. Si antes no se eligió ningún cliente, se crea un cliente nuevo con el nombre, el correo, el teléfono y la fecha de nacimiento del formulario. Los formularios guardados están en el perfil del cliente, en **Consentimientos**; **Ver respuestas** muestra cada respuesta. Un formulario editado en el creador de formularios se guarda con los datos del estudio: la tableta muestra el mismo formulario que el equipo donde lo editó.


Para que el cliente no pueda salir del formulario si usted se aleja, defina un **Tablet Kiosk PIN** en **Ajustes**. Salir del modo quiosco pedirá entonces el PIN. Cuando el cliente pulsa **Complete**, el quiosco comprueba que no falte nada, guarda el formulario y muestra «Thank you, your form has been submitted» hasta que alguien del estudio introduce el PIN. Los consentimientos firmados están en el perfil del cliente, en **Consentimientos**: **View waiver** muestra las respuestas y la firma, y **Download PDF** guarda una copia para imprimir o conservar.

**Tabletas quiosco:** una tableta en un soporte solo sirve para formularios. En **Ajustes**, **Tabletas quiosco**, defina una contraseña de quiosco (necesita la contraseña del estudio). En la tableta, abra la dirección que se indica (termina en `/kiosk`), entre con la contraseña del quiosco y dé un nombre a la tableta; mostrará «Espere, por favor». Para enviar un formulario, abra **Clientes**, **Firmar exención** en el cliente, elija el formulario, **Vista previa** y luego **Enviar al quiosco**. El formulario se abre en la tableta; cuando el cliente toca **Completar**, se guarda en ese cliente (en **Consentimientos**) y la tableta vuelve a esperar. Si envía mientras otro formulario sigue esperando, puede **Retirar** el que espera. Un acceso de quiosco no puede abrir el CRM ni leer datos de clientes. Active la pantalla completa o el modo quiosco de la tableta (por ejemplo, la fijación de pantalla de Android o un navegador quiosco) para que el cliente no salga de la página.
## Mensajes: el CRM prepara, usted envía

Studio CRM no envía por sí mismo correos, SMS ni mensajes de chat. Cuando prepara un correo de cuidados posteriores, un recordatorio o un pedido a un proveedor, aparece un panel **Mensaje listo**. Haga clic en **Correo**, **WhatsApp** o **LINE** para abrirlo en su propia app con el texto ya escrito, y pulse enviar allí, o haga clic en **Copiar**.

## Stock, escáner y pedidos de compra

**Inventario** hace seguimiento de cantidades, lotes, fechas de caducidad y proveedores. Los artículos en su nivel de reposición o por debajo cuentan como stock bajo. La lista **Stock items** muestra cada artículo con su cantidad, nivel de pedido, lote, caducidad y proveedor; busque por nombre, SKU o proveedor. **+ Add item** añade uno a mano y **Edit** lo cambia. **Suppliers** lista sus proveedores: **+ Add supplier** y **Edit**. Los pedidos se envían al correo de pedidos del proveedor; compruébelo.

El escáner en **Registro de actividad** usa la cámara del dispositivo. Escanee un SKU de stock o un número de lote para ver el artículo, o un código `CLIENT-<number>` para abrir un cliente. También puede escanear un código desde una foto. Los códigos desconocidos se listan en **Registro de errores**.

**Pedido de compra** enumera sus proveedores y sus artículos con stock bajo, crea un número de pedido, descarga un PDF y prepara el correo del pedido.

## Galería

**Portafolio** contiene fotos de trabajos terminados, vinculadas al cliente y al artista. **Diseños flash** contiene diseños con precio y depósito; marque uno como reservado cuando un cliente lo reserve. **Compartir** prepara un mensaje para WhatsApp, LINE, X o correo; el menú de compartir del teléfono puede incluir la foto.

## Dinero y personal

La **Calculadora de propinas** reparte una propina 80% artista, 15% aprendiz, 5% recepción y la registra. El personal registra la entrada y salida con el botón de turno. Las exportaciones le dan el registro de actividad, el stock bajo, los turnos y las duraciones de sesión en CSV o PDF. En el Calendario, la ventana de turnos muestra si una persona está de turno, y la lista de **Turnos** recoge los turnos previstos: elija una persona, una fecha y el horario, y pulse **Añadir turno**. La exportación de turnos y, en Inventario, la exportación del stock guardan un archivo CSV o PDF en su carpeta de Descargas. En **Finanzas**, **Record Payment** registra un pago: el cliente, el importe y la forma de pago. **Deposit Ledger** lista los depósitos cobrados al reservar.

## Registros de cumplimiento

La **lista de cierre** registra qué tareas se hicieron, el supervisor, el número de ciclo del autoclave y sus notas. El **Registro del autoclave** enumera los ciclos de esterilización, y el panel principal avisa sobre el stock pasado su fecha de caducidad. Estos son sus propios registros: consulte las normas de su autoridad sanitaria local sobre lo que debe conservar.

## Herramientas Poli

La pantalla **Herramientas** abre las herramientas de Poli International (calendarios de cuidados posteriores, creador de formularios de consentimiento, convertidor de calibre, estimador de precios y más) dentro del CRM.

## Copias de seguridad

Todo se almacena en `data/studio_crm.sqlite` (o en la ruta definida en `SQLITE_DB_PATH`). Copie ese archivo para hacer una copia de seguridad del estudio. El botón de instantánea también escribe una copia en `storage/backups/`.
