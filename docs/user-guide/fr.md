# Guide d'utilisation Studio CRM

Studio CRM fonctionne sur un seul ordinateur dans votre studio. Le personnel l'ouvre dans un navigateur web sur cet ordinateur ou sur tout autre appareil du réseau du studio. Vos données restent dans un fichier sur cet ordinateur. Rien n'est envoyé à Poli International.

## Installation et démarrage

1. Téléchargez le ZIP de Studio CRM pour votre ordinateur (Windows, Mac ou Linux) depuis la page Studio CRM. Node.js est déjà inclus ; il n'y a rien d'autre à installer.
2. Décompressez-le. Placez le dossier `studio-crm` à un endroit où il peut rester, par exemple dans Documents.
3. Double-cliquez sur **Start Studio CRM** (`Start Studio CRM.bat` sous Windows, `Start Studio CRM.command` sur Mac, `./start-studio-crm.sh` sous Linux). Sur Mac, la première fois, faites un clic droit puis choisissez **Ouvrir**.
4. Votre navigateur s'ouvre sur `http://localhost:3000`. Gardez ouverte la fenêtre qui s'est affichée pendant que vous utilisez le CRM ; la fermer arrête le CRM. Les autres appareils utilisent l'adresse réseau de l'ordinateur à la place de `localhost`, avec `:3000` à la fin.

Si vous avez téléchargé le code source, installez Node.js 22 ou une version plus récente, puis exécutez `npm install` une fois et `npm start`. Avec Docker : `docker compose up -d`.

Pour mettre à jour, téléchargez le nouveau ZIP, décompressez-le dans un nouveau dossier, puis copiez votre dossier `data` de l'ancien dossier vers le nouveau.

Pour utiliser un port différent, définissez `PORT` dans un fichier `.env` (copiez `.env.example`). Définissez aussi `STUDIO_MANAGER_EMAIL` à cet endroit, afin que les alertes vous soient adressées.

## Premier lancement : données de démonstration

Une nouvelle installation s'ouvre avec des clients, rendez-vous, stocks et membres du personnel de démonstration, afin que vous puissiez essayer chaque écran. Lorsque vous êtes prêt à passer au travail réel, cliquez sur **Commencer avec un studio vide** dans le tableau de bord. Cela supprime les données de démonstration et conserve la liste des services, les catégories, les modèles, les postes et les réglages. Cette action est irréversible.

## Langue

Choisissez l'anglais, le français, l'italien, l'allemand, l'espagnol, le néerlandais, le portugais ou le thaï dans le menu de langue en haut. Les outils Poli intégrés au CRM s'ouvrent dans la même langue lorsqu'ils la proposent (les outils sans thaï s'ouvrent en anglais).

## Réglages du studio

Ouvrez **Réglages** pour saisir vos prix, la règle d'acompte, le taux de taxe (TVA), la politique de retouche et les seuils de stock. L'estimateur de prix, les devis et les factures utilisent ces valeurs, donc définissez-les d'abord. **Exporter CSV** télécharge votre liste de prix ; modifiez-la et utilisez **Importer CSV** pour la recharger. Vous pouvez aussi téléverser le logo de votre studio ; il apparaît dans la barre supérieure.

## Clients

**Clients** répertorie tout le monde avec leurs coordonnées, allergies et notes médicales, formulaires de consentement signés et total dépensé. Utilisez **Nouveau client** pour en ajouter un. La recherche filtre la liste au fur et à mesure que vous tapez. **Voir le profil** ouvre le dossier complet. Dans le profil, **Modifier le client** change les coordonnées et **Supprimer** retire le client. Le profil affiche aussi les rendez-vous, les notes du personnel, les décharges signées, les formulaires de consentement enregistrés et les photos des travaux. Pour ajouter plusieurs clients à la fois, ouvrez **Réglages**, **Import Data** et collez une liste dont la première ligne est `name,email,phone,allergies,notes`.

## Personnel

Cliquez sur le bouton du personnel en haut à droite (il affiche **Connexion équipe** tant que personne n'est sélectionné) pour voir votre équipe. **Ajouter un membre** ajoute une personne, **Modifier** change ses coordonnées et **Retirer** l'enlève de l'équipe. **Sélectionner** affiche le nom de cette personne dans la barre du haut, pour que chacun voie qui est à l'écran. Il n'y a ni mot de passe ni niveau d'accès. Un nouveau membre peut être choisi tout de suite partout où l'on choisit un artiste, par exemple pour un rendez-vous.

## Rendez-vous et planification

**Nouveau rendez-vous** réserve une séance unique avec artiste, poste, prix et acompte. Pour un travail en plusieurs séances, le **Planificateur automatique** recherche les créneaux libres de l'artiste à une date choisie et réserve jusqu'à six séances espacées d'un nombre de semaines défini. Le tableau de bord affiche les chiffres du jour, les réservations à venir, l'état des postes et les stocks faibles.

## Formulaires de consentement numériques

Ouvrez le formulaire de consentement, choisissez le client dans la liste (ses allergies sont déjà renseignées), confirmez la vérification d'âge, puis faites signer le client sur la tablette. Le formulaire est enregistré avec l'image de la signature. Il ne s'enregistre pas sans client ni signature.

Pour faire remplir un formulaire de consentement sur une tablette, ouvrez **Clients**, le créateur de formulaires de consentement, l'aperçu du formulaire, puis le mode kiosque tablette. Le client répond à une section par écran, signe sur le dernier et touche le bouton pour terminer. Le formulaire est enregistré avec la signature et un PDF est téléchargé. Si aucun client n'a été choisi avant, un nouveau client est créé à partir du nom, de l'e-mail, du téléphone et de la date de naissance du formulaire. Les formulaires enregistrés se trouvent dans le profil du client, sous **Décharges** ; **Voir les réponses** affiche chaque réponse.

## Messages : le CRM prépare, vous envoyez

Studio CRM n'envoie pas lui-même d'e-mails, de SMS ou de messages de chat. Lorsque vous préparez un e-mail de soins post-acte, un rappel ou une commande fournisseur, un panneau **Message prêt** apparaît. Cliquez sur **E-mail**, **WhatsApp** ou **LINE** pour l'ouvrir dans votre propre application avec le texte déjà rempli, puis appuyez sur envoyer là-bas, ou cliquez sur **Copier**.

## Stock, scanner et bons de commande

**Inventaire** suit les quantités, les lots, les dates d'expiration et les fournisseurs. Les articles à leur seuil de réapprovisionnement ou en dessous sont considérés comme stock faible.

Le scanner dans **Journal d'activité** utilise la caméra de l'appareil. Scannez une référence de stock ou un numéro de lot pour voir l'article, ou un code `CLIENT-<number>` pour ouvrir un client. Vous pouvez aussi scanner un code à partir d'une photo. Les codes inconnus sont répertoriés dans **Journal des erreurs**.

**Bon de commande** répertorie vos fournisseurs et leurs articles en stock faible, crée un numéro de bon de commande, télécharge un PDF et prépare l'e-mail de commande.

## Galerie

**Portfolio** contient les photos des travaux terminés, liées au client et à l'artiste. **Flashs** contient des designs avec prix et acompte ; marquez-en un comme réservé lorsqu'un client le réserve. **Partager** prépare un message pour WhatsApp, LINE, X ou e-mail ; le menu de partage du téléphone peut inclure la photo.

## Argent et personnel

Le **Calculateur de pourboire** répartit un pourboire à 80 % artiste, 15 % apprenti, 5 % accueil et l'enregistre. Le personnel pointe l'arrivée et le départ avec le bouton de service. Les exports fournissent le journal d'activité, le stock faible, les services et les durées de séance en CSV ou PDF. Dans le Calendrier, la fenêtre des services indique si une personne est en service, et le **Planning des services** liste les services prévus : choisissez une personne, une date et les heures, puis **Ajouter un service**. L'export du planning et, dans l'Inventaire, l'export du stock enregistrent un fichier CSV ou PDF dans votre dossier Téléchargements.

## Registres de conformité

La **liste de clôture** enregistre les tâches effectuées, le responsable, le numéro de cycle d'autoclave et vos notes. Le **Registre d'autoclave** répertorie les cycles de stérilisation, et le tableau de bord signale les stocks dépassant leur date d'expiration. Ce sont vos propres registres : vérifiez les règles de votre autorité sanitaire locale quant à ce que vous devez conserver.

## Outils Poli

L'écran **Outils** ouvre les outils Poli International (calendriers de soins post-acte, créateur de formulaire de consentement, convertisseur de calibre, estimateur de prix et plus) à l'intérieur du CRM.

## Sauvegardes

Tout est stocké dans `data/studio_crm.sqlite` (ou le chemin défini dans `SQLITE_DB_PATH`). Copiez ce fichier pour sauvegarder le studio. Le bouton d'instantané écrit aussi une copie dans `storage/backups/`.
