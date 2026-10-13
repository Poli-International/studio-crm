# Studio CRM-gebruikershandleiding

Studio CRM draait op één computer in uw studio. Medewerkers openen het in een webbrowser op die computer of op elk apparaat in het studionetwerk. Uw gegevens blijven in een bestand op die computer. Er wordt niets naar Poli International verzonden.

## Installeren en starten

1. Download de Studio CRM-ZIP voor uw computer (Windows, Mac of Linux) van de Studio CRM-pagina. Node.js zit er al in; u hoeft verder niets te installeren.
2. Pak het uit. Zet de map `studio-crm` op een plek waar hij kan blijven staan, bijvoorbeeld in Documenten.
3. Dubbelklik op **Start Studio CRM** (`Start Studio CRM.bat` op Windows, `Start Studio CRM.command` op een Mac, `./start-studio-crm.sh` op Linux). Op een Mac klikt u de eerste keer met de rechtermuisknop en kiest u **Open**.
4. Uw browser opent `http://localhost:3000`. Houd het venster dat verscheen open terwijl u het CRM gebruikt; als u het sluit, stopt het CRM. Andere apparaten gebruiken het netwerkadres van de computer in plaats van `localhost`, met `:3000` aan het eind.

Hebt u de broncode gedownload, installeer dan Node.js 22 of nieuwer, voer één keer `npm install` uit en daarna `npm start`. Met Docker: `docker compose up -d`.

Om bij te werken downloadt u de nieuwe ZIP, pakt u die uit in een nieuwe map en kopieert u uw map `data` van de oude map naar de nieuwe.

Om een andere poort te gebruiken, stelt u `PORT` in een `.env`-bestand in (kopieer `.env.example`). Stel daar ook `STUDIO_MANAGER_EMAIL` in, zodat meldingen aan u worden geadresseerd.

## Eerste keer opstarten: demogegevens

Een nieuwe installatie start met demoklanten, afspraken, voorraad en personeel, zodat u elk scherm kunt uitproberen. Wanneer u klaar bent voor echt werk, klikt u op **Beginnen met een lege studio** op het dashboard. Dit verwijdert de demogegevens en behoudt de dienstenlijst, categorieën, sjablonen, stations en instellingen. Dit kan niet ongedaan worden gemaakt.

## Taal

Kies Engels, Frans, Italiaans, Duits, Spaans, Nederlands, Portugees of Thai in het taalmenu boven aan. De Poli-tools binnen de CRM openen in dezelfde taal wanneer die beschikbaar is (tools zonder Thai openen in het Engels).

## Studio-instellingen

Open **Instellingen** om uw prijzen, aanbetalingsregel, belastingtarief (btw), retoucherbeleid en voorraaddrempels in te voeren. De prijsschatter, offertes en facturen gebruiken deze waarden, stel ze dus eerst in. **CSV exporteren** downloadt uw prijslijst; bewerk deze en gebruik **CSV importeren** om ze terug te laden. U kunt ook uw studiologo uploaden; dit verschijnt in de bovenste balk.

## Klanten

**Klanten** toont iedereen met contactgegevens, allergieën en medische notities, ondertekende toestemmingsformulieren en totaal besteed. Gebruik **Nieuwe klant** om er een toe te voegen. Zoeken filtert de lijst terwijl u typt. **Profiel bekijken** opent het volledige dossier. In het profiel wijzigt **Klant bewerken** de gegevens en verwijdert **Verwijderen** de klant. Het profiel toont ook afspraken, teamnotities, ondertekende verklaringen, opgeslagen toestemmingsformulieren en foto's van het werk. Om veel klanten tegelijk toe te voegen, opent u **Instellingen**, **Import Data** en plakt u een lijst waarvan de eerste regel `name,email,phone,allergies,notes` is.

## Personeel

Klik rechtsboven op de personeelsknop om uw team te zien. **Teamlid toevoegen** voegt een persoon toe, **Bewerken** wijzigt de gegevens en **Verwijderen** haalt de persoon uit het team. **Selecteren** toont de naam van die persoon in de bovenbalk, zodat iedereen ziet wie er achter het scherm zit. Er zijn geen wachtwoorden en geen toegangsniveaus. Een nieuw teamlid kan meteen worden gekozen op elke plek waar een artiest wordt gekozen, bijvoorbeeld bij het boeken van een afspraak.

## Afspraken en planning

**Nieuwe afspraak** boekt één sessie met artiest, station, prijs en aanbetaling. Voor werk met meerdere sessies zoekt de **Automatische planner** de vrije tijdslots van de artiest op een gekozen dag en boekt tot zes sessies met een vast aantal weken ertussen. Het dashboard toont de cijfers van vandaag, aankomende boekingen, stationsstatus en lage voorraad. De Agenda toont alle geboekte afspraken, de eerstvolgende bovenaan. **Afgerond** markeert een sessie als gedaan, zodat ze meetelt in de duuranalyse, en **Verwijderen** wist ze.

## Digitale toestemmingsformulieren

Open het toestemmingsformulier, kies de klant uit de lijst (diens allergieën worden ingevuld), bevestig de leeftijdscontrole en laat de klant tekenen op het tablet. Het toestemmingsformulier wordt opgeslagen met de handtekeningafbeelding. Het wordt niet opgeslagen zonder klant en handtekening.

Om de klant een toestemmingsformulier op een tablet te laten invullen, opent u **Klanten**, de bouwer van toestemmingsformulieren, het formuliervoorbeeld en daarna de tablet-kioskmodus. De klant beantwoordt één onderdeel per scherm, tekent op het laatste en tikt op de knop om af te ronden. Het formulier wordt met de handtekening opgeslagen en er wordt een PDF gedownload. Als er vooraf geen klant was gekozen, wordt een nieuwe klant aangemaakt met de naam, het e-mailadres, het telefoonnummer en de geboortedatum van het formulier. Opgeslagen formulieren staan in het klantprofiel onder **Verklaringen**; **Antwoorden bekijken** toont elk antwoord.

## Berichten: de CRM bereidt voor, u verstuurt

Studio CRM verstuurt zelf geen e-mail, sms of chatberichten. Wanneer u een nazorg-e-mail, een herinnering of een leveranciersbestelling voorbereidt, verschijnt een paneel **Bericht klaar**. Klik op **E-mail**, **WhatsApp** of **LINE** om het met de ingevulde tekst in uw eigen app te openen, en druk daar op verzenden, of klik op **Kopiëren**.

## Voorraad, scanner en inkooporders

**Voorraad** houdt hoeveelheden, partijen, vervaldatums en leveranciers bij. Artikelen op of onder hun bestelniveau tellen als lage voorraad.

De scanner in **Activiteitenlogboek** gebruikt de camera van het apparaat. Scan een voorraad-SKU of partijnummer om het artikel te zien, of een `CLIENT-<number>`-code om een klant te openen. U kunt ook een code van een foto scannen. Onbekende codes worden vermeld onder **Foutenlogboek**.

**Inkooporder** toont uw leveranciers en hun artikelen met lage voorraad, maakt een inkoopordernummer, downloadt een PDF en bereidt de bestel-e-mail voor.

## Galerij

**Portfolio** bevat foto's van afgewerkt werk, gekoppeld aan klant en artiest. **Flash sheets** bevat ontwerpen met prijs en aanbetaling; markeer een als gereserveerd wanneer een klant het reserveert. **Delen** bereidt een bericht voor WhatsApp, LINE, X of e-mail voor; het deelmenu van de telefoon kan de foto bevatten.

## Geld en personeel

De **Fooicalculator** verdeelt een fooi 80% artiest, 15% leerling, 5% balie en registreert dit. Personeel klokt in en uit met de diensttoets. Exports geven u het activiteitenlogboek, lage voorraad, diensten en sessieduur als CSV of PDF. In de Agenda toont het dienstenvenster of iemand in dienst is, en het **Dienstrooster** toont de geplande diensten: kies een persoon, een datum en de tijden, en klik op **Dienst toevoegen**. De export van het rooster en, in Voorraad, de export van de voorraad slaan een CSV- of PDF-bestand op in uw map Downloads.

## Compliancedossiers

De **afsluitchecklist** registreert welke taken zijn uitgevoerd, de leidinggevende, het autoclaafcyclusnummer en uw notities. Het **Autoclaafregister** toont sterilisatiecycli, en het dashboard waarschuwt voor voorraad die de vervaldatum heeft overschreden. Dit zijn uw eigen dossiers: controleer de regels van uw lokale gezondheidsautoriteit over wat u moet bewaren.

## Poli-tools

Het scherm **Tools** opent de Poli International-tools (nazorgschema's, generator voor toestemmingsformulieren, gauge-omrekenaar, prijsschatter en meer) binnen de CRM.

## Backups

Alles wordt opgeslagen in `data/studio_crm.sqlite` (of het pad ingesteld in `SQLITE_DB_PATH`). Kopieer dat bestand om de studio te backuppen. De snapshotknop schrijft ook een kopie naar `storage/backups/`.
