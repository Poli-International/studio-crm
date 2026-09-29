# 🤝 Contributing to Studio CRM & POLI Studio OS (v2.5)

<div align="center">

**🌍 Multilingual Versions / Versions Multilingues / Versioni Multilingue / Mehrsprachige Versionen / Versiones Multilingües / Meertalige Versies / Versões Multilíngues:**  
[🇬🇧 English](#-1-english-contributing-guide-v25---en) • [🇫🇷 Français](#-2-guide-de-contribution-en-français-v25---fr) • [🇮🇹 Italiano](#-3-guida-al-contributo-in-italiano-v25---it) • [🇩🇪 Deutsch](#-4-deutsche-mitwirkungs-anleitung-v25---de) • [🇪🇸 Español](#-5-guía-de-contribución-en-español-v25---es) • [🇳🇱 Nederlands](#-6-nederlandse-bijdragehandleiding-v25---nl) • [🇵🇹 Português](#-7-guia-de-contribuição-em-português-v25---pt)

</div>

---

## 🇬🇧 1. English Contributing Guide (v2.5 - EN)

Thank you for your interest in contributing to Studio CRM!
### Development Guidelines
1. **Fork & Clone**: `git clone https://github.com/Poli-International/studio-crm.git`
2. **Install Dependencies**: `npm install`
3. **Run Dev Server**: `npm start` (Runs on port 3000)
4. **Test Battery Suite**: Run `node test-battery.cjs` to ensure 100% test passing before submitting PRs.
5. **v2.5 Features Contribution**:
   - **Multi-Session Project Planning**: Ensure new session workflows support deposit tracking, milestone statuses, and calendar synchronization.
   - **PDF Generation**: Verify PDF Purchase Orders (`generateTop5SupplierPOPDF`) and client reports generate valid jsPDF autoTable formats with proper margins and headers.
   - **Historical Trends**: When adding D3 charts, provide animated transition reveals (staggered stroke-dasharray) and custom interactive tooltip hover handlers.
   - **Inventory Management**: Ensure all new inventory controls have `data-i18n` attributes, clear-search bindings, and threshold alert logic.

---

## 🇫🇷 2. Guide de Contribution en Français (v2.5 - FR)
Merci pour votre intérêt envers Studio CRM !
### Directives de Développement
1. Cloner le dépôt : `git clone https://github.com/Poli-International/studio-crm.git`
2. Installer les dépendances : `npm install`
3. Lancer le serveur : `npm start`
4. Exécuter la batterie de tests : `node test-battery.cjs`
5. **Nouvelles fonctionnalités v2.5** :
   - **Planification Multi-Sessions** : Valider la gestion des acomptes et le calendrier des étapes.
   - **Rapports & Bons de Commande PDF** : Vérifier la mise en page jsPDF autoTable (`generateTop5SupplierPOPDF`).
   - **Indicateurs de Tendances D3** : Intégrer des animations fluides et des infobulles de survol personnalisées.
   - **Gestion des Stocks** : Assurer la compatibilité avec les balises `data-i18n` et les seuils de réapprovisionnement.

---

## 🇮🇹 3. Guida al Contributo in Italiano (v2.5 - IT)
Grazie per l'interesse nel contribuire a Studio CRM!
### Linee Guida per lo Sviluppo
1. Clona il repository: `git clone https://github.com/Poli-International/studio-crm.git`
2. Installa le dipendenze: `npm install`
3. Esegui il server: `npm start`
4. Esegui il test battery: `node test-battery.cjs`
5. **Nuove Funzionalità v2.5**:
   - **Pianificazione Multi-Sessione**: Supportare depositi scaglionati e sincronizzazione calendario.
   - **Generazione PDF & Ordini di Acquisto**: Verificare la formattazione jsPDF (`generateTop5SupplierPOPDF`).
   - **Grafici D3 & Indicatori di Spesa**: Fornire animazioni progressive e tooltip interattivi.
   - **Gestione Scorte**: Garantire attributi `data-i18n` e notifiche soglia minima.

---

## 🇩🇪 4. Deutsche Mitwirkungs-Anleitung (v2.5 - DE)
Vielen Dank für dein Interesse an Studio CRM!
### Entwicklungsrichtlinien
1. Repository klonen: `git clone https://github.com/Poli-International/studio-crm.git`
2. Abhängigkeiten installieren: `npm install`
3. Server starten: `npm start`
4. Testsuite ausführen: `node test-battery.cjs`
5. **v2.5 Funktionsrichtlinien**:
   - **Multi-Session Projektplanung**: Anzahlungen, Meilensteine und Kalender-Synchronisation validieren.
   - **PDF-Berichte & Lieferantenbestellungen**: Gültiges Tabellenlayout mit jsPDF sicherstellen (`generateTop5SupplierPOPDF`).
   - **Historische D3-Trends**: Animierte Strichpfade und Hover-Tooltips implementieren.
   - **Lagerverwaltung**: Mehrsprachige `data-i18n`-Schlüssel und Schwellenwerte testen.

---

## 🇪🇸 5. Guía de Contribución en Español (v2.5 - ES)
¡Gracias por tu interés en contribuir a Studio CRM!
### Directrices de Desarrollo
1. Clona el repositorio: `git clone https://github.com/Poli-International/studio-crm.git`
2. Instala dependencias: `npm install`
3. Inicia el servidor: `npm start`
4. Ejecuta las pruebas: `node test-battery.cjs`
5. **Nuevas Funcionalidades v2.5**:
   - **Planificación Multi-Sesión**: Validar depósitos escalonados e hitos de proyecto.
   - **Generación de Reportes y Órdenes PDF**: Probar la estructura de jsPDF (`generateTop5SupplierPOPDF`).
   - **Tendencias Históricas D3**: Incluir animaciones de trazado y tooltips flotantes.
   - **Gestión de Inventario**: Comprobar atributos `data-i18n` y filtros con borrado rápido.

---

## 🇳🇱 6. Nederlandse Bijdragehandleiding (v2.5 - NL)
Bedankt voor je interesse om bij te dragen aan Studio CRM!
### Ontwikkelingsrichtlijnen
1. Clone de repository: `git clone https://github.com/Poli-International/studio-crm.git`
2. Installeer afhankelijkheden: `npm install`
3. Start de server: `npm start`
4. Voer tests uit: `node test-battery.cjs`
5. **Nieuwe v2.5 Functies**:
   - **Multi-Sessie Projectplanning**: Beheer van termijnbetalingen en mijlpaalsynchronisatie.
   - **PDF-Rapporten & Inkooporders**: Valideer de jsPDF autoTable-lay-out (`generateTop5SupplierPOPDF`).
   - **D3 Historische Trends**: Geanimeerde lijnonthullingen en interactieve hover-tooltips toevoegen.
   - **Voorraadbeheer**: Test `data-i18n` sleutels en meldingen voor minimumvoorraad.

---

## 🇵🇹 7. Guia de Contribuição em Português (v2.5 - PT)
Obrigado pelo seu interesse em contribuir com o Studio CRM!
### Diretrizes de Desenvolvimento
1. Clone o repositório: `git clone https://github.com/Poli-International/studio-crm.git`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm start`
4. Execute os testes: `node test-battery.cjs`
5. **Novos Recursos v2.5**:
   - **Planejamento Multi-Sessão**: Validar parcelamento de sinal e marcos de projeto.
   - **Relatórios PDF & Ordens de Compra**: Testar estrutura de tabelas jsPDF (`generateTop5SupplierPOPDF`).
   - **Tendências Históricas D3**: Incluir animações de revelação e tooltips de porcentagem/valor.
   - **Gestão de Estoque**: Garantir cobertura `data-i18n` e alertas de reposição.

---

<div align="center">
<strong>Poli International • Contributing Guide v2.5</strong>
</div>

