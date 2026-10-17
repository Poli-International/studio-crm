# Studio CRM-gebruikershandleiding

Studio CRM draait op één computer in uw studio. Medewerkers openen het in een webbrowser op die computer of op elk apparaat in het studionetwerk. Uw gegevens blijven in een bestand op die computer. Er wordt niets naar Poli International verzonden.

## Installeren en starten

1. Download de Studio CRM-ZIP voor uw computer (Windows, Mac of Linux) van de Studio CRM-pagina. Node.js zit er al in; u hoeft verder niets te installeren.
2. Pak het uit. Zet de map `studio-crm` op een plek waar hij kan blijven staan, bijvoorbeeld in Documenten.
3. Dubbelklik op **Start Studio CRM** (`Start Studio CRM.bat` op Windows, `Start Studio CRM.command` op een Mac, `./start-studio-crm.sh` op Linux). Op een Mac klikt u de eerste keer met de rechtermuisknop en kiest u **Open**.
4. Uw browser opent `http://localhost:3000`. Houd het venster dat verscheen open terwijl u het CRM gebruikt; als u het sluit, stopt het CRM. Andere apparaten gebruiken het netwerkadres van de computer in plaats van `localhost`, met `:3000` aan het eind.

Hebt u de broncode gedownload, installeer dan Node.js 22 of nieuwer, voer één keer `npm install` uit en daarna `npm start`. Met Docker: `docker compose up -d`.

**Bijwerken:** als er een nieuwe versie is, staat bij het versienummer onderaan het menu **update beschikbaar**. Open **Instellingen**, **Updates** en klik op **Nu bijwerken** (alleen een beheerder). Het CRM downloadt de nieuwe versie, maakt een back-up van de database in `storage/backups`, probeert de nieuwe versie op een kopie van uw gegevens en installeert hem pas dan; het start vanzelf opnieuw en de pagina laadt opnieuw. Uw gegevens blijven in de map `data` en worden nooit verplaatst. Gaat er iets mis, dan verandert er niets en blijft de oude versie draaien. De vorige versie blijft in de verborgen map `.update/previous`. Versies vóór 1.0.12 werkt u één keer met de hand bij: download de nieuwe ZIP, pak die uit in een nieuwe map en kopieer uw map `data` van de oude map naar de nieuwe.

Om een andere poort te gebruiken, stelt u `PORT` in een `.env`-bestand in (kopieer `.env.example`). Stel daar ook `STUDIO_MANAGER_EMAIL` in, zodat meldingen aan u worden geadresseerd.

## Eerste keer opstarten: demogegevens

Een nieuwe installatie start met demoklanten, afspraken, voorraad en personeel, zodat u elk scherm kunt uitproberen. Wanneer u klaar bent voor echt werk, klikt u op **Beginnen met een lege studio** op het dashboard. Dit verwijdert de demogegevens en behoudt de dienstenlijst, categorieën, sjablonen, stations en instellingen. Dit kan niet ongedaan worden gemaakt.

## Taal

Kies Engels, Frans, Italiaans, Duits, Spaans, Nederlands, Portugees of Thai in het taalmenu boven aan. De Poli-tools binnen de CRM openen in dezelfde taal wanneer die beschikbaar is (tools zonder Thai openen in het Engels).

## Studio-instellingen

Open **Instellingen** om uw prijzen, aanbetalingsregel, belastingtarief (btw), retoucherbeleid en voorraaddrempels in te voeren. De prijsschatter, offertes en facturen gebruiken deze waarden, stel ze dus eerst in. **CSV exporteren** downloadt uw prijslijst; bewerk deze en gebruik **CSV importeren** om ze terug te laden. U kunt ook uw studiologo uploaden; dit verschijnt in de bovenste balk.

## Klanten

**Klanten** toont iedereen met contactgegevens, allergieën en medische notities, ondertekende toestemmingsformulieren en totaal besteed. Gebruik **Nieuwe klant** om er een toe te voegen. Zoeken filtert de lijst terwijl u typt. **Profiel bekijken** opent het volledige dossier. In het profiel wijzigt **Klant bewerken** de gegevens en verwijdert **Verwijderen** de klant. Het profiel toont ook afspraken, teamnotities, ondertekende verklaringen, opgeslagen toestemmingsformulieren en foto's van het werk. Om veel klanten tegelijk toe te voegen, opent u **Instellingen**, **Import Data** en plakt u een lijst waarvan de eerste regel `name,email,phone,allergies,notes` is. De teller **Signed** telt ook toestemmingsformulieren die op de tablet zijn ondertekend. **Healing Pipeline** toont de klanten van wie de sessie de afgelopen 90 dagen als voltooid is gemarkeerd, gegroepeerd per dagen sinds de sessie, met **View Profile** en **Download PDF**.

## Personeel

Klik rechtsboven op de personeelsknop om uw team te zien. **Teamlid toevoegen** voegt een persoon toe, **Bewerken** wijzigt de gegevens en **Verwijderen** haalt de persoon uit het team. **Selecteren** toont de naam van die persoon in de bovenbalk, zodat iedereen ziet wie er achter het scherm zit. Zodra er een studiowachtwoord is, kan iedereen ook een eigen login en toegangsniveau krijgen (zie hieronder). Een nieuw teamlid kan meteen worden gekozen op elke plek waar een artiest wordt gekozen, bijvoorbeeld bij het boeken van een afspraak.

## Tablets, telefoons en het studiowachtwoord

Andere apparaten in de studio openen het CRM met het adres dat in het startvenster staat. Een tablet of telefoon die de camera nodig heeft (de scanner) moet het adres gebruiken dat begint met `https://` en eindigt op `:3443`. De eerste keer waarschuwt de browser dat de verbinding niet privé is, omdat het certificaat door uw eigen computer is gemaakt: kies Geavanceerd en daarna Doorgaan. Met het gewone `http://`-adres werkt alles behalve de camera.

De eerste keer dat het CRM start, vraagt het u het **studiowachtwoord** aan te maken. Elke computer, tablet en telefoon meldt zich daarna één keer daarmee aan. U kunt **Continue without a password** kiezen en het later instellen in **Instellingen**, **Studiowachtwoord**. Vergeten? Maak een leeg bestand `reset-password.txt` in de map `data` en start het CRM opnieuw: dat verwijdert het studiowachtwoord en alle personeelslogins.

**Een ongebruikt apparaat vergrendelen:** kies in **Instellingen**, onder het studiowachtwoord, hoe lang een apparaat ongebruikt mag blijven (5, 10, 15 of 30 minuten) voordat het zichzelf afmeldt. De tabletkiosk wordt nooit vergrendeld: die heeft een eigen pincode om af te sluiten.

**Logins en niveaus voor personeel:** met het studiowachtwoord ingesteld opent u de personeelslijst, klikt u bij iemand op **Bewerken** en kiest u een **Toegangsniveau** en een **Loginwachtwoord** (minstens 8 tekens). Geef uzelf eerst het niveau **Beheerder**: personeelslogins werken zodra één beheerder een login heeft. Daarna vraagt de aanmeldpagina **Who are you?** en meldt iedereen zich aan met een eigen wachtwoord. Het studiowachtwoord blijft werken en meldt aan als beheerder.

- **Receptie**: klanten, afspraken, toestemmingsformulieren, betalingen, in- en uitklokken.
- **Personeel**: alles van de receptie, plus voorraad, leveranciers, compliance-registraties, nazorg, het rooster en het ontwerp van de toestemmingsformulieren.
- **Beheerder**: alles, ook verwijderen, de financiële overzichten, Instellingen, het team, logins, back-ups en imports.

Receptie en personeel zien Financiën en Instellingen niet. Probeert iemand iets wat het niveau niet toestaat, dan meldt het CRM dat en verandert er niets. Een login verwijderen: zet het niveau op **Geen login**.

## Afspraken en planning

**Nieuwe afspraak** boekt één sessie met artiest, station, prijs en aanbetaling. Voor werk met meerdere sessies zoekt de **Automatische planner** de vrije tijdslots van de artiest op een gekozen dag en boekt tot zes sessies met een vast aantal weken ertussen. Het dashboard toont de cijfers van vandaag, aankomende boekingen, stationsstatus en lage voorraad. De Agenda toont alle geboekte afspraken, de eerstvolgende bovenaan. **Afgerond** markeert een sessie als gedaan, zodat ze meetelt in de duuranalyse, en **Verwijderen** wist ze. **Edit** bij een afspraak wijzigt tijd, artiest, werkplek, prijs, aanbetaling of notities. Typ bij het boeken de naam van de klant en kies die uit de lijst, zodat de afspraak in het klantprofiel verschijnt. Twee keer snel op een opslagknop tikken slaat één keer op. De lijst toont bij elke afspraak ook de aanbetaling en wat nog te betalen is (prijs min aanbetaling).

## Digitale toestemmingsformulieren

Open het toestemmingsformulier, kies de klant uit de lijst (diens allergieën worden ingevuld), bevestig de leeftijdscontrole en laat de klant tekenen op het tablet. Het toestemmingsformulier wordt opgeslagen met de handtekeningafbeelding. Het wordt niet opgeslagen zonder klant en handtekening. Geopend vanuit het profiel van een klant staat die klant al in het formulier.

Om de klant een toestemmingsformulier op een tablet te laten invullen, opent u **Klanten**, de bouwer van toestemmingsformulieren, het formuliervoorbeeld en daarna de tablet-kioskmodus. De klant beantwoordt één onderdeel per scherm, tekent op het laatste en tikt op de knop om af te ronden. Het formulier wordt met de handtekening opgeslagen en er wordt een PDF gedownload. Als er vooraf geen klant was gekozen, wordt een nieuwe klant aangemaakt met de naam, het e-mailadres, het telefoonnummer en de geboortedatum van het formulier. Opgeslagen formulieren staan in het klantprofiel onder **Verklaringen**; **Antwoorden bekijken** toont elk antwoord. Een formulier dat u in de formulierbouwer bewerkt, wordt bij de studiogegevens opgeslagen: de tablet toont dus hetzelfde formulier als de computer waarop u het bewerkte.


Wilt u voorkomen dat een klant het formulier verlaat als u even wegloopt, stel dan in **Instellingen** een **Tablet Kiosk PIN** in. De kioskmodus verlaten vraagt dan om de pincode. Tikt de klant op **Complete**, dan controleert de kiosk of er niets ontbreekt, slaat het formulier op en toont „Thank you, your form has been submitted” tot een medewerker de pincode invoert. Ondertekende toestemmingen staan in het klantprofiel onder **Verklaringen**: **View waiver** toont de antwoorden en de handtekening, en **Download PDF** bewaart een kopie om af te drukken of te bewaren.

**Kiosktablets:** een tablet op een standaard kan alleen formulieren. Stel bij **Instellingen**, **Kiosktablets** een kioskwachtwoord in (daarvoor is het studiowachtwoord nodig). Open op de tablet het adres dat daar staat (het eindigt op `/kiosk`), meld aan met het kioskwachtwoord en geef de tablet een naam; hij toont dan ‘Even geduld’. Om een formulier te sturen opent u **Klanten**, **Verklaring ondertekenen** bij de klant, kiest u het formulier, **Voorbeeld bekijken** en dan **Naar de kiosk sturen**. Het formulier opent op de tablet; tikt de klant op **Afronden**, dan wordt het bij die klant bewaard (onder **Verklaringen**) en wacht de tablet weer. Stuurt u terwijl er nog een formulier wacht, dan kunt u het wachtende **Terugnemen**. Een kioskaanmelding kan het CRM niet openen en geen klantgegevens lezen. Zet op de tablet volledig scherm of kioskmodus aan (bijvoorbeeld scherm vastzetten op Android of een kioskbrowser) zodat de klant op de pagina blijft.

**Een kiosktablet instellen, goed om te weten:** de eerste keer waarschuwt de tablet dat de verbinding niet privé is: tik op **Geavanceerd** en daarna op **Doorgaan** (Chrome of Edge). Het is je eigen server; die heeft het certificaat zelf gemaakt. Komt de waarschuwing steeds terug, of blijft een kioskbrowser erop hangen, gebruik dan het `http://`-adres dat **Instellingen** eronder toont: geen waarschuwing, maar de formulieren gaan onversleuteld over je netwerk, dus alleen op de eigen wifi van de studio. Geef de CRM-computer een vast adres in je router ("DHCP-reservering" of "vast IP"), anders raken de tablets hem kwijt als zijn adres verandert. Als het CRM opnieuw start, blijft de tablet aangemeld en blijft een wachtend formulier staan.
## Berichten: de CRM bereidt voor, u verstuurt

Studio CRM verstuurt zelf geen e-mail, sms of chatberichten. Wanneer u een nazorg-e-mail, een herinnering of een leveranciersbestelling voorbereidt, verschijnt een paneel **Bericht klaar**. Klik op **E-mail**, **WhatsApp** of **LINE** om het met de ingevulde tekst in uw eigen app te openen, en druk daar op verzenden, of klik op **Kopiëren**.

## Voorraad, scanner en inkooporders

**Voorraad** houdt hoeveelheden, partijen, vervaldatums en leveranciers bij. Artikelen op of onder hun bestelniveau tellen als lage voorraad. De lijst **Stock items** toont elk artikel met aantal, bestelgrens, lot, vervaldatum en leverancier; zoek op naam, SKU of leverancier. **+ Add item** voegt een artikel met de hand toe en **Edit** wijzigt het. **Suppliers** toont uw leveranciers: **+ Add supplier** en **Edit**. Bestellingen gaan naar het bestel-e-mailadres van de leverancier; controleer het.

De scanner in **Activiteitenlogboek** gebruikt de camera van het apparaat. Scan een voorraad-SKU of partijnummer om het artikel te zien, of een `CLIENT-<number>`-code om een klant te openen. U kunt ook een code van een foto scannen. Onbekende codes worden vermeld onder **Foutenlogboek**.

**Inkooporder** toont uw leveranciers en hun artikelen met lage voorraad, maakt een inkoopordernummer, downloadt een PDF en bereidt de bestel-e-mail voor.

## Galerij

**Portfolio** bevat foto's van afgewerkt werk, gekoppeld aan klant en artiest. **Flash sheets** bevat ontwerpen met prijs en aanbetaling; markeer een als gereserveerd wanneer een klant het reserveert. **Delen** bereidt een bericht voor WhatsApp, LINE, X of e-mail voor; het deelmenu van de telefoon kan de foto bevatten.

## Geld en personeel

De **Fooicalculator** verdeelt een fooi 80% artiest, 15% leerling, 5% balie en registreert dit. Personeel klokt in en uit met de diensttoets. Exports geven u het activiteitenlogboek, lage voorraad, diensten en sessieduur als CSV of PDF. In de Agenda toont het dienstenvenster of iemand in dienst is, en het **Dienstrooster** toont de geplande diensten: kies een persoon, een datum en de tijden, en klik op **Dienst toevoegen**. De export van het rooster en, in Voorraad, de export van de voorraad slaan een CSV- of PDF-bestand op in uw map Downloads. Onder **Financiën** legt **Record Payment** een betaling vast: de klant, het bedrag en de betaalwijze. **Deposit Ledger** toont de aanbetalingen die bij het boeken zijn ontvangen.

## Compliancedossiers

De **afsluitchecklist** registreert welke taken zijn uitgevoerd, de leidinggevende, het autoclaafcyclusnummer en uw notities. Het **Autoclaafregister** toont sterilisatiecycli, en het dashboard waarschuwt voor voorraad die de vervaldatum heeft overschreden. Dit zijn uw eigen dossiers: controleer de regels van uw lokale gezondheidsautoriteit over wat u moet bewaren.

## Poli-tools

Het scherm **Tools** opent de Poli International-tools (nazorgschema's, generator voor toestemmingsformulieren, gauge-omrekenaar, prijsschatter en meer) binnen de CRM.

## Backups

Alles wordt opgeslagen in `data/studio_crm.sqlite` (of het pad ingesteld in `SQLITE_DB_PATH`). Kopieer dat bestand om de studio te backuppen. De snapshotknop schrijft ook een kopie naar `storage/backups/`.
