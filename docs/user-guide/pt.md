# Guia do utilizador do Studio CRM

O Studio CRM funciona num único computador do seu estúdio. A equipa abre-o num navegador nesse computador ou em qualquer dispositivo da rede do estúdio. Os seus dados permanecem num ficheiro nesse computador. Não é enviado nada para a Poli International.

## Instalação e arranque

1. Descarregue o ZIP do Studio CRM para o seu computador (Windows, Mac ou Linux) na página do Studio CRM. O Node.js já está incluído; não há mais nada para instalar.
2. Descomprima-o. Coloque a pasta `studio-crm` num local onde possa ficar, por exemplo em Documentos.
3. Faça duplo clique em **Start Studio CRM** (`Start Studio CRM.bat` no Windows, `Start Studio CRM.command` no Mac, `./start-studio-crm.sh` no Linux). No Mac, da primeira vez, clique com o botão direito e escolha **Abrir**.
4. O seu navegador abre em `http://localhost:3000`. Mantenha aberta a janela que apareceu enquanto usa o CRM; fechá-la para o CRM. Os outros dispositivos usam o endereço de rede do computador em vez de `localhost`, com `:3000` no fim.

Se descarregou o código-fonte, instale o Node.js 22 ou mais recente, execute `npm install` uma vez e depois `npm start`. Com Docker: `docker compose up -d`.

**Atualizar:** quando sai uma versão nova, o número da versão no fundo do menu diz **atualização disponível**. Abra **Definições**, **Atualizações** e clique em **Atualizar agora** (só um administrador). O CRM descarrega a versão nova, faz uma cópia de segurança da base de dados em `storage/backups`, experimenta a versão nova numa cópia dos seus dados e só então a instala e reinicia sozinho; a página volta a carregar. Os seus dados ficam na pasta `data` e nunca são movidos. Se algo correr mal, nada muda e a versão antiga continua a funcionar. A versão anterior fica guardada na pasta oculta `.update/previous`. As versões anteriores à 1.0.12 atualizam-se à mão uma vez: descarregue o ZIP novo, descomprima-o numa pasta nova e copie a sua pasta `data` da pasta antiga para a nova.

Para usar uma porta diferente, defina `PORT` num ficheiro `.env` (copie `.env.example`). Defina também ali `STUDIO_MANAGER_EMAIL`, para que os alertas lhe sejam dirigidos.

## Primeira utilização: dados de demonstração

Uma nova instalação abre com clientes, marcações, stock e equipa de demonstração, para que possa experimentar todos os ecrãs. Quando estiver pronto para o trabalho real, clique em **Começar com um estúdio vazio** no Dashboard. Isto elimina os registos de demonstração e mantém a lista de serviços, categorias, modelos, estações e definições. Esta ação não pode ser desfeita.

## Idioma

Escolha inglês, francês, italiano, alemão, espanhol, neerlandês, português ou tailandês no menu de idioma no topo. As ferramentas Poli dentro do CRM abrem no mesmo idioma quando o oferecem (as ferramentas sem tailandês abrem em inglês).

## Definições do estúdio

Abra **Definições** para introduzir os seus preços, a regra de depósito, a taxa de imposto (IVA), a política de retoques e os limiares de stock. O estimador de preços, os orçamentos e as faturas utilizam estes valores, por isso defina-os primeiro. **Exportar CSV** descarrega a sua lista de preços; edite-a e use **Importar CSV** para a carregar de novo. Também pode carregar o logótipo do seu estúdio; este aparece na barra superior.

**Dados do estúdio e postos:** em **Definições**, **Dados do estúdio**, escreva o nome, a morada, o telefone, o e-mail e o número de licença sanitária do estúdio: cada formulário de consentimento mostra-os, no computador e nos tablets. Em **Postos**, adicione, mude o nome ou remova os seus postos (sala de tatuagem, sala de piercing, área de branding...), e dê a cada um um tipo e um artista habitual. O formulário de marcação lista os seus postos, e marcar um artista escolhe o posto onde costuma trabalhar.

## Clientes

**Clientes** lista todos com os seus dados de contacto, alergias e notas médicas, consentimentos assinados e total gasto. Use **Novo cliente** para adicionar um. A pesquisa filtra a lista à medida que escreve. **Ver perfil** abre o registo completo. No perfil, **Editar cliente** altera os dados e **Excluir** remove o cliente. O perfil mostra também as marcações, as notas da equipa, os termos assinados, os formulários de consentimento guardados e as fotos dos trabalhos. Para adicionar muitos clientes de uma vez, abra **Definições**, **Import Data** e cole uma lista cuja primeira linha seja `name,email,phone,allergies,notes`. A contagem **Signed** inclui os formulários de consentimento assinados no tablet. Em **Trabalhos e fotos**, **Tirar ou escolher uma foto** adiciona uma imagem do dispositivo, ou da câmara num telemóvel ou tablet. **Healing Pipeline** lista os clientes cuja sessão foi marcada como concluída nos últimos 90 dias, agrupados por dias desde a sessão, com **View Profile** e **Download PDF**.

**Cuidados posteriores:** na ficha de um cliente, em **Cuidados posteriores**, escolha a folha (tatuagem, piercing, traço fino, maquilhagem permanente) e a marcação, depois **Imprimir e registar os cuidados**: a folha é impressa com os dados do estúdio e o nome do cliente, e o CRM regista que folha foi entregue, para que marcação, por quem e quando. Cada marcação mostra se os cuidados foram entregues. **🖨️ Folha de cuidados** em Clientes imprime uma folha sem nome de cliente e não regista nada. Cada folha é impressa na língua escolhida ao lado. Em **Definições**, **Folhas de cuidados**, altere o título, a descrição e os passos de cada folha em cada língua, ou adicione as suas próprias folhas; uma língua deixada vazia imprime o inglês.

## Equipa

Clique no botão da equipa, em cima à direita, para ver a sua equipa. **Adicionar membro** adiciona uma pessoa, **Editar** altera os seus dados e **Remover** retira-a da equipa. **Selecionar** mostra o nome dessa pessoa na barra superior, para que todos vejam quem está no ecrã. Depois de definida a palavra-passe do estúdio, cada pessoa pode ter também o seu próprio acesso e nível (ver abaixo). Um novo membro pode ser escolhido de imediato em qualquer lugar onde se escolhe um artista, por exemplo ao marcar uma sessão.

## Tablets, telemóveis e a palavra-passe do estúdio

Os outros dispositivos do estúdio abrem o CRM com o endereço mostrado na janela que o iniciou. Um tablet ou telemóvel que precise da câmara (o scanner) tem de usar o endereço que começa por `https://` e termina em `:3443`. Da primeira vez, o navegador avisa que a ligação não é privada, porque o certificado foi criado pelo seu próprio computador: escolha Avançadas e depois Continuar. Com o endereço `http://` simples funciona tudo, exceto a câmara.

Na primeira vez que arranca, o CRM pede-lhe que crie a **palavra-passe do estúdio**. Cada computador, tablet e telemóvel inicia sessão uma vez com ela. Pode escolher **Continue without a password** e defini-la mais tarde em **Definições**, **Palavra-passe do estúdio**. Se a esquecer, crie um ficheiro vazio chamado `reset-password.txt` na pasta `data` e volte a iniciar o CRM: isto remove a palavra-passe do estúdio e todos os acessos da equipa.

**Bloquear um dispositivo sem uso:** em **Definições**, por baixo da palavra-passe do estúdio, escolha quanto tempo um dispositivo pode ficar sem uso (5, 10, 15 ou 30 minutos) antes de terminar a sessão sozinho. O quiosque do tablet nunca é bloqueado: tem o seu próprio PIN de saída.

**Acessos e níveis da equipa:** com a palavra-passe do estúdio definida, abra a lista da equipa, clique em **Editar** numa pessoa e escolha um **Nível de acesso** e uma **Palavra-passe de acesso** (pelo menos 8 caracteres). A partir do primeiro acesso, a página de início de sessão pergunta **Who are you?**: cada pessoa escolhe o seu nome e entra com a sua palavra-passe. A palavra-passe do estúdio fica em primeiro nessa lista e continua a entrar como administrador; dê também a si próprio o nível **Administrador** se quiser um acesso seu.

**Funções:** em **Definições**, **Funções**, marque o que cada função pode abrir e alterar: clientes e marcações, stock e fornecedores, esterilização e conformidade, escala de turnos, formulários de consentimento e folhas de cuidados, dinheiro e relatórios, eliminar registos. Recepção e Equipa estão sempre lá e começam com o que podiam fazer antes; **Adicionar função** cria uma sua ("Esterilização", "Aprendiz") e **Guardar as funções** mantém as alterações. Uma função sem uma área não vê o seu ecrã, e o CRM recusa as suas alterações. Só um **Administrador** altera as Definições, a equipa, os acessos e as funções. Uma função que alguém ainda tem não pode ser removida: dê-lhe antes outra função.

- **Recepção**: clientes, marcações, consentimentos, pagamentos, registo de entrada e saída.
- **Equipa**: tudo o que a recepção faz, mais stock, fornecedores, registos de conformidade, cuidados pós-sessão, escalas e o design dos consentimentos.
- **Administrador**: tudo, incluindo apagar registos, os relatórios financeiros, as Definições, a equipa, os acessos, as cópias de segurança e as importações.

A recepção e a equipa não veem Finanças nem Definições. Se alguém tentar algo que o seu nível não permite, o CRM avisa e não altera nada. Para remover um acesso, defina o nível como **Sem acesso**.

## Marcações e agendamento

**Nova marcação** reserva uma única sessão com artista, estação, preço e depósito. Para trabalhos de várias sessões, o **Agendador automático** procura os horários livres do artista num dia escolhido e reserva até seis sessões com um número fixo de semanas de intervalo. O Dashboard mostra os números do dia, as próximas marcações, o estado das estações e o stock baixo. O Calendário lista todas as marcações, as próximas primeiro. **Concluída** marca uma sessão como feita, passando a contar na análise de durações, e **Remover** apaga-a. **Edit** numa marcação altera a hora, o artista, o posto, o preço, o sinal ou as notas. Ao marcar, escreva o nome do cliente e escolha-o na lista, para que a marcação apareça no perfil dele. Dois toques rápidos num botão de guardar guardam uma só vez. A lista mostra também o sinal de cada marcação e o que falta pagar (preço menos sinal).

## Consentimentos digitais

Abra o formulário de consentimento, escolha o cliente na lista (as suas alergias são preenchidas automaticamente), confirme a verificação de idade e peça ao cliente para assinar no tablet. O consentimento é guardado com a imagem da assinatura. Não é guardado sem um cliente e uma assinatura. Aberto a partir do perfil de um cliente, o formulário já tem esse cliente escolhido.

Para o cliente preencher um formulário de consentimento num tablet, abra **Clientes**, o criador de formulários de consentimento, a pré-visualização do formulário e depois o modo quiosque para tablet. O cliente responde a uma secção por ecrã, assina no último e toca no botão para concluir. O formulário é guardado com a assinatura e é descarregado um PDF. Se antes não foi escolhido nenhum cliente, é criado um novo cliente com o nome, o e-mail, o telefone e a data de nascimento do formulário. Os formulários guardados estão no perfil do cliente, em **Termos**; **Ver respostas** mostra cada resposta. Um formulário editado no criador de formulários é guardado com os dados do estúdio: o tablet mostra o mesmo formulário que o computador onde o editou.


Para que o cliente não saia do formulário quando se afasta, defina um **Tablet Kiosk PIN** em **Definições**. Sair do modo quiosque passa a pedir o PIN. Quando o cliente toca em **Complete**, o quiosque verifica se não falta nada, guarda o formulário e mostra «Thank you, your form has been submitted» até alguém da equipa introduzir o PIN. Os consentimentos assinados estão no perfil do cliente, em **Termos**: **View waiver** mostra as respostas e a assinatura, e **Download PDF** guarda uma cópia para imprimir ou arquivar.

**Tablets de quiosque:** um tablet num suporte só serve para formulários. Em **Definições**, **Tablets de quiosque**, defina uma senha de quiosque (é preciso a senha do estúdio). No tablet, abra o endereço indicado (termina em `/kiosk`), entre com a senha do quiosque e dê um nome ao tablet; ele mostra então «Aguarde, por favor». Para enviar um formulário, abra **Clientes**, **Assinar Termo de Responsabilidade** no cliente, escolha o formulário, **Pré-visualizar** e depois **Enviar para o quiosque**. O formulário abre no tablet; quando o cliente toca **Concluir**, ele é salvo nesse cliente (em **Termos**) e o tablet volta a esperar. Se enviar enquanto outro formulário ainda espera, pode **Retirar** o que está à espera. Um acesso de quiosque não abre o CRM nem lê dados de clientes. Ative a tela cheia ou o modo quiosque do tablet (por exemplo, a fixação de tela do Android ou um navegador de quiosque) para o cliente ficar na página.

**Configurar um tablet de quiosque, bom saber:** na primeira vez, o tablet avisa que a ligação não é privada: toque em **Avançadas** e depois em **Continuar** (Chrome ou Edge). É o seu próprio servidor; foi ele que criou o certificado. Se o aviso voltar sempre, ou um navegador de quiosque parar nele, use o endereço `http://` que as **Definições** mostram por baixo: sem aviso, mas os formulários passam pela rede sem encriptação, por isso use-o só na rede Wi-Fi do próprio estúdio. Dê ao computador do CRM um endereço fixo no router ("reserva DHCP" ou "IP estático"); caso contrário, os tablets perdem-no quando o endereço muda. Quando o CRM reinicia, o tablet continua ligado e o formulário em espera continua lá.

**Clientes menores de 18 anos e verificação de identidade:** o CRM calcula a idade de cada cliente a partir da data de nascimento (da ficha, da verificação de identidade ou de uma data que o cliente escreve num formulário). Um cliente menor de 18 anos aparece como **Menor de 18** na lista de clientes, na ficha e no formulário de marcação, e os seus formulários precisam da assinatura de um pai, mãe ou tutor: o CRM não guarda nem envia um formulário sem ela (o modelo de consentimento para menores tem-na). Se um cliente escrever no tablet uma data de nascimento de menor de 18, o formulário assinado é guardado mas marcado a vermelho, e o registo de atividade indica-o. Na ficha do cliente, **Registar uma verificação de identidade** guarda o tipo de identificação e só os últimos 4 caracteres, com quem verificou e quando; cada formulário assinado depois mostra a idade e a verificação, no ecrã e no PDF.

**Campo Scanner:** no criador de formulários, adicione um campo **Scanner** a um formulário e dê ao botão as suas próprias palavras. No formulário, o botão digitaliza uma página com o scanner ligado ao computador onde o CRM funciona, a partir da receção ou de um tablet; a página fica guardada com o formulário como uma foto e é impressa no PDF. No Windows usa a digitalização integrada do Windows (WIA): se o scanner funciona com a aplicação Digitalizar do Windows, funciona aqui. No Linux usa SANE. Ainda não no Mac.
## Mensagens: o CRM prepara, você envia

O Studio CRM não envia, por si próprio, e-mails, SMS ou mensagens de chat. Quando prepara um e-mail de cuidados pós-procedimento, um recordatório ou uma encomenda a um fornecedor, aparece um painel **Mensagem pronta**. Clique em **E-mail**, **WhatsApp** ou **LINE** para o abrir na sua própria aplicação com o texto já preenchido, e depois envie a partir daí, ou clique em **Copiar**.

## Stock, scanner e encomendas

**Inventário** acompanha quantidades, lotes, datas de validade e fornecedores. Os artigos no nível de reposição ou abaixo dele contam como stock baixo. A lista **Stock items** mostra cada artigo com quantidade, nível de encomenda, lote, validade e fornecedor; pesquise por nome, SKU ou fornecedor. **+ Add item** acrescenta um artigo à mão e **Edit** altera-o. **Suppliers** lista os fornecedores: **+ Add supplier** e **Edit**. As encomendas seguem para o email de encomendas do fornecedor: confirme-o.

O scanner em **Registo de atividade** usa a câmara do dispositivo. Digitalize um SKU de stock ou número de lote para ver o artigo, ou um código `CLIENT-<number>` para abrir um cliente. Também pode digitalizar um código a partir de uma fotografia. Os códigos desconhecidos são listados em **Registo de erros**.

**Encomenda** lista os seus fornecedores e os respetivos artigos com stock baixo, cria um número de encomenda, descarrega um PDF e prepara o e-mail da encomenda.

## Galeria

**Portefólio** contém fotografias de trabalhos concluídos, associadas ao cliente e ao artista. **Flash sheets** contém desenhos com preço e depósito; marque um como reservado quando um cliente o reservar. **Partilhar** prepara uma mensagem para WhatsApp, LINE, X ou e-mail; o menu de partilha do telemóvel pode incluir a fotografia.

## Dinheiro e equipa

A **Calculadora de gorjetas** divide uma gorjeta em 80% artista, 15% aprendiz, 5% receção e regista-a. A equipa regista a entrada e a saída com o botão de turno. As exportações fornecem-lhe o registo de atividade, o stock baixo, os turnos e as durações das sessões em CSV ou PDF. No Calendário, a janela dos turnos mostra se uma pessoa está de turno, e a **Escala de turnos** lista os turnos previstos: escolha uma pessoa, uma data e o horário, e clique em **Adicionar turno**. A exportação da escala e, no Inventário, a exportação do stock guardam um ficheiro CSV ou PDF na sua pasta de Transferências. Em **Finanças**, **Record Payment** regista um pagamento: o cliente, o valor e a forma de pagamento. **Deposit Ledger** lista os sinais recebidos nas marcações.

## Registos de conformidade

A **checklist de fecho** regista quais os itens realizados, o supervisor, o número do ciclo do autoclave e as suas notas. O **Registo do autoclave** lista os ciclos de esterilização, e o Dashboard avisa sobre stock com a validade expirada. Estes são os seus próprios registos: consulte as regras da sua autoridade de saúde local sobre o que deve conservar.

## Ferramentas Poli

O ecrã **Ferramentas** abre as ferramentas da Poli International (calendários de cuidados pós-procedimento, criador de formulários de consentimento, conversor de calibre, estimador de preços e mais) dentro do CRM.

## Cópias de segurança

Tudo é guardado em `data/studio_crm.sqlite` (ou no caminho definido em `SQLITE_DB_PATH`). Copie esse ficheiro para fazer uma cópia de segurança do estúdio. O botão de snapshot também escreve uma cópia em `storage/backups/`. O CRM também guarda lá uma cópia todos os dias e mantém os últimos 30 dias. Em **Definições**, **Cópia de Segurança da Base de Dados**, pode copiar também cada cópia para uma segunda pasta (pen USB, outro disco, pasta do Google Drive, OneDrive ou Dropbox), para que um disco avariado ou um computador roubado não leve todas as cópias.
