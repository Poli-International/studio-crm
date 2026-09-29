# Guide d'utilisation Studio CRM

Studio CRM fonctionne sur un seul ordinateur dans votre studio. Le personnel l'ouvre dans un navigateur web sur cet ordinateur ou sur tout autre appareil du réseau du studio. Vos données restent dans un fichier sur cet ordinateur. Rien n'est envoyé à Poli International.

## Installation et démarrage

1. Installez Node.js 20 ou une version plus récente.
2. Téléchargez les fichiers de Studio CRM et ouvrez un terminal dans le dossier `studio-crm`.
3. Exécutez `npm ci` une fois, puis `npm start`.
4. Ouvrez `http://localhost:3000` dans le navigateur. Les autres appareils utilisent l'adresse réseau de l'ordinateur à la place de `localhost`.

Pour utiliser un port différent, définissez `PORT` dans un fichier `.env` (copiez `.env.example`). Définissez aussi `STUDIO_MANAGER_EMAIL` à cet endroit, afin que les alertes vous soient adressées.

## Premier lancement : données de démonstration

Une nouvelle installation s'ouvre avec des clients, rendez-vous, stocks et membres du personnel de démonstration, afin que vous puissiez essayer chaque écran. Lorsque vous êtes prêt à passer au travail réel, cliquez sur **Commencer avec un studio vide** dans le tableau de bord. Cela supprime les données de démonstration et conserve la liste des services, les catégories, les modèles, les postes et les réglages. Cette action est irréversible.

## Langue

Choisissez l'anglais, le français, l'italien, l'allemand, l'espagnol, le néerlandais, le portugais ou le thaï dans le menu de langue en haut. Les outils Poli intégrés au CRM s'ouvrent dans la même langue lorsqu'ils la proposent (les outils sans thaï s'ouvrent en anglais).

## Réglages du studio

Ouvrez **Réglages** pour saisir vos prix, la règle d'acompte, le taux de taxe (TVA), la politique de retouche et les seuils de stock. L'estimateur de prix, les devis et les factures utilisent ces valeurs, donc définissez-les d'abord. **Exporter CSV** télécharge votre liste de prix ; modifiez-la et utilisez **Importer CSV** pour la recharger. Vous pouvez aussi téléverser le logo de votre studio ; il apparaît dans la barre supérieure.

## Clients

**Clients** répertorie tout le monde avec leurs coordonnées, allergies et notes médicales, formulaires de consentement signés et total dépensé. Utilisez **Nouveau client** pour en ajouter un. La recherche filtre la liste au fur et à mesure que vous tapez. **Voir le profil** ouvre le dossier complet.

## Rendez-vous et planification

**Nouveau rendez-vous** réserve une séance unique avec artiste, poste, prix et acompte. Pour un travail en plusieurs séances, le **Planificateur automatique** recherche les créneaux libres de l'artiste à une date choisie et réserve jusqu'à six séances espacées d'un nombre de semaines défini. Le tableau de bord affiche les chiffres du jour, les réservations à venir, l'état des postes et les stocks faibles.

## Formulaires de consentement numériques

Ouvrez le formulaire de consentement, choisissez le client dans la liste (ses allergies sont déjà renseignées), confirmez la vérification d'âge, puis faites signer le client sur la tablette. Le formulaire est enregistré avec l'image de la signature. Il ne s'enregistre pas sans client ni signature.

## Messages : le CRM prépare, vous envoyez

Studio CRM n'envoie pas lui-même d'e-mails, de SMS ou de messages de chat. Lorsque vous préparez un e-mail de soins post-acte, un rappel ou une commande fournisseur, un panneau **Message prêt** apparaît. Cliquez sur **E-mail**, **WhatsApp** ou **LINE** pour l'ouvrir dans votre propre application avec le texte déjà rempli, puis appuyez sur envoyer là-bas, ou cliquez sur **Copier**.

## Stock, scanner et bons de commande

**Inventaire** suit les quantités, les lots, les dates d'expiration et les fournisseurs. Les articles à leur seuil de réapprovisionnement ou en dessous sont considérés comme stock faible.

Le scanner dans **Journal d'activité** utilise la caméra de l'appareil. Scannez une référence de stock ou un numéro de lot pour voir l'article, ou un code `CLIENT-<number>` pour ouvrir un client. Vous pouvez aussi scanner un code à partir d'une photo. Les codes inconnus sont répertoriés dans **Journal des erreurs**.

**Bon de commande** répertorie vos fournisseurs et leurs articles en stock faible, crée un numéro de bon de commande, télécharge un PDF et prépare l'e-mail de commande.

## Galerie

**Portfolio** contient les photos des travaux terminés, liées au client et à l'artiste. **Flashs** contient des designs avec prix et acompte ; marquez-en un comme réservé lorsqu'un client le réserve. **Partager** prépare un message pour WhatsApp, LINE, X ou e-mail ; le menu de partage du téléphone peut inclure la photo.

## Argent et personnel

Le **Calculateur de pourboire** répartit un pourboire à 80 % artiste, 15 % apprenti, 5 % accueil et l'enregistre. Le personnel pointe l'arrivée et le départ avec le bouton de service. Les exports fournissent le journal d'activité, le stock faible, les services et les durées de séance en CSV ou PDF.

## Registres de conformité

La **liste de clôture** enregistre les tâches effectuées, le responsable, le numéro de cycle d'autoclave et vos notes. Le **Registre d'autoclave** répertorie les cycles de stérilisation, et le tableau de bord signale les stocks dépassant leur date d'expiration. Ce sont vos propres registres : vérifiez les règles de votre autorité sanitaire locale quant à ce que vous devez conserver.

## Outils Poli

L'écran **Outils** ouvre les outils Poli International (calendriers de soins post-acte, créateur de formulaire de consentement, convertisseur de calibre, estimateur de prix et plus) à l'intérieur du CRM.

## Sauvegardes

Tout est stocké dans `data/studio_crm.sqlite` (ou le chemin défini dans `SQLITE_DB_PATH`). Copiez ce fichier pour sauvegarder le studio. Le bouton d'instantané écrit aussi une copie dans `storage/backups/`.
