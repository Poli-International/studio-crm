# Guida utente di Studio CRM

Studio CRM funziona su un solo computer nel vostro studio. Il personale lo apre in un browser web su quel computer o su qualsiasi dispositivo della rete dello studio. I vostri dati restano in un file su quel computer. Niente viene inviato a Poli International.

## Installazione e avvio

1. Installate Node.js 22 o una versione più recente.
2. Scaricate i file di Studio CRM e aprite un terminale nella cartella `studio-crm`.
3. Eseguite `npm install` una volta, poi `npm start`.
4. Aprite `http://localhost:3000` nel browser. Gli altri dispositivi usano l'indirizzo di rete del computer invece di `localhost`.

Per usare una porta diversa, impostate `PORT` in un file `.env` (copiate `.env.example`). Impostate anche `STUDIO_MANAGER_EMAIL` lì, in modo che gli avvisi siano indirizzati a voi.

## Primo avvio: dati demo

Una nuova installazione si apre con clienti, appuntamenti, magazzino e personale di esempio, così potete provare ogni schermata. Quando siete pronti per il lavoro reale, cliccate su **Inizia con uno studio vuoto** nella Dashboard. Questo elimina i dati demo e conserva l'elenco dei servizi, le categorie, i modelli, le postazioni e le impostazioni. Questa azione è irreversibile.

## Lingua

Scegliete inglese, francese, italiano, tedesco, spagnolo, olandese, portoghese o thailandese dal menu della lingua in alto. Gli strumenti Poli all'interno del CRM si aprono nella stessa lingua quando la offrono (gli strumenti senza thailandese si aprono in inglese).

## Impostazioni dello studio

Aprite **Impostazioni** per inserire i vostri prezzi, la regola dell'acconto, l'aliquota fiscale (IVA), la politica dei ritocchi e le soglie di magazzino. Il preventivatore prezzi, i preventivi e le fatture leggono questi valori, quindi impostateli prima. **Esporta CSV** scarica il vostro listino prezzi; modificatelo e usate **Importa CSV** per ricaricarlo. Potete anche caricare il logo del vostro studio; appare nella barra superiore.

## Clienti

**Clienti** elenca tutti con i loro dati di contatto, allergie e note mediche, consensi firmati e totale spesa. Usate **Nuovo cliente** per aggiungerne uno. La ricerca filtra l'elenco mentre digitate. **Visualizza profilo** apre la scheda completa.

## Appuntamenti e pianificazione

**Nuovo appuntamento** prenota una singola sessione con artista, postazione, prezzo e acconto. Per lavori su più sessioni, il **Pianificatore automatico** cerca gli slot liberi dell'artista in un giorno scelto e prenota fino a sei sessioni a un numero fisso di settimane di distanza. La Dashboard mostra i dati di oggi, le prenotazioni in arrivo, lo stato delle postazioni e le scorte basse.

## Consensi digitali

Aprite il modulo di consenso, scegliete il cliente dall'elenco (le sue allergie vengono compilate automaticamente), confermate la verifica dell'età e fate firmare il cliente sul tablet. Il consenso viene salvato con l'immagine della firma. Non si salva senza un cliente e una firma.

## Messaggi: il CRM prepara, voi inviate

Studio CRM non invia da solo email, SMS o messaggi di chat. Quando preparate un'email di aftercare, un promemoria o un ordine al fornitore, appare un pannello **Messaggio pronto**. Cliccate su **Email**, **WhatsApp** o **LINE** per aprirlo nella vostra app con il testo già compilato, poi premete invia lì, oppure cliccate su **Copia**.

## Magazzino, scanner e ordini d'acquisto

**Magazzino** tiene traccia di quantità, lotti, date di scadenza e fornitori. Gli articoli al livello di riordino o sotto di esso sono considerati scorte basse.

Lo scanner in **Registro attività** usa la fotocamera del dispositivo. Scansionate un codice articolo o un numero di lotto per vedere l'articolo, oppure un codice `CLIENT-<number>` per aprire un cliente. Potete anche scansionare un codice da una foto. I codici non riconosciuti sono elencati in **Registro errori**.

**Ordine d'acquisto** elenca i vostri fornitori e i loro articoli in scorta bassa, crea un numero d'ordine, scarica un PDF e prepara l'email d'ordine.

## Galleria

**Portfolio lavori** contiene le foto dei lavori finiti, collegate al cliente e all'artista. **Flash** contiene i disegni con prezzo e acconto; contrassegnate uno come riservato quando un cliente lo prenota. **Condividi** prepara un messaggio per WhatsApp, LINE, X o email; il menu di condivisione del telefono può includere la foto.

## Denaro e personale

Il **Calcolatore mance** divide una mancia 80% artista, 15% apprendista, 5% reception e la registra. Il personale timbra entrata e uscita con il pulsante turno. Le esportazioni forniscono il registro attività, le scorte basse, i turni e le durate delle sessioni in CSV o PDF.

## Registri di conformità

La **checklist di chiusura** registra quali attività sono state svolte, il supervisore, il numero di ciclo dell'autoclave e le vostre note. Il **Registro autoclave** elenca i cicli di sterilizzazione, e la Dashboard avvisa sulle scorte oltre la data di scadenza. Questi sono i vostri registri: verificate le regole della vostra autorità sanitaria locale su cosa dovete conservare.

## Strumenti Poli

La schermata **Strumenti** apre gli strumenti Poli International (calendari di aftercare, generatore di moduli di consenso, convertitore di calibro, preventivatore prezzi e altro) all'interno del CRM.

## Backup

Tutto è memorizzato in `data/studio_crm.sqlite` (o nel percorso impostato in `SQLITE_DB_PATH`). Copiate quel file per fare il backup dello studio. Il pulsante snapshot scrive anche una copia in `storage/backups/`.
