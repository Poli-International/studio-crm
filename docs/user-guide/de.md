# Studio CRM Benutzerhandbuch

Studio CRM läuft auf einem Computer in Ihrem Studio. Das Personal öffnet es in einem Webbrowser auf diesem Computer oder auf jedem Gerät im Studio-Netzwerk. Ihre Daten bleiben in einer Datei auf diesem Computer. Es wird nichts an Poli International gesendet.

## Installation und Start

1. Laden Sie das Studio-CRM-ZIP für Ihren Computer (Windows, Mac oder Linux) von der Studio-CRM-Seite herunter. Node.js ist bereits enthalten; sonst muss nichts installiert werden.
2. Entpacken Sie es. Legen Sie den Ordner `studio-crm` dort ab, wo er bleiben kann, zum Beispiel unter Dokumente.
3. Doppelklicken Sie auf **Start Studio CRM** (`Start Studio CRM.bat` unter Windows, `Start Studio CRM.command` auf dem Mac, `./start-studio-crm.sh` unter Linux). Auf dem Mac beim ersten Mal mit der rechten Maustaste klicken und **Öffnen** wählen.
4. Ihr Browser öffnet `http://localhost:3000`. Lassen Sie das geöffnete Fenster offen, solange Sie das CRM benutzen; wird es geschlossen, stoppt das CRM. Andere Geräte verwenden statt `localhost` die Netzwerkadresse des Computers, mit `:3000` am Ende.

Wenn Sie den Quellcode heruntergeladen haben, installieren Sie Node.js 22 oder neuer und führen Sie einmal `npm install` und dann `npm start` aus. Mit Docker: `docker compose up -d`.

**Aktualisieren:** Wenn eine neue Version erscheint, steht unten im Menü neben der Versionsnummer **Update verfügbar**. Öffnen Sie **Einstellungen**, **Updates** und klicken Sie auf **Jetzt aktualisieren** (nur ein Administrator). Das CRM lädt die neue Version herunter, sichert die Datenbank in `storage/backups`, probiert die neue Version an einer Kopie Ihrer Daten aus und installiert sie erst dann; es startet von selbst neu und die Seite lädt neu. Ihre Daten bleiben im Ordner `data` und werden nie verschoben. Geht etwas schief, wird nichts verändert und die alte Version läuft weiter. Die vorige Version bleibt im versteckten Ordner `.update/previous`. Versionen vor 1.0.12 werden einmal von Hand aktualisiert: das neue ZIP herunterladen, in einen neuen Ordner entpacken und den Ordner `data` aus dem alten Ordner hineinkopieren.

Um einen anderen Port zu verwenden, legen Sie `PORT` in einer `.env`-Datei fest (kopieren Sie `.env.example`). Legen Sie dort auch `STUDIO_MANAGER_EMAIL` fest, damit Benachrichtigungen an Sie adressiert werden.

## Erster Start: Demodaten

Eine Neuinstallation startet mit Demo-Kunden, -Terminen, -Lagerbestand und -Personal, damit Sie jeden Bildschirm ausprobieren können. Wenn Sie bereit für die echte Arbeit sind, klicken Sie auf **Mit einem leeren Studio beginnen** im Dashboard. Dadurch werden die Demodaten gelöscht, während Leistungsliste, Kategorien, Vorlagen, Stationen und Einstellungen erhalten bleiben. Dies kann nicht rückgängig gemacht werden.

## Sprache

Wählen Sie Englisch, Französisch, Italienisch, Deutsch, Spanisch, Niederländisch, Portugiesisch oder Thai aus dem Sprachmenü oben. Die Poli-Tools innerhalb des CRM öffnen sich in derselben Sprache, sofern sie diese anbieten (Tools ohne Thai öffnen sich auf Englisch).

## Studio-Einstellungen

Öffnen Sie **Einstellungen**, um Ihre Preise, die Anzahlungsregel, den Steuersatz (MwSt.), die Nachbesserungsrichtlinie und die Lagerschwellen einzugeben. Preisschätzer, Angebote und Rechnungen greifen auf diese Werte zurück, legen Sie diese also zuerst fest. **CSV exportieren** lädt Ihre Preisliste herunter; bearbeiten Sie sie und verwenden Sie **CSV importieren**, um sie wieder zu laden. Sie können auch Ihr Studio-Logo hochladen; es erscheint in der oberen Leiste.

**Studiodaten und Arbeitsplätze:** Tragen Sie unter **Einstellungen**, **Studiodaten** Name, Adresse, Telefon, E-Mail und Gesundheitsgenehmigung oder Lizenz des Studios ein: Jedes Einwilligungsformular zeigt sie, am Computer und auf den Tablets. Unter **Arbeitsplätze** fügen Sie Ihre Arbeitsplätze hinzu (Tattooraum, Piercingraum, Branding-Bereich...), benennen sie um oder entfernen sie, und geben jedem eine Art und einen üblichen Künstler. Das Terminformular listet Ihre Arbeitsplätze, und wenn Sie einen Künstler buchen, wird sein üblicher Arbeitsplatz gewählt.

## Kunden

**Kunden** listet alle mit Kontaktdaten, Allergien und medizinischen Hinweisen, unterschriebenen Einverständniserklärungen und Gesamtumsatz auf. Verwenden Sie **Neuer Kunde**, um einen hinzuzufügen. Die Suche filtert die Liste während der Eingabe. **Profil ansehen** öffnet den vollständigen Datensatz. Im Profil ändert **Kunde bearbeiten** die Angaben, und **Löschen** entfernt den Kunden. Das Profil zeigt außerdem Termine, Teamnotizen, unterschriebene Einwilligungen, gespeicherte Einwilligungsformulare und Fotos der Arbeiten. Um viele Kunden auf einmal anzulegen, öffnen Sie **Einstellungen**, **Daten importieren** und fügen eine Liste ein, deren erste Zeile `name,email,phone,allergies,notes` lautet. Die Zahl **Unterschrieben** zählt auch Einwilligungsformulare, die auf dem Tablet unterschrieben wurden. Unter **Arbeiten und Fotos** fügt **Foto aufnehmen oder auswählen** ein Bild vom Gerät hinzu, auf einem Telefon oder Tablet auch direkt von der Kamera. **Heilungspipeline** listet die Kunden, deren Sitzung in den letzten 90 Tagen als erledigt markiert wurde, nach Tagen seit der Sitzung gruppiert, mit **Profil anzeigen** und **PDF herunterladen**.

**Nachsorge:** Wählen Sie im Profil eines Kunden unter **Nachsorge** das Blatt (Tattoo, Piercing, Fine Line, Permanent Make-up) und den Termin, dann **Drucken und Nachsorge erfassen**: Das Blatt wird mit den Studiodaten und dem Namen des Kunden gedruckt, und das CRM erfasst, welches Blatt für welchen Termin von wem und wann übergeben wurde. Jeder Termin zeigt, ob Nachsorge übergeben wurde. **Pflegeblatt** unter Kunden druckt ein Blatt ohne Kundennamen und erfasst nichts. Jedes Blatt wird in der daneben gewählten Sprache gedruckt. Unter **Einstellungen**, **Pflegeblätter** ändern Sie Titel, Beschreibung und Schritte jedes Blatts in jeder Sprache oder fügen eigene Blätter hinzu; eine leere Sprache druckt das Englische.

## Personal

Klicken Sie oben rechts auf die Personal-Schaltfläche, um Ihr Team zu sehen. **Teammitglied hinzufügen** legt eine Person an, **Bearbeiten** ändert ihre Angaben, und **Entfernen** nimmt sie aus dem Team. **Auswählen** zeigt den Namen dieser Person in der oberen Leiste, damit alle sehen, wer am Bildschirm ist. Sobald ein Studio-Passwort gesetzt ist, kann jede Person auch eine eigene Anmeldung und Zugriffsstufe bekommen (siehe unten). Ein neues Teammitglied kann sofort überall gewählt werden, wo ein Artist ausgewählt wird, zum Beispiel bei einer Terminbuchung.

## Tablets, Telefone und das Studio-Passwort

Andere Geräte im Studio öffnen das CRM mit der Adresse, die im Startfenster angezeigt wird. Ein Tablet oder Telefon, das die Kamera braucht (den Scanner), muss die Adresse verwenden, die mit `https://` beginnt und mit `:3443` endet. Beim ersten Mal warnt der Browser, dass die Verbindung nicht privat ist, weil das Zertifikat von Ihrem eigenen Rechner erstellt wurde: Wählen Sie Erweitert, dann Weiter. Mit der einfachen `http://`-Adresse funktioniert alles außer der Kamera.

Beim ersten Start fordert das CRM Sie auf, das **Studio-Passwort** anzulegen. Jeder Computer, jedes Tablet und jedes Telefon meldet sich dann einmal damit an. Sie können **Continue without a password** wählen und es später unter **Einstellungen**, **Studio-Passwort** festlegen. Wenn Sie es vergessen, legen Sie im Ordner `data` eine leere Datei namens `reset-password.txt` an und starten das CRM neu: Das entfernt das Studio-Passwort und alle Anmeldungen des Personals.

**Unbenutztes Gerät sperren:** Wählen Sie unter **Einstellungen**, unter dem Studio-Passwort, wie lange ein Gerät unbenutzt bleiben darf (5, 10, 15 oder 30 Minuten), bevor es sich selbst abmeldet. Der Tablet-Kiosk wird nie gesperrt: Er hat seine eigene Ausgangs-PIN.

**Anmeldungen und Stufen für das Personal:** Ist das Studio-Passwort gesetzt, öffnen Sie die Personalliste, klicken bei einer Person auf **Bearbeiten** und wählen ein **Zugriffsstufe** und ein **Anmeldepasswort** (mindestens 8 Zeichen). Ab der ersten Anmeldung fragt die Anmeldeseite **Who are you?**: Jede Person wählt ihren Namen und meldet sich mit ihrem eigenen Passwort an. Das Studio-Passwort steht in dieser Liste an erster Stelle und meldet weiterhin als Administrator an; geben Sie sich auch selbst die Stufe **Administrator**, wenn Sie eine eigene Anmeldung möchten. Um die Person am Bildschirm zu wechseln, klicken Sie oben auf den Namen und dann auf **Abmelden**: Die nächste Person meldet sich mit ihrem eigenen Passwort an.

**Rollen:** Kreuzen Sie unter **Einstellungen**, **Rollen** an, was jede Rolle öffnen und ändern darf: Kunden und Termine, Lager und Lieferanten, Sterilisation und Vorschriften, Schichtplan, Einwilligungsformulare und Pflegeblätter, Geld und Berichte, Einträge löschen. Empfang und Personal sind immer da und beginnen mit dem, was sie vorher durften; **Rolle hinzufügen** legt eine eigene an („Sterilisation", „Lehrling") und **Rollen speichern** behält die Änderungen. Eine Rolle ohne einen Bereich sieht dessen Bildschirm nicht, und das CRM lehnt ihre Änderungen dort ab. Nur ein **Administrator** ändert Einstellungen, Team, Anmeldungen und Rollen. Eine Rolle, die noch jemand hat, lässt sich nicht entfernen: Geben Sie dieser Person zuerst eine andere Rolle.

- **Empfang**: Kunden, Termine, Einverständniserklärungen, Zahlungen, Ein- und Ausstempeln.
- **Personal**: alles vom Empfang, dazu Lager, Lieferanten, Compliance-Aufzeichnungen, Nachsorge, Dienstplan und die Gestaltung der Einverständnisformulare.
- **Administrator**: alles, auch Löschen, Finanzberichte, Einstellungen, das Team, Anmeldungen, Backups und Importe.

Empfang und Personal sehen Finanzen und Einstellungen nicht. Versucht jemand etwas, das seine Stufe nicht erlaubt, sagt das CRM es und ändert nichts. Um eine Anmeldung zu entfernen, setzen Sie die Stufe auf **Keine Anmeldung**.

## Termine und Terminplanung

**Neuer Termin** bucht eine einzelne Sitzung mit Künstler, Station, Preis und Anzahlung. Für Arbeiten mit mehreren Sitzungen sucht der **Auto-Planer** die freien Zeitfenster des Künstlers an einem gewählten Tag und bucht bis zu sechs Sitzungen im festgelegten Wochenabstand. Das Dashboard zeigt die heutigen Zahlen, kommende Buchungen, den Stationsstatus und niedrigen Lagerbestand. Der Kalender listet alle gebuchten Termine auf, die nächsten zuerst. **Abgeschlossen** markiert eine Sitzung als erledigt, sie zählt dann in der Daueranalyse, und **Entfernen** löscht sie. **Bearbeiten** bei einem Termin ändert Zeit, Künstler, Station, Preis, Anzahlung oder Notizen. Tippen Sie beim Buchen den Namen des Kunden und wählen Sie ihn aus der Liste, damit der Termin in seinem Profil erscheint. Zweimal schnell auf eine Speichern-Schaltfläche tippen speichert nur einmal. Die Liste zeigt zu jedem Termin auch die Anzahlung und den noch offenen Betrag (Preis minus Anzahlung).

## Digitale Einverständniserklärungen

Öffnen Sie das Einverständnisformular, wählen Sie den Kunden aus der Liste (dessen Allergien werden automatisch eingetragen), bestätigen Sie die Altersprüfung und lassen Sie den Kunden auf dem Pad unterschreiben. Die Einverständniserklärung wird mit dem Unterschriftsbild gespeichert. Sie wird nicht ohne Kunden und Unterschrift gespeichert. Aus dem Profil eines Kunden geöffnet, ist dieser Kunde im Formular bereits gewählt.

Damit der Kunde ein Einwilligungsformular auf einem Tablet ausfüllt, öffnen Sie **Kunden**, den Editor für Einwilligungsformulare, die Formularvorschau und dann den Tablet-Kioskmodus. Der Kunde beantwortet einen Abschnitt pro Bildschirm, unterschreibt auf dem letzten und tippt auf die Schaltfläche zum Abschließen. Das Formular wird mit der Unterschrift gespeichert, und ein PDF wird heruntergeladen. Wurde vorher kein Kunde gewählt, wird aus Name, E-Mail, Telefon und Geburtsdatum des Formulars ein neuer Kunde angelegt. Gespeicherte Formulare stehen im Kundenprofil unter **Einwilligungen**; **Antworten ansehen** zeigt jede Antwort. Ein im Formular-Editor bearbeitetes Formular wird mit den Studiodaten gespeichert: Das Tablet zeigt also dasselbe Formular wie der Rechner, auf dem Sie es bearbeitet haben.


Damit ein Kunde das Formular nicht verlassen kann, wenn Sie kurz weggehen, legen Sie in **Einstellungen** eine **Tablet-Kiosk-PIN** fest. Der Kioskmodus lässt sich dann nur mit der PIN verlassen. Tippt der Kunde auf **Complete**, prüft der Kiosk, dass nichts fehlt, speichert das Formular und zeigt „Thank you, your form has been submitted“, bis ein Mitarbeiter die PIN eingibt. Unterschriebene Einwilligungen stehen im Kundenprofil unter **Einwilligungen**: **View waiver** zeigt die Angaben und die Unterschrift, **PDF herunterladen** speichert eine Kopie zum Drucken oder Aufbewahren.

**Kiosk-Tablets:** Ein Tablet auf einem Ständer kann nur Formulare. Legen Sie unter **Einstellungen**, **Kiosk-Tablets** ein Kiosk-Passwort fest (dafür braucht es das Studio-Passwort). Öffnen Sie auf dem Tablet die dort angezeigte Adresse (sie endet auf `/kiosk`), melden Sie sich mit dem Kiosk-Passwort an und geben Sie dem Tablet einen Namen; es zeigt dann „Bitte warten“. Um ein Formular zu senden, öffnen Sie **Kunden**, beim Kunden **Einverständniserklärung unterschreiben**, wählen das Formular, **Formular-Vorschau**, dann **An den Kiosk senden**. Das Formular öffnet sich auf dem Tablet; tippt der Kunde auf **Abschließen**, wird es beim Kunden gespeichert (unter **Einwilligungen**) und das Tablet wartet wieder. Senden Sie, während noch ein Formular wartet, können Sie das wartende **Zurücknehmen**. Eine Kiosk-Anmeldung kann weder das CRM öffnen noch Kundendaten lesen. Schalten Sie am Tablet Vollbild oder Kiosk-Modus ein (zum Beispiel Bildschirmfixierung unter Android oder einen Kiosk-Browser), damit der Kunde auf der Seite bleibt.

**Kiosk-Tablet einrichten, gut zu wissen:** Beim ersten Mal warnt das Tablet, die Verbindung sei nicht privat: Tippen Sie auf **Erweitert** und dann auf **Weiter** (Chrome) bzw. **Fortfahren** (Edge). Es ist Ihr eigener Server, das Zertifikat hat er selbst erstellt. Kommt die Warnung immer wieder oder bleibt ein Kiosk-Browser daran hängen, nehmen Sie die `http://`-Adresse, die **Einstellungen** darunter zeigt: keine Warnung, aber die Formulare gehen unverschlüsselt durch Ihr Netzwerk, also nur im studioeigenen WLAN. Geben Sie dem CRM-Computer im Router eine feste Adresse („DHCP-Reservierung“ oder „statische IP“), sonst finden ihn die Tablets nicht mehr, wenn sich seine Adresse ändert. Ein Tablet bleibt angemeldet, und ein wartendes Formular bleibt erhalten, wenn das CRM neu gestartet wird.

**Kunden unter 18 und Ausweisprüfung:** Das CRM berechnet das Alter jedes Kunden aus dem Geburtsdatum (aus dem Kundendatensatz, der Ausweisprüfung oder einem Geburtsdatum, das der Kunde in ein Formular schreibt). Ein Kunde unter 18 wird in der Kundenliste, im Profil und im Terminformular mit **Unter 18** markiert, und seine Formulare brauchen die Unterschrift eines Elternteils oder Vormunds: Ohne sie speichert oder sendet das CRM kein Formular (die Vorlage für Minderjährige hat sie). Schreibt ein Kunde auf dem Tablet ein Geburtsdatum unter 18, wird das unterschriebene Formular behalten, aber rot markiert, und das Aktivitätsprotokoll meldet es. Im Kundenprofil speichert **Ausweisprüfung erfassen** die Art des Ausweises und nur seine letzten 4 Zeichen, mit wer geprüft hat und wann; jedes danach unterschriebene Formular zeigt Alter und Ausweisprüfung, am Bildschirm und im PDF.

**Scanner-Feld:** Fügen Sie im Formular-Editor einem Formular ein **Scanner**-Feld hinzu und geben Sie seinem Knopf Ihre eigenen Worte. Auf dem Formular scannt der Knopf eine Seite mit dem Scanner, der an den Computer mit dem CRM angeschlossen ist, vom Empfang oder von einem Kiosk-Tablet; die Seite wird wie ein Foto mit dem Formular gespeichert und in seinem PDF gedruckt. Unter Windows nutzt es das in Windows eingebaute Scannen (WIA): Wenn der Scanner mit der Windows-App Scan funktioniert, funktioniert er hier. Unter Linux nutzt es SANE. Noch nicht auf dem Mac.
## Nachrichten: Das CRM bereitet vor, Sie senden

Studio CRM sendet selbst keine E-Mails, SMS oder Chat-Nachrichten. Wenn Sie eine Nachsorge-E-Mail, eine Erinnerung oder eine Lieferantenbestellung vorbereiten, erscheint ein Panel **Nachricht bereit**. Klicken Sie auf **E-Mail**, **WhatsApp** oder **LINE**, um sie mit dem bereits eingefügten Text in Ihrer eigenen App zu öffnen, und drücken Sie dort auf Senden, oder klicken Sie auf **Kopieren**.

## Lager, Scanner und Bestellungen

**Inventar** verfolgt Mengen, Chargen, Ablaufdaten und Lieferanten. Artikel auf oder unter ihrem Nachbestellniveau zählen als niedriger Lagerbestand. Die Liste **Lagerartikel** zeigt jeden Artikel mit Menge, Nachbestellgrenze, Charge, Ablaufdatum und Lieferant; suchen Sie nach Name, SKU oder Lieferant. **+ Artikel hinzufügen** legt einen Artikel von Hand an, **Bearbeiten** ändert ihn. **Lieferanten** listet Ihre Lieferanten: **+ Lieferant hinzufügen** und **Bearbeiten**. Bestellungen gehen an die Bestell-E-Mail des Lieferanten; prüfen Sie sie.

Der Scanner in **Aktivitätsprotokoll** nutzt die Gerätekamera. Scannen Sie eine Lager-SKU oder Chargennummer, um den Artikel zu sehen, oder einen `CLIENT-<number>`-Code, um einen Kunden zu öffnen. Sie können auch einen Code von einem Foto scannen. Unbekannte Codes werden unter **Fehlerprotokoll** aufgeführt.

**Bestellung** listet Ihre Lieferanten und deren Artikel mit niedrigem Lagerbestand auf, erstellt eine Bestellnummer, lädt ein PDF herunter und bereitet die Bestell-E-Mail vor.

## Galerie

**Portfolio** enthält Fotos fertiger Arbeiten, verknüpft mit Kunde und Künstler. **Flash-Vorlagen** enthält Designs mit Preis und Anzahlung; markieren Sie eines als reserviert, wenn ein Kunde es reserviert. **Teilen** bereitet eine Nachricht für WhatsApp, LINE, X oder E-Mail vor; das Teilen-Menü des Telefons kann das Foto einschließen.

## Geld und Personal

Der **Trinkgeldrechner** teilt ein Trinkgeld 80 % Künstler, 15 % Auszubildender, 5 % Empfang und erfasst es. Das Personal stempelt Beginn und Ende der Schicht mit dem Schicht-Button. Exporte liefern Ihnen das Aktivitätsprotokoll, niedrigen Lagerbestand, Schichten und Sitzungsdauern als CSV oder PDF. Im Kalender zeigt das Schichtfenster, ob eine Person im Dienst ist, und der **Dienstplan** listet die geplanten Schichten: Wählen Sie eine Person, ein Datum und die Zeiten, dann **Schicht hinzufügen**. Der Export des Dienstplans und, im Lager, der Export des Bestands speichern eine CSV- oder PDF-Datei in Ihrem Download-Ordner. Unter **Finanzen** erfasst **Zahlung erfassen** eine Zahlung: Kunde, Betrag und Zahlungsart. **Anzahlungsjournal** listet die bei der Buchung erhaltenen Anzahlungen.

## Compliance-Aufzeichnungen

Die **Abschluss-Checkliste** erfasst, welche Punkte erledigt wurden, den Verantwortlichen, die Autoklav-Zyklusnummer und Ihre Notizen. Der **Autoklav-Speicher** listet Sterilisationszyklen auf, und das Dashboard warnt vor Lagerbestand nach Ablaufdatum. Dies sind Ihre eigenen Aufzeichnungen: Prüfen Sie die Vorschriften Ihrer lokalen Gesundheitsbehörde, was Sie aufbewahren müssen.

## Poli-Tools

Der Bildschirm **Werkzeuge** öffnet die Poli-International-Tools (Nachsorgepläne, Einverständnisformular-Generator, Gauge-Umrechner, Preisschätzer und mehr) innerhalb des CRM.

Die Gruppe **Prüfer für Farbvorschriften** hat einen Prüfer je Region: USA (MoCRA und California Proposition 65), Europa (REACH) und Südostasien (Thailand, auch auf Thai). Jeder gilt nur für seine eigene Region.

## Backups

Alles wird in `data/studio_crm.sqlite` gespeichert (oder im in `SQLITE_DB_PATH` festgelegten Pfad). Kopieren Sie diese Datei, um das Studio zu sichern. Die Snapshot-Schaltfläche schreibt außerdem eine Kopie nach `storage/backups/`. Das CRM speichert dort außerdem jeden Tag eine Kopie und behält die letzten 30 Tage. Unter **Einstellungen**, **Datenbanksicherung** können Sie jede Sicherung zusätzlich in einen zweiten Ordner kopieren lassen (USB-Stick, andere Festplatte, Google-Drive-, OneDrive- oder Dropbox-Ordner), damit eine defekte Festplatte oder ein gestohlener Computer nicht alle Kopien mitnimmt.
