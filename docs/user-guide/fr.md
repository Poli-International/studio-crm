# Guide d'utilisation Studio CRM

Studio CRM fonctionne sur un seul ordinateur dans votre studio. Le personnel l'ouvre dans un navigateur web sur cet ordinateur ou sur tout autre appareil du réseau du studio. Vos données restent dans un fichier sur cet ordinateur. Rien n'est envoyé à Poli International.

## Installation et démarrage

1. Téléchargez le ZIP de Studio CRM pour votre ordinateur (Windows, Mac ou Linux) depuis la page Studio CRM. Node.js est déjà inclus ; il n'y a rien d'autre à installer.
2. Décompressez-le. Placez le dossier `studio-crm` à un endroit où il peut rester, par exemple dans Documents.
3. Double-cliquez sur **Start Studio CRM** (`Start Studio CRM.bat` sous Windows, `Start Studio CRM.command` sur Mac, `./start-studio-crm.sh` sous Linux). Sur Mac, la première fois, faites un clic droit puis choisissez **Ouvrir**.
4. Votre navigateur s'ouvre sur `http://localhost:3000`. Gardez ouverte la fenêtre qui s'est affichée pendant que vous utilisez le CRM ; la fermer arrête le CRM. Les autres appareils utilisent l'adresse réseau de l'ordinateur à la place de `localhost`, avec `:3000` à la fin.

Si vous avez téléchargé le code source, installez Node.js 22 ou une version plus récente, puis exécutez `npm install` une fois et `npm start`. Avec Docker : `docker compose up -d`.

**Mettre à jour :** quand une nouvelle version sort, le numéro de version en bas du menu indique **mise à jour disponible**. Ouvrez **Paramètres**, **Mises à jour**, puis cliquez sur **Mettre à jour** (un administrateur seulement). Le CRM télécharge la nouvelle version, sauvegarde la base de données dans `storage/backups`, essaie la nouvelle version sur une copie de vos données, puis seulement l'installe et redémarre tout seul ; la page se recharge. Vos données restent dans le dossier `data` et ne sont jamais déplacées. Si quelque chose ne va pas, rien n'est changé et l'ancienne version continue de tourner. La version précédente est gardée dans le dossier caché `.update/previous`. Les versions antérieures à 1.0.12 se mettent à jour une fois à la main : téléchargez le nouveau ZIP, décompressez-le dans un nouveau dossier et copiez votre dossier `data` de l'ancien dossier vers le nouveau.

Pour utiliser un port différent, définissez `PORT` dans un fichier `.env` (copiez `.env.example`). Définissez aussi `STUDIO_MANAGER_EMAIL` à cet endroit, afin que les alertes vous soient adressées.

## Premier lancement : données de démonstration

Une nouvelle installation s'ouvre avec des clients, rendez-vous, stocks et membres du personnel de démonstration, afin que vous puissiez essayer chaque écran. Lorsque vous êtes prêt à passer au travail réel, cliquez sur **Commencer avec un studio vide** dans le tableau de bord. Cela supprime les données de démonstration et conserve la liste des services, les catégories, les modèles, les postes et les réglages. Cette action est irréversible.

## Langue

Choisissez l'anglais, le français, l'italien, l'allemand, l'espagnol, le néerlandais, le portugais ou le thaï dans le menu de langue en haut. Les outils Poli intégrés au CRM s'ouvrent dans la même langue lorsqu'ils la proposent (les outils sans thaï s'ouvrent en anglais).

## Réglages du studio

Ouvrez **Réglages** pour saisir vos prix, la règle d'acompte, le taux de taxe (TVA), la politique de retouche et les seuils de stock. L'estimateur de prix, les devis et les factures utilisent ces valeurs, donc définissez-les d'abord. **Exporter CSV** télécharge votre liste de prix ; modifiez-la et utilisez **Importer CSV** pour la recharger. Vous pouvez aussi téléverser le logo de votre studio ; il apparaît dans la barre supérieure.

**Coordonnées du studio et postes :** dans **Paramètres**, **Coordonnées du studio**, saisissez le nom, l'adresse, le téléphone, l'e-mail et le numéro d'autorisation sanitaire ou de licence du studio : chaque formulaire de consentement les affiche, sur l'ordinateur et sur les tablettes. Dans **Postes**, ajoutez, renommez ou retirez vos postes (salle de tatouage, salle de piercing, espace branding...), donnez à chacun un type et un artiste habituel. Le formulaire de rendez-vous liste vos postes, et réserver un artiste choisit le poste où il travaille d'habitude.

## Clients

**Clients** répertorie tout le monde avec leurs coordonnées, allergies et notes médicales, formulaires de consentement signés et total dépensé. Utilisez **Nouveau client** pour en ajouter un. La recherche filtre la liste au fur et à mesure que vous tapez. **Voir le profil** ouvre le dossier complet. Dans le profil, **Modifier le client** change les coordonnées et **Supprimer** retire le client. Le profil affiche aussi les rendez-vous, les notes du personnel, les décharges signées, les formulaires de consentement enregistrés et les photos des travaux. Pour ajouter plusieurs clients à la fois, ouvrez **Réglages**, **Import Data** et collez une liste dont la première ligne est `name,email,phone,allergies,notes`. Le compteur **Signed** inclut les formulaires de consentement signés sur la tablette. **Healing Pipeline** liste les clients dont la séance a été marquée terminée ces 90 derniers jours, groupés par jours depuis la séance, avec **View Profile** et **Download PDF**.

**Soins après la séance :** dans la fiche d'un client, sous **Soins après la séance**, choisissez la fiche (tatouage, piercing, trait fin, maquillage permanent) et le rendez-vous, puis **Imprimer et enregistrer les soins** : la fiche s'imprime avec les coordonnées du studio et le nom du client, et le CRM enregistre quelle fiche a été remise, pour quel rendez-vous, par qui et quand. Chaque rendez-vous indique si les soins ont été remis. **🖨️ Fiche de soins** dans Clients imprime une fiche sans nom de client, sans rien enregistrer.

## Personnel

Cliquez sur le bouton du personnel en haut à droite (il affiche **Connexion équipe** tant que personne n'est sélectionné) pour voir votre équipe. **Ajouter un membre** ajoute une personne, **Modifier** change ses coordonnées et **Retirer** l'enlève de l'équipe. **Sélectionner** affiche le nom de cette personne dans la barre du haut, pour que chacun voie qui est à l'écran. Une fois le mot de passe du studio défini, chaque personne peut aussi avoir son propre identifiant et son niveau d'accès (voir plus bas). Un nouveau membre peut être choisi tout de suite partout où l'on choisit un artiste, par exemple pour un rendez-vous.

## Tablettes, téléphones et mot de passe du studio

Les autres appareils du studio ouvrent le CRM avec l'adresse affichée dans la fenêtre qui l'a démarré. Une tablette ou un téléphone qui a besoin de la caméra (le scanner) doit utiliser l'adresse qui commence par `https://` et se termine par `:3443`. La première fois, le navigateur avertit que la connexion n'est pas privée, car le certificat a été créé par votre propre ordinateur : choisissez Avancé, puis Continuer. Avec l'adresse `http://` simple, tout fonctionne sauf la caméra.

Au premier démarrage, le CRM vous demande de créer le **mot de passe du studio**. Chaque ordinateur, tablette et téléphone se connecte ensuite une fois avec lui. Vous pouvez choisir **Continue without a password** et le définir plus tard dans **Réglages**, **Mot de passe du studio**. Si vous l'oubliez, créez un fichier vide nommé `reset-password.txt` dans le dossier `data` et redémarrez le CRM : cela supprime le mot de passe du studio et tous les identifiants du personnel.

**Verrouiller un appareil inutilisé :** dans **Réglages**, sous le mot de passe du studio, choisissez combien de temps un appareil peut rester inutilisé (5, 10, 15 ou 30 minutes) avant de se déconnecter tout seul. Le kiosque tablette n'est jamais verrouillé : il a son propre code PIN de sortie.

**Identifiants et niveaux du personnel :** une fois le mot de passe du studio défini, ouvrez la liste du personnel, cliquez sur **Modifier** pour une personne et choisissez un **Niveau d'accès** et un **Mot de passe de connexion** (8 caractères minimum). Donnez-vous d'abord le niveau **Administrateur** : les identifiants du personnel fonctionnent dès qu'un administrateur en a un. Ensuite, la page de connexion demande **Who are you?** et chacun se connecte avec son propre mot de passe. Le mot de passe du studio fonctionne toujours et connecte en administrateur.

- **Accueil** : clients, rendez-vous, formulaires de consentement, paiements, pointage.
- **Personnel** : tout ce que fait l'accueil, plus le stock, les fournisseurs, les registres de conformité, les soins post-séance, le planning et la conception des formulaires de consentement.
- **Administrateur** : tout, y compris la suppression, les rapports financiers, les Réglages, l'équipe, les identifiants, les sauvegardes et les imports.

L'accueil et le personnel ne voient pas Finance ni Réglages. Si quelqu'un tente une action que son niveau ne permet pas, le CRM le dit et ne change rien. Pour supprimer un identifiant, choisissez le niveau **Pas d'identifiant**.

## Rendez-vous et planification

**Nouveau rendez-vous** réserve une séance unique avec artiste, poste, prix et acompte. Pour un travail en plusieurs séances, le **Planificateur automatique** recherche les créneaux libres de l'artiste à une date choisie et réserve jusqu'à six séances espacées d'un nombre de semaines défini. Le tableau de bord affiche les chiffres du jour, les réservations à venir, l'état des postes et les stocks faibles. Le Calendrier affiche tous les rendez-vous réservés, les prochains en premier. **Terminé** marque une séance comme faite, elle compte alors dans l'analyse des durées, et **Retirer** la supprime. **Edit** sur un rendez-vous modifie l'heure, l'artiste, le poste, le prix, l'acompte ou les notes. À la réservation, tapez le nom du client et choisissez-le dans la liste : le rendez-vous apparaît alors dans sa fiche. Deux appuis rapides sur un bouton d'enregistrement n'enregistrent qu'une fois. La liste montre aussi l'acompte de chaque rendez-vous et le reste à payer (prix moins acompte).

## Formulaires de consentement numériques

Ouvrez le formulaire de consentement, choisissez le client dans la liste (ses allergies sont déjà renseignées), confirmez la vérification d'âge, puis faites signer le client sur la tablette. Le formulaire est enregistré avec l'image de la signature. Il ne s'enregistre pas sans client ni signature. Ouvert depuis la fiche d'un client, le formulaire a déjà ce client choisi.

Pour faire remplir un formulaire de consentement sur une tablette, ouvrez **Clients**, le créateur de formulaires de consentement, l'aperçu du formulaire, puis le mode kiosque tablette. Le client répond à une section par écran, signe sur le dernier et touche le bouton pour terminer. Le formulaire est enregistré avec la signature et un PDF est téléchargé. Si aucun client n'a été choisi avant, un nouveau client est créé à partir du nom, de l'e-mail, du téléphone et de la date de naissance du formulaire. Les formulaires enregistrés se trouvent dans le profil du client, sous **Décharges** ; **Voir les réponses** affiche chaque réponse. Un formulaire modifié dans le créateur de formulaires est enregistré avec les données du studio : la tablette affiche donc le même formulaire que l'ordinateur où vous l'avez modifié.


Pour que le client ne puisse pas quitter le formulaire si vous vous absentez, définissez un **Tablet Kiosk PIN** dans **Réglages**. Quitter le mode kiosque demande alors le code. Quand le client appuie sur **Complete**, le kiosque vérifie que rien ne manque, enregistre le formulaire et affiche « Thank you, your form has been submitted » jusqu'à ce qu'un membre de l'équipe saisisse le code. Les consentements signés sont dans la fiche du client, sous **Décharges** : **View waiver** affiche les réponses et la signature, et **Download PDF** enregistre une copie à imprimer ou à conserver.

**Tablettes borne :** une tablette sur un support ne sert qu’aux formulaires. Dans **Paramètres**, **Tablettes borne**, définissez un mot de passe borne (il faut le mot de passe du studio). Sur la tablette, ouvrez l’adresse indiquée (elle se termine par `/kiosk`), connectez-vous avec le mot de passe borne et donnez un nom à la tablette ; elle affiche alors « Veuillez patienter ». Pour envoyer un formulaire, ouvrez **Clients**, **Signer la décharge** sur le client, choisissez le formulaire, **Aperçu du formulaire**, puis **Envoyer à la borne**. Le formulaire s’ouvre sur la tablette ; quand le client touche **Terminer**, il est enregistré chez ce client (sous **Décharges**) et la tablette attend à nouveau. Si vous envoyez alors qu’un formulaire attend encore, vous pouvez **Reprendre** celui qui attend. Une connexion borne ne peut ni ouvrir le CRM ni lire de données client. Activez le plein écran ou le mode borne de la tablette (par exemple l’épinglage d’écran Android ou un navigateur borne) pour que le client reste sur la page.

**Installer une tablette borne, bon à savoir :** la première fois, la tablette avertit que la connexion n'est pas privée : touchez **Paramètres avancés**, puis **Continuer** (Chrome ou Edge). C'est votre propre serveur ; il a créé ce certificat lui-même. Si l'avertissement revient sans cesse, ou si un navigateur kiosque s'y bloque, utilisez l'adresse `http://` que **Paramètres** affiche en dessous : pas d'avertissement, mais les formulaires traversent votre réseau sans chiffrement, donc uniquement sur le Wi-Fi du studio. Donnez à l'ordinateur du CRM une adresse fixe dans votre box (« réservation DHCP » ou « IP statique »), sinon les tablettes le perdent quand son adresse change. Quand le CRM redémarre, la tablette reste connectée et le formulaire qui l'attend reste là.

**Clients de moins de 18 ans et vérification d'identité :** le CRM calcule l'âge de chaque client à partir de sa date de naissance (la fiche, la vérification d'identité, ou une date de naissance écrite par le client sur un formulaire). Un client de moins de 18 ans est signalé **Moins de 18 ans** dans la liste des clients, la fiche et le formulaire de rendez-vous, et ses formulaires demandent la signature d'un parent ou tuteur : le CRM n'enregistre ni n'envoie un formulaire sans elle (le modèle de consentement pour mineur l'a). Si un client écrit sur la tablette une date de naissance de moins de 18 ans, le formulaire signé est gardé mais marqué en rouge, et le journal d'activité le signale. Dans la fiche du client, **Enregistrer une vérification d'identité** garde le type de pièce et seulement ses 4 derniers caractères, avec qui l'a vérifiée et quand ; chaque formulaire signé ensuite montre l'âge et la vérification, à l'écran et dans le PDF.
## Messages : le CRM prépare, vous envoyez

Studio CRM n'envoie pas lui-même d'e-mails, de SMS ou de messages de chat. Lorsque vous préparez un e-mail de soins post-acte, un rappel ou une commande fournisseur, un panneau **Message prêt** apparaît. Cliquez sur **E-mail**, **WhatsApp** ou **LINE** pour l'ouvrir dans votre propre application avec le texte déjà rempli, puis appuyez sur envoyer là-bas, ou cliquez sur **Copier**.

## Stock, scanner et bons de commande

**Inventaire** suit les quantités, les lots, les dates d'expiration et les fournisseurs. Les articles à leur seuil de réapprovisionnement ou en dessous sont considérés comme stock faible. La liste **Stock items** montre chaque article avec sa quantité, son seuil de commande, son lot, sa date de péremption et son fournisseur ; cherchez par nom, SKU ou fournisseur. **+ Add item** ajoute un article à la main et **Edit** le modifie. **Suppliers** liste vos fournisseurs : **+ Add supplier** et **Edit**. Les bons de commande partent à l'e-mail de commande du fournisseur : vérifiez-le.

Le scanner dans **Journal d'activité** utilise la caméra de l'appareil. Scannez une référence de stock ou un numéro de lot pour voir l'article, ou un code `CLIENT-<number>` pour ouvrir un client. Vous pouvez aussi scanner un code à partir d'une photo. Les codes inconnus sont répertoriés dans **Journal des erreurs**.

**Bon de commande** répertorie vos fournisseurs et leurs articles en stock faible, crée un numéro de bon de commande, télécharge un PDF et prépare l'e-mail de commande.

## Galerie

**Portfolio** contient les photos des travaux terminés, liées au client et à l'artiste. **Flashs** contient des designs avec prix et acompte ; marquez-en un comme réservé lorsqu'un client le réserve. **Partager** prépare un message pour WhatsApp, LINE, X ou e-mail ; le menu de partage du téléphone peut inclure la photo.

## Argent et personnel

Le **Calculateur de pourboire** répartit un pourboire à 80 % artiste, 15 % apprenti, 5 % accueil et l'enregistre. Le personnel pointe l'arrivée et le départ avec le bouton de service. Les exports fournissent le journal d'activité, le stock faible, les services et les durées de séance en CSV ou PDF. Dans le Calendrier, la fenêtre des services indique si une personne est en service, et le **Planning des services** liste les services prévus : choisissez une personne, une date et les heures, puis **Ajouter un service**. L'export du planning et, dans l'Inventaire, l'export du stock enregistrent un fichier CSV ou PDF dans votre dossier Téléchargements. Dans **Finances**, **Record Payment** enregistre un paiement : le client, le montant et le moyen de paiement. **Deposit Ledger** liste les acomptes encaissés à la réservation.

## Registres de conformité

La **liste de clôture** enregistre les tâches effectuées, le responsable, le numéro de cycle d'autoclave et vos notes. Le **Registre d'autoclave** répertorie les cycles de stérilisation, et le tableau de bord signale les stocks dépassant leur date d'expiration. Ce sont vos propres registres : vérifiez les règles de votre autorité sanitaire locale quant à ce que vous devez conserver.

## Outils Poli

L'écran **Outils** ouvre les outils Poli International (calendriers de soins post-acte, créateur de formulaire de consentement, convertisseur de calibre, estimateur de prix et plus) à l'intérieur du CRM.

## Sauvegardes

Tout est stocké dans `data/studio_crm.sqlite` (ou le chemin défini dans `SQLITE_DB_PATH`). Copiez ce fichier pour sauvegarder le studio. Le bouton d'instantané écrit aussi une copie dans `storage/backups/`. Le CRM y enregistre aussi une copie chaque jour et garde les 30 derniers jours. Dans **Paramètres**, **Sauvegarde de la base de données**, vous pouvez aussi copier chaque sauvegarde dans un second dossier (clé USB, autre disque, dossier Google Drive, OneDrive ou Dropbox) : un disque en panne ou un ordinateur volé n'emporte pas toutes les copies.
