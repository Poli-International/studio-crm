# Studio CRM Benutzerhandbuch

Studio CRM läuft auf einem Computer in Ihrem Studio. Das Personal öffnet es in einem Webbrowser auf diesem Computer oder auf jedem Gerät im Studio-Netzwerk. Ihre Daten bleiben in einer Datei auf diesem Computer. Es wird nichts an Poli International gesendet.

## Installation und Start

1. Laden Sie das Studio-CRM-ZIP für Ihren Computer (Windows, Mac oder Linux) von der Studio-CRM-Seite herunter. Node.js ist bereits enthalten; sonst muss nichts installiert werden.
2. Entpacken Sie es. Legen Sie den Ordner `studio-crm` dort ab, wo er bleiben kann, zum Beispiel unter Dokumente.
3. Doppelklicken Sie auf **Start Studio CRM** (`Start Studio CRM.bat` unter Windows, `Start Studio CRM.command` auf dem Mac, `./start-studio-crm.sh` unter Linux). Auf dem Mac beim ersten Mal mit der rechten Maustaste klicken und **Öffnen** wählen.
4. Ihr Browser öffnet `http://localhost:3000`. Lassen Sie das geöffnete Fenster offen, solange Sie das CRM benutzen; wird es geschlossen, stoppt das CRM. Andere Geräte verwenden statt `localhost` die Netzwerkadresse des Computers, mit `:3000` am Ende.

Wenn Sie den Quellcode heruntergeladen haben, installieren Sie Node.js 22 oder neuer und führen Sie einmal `npm install` und dann `npm start` aus. Mit Docker: `docker compose up -d`.

Zum Aktualisieren laden Sie das neue ZIP herunter, entpacken es in einen neuen Ordner und kopieren Ihren Ordner `data` aus dem alten Ordner in den neuen.

Um einen anderen Port zu verwenden, legen Sie `PORT` in einer `.env`-Datei fest (kopieren Sie `.env.example`). Legen Sie dort auch `STUDIO_MANAGER_EMAIL` fest, damit Benachrichtigungen an Sie adressiert werden.

## Erster Start: Demodaten

Eine Neuinstallation startet mit Demo-Kunden, -Terminen, -Lagerbestand und -Personal, damit Sie jeden Bildschirm ausprobieren können. Wenn Sie bereit für die echte Arbeit sind, klicken Sie auf **Mit einem leeren Studio beginnen** im Dashboard. Dadurch werden die Demodaten gelöscht, während Leistungsliste, Kategorien, Vorlagen, Stationen und Einstellungen erhalten bleiben. Dies kann nicht rückgängig gemacht werden.

## Sprache

Wählen Sie Englisch, Französisch, Italienisch, Deutsch, Spanisch, Niederländisch, Portugiesisch oder Thai aus dem Sprachmenü oben. Die Poli-Tools innerhalb des CRM öffnen sich in derselben Sprache, sofern sie diese anbieten (Tools ohne Thai öffnen sich auf Englisch).

## Studio-Einstellungen

Öffnen Sie **Einstellungen**, um Ihre Preise, die Anzahlungsregel, den Steuersatz (MwSt.), die Nachbesserungsrichtlinie und die Lagerschwellen einzugeben. Preisschätzer, Angebote und Rechnungen greifen auf diese Werte zurück, legen Sie diese also zuerst fest. **CSV exportieren** lädt Ihre Preisliste herunter; bearbeiten Sie sie und verwenden Sie **CSV importieren**, um sie wieder zu laden. Sie können auch Ihr Studio-Logo hochladen; es erscheint in der oberen Leiste.

## Kunden

**Kunden** listet alle mit Kontaktdaten, Allergien und medizinischen Hinweisen, unterschriebenen Einverständniserklärungen und Gesamtumsatz auf. Verwenden Sie **Neuer Kunde**, um einen hinzuzufügen. Die Suche filtert die Liste während der Eingabe. **Profil ansehen** öffnet den vollständigen Datensatz. Im Profil ändert **Kunde bearbeiten** die Angaben, und **Löschen** entfernt den Kunden. Das Profil zeigt außerdem Termine, Teamnotizen, unterschriebene Einwilligungen, gespeicherte Einwilligungsformulare und Fotos der Arbeiten. Um viele Kunden auf einmal anzulegen, öffnen Sie **Einstellungen**, **Import Data** und fügen eine Liste ein, deren erste Zeile `name,email,phone,allergies,notes` lautet.

## Personal

Klicken Sie oben rechts auf die Personal-Schaltfläche, um Ihr Team zu sehen. **Teammitglied hinzufügen** legt eine Person an, **Bearbeiten** ändert ihre Angaben, und **Entfernen** nimmt sie aus dem Team. **Auswählen** zeigt den Namen dieser Person in der oberen Leiste, damit alle sehen, wer am Bildschirm ist. Es gibt keine Passwörter und keine Zugriffsstufen. Ein neues Teammitglied kann sofort überall gewählt werden, wo ein Artist ausgewählt wird, zum Beispiel bei einer Terminbuchung.

## Termine und Terminplanung

**Neuer Termin** bucht eine einzelne Sitzung mit Künstler, Station, Preis und Anzahlung. Für Arbeiten mit mehreren Sitzungen sucht der **Auto-Planer** die freien Zeitfenster des Künstlers an einem gewählten Tag und bucht bis zu sechs Sitzungen im festgelegten Wochenabstand. Das Dashboard zeigt die heutigen Zahlen, kommende Buchungen, den Stationsstatus und niedrigen Lagerbestand. Der Kalender listet alle gebuchten Termine auf, die nächsten zuerst. **Abgeschlossen** markiert eine Sitzung als erledigt, sie zählt dann in der Daueranalyse, und **Entfernen** löscht sie.

## Digitale Einverständniserklärungen

Öffnen Sie das Einverständnisformular, wählen Sie den Kunden aus der Liste (dessen Allergien werden automatisch eingetragen), bestätigen Sie die Altersprüfung und lassen Sie den Kunden auf dem Pad unterschreiben. Die Einverständniserklärung wird mit dem Unterschriftsbild gespeichert. Sie wird nicht ohne Kunden und Unterschrift gespeichert.

Damit der Kunde ein Einwilligungsformular auf einem Tablet ausfüllt, öffnen Sie **Kunden**, den Editor für Einwilligungsformulare, die Formularvorschau und dann den Tablet-Kioskmodus. Der Kunde beantwortet einen Abschnitt pro Bildschirm, unterschreibt auf dem letzten und tippt auf die Schaltfläche zum Abschließen. Das Formular wird mit der Unterschrift gespeichert, und ein PDF wird heruntergeladen. Wurde vorher kein Kunde gewählt, wird aus Name, E-Mail, Telefon und Geburtsdatum des Formulars ein neuer Kunde angelegt. Gespeicherte Formulare stehen im Kundenprofil unter **Einwilligungen**; **Antworten ansehen** zeigt jede Antwort.

## Nachrichten: Das CRM bereitet vor, Sie senden

Studio CRM sendet selbst keine E-Mails, SMS oder Chat-Nachrichten. Wenn Sie eine Nachsorge-E-Mail, eine Erinnerung oder eine Lieferantenbestellung vorbereiten, erscheint ein Panel **Nachricht bereit**. Klicken Sie auf **E-Mail**, **WhatsApp** oder **LINE**, um sie mit dem bereits eingefügten Text in Ihrer eigenen App zu öffnen, und drücken Sie dort auf Senden, oder klicken Sie auf **Kopieren**.

## Lager, Scanner und Bestellungen

**Inventar** verfolgt Mengen, Chargen, Ablaufdaten und Lieferanten. Artikel auf oder unter ihrem Nachbestellniveau zählen als niedriger Lagerbestand.

Der Scanner in **Aktivitätsprotokoll** nutzt die Gerätekamera. Scannen Sie eine Lager-SKU oder Chargennummer, um den Artikel zu sehen, oder einen `CLIENT-<number>`-Code, um einen Kunden zu öffnen. Sie können auch einen Code von einem Foto scannen. Unbekannte Codes werden unter **Fehlerprotokoll** aufgeführt.

**Bestellung** listet Ihre Lieferanten und deren Artikel mit niedrigem Lagerbestand auf, erstellt eine Bestellnummer, lädt ein PDF herunter und bereitet die Bestell-E-Mail vor.

## Galerie

**Portfolio** enthält Fotos fertiger Arbeiten, verknüpft mit Kunde und Künstler. **Flash-Vorlagen** enthält Designs mit Preis und Anzahlung; markieren Sie eines als reserviert, wenn ein Kunde es reserviert. **Teilen** bereitet eine Nachricht für WhatsApp, LINE, X oder E-Mail vor; das Teilen-Menü des Telefons kann das Foto einschließen.

## Geld und Personal

Der **Trinkgeldrechner** teilt ein Trinkgeld 80 % Künstler, 15 % Auszubildender, 5 % Empfang und erfasst es. Das Personal stempelt Beginn und Ende der Schicht mit dem Schicht-Button. Exporte liefern Ihnen das Aktivitätsprotokoll, niedrigen Lagerbestand, Schichten und Sitzungsdauern als CSV oder PDF. Im Kalender zeigt das Schichtfenster, ob eine Person im Dienst ist, und der **Dienstplan** listet die geplanten Schichten: Wählen Sie eine Person, ein Datum und die Zeiten, dann **Schicht hinzufügen**. Der Export des Dienstplans und, im Lager, der Export des Bestands speichern eine CSV- oder PDF-Datei in Ihrem Download-Ordner.

## Compliance-Aufzeichnungen

Die **Abschluss-Checkliste** erfasst, welche Punkte erledigt wurden, den Verantwortlichen, die Autoklav-Zyklusnummer und Ihre Notizen. Der **Autoklav-Speicher** listet Sterilisationszyklen auf, und das Dashboard warnt vor Lagerbestand nach Ablaufdatum. Dies sind Ihre eigenen Aufzeichnungen: Prüfen Sie die Vorschriften Ihrer lokalen Gesundheitsbehörde, was Sie aufbewahren müssen.

## Poli-Tools

Der Bildschirm **Tools** öffnet die Poli-International-Tools (Nachsorgepläne, Einverständnisformular-Generator, Gauge-Umrechner, Preisschätzer und mehr) innerhalb des CRM.

## Backups

Alles wird in `data/studio_crm.sqlite` gespeichert (oder im in `SQLITE_DB_PATH` festgelegten Pfad). Kopieren Sie diese Datei, um das Studio zu sichern. Die Snapshot-Schaltfläche schreibt außerdem eine Kopie nach `storage/backups/`.
