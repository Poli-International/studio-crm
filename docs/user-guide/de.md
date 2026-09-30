# Studio CRM Benutzerhandbuch

Studio CRM läuft auf einem Computer in Ihrem Studio. Das Personal öffnet es in einem Webbrowser auf diesem Computer oder auf jedem Gerät im Studio-Netzwerk. Ihre Daten bleiben in einer Datei auf diesem Computer. Es wird nichts an Poli International gesendet.

## Installation und Start

1. Installieren Sie Node.js 20 oder neuer.
2. Laden Sie die Studio-CRM-Dateien herunter und öffnen Sie ein Terminal im Ordner `studio-crm`.
3. Führen Sie einmal `npm install` aus, dann `npm start`.
4. Öffnen Sie `http://localhost:3000` im Browser. Andere Geräte verwenden die Netzwerkadresse des Computers statt `localhost`.

Um einen anderen Port zu verwenden, legen Sie `PORT` in einer `.env`-Datei fest (kopieren Sie `.env.example`). Legen Sie dort auch `STUDIO_MANAGER_EMAIL` fest, damit Benachrichtigungen an Sie adressiert werden.

## Erster Start: Demodaten

Eine Neuinstallation startet mit Demo-Kunden, -Terminen, -Lagerbestand und -Personal, damit Sie jeden Bildschirm ausprobieren können. Wenn Sie bereit für die echte Arbeit sind, klicken Sie auf **Mit einem leeren Studio beginnen** im Dashboard. Dadurch werden die Demodaten gelöscht, während Leistungsliste, Kategorien, Vorlagen, Stationen und Einstellungen erhalten bleiben. Dies kann nicht rückgängig gemacht werden.

## Sprache

Wählen Sie Englisch, Französisch, Italienisch, Deutsch, Spanisch, Niederländisch, Portugiesisch oder Thai aus dem Sprachmenü oben. Die Poli-Tools innerhalb des CRM öffnen sich in derselben Sprache, sofern sie diese anbieten (Tools ohne Thai öffnen sich auf Englisch).

## Studio-Einstellungen

Öffnen Sie **Einstellungen**, um Ihre Preise, die Anzahlungsregel, den Steuersatz (MwSt.), die Nachbesserungsrichtlinie und die Lagerschwellen einzugeben. Preisschätzer, Angebote und Rechnungen greifen auf diese Werte zurück, legen Sie diese also zuerst fest. **CSV exportieren** lädt Ihre Preisliste herunter; bearbeiten Sie sie und verwenden Sie **CSV importieren**, um sie wieder zu laden. Sie können auch Ihr Studio-Logo hochladen; es erscheint in der oberen Leiste.

## Kunden

**Kunden** listet alle mit Kontaktdaten, Allergien und medizinischen Hinweisen, unterschriebenen Einverständniserklärungen und Gesamtumsatz auf. Verwenden Sie **Neuer Kunde**, um einen hinzuzufügen. Die Suche filtert die Liste während der Eingabe. **Profil ansehen** öffnet den vollständigen Datensatz.

## Termine und Terminplanung

**Neuer Termin** bucht eine einzelne Sitzung mit Künstler, Station, Preis und Anzahlung. Für Arbeiten mit mehreren Sitzungen sucht der **Auto-Planer** die freien Zeitfenster des Künstlers an einem gewählten Tag und bucht bis zu sechs Sitzungen im festgelegten Wochenabstand. Das Dashboard zeigt die heutigen Zahlen, kommende Buchungen, den Stationsstatus und niedrigen Lagerbestand.

## Digitale Einverständniserklärungen

Öffnen Sie das Einverständnisformular, wählen Sie den Kunden aus der Liste (dessen Allergien werden automatisch eingetragen), bestätigen Sie die Altersprüfung und lassen Sie den Kunden auf dem Pad unterschreiben. Die Einverständniserklärung wird mit dem Unterschriftsbild gespeichert. Sie wird nicht ohne Kunden und Unterschrift gespeichert.

## Nachrichten: Das CRM bereitet vor, Sie senden

Studio CRM sendet selbst keine E-Mails, SMS oder Chat-Nachrichten. Wenn Sie eine Nachsorge-E-Mail, eine Erinnerung oder eine Lieferantenbestellung vorbereiten, erscheint ein Panel **Nachricht bereit**. Klicken Sie auf **E-Mail**, **WhatsApp** oder **LINE**, um sie mit dem bereits eingefügten Text in Ihrer eigenen App zu öffnen, und drücken Sie dort auf Senden, oder klicken Sie auf **Kopieren**.

## Lager, Scanner und Bestellungen

**Inventar** verfolgt Mengen, Chargen, Ablaufdaten und Lieferanten. Artikel auf oder unter ihrem Nachbestellniveau zählen als niedriger Lagerbestand.

Der Scanner in **Aktivitätsprotokoll** nutzt die Gerätekamera. Scannen Sie eine Lager-SKU oder Chargennummer, um den Artikel zu sehen, oder einen `CLIENT-<number>`-Code, um einen Kunden zu öffnen. Sie können auch einen Code von einem Foto scannen. Unbekannte Codes werden unter **Fehlerprotokoll** aufgeführt.

**Bestellung** listet Ihre Lieferanten und deren Artikel mit niedrigem Lagerbestand auf, erstellt eine Bestellnummer, lädt ein PDF herunter und bereitet die Bestell-E-Mail vor.

## Galerie

**Portfolio** enthält Fotos fertiger Arbeiten, verknüpft mit Kunde und Künstler. **Flash-Vorlagen** enthält Designs mit Preis und Anzahlung; markieren Sie eines als reserviert, wenn ein Kunde es reserviert. **Teilen** bereitet eine Nachricht für WhatsApp, LINE, X oder E-Mail vor; das Teilen-Menü des Telefons kann das Foto einschließen.

## Geld und Personal

Der **Trinkgeldrechner** teilt ein Trinkgeld 80 % Künstler, 15 % Auszubildender, 5 % Empfang und erfasst es. Das Personal stempelt Beginn und Ende der Schicht mit dem Schicht-Button. Exporte liefern Ihnen das Aktivitätsprotokoll, niedrigen Lagerbestand, Schichten und Sitzungsdauern als CSV oder PDF.

## Compliance-Aufzeichnungen

Die **Abschluss-Checkliste** erfasst, welche Punkte erledigt wurden, den Verantwortlichen, die Autoklav-Zyklusnummer und Ihre Notizen. Der **Autoklav-Speicher** listet Sterilisationszyklen auf, und das Dashboard warnt vor Lagerbestand nach Ablaufdatum. Dies sind Ihre eigenen Aufzeichnungen: Prüfen Sie die Vorschriften Ihrer lokalen Gesundheitsbehörde, was Sie aufbewahren müssen.

## Poli-Tools

Der Bildschirm **Tools** öffnet die Poli-International-Tools (Nachsorgepläne, Einverständnisformular-Generator, Gauge-Umrechner, Preisschätzer und mehr) innerhalb des CRM.

## Backups

Alles wird in `data/studio_crm.sqlite` gespeichert (oder im in `SQLITE_DB_PATH` festgelegten Pfad). Kopieren Sie diese Datei, um das Studio zu sichern. Die Snapshot-Schaltfläche schreibt außerdem eine Kopie nach `storage/backups/`.
