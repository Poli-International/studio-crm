# Guida utente di Studio CRM

Studio CRM funziona su un solo computer nel vostro studio. Il personale lo apre in un browser web su quel computer o su qualsiasi dispositivo della rete dello studio. I vostri dati restano in un file su quel computer. Niente viene inviato a Poli International.

## Installazione e avvio

1. Scaricate lo ZIP di Studio CRM per il vostro computer (Windows, Mac o Linux) dalla pagina Studio CRM. Node.js è già incluso; non c'è altro da installare.
2. Decomprimetelo. Mettete la cartella `studio-crm` dove può restare, per esempio in Documenti.
3. Fate doppio clic su **Start Studio CRM** (`Start Studio CRM.bat` su Windows, `Start Studio CRM.command` su Mac, `./start-studio-crm.sh` su Linux). Su Mac, la prima volta, fate clic destro e scegliete **Apri**.
4. Il browser si apre su `http://localhost:3000`. Tenete aperta la finestra che è comparsa mentre usate il CRM; chiuderla ferma il CRM. Gli altri dispositivi usano l'indirizzo di rete del computer al posto di `localhost`, con `:3000` alla fine.

Se avete scaricato il codice sorgente, installate Node.js 22 o più recente, poi eseguite `npm install` una volta e `npm start`. Con Docker: `docker compose up -d`.

**Aggiornare:** quando esce una nuova versione, il numero di versione in fondo al menu indica **aggiornamento disponibile**. Aprite **Impostazioni**, **Aggiornamenti** e fate clic su **Aggiorna ora** (solo un amministratore). Il CRM scarica la nuova versione, salva una copia del database in `storage/backups`, prova la nuova versione su una copia dei vostri dati e solo allora la installa e si riavvia da solo; la pagina si ricarica. I vostri dati restano nella cartella `data` e non vengono mai spostati. Se qualcosa va storto, non cambia nulla e la vecchia versione continua a funzionare. La versione precedente resta nella cartella nascosta `.update/previous`. Le versioni precedenti alla 1.0.12 si aggiornano a mano una volta: scaricate il nuovo ZIP, decomprimetelo in una nuova cartella e copiate la vostra cartella `data` dalla vecchia cartella alla nuova.

Per usare una porta diversa, impostate `PORT` in un file `.env` (copiate `.env.example`). Impostate anche `STUDIO_MANAGER_EMAIL` lì, in modo che gli avvisi siano indirizzati a voi.

## Primo avvio: dati demo

Una nuova installazione si apre con clienti, appuntamenti, magazzino e personale di esempio, così potete provare ogni schermata. Quando siete pronti per il lavoro reale, cliccate su **Inizia con uno studio vuoto** nella Dashboard. Questo elimina i dati demo e conserva l'elenco dei servizi, le categorie, i modelli, le postazioni e le impostazioni. Questa azione è irreversibile.

## Lingua

Scegliete inglese, francese, italiano, tedesco, spagnolo, olandese, portoghese o thailandese dal menu della lingua in alto. Gli strumenti Poli all'interno del CRM si aprono nella stessa lingua quando la offrono (gli strumenti senza thailandese si aprono in inglese).

## Impostazioni dello studio

Aprite **Impostazioni** per inserire i vostri prezzi, la regola dell'acconto, l'aliquota fiscale (IVA), la politica dei ritocchi e le soglie di magazzino. Il preventivatore prezzi, i preventivi e le fatture leggono questi valori, quindi impostateli prima. **Esporta CSV** scarica il vostro listino prezzi; modificatelo e usate **Importa CSV** per ricaricarlo. Potete anche caricare il logo del vostro studio; appare nella barra superiore.

**Dati dello studio e postazioni:** in **Impostazioni**, **Dati dello studio**, inserite nome, indirizzo, telefono, e-mail e numero di autorizzazione sanitaria o licenza dello studio: ogni modulo di consenso li mostra, sul computer e sui tablet. In **Postazioni**, aggiungete, rinominate o rimuovete le vostre postazioni (sala tatuaggi, sala piercing, area branding...), date a ciascuna un tipo e un artista abituale. Il modulo di prenotazione elenca le vostre postazioni, e prenotare un artista sceglie la postazione dove lavora di solito.

## Clienti

**Clienti** elenca tutti con i loro dati di contatto, allergie e note mediche, consensi firmati e totale spesa. Usate **Nuovo cliente** per aggiungerne uno. La ricerca filtra l'elenco mentre digitate. **Visualizza profilo** apre la scheda completa. Nel profilo, **Modifica cliente** cambia i dati e **Elimina** rimuove il cliente. Il profilo mostra anche gli appuntamenti, le note del personale, le liberatorie firmate, i moduli di consenso salvati e le foto dei lavori. Per aggiungere molti clienti insieme, aprite **Impostazioni**, **Importa Dati** e incollate un elenco la cui prima riga è `name,email,phone,allergies,notes`. Il conteggio **Firmato** include i moduli di consenso firmati sul tablet. In **Lavori e foto**, **Scatta o scegli una foto** aggiunge un'immagine dal dispositivo, o dalla sua fotocamera su un telefono o un tablet. **Percorso di Guarigione** elenca i clienti la cui seduta è stata segnata come completata negli ultimi 90 giorni, raggruppati per giorni dalla seduta, con **Visualizza Profilo** e **Scarica PDF**.

**Cura successiva:** nella scheda di un cliente, in **Cura successiva**, scegliete la scheda (tatuaggio, piercing, linea sottile, trucco permanente) e l'appuntamento, poi **Stampa e registra la cura**: la scheda si stampa con i dati dello studio e il nome del cliente, e il CRM registra quale scheda è stata consegnata, per quale appuntamento, da chi e quando. Ogni appuntamento mostra se la cura è stata consegnata. **Scheda di cura** in Clienti stampa una scheda senza nome del cliente, senza registrare nulla. Ogni scheda si stampa nella lingua scelta accanto. In **Impostazioni**, **Schede di cura**, cambiate titolo, descrizione e passaggi di ogni scheda in ogni lingua, o aggiungete le vostre schede; una lingua lasciata vuota stampa l'inglese.

## Personale

Fate clic sul pulsante del personale in alto a destra per vedere il team. **Aggiungi membro** aggiunge una persona, **Modifica** ne cambia i dati e **Rimuovi** la toglie dal team. **Seleziona** mostra il nome di quella persona nella barra in alto, così tutti vedono chi è allo schermo. Una volta impostata la password dello studio, ogni persona può avere anche un proprio accesso e livello (vedi sotto). Un nuovo membro si può scegliere subito ovunque si scelga un artista, per esempio quando si prenota un appuntamento.

## Tablet, telefoni e password dello studio

Gli altri dispositivi dello studio aprono il CRM con l'indirizzo mostrato nella finestra che lo ha avviato. Un tablet o un telefono che ha bisogno della fotocamera (lo scanner) deve usare l'indirizzo che inizia con `https://` e finisce con `:3443`. La prima volta il browser avvisa che la connessione non è privata, perché il certificato è stato creato dal vostro computer: scegliete Avanzate, poi Continua. Con il semplice indirizzo `http://` funziona tutto tranne la fotocamera.

Al primo avvio il CRM vi chiede di creare la **password dello studio**. Ogni computer, tablet e telefono accede poi una volta con essa. Potete scegliere **Continue without a password** e impostarla più tardi in **Impostazioni**, **Password dello studio**. Se la dimenticate, create un file vuoto chiamato `reset-password.txt` nella cartella `data` e riavviate il CRM: questo rimuove la password dello studio e tutti gli accessi del personale.

**Bloccare un dispositivo inutilizzato:** in **Impostazioni**, sotto la password dello studio, scegliete per quanto tempo un dispositivo può restare inutilizzato (5, 10, 15 o 30 minuti) prima di disconnettersi da solo. Il chiosco del tablet non viene mai bloccato: ha il suo PIN di uscita.

**Accessi e livelli del personale:** con la password dello studio impostata, aprite l'elenco del personale, cliccate su **Modifica** per una persona e scegliete un **Livello di accesso** e una **Password di accesso** (almeno 8 caratteri). Dal primo accesso creato, la pagina di accesso chiede **Who are you?**: ognuno sceglie il proprio nome ed entra con la propria password. La password dello studio resta prima in quell'elenco ed entra ancora come amministratore; date anche a voi stessi il livello **Amministratore** se volete un accesso personale. Per cambiare la persona allo schermo, cliccate sul nome in alto, poi **Esci**: la persona successiva entra con la propria password.

**Ruoli:** in **Impostazioni**, **Ruoli**, spuntate cosa può aprire e modificare ogni ruolo: clienti e appuntamenti, magazzino e fornitori, sterilizzazione e conformità, turni del personale, moduli di consenso e schede di cura, denaro e report, eliminazione dei record. Reception e Staff ci sono sempre e partono da ciò che potevano fare prima; **Aggiungi ruolo** ne crea uno vostro ("Sterilizzazione", "Apprendista") e **Salva i ruoli** conserva le modifiche. Un ruolo senza un'area non ne vede la schermata, e il CRM rifiuta le sue modifiche. Solo un **Amministratore** modifica le Impostazioni, il team, gli accessi e i ruoli. Un ruolo ancora assegnato a qualcuno non si può rimuovere: dategli prima un altro ruolo.

- **Reception**: clienti, appuntamenti, consensi, pagamenti, timbratura di entrata e uscita.
- **Staff**: tutto quello della reception, più magazzino, fornitori, registri di conformità, cura post-trattamento, turni e il design dei moduli di consenso.
- **Amministratore**: tutto, compresa l'eliminazione dei record, i report economici, le Impostazioni, il team, gli accessi, i backup e le importazioni.

Reception e personale non vedono Finanza e Impostazioni. Se qualcuno prova un'azione che il suo livello non consente, il CRM lo dice e non cambia nulla. Per rimuovere un accesso, impostate il livello su **Nessun accesso**.

## Appuntamenti e pianificazione

**Nuovo appuntamento** prenota una singola sessione con artista, postazione, prezzo e acconto. Per lavori su più sessioni, il **Pianificatore automatico** cerca gli slot liberi dell'artista in un giorno scelto e prenota fino a sei sessioni a un numero fisso di settimane di distanza. La Dashboard mostra i dati di oggi, le prenotazioni in arrivo, lo stato delle postazioni e le scorte basse. Il Calendario elenca tutti gli appuntamenti prenotati, i prossimi per primi. **Completato** segna una sessione come svolta, così viene contata nell'analisi delle durate, e **Rimuovi** la elimina. **Modifica** su un appuntamento cambia ora, artista, postazione, prezzo, acconto o note. Quando prenoti, digita il nome del cliente e sceglilo dall'elenco, così l'appuntamento compare nella sua scheda. Due tocchi rapidi su un pulsante di salvataggio salvano una sola volta. L'elenco mostra anche l'acconto di ogni appuntamento e quanto resta da pagare (prezzo meno acconto).

## Consensi digitali

Aprite il modulo di consenso, scegliete il cliente dall'elenco (le sue allergie vengono compilate automaticamente), confermate la verifica dell'età e fate firmare il cliente sul tablet. Il consenso viene salvato con l'immagine della firma. Non si salva senza un cliente e una firma. Aperto dalla scheda di un cliente, il modulo ha già quel cliente selezionato.

Per far compilare un modulo di consenso su un tablet, aprite **Clienti**, il generatore di moduli di consenso, l'anteprima del modulo, poi la modalità chiosco per tablet. Il cliente risponde a una sezione per schermata, firma nell'ultima e tocca il pulsante per completare. Il modulo viene salvato con la firma e viene scaricato un PDF. Se prima non è stato scelto alcun cliente, viene creato un nuovo cliente con nome, email, telefono e data di nascita del modulo. I moduli salvati sono nel profilo del cliente, sotto **Liberatorie**; **Vedi risposte** mostra ogni risposta. Un modulo modificato nel generatore di moduli viene salvato con i dati dello studio: il tablet mostra quindi lo stesso modulo del computer su cui lo avete modificato.


Per impedire al cliente di uscire dal modulo quando ti allontani, imposta un **PIN del chiosco tablet** in **Impostazioni**. Per uscire dalla modalità kiosk servirà il PIN. Quando il cliente tocca **Complete**, il kiosk controlla che non manchi nulla, salva il modulo e mostra «Thank you, your form has been submitted» finché un membro dello staff non inserisce il PIN. I consensi firmati sono nella scheda del cliente, sotto **Liberatorie**: **View waiver** mostra le risposte e la firma, e **Scarica PDF** salva una copia da stampare o conservare.

**Tablet chiosco:** un tablet su un supporto serve solo per i moduli. In **Impostazioni**, **Tablet chiosco**, imposta una password del chiosco (serve la password dello studio). Sul tablet apri l’indirizzo indicato (finisce con `/kiosk`), accedi con la password del chiosco e dai un nome al tablet; mostrerà «Attendere prego». Per inviare un modulo apri **Clienti**, **Firma Liberatoria** sul cliente, scegli il modulo, **Anteprima modulo**, poi **Invia al chiosco**. Il modulo si apre sul tablet; quando il cliente tocca **Completa** viene salvato su quel cliente (in **Liberatorie**) e il tablet torna in attesa. Se invii mentre un modulo è ancora in attesa, puoi **Ritira** quello in attesa. L’accesso del chiosco non può aprire il CRM né leggere dati dei clienti. Attiva lo schermo intero o la modalità chiosco del tablet (per esempio il blocco app di Android o un browser kiosk) così il cliente resta sulla pagina.

**Configurare un tablet chiosco, buono a sapersi:** la prima volta il tablet avvisa che la connessione non è privata: tocca **Avanzate**, poi **Procedi** (Chrome) o **Continua** (Edge). È il tuo server; il certificato l'ha creato lui. Se l'avviso torna di continuo, o un browser kiosk si blocca lì, usa l'indirizzo `http://` che **Impostazioni** mostra sotto: nessun avviso, ma i moduli attraversano la rete senza cifratura, quindi usalo solo sul Wi-Fi dello studio. Assegna al computer del CRM un indirizzo fisso nel router ("prenotazione DHCP" o "IP statico"), altrimenti i tablet lo perdono quando l'indirizzo cambia. Quando il CRM si riavvia, il tablet resta collegato e il modulo in attesa resta lì.

**Clienti minori di 18 anni e verifica del documento:** il CRM calcola l'età di ogni cliente dalla data di nascita (dalla scheda, dalla verifica del documento o da una data di nascita scritta dal cliente su un modulo). Un cliente minore di 18 anni è segnalato **Minore di 18 anni** nell'elenco clienti, nella scheda e nel modulo di prenotazione, e i suoi moduli richiedono la firma di un genitore o tutore: il CRM non salva né invia un modulo senza (il modello di consenso per minori la prevede). Se un cliente scrive sul tablet una data di nascita sotto i 18 anni, il modulo firmato viene conservato ma segnato in rosso, e il registro attività lo segnala. Nella scheda del cliente, **Registra una verifica del documento** conserva il tipo di documento e solo gli ultimi 4 caratteri, con chi l'ha verificato e quando; ogni modulo firmato in seguito mostra età e verifica, a schermo e nel PDF.

**Campo Scanner:** nel creatore di moduli, aggiungete un campo **Scanner** a un modulo e date al suo pulsante le vostre parole. Sul modulo, il pulsante scansiona una pagina con lo scanner collegato al computer su cui gira il CRM, dalla reception o da un tablet; la pagina viene conservata con il modulo come una foto, e stampata nel suo PDF. Su Windows usa la scansione integrata di Windows (WIA): se lo scanner funziona con l'app Scanner di Windows, funziona anche qui. Su Linux usa SANE. Non ancora su Mac.
## Messaggi: il CRM prepara, voi inviate

Studio CRM non invia da solo email, SMS o messaggi di chat. Quando preparate un'email di aftercare, un promemoria o un ordine al fornitore, appare un pannello **Messaggio pronto**. Cliccate su **Email**, **WhatsApp** o **LINE** per aprirlo nella vostra app con il testo già compilato, poi premete invia lì, oppure cliccate su **Copia**.

## Magazzino, scanner e ordini d'acquisto

**Magazzino** tiene traccia di quantità, lotti, date di scadenza e fornitori. Gli articoli al livello di riordino o sotto di esso sono considerati scorte basse. L'elenco **Articoli di magazzino** mostra ogni articolo con quantità, soglia di riordino, lotto, scadenza e fornitore; cerca per nome, SKU o fornitore. **+ Aggiungi articolo** aggiunge un articolo a mano e **Modifica** lo modifica. **Fornitori** elenca i fornitori: **+ Aggiungi fornitore** e **Modifica**. Gli ordini partono all'email ordini del fornitore: controllala.

Lo scanner in **Registro attività** usa la fotocamera del dispositivo. Scansionate un codice articolo o un numero di lotto per vedere l'articolo, oppure un codice `CLIENT-<number>` per aprire un cliente. Potete anche scansionare un codice da una foto. I codici non riconosciuti sono elencati in **Registro errori**.

**Ordine d'acquisto** elenca i vostri fornitori e i loro articoli in scorta bassa, crea un numero d'ordine, scarica un PDF e prepara l'email d'ordine.

## Galleria

**Portfolio lavori** contiene le foto dei lavori finiti, collegate al cliente e all'artista. **Flash** contiene i disegni con prezzo e acconto; contrassegnate uno come riservato quando un cliente lo prenota. **Condividi** prepara un messaggio per WhatsApp, LINE, X o email; il menu di condivisione del telefono può includere la foto.

## Denaro e personale

Il **Calcolatore mance** divide una mancia 80% artista, 15% apprendista, 5% reception e la registra. Il personale timbra entrata e uscita con il pulsante turno. Le esportazioni forniscono il registro attività, le scorte basse, i turni e le durate delle sessioni in CSV o PDF. Nel Calendario, la finestra dei turni mostra se una persona è in turno, e l'elenco **Turni** riporta i turni previsti: scegliete una persona, una data e l'orario, poi **Aggiungi turno**. L'esportazione dei turni e, in Magazzino, l'esportazione delle scorte salvano un file CSV o PDF nella cartella Download. In **Finanze**, **Registra Pagamento** registra un pagamento: il cliente, l'importo e il metodo di pagamento. **Registro Acconti** elenca gli acconti incassati alla prenotazione.

## Registri di conformità

La **checklist di chiusura** registra quali attività sono state svolte, il supervisore, il numero di ciclo dell'autoclave e le vostre note. Il **Registro autoclave** elenca i cicli di sterilizzazione, e la Dashboard avvisa sulle scorte oltre la data di scadenza. Questi sono i vostri registri: verificate le regole della vostra autorità sanitaria locale su cosa dovete conservare.

## Strumenti Poli

La schermata **Strumenti** apre gli strumenti Poli International (calendari di aftercare, generatore di moduli di consenso, convertitore di calibro, preventivatore prezzi e altro) all'interno del CRM.

Ogni scheda strumento ha una fascia colorata in alto, e la finestra dello strumento la stessa fascia nella barra del titolo, così la famiglia si riconosce a colpo d'occhio: nastro indicatore a strisce per sterilizzazione e conformità, i colori del titanio anodizzato per piercing e gioielli, viola stencil per tatuaggio e inchiostro, righe da modulo per clienti e salute, carta da registro per la gestione dello studio.

Il gruppo **Verifiche normative sugli inchiostri** ha una verifica per regione: USA (MoCRA e Proposition 65 della California), Europa (REACH) e Sud-est asiatico (Thailandia, anche in thailandese). Ognuna vale solo per la propria regione.

## Backup

Tutto è memorizzato in `data/studio_crm.sqlite` (o nel percorso impostato in `SQLITE_DB_PATH`). Copiate quel file per fare il backup dello studio. Il pulsante snapshot scrive anche una copia in `storage/backups/`. Il CRM vi salva anche una copia ogni giorno e conserva gli ultimi 30 giorni. In **Impostazioni**, **Backup Database**, potete copiare ogni backup anche in una seconda cartella (chiavetta USB, altro disco, cartella Google Drive, OneDrive o Dropbox), così un disco guasto o un computer rubato non porta via tutte le copie.
