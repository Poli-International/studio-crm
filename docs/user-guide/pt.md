# Guia do utilizador do Studio CRM

O Studio CRM funciona num único computador do seu estúdio. A equipa abre-o num navegador nesse computador ou em qualquer dispositivo da rede do estúdio. Os seus dados permanecem num ficheiro nesse computador. Não é enviado nada para a Poli International.

## Instalação e arranque

1. Descarregue o ZIP do Studio CRM para o seu computador (Windows, Mac ou Linux) na página do Studio CRM. O Node.js já está incluído; não há mais nada para instalar.
2. Descomprima-o. Coloque a pasta `studio-crm` num local onde possa ficar, por exemplo em Documentos.
3. Faça duplo clique em **Start Studio CRM** (`Start Studio CRM.bat` no Windows, `Start Studio CRM.command` no Mac, `./start-studio-crm.sh` no Linux). No Mac, da primeira vez, clique com o botão direito e escolha **Abrir**.
4. O seu navegador abre em `http://localhost:3000`. Mantenha aberta a janela que apareceu enquanto usa o CRM; fechá-la para o CRM. Os outros dispositivos usam o endereço de rede do computador em vez de `localhost`, com `:3000` no fim.

Se descarregou o código-fonte, instale o Node.js 22 ou mais recente, execute `npm install` uma vez e depois `npm start`. Com Docker: `docker compose up -d`.

Para atualizar, descarregue o novo ZIP, descomprima-o numa pasta nova e copie a sua pasta `data` da pasta antiga para a nova.

Para usar uma porta diferente, defina `PORT` num ficheiro `.env` (copie `.env.example`). Defina também ali `STUDIO_MANAGER_EMAIL`, para que os alertas lhe sejam dirigidos.

## Primeira utilização: dados de demonstração

Uma nova instalação abre com clientes, marcações, stock e equipa de demonstração, para que possa experimentar todos os ecrãs. Quando estiver pronto para o trabalho real, clique em **Começar com um estúdio vazio** no Dashboard. Isto elimina os registos de demonstração e mantém a lista de serviços, categorias, modelos, estações e definições. Esta ação não pode ser desfeita.

## Idioma

Escolha inglês, francês, italiano, alemão, espanhol, neerlandês, português ou tailandês no menu de idioma no topo. As ferramentas Poli dentro do CRM abrem no mesmo idioma quando o oferecem (as ferramentas sem tailandês abrem em inglês).

## Definições do estúdio

Abra **Definições** para introduzir os seus preços, a regra de depósito, a taxa de imposto (IVA), a política de retoques e os limiares de stock. O estimador de preços, os orçamentos e as faturas utilizam estes valores, por isso defina-os primeiro. **Exportar CSV** descarrega a sua lista de preços; edite-a e use **Importar CSV** para a carregar de novo. Também pode carregar o logótipo do seu estúdio; este aparece na barra superior.

## Clientes

**Clientes** lista todos com os seus dados de contacto, alergias e notas médicas, consentimentos assinados e total gasto. Use **Novo cliente** para adicionar um. A pesquisa filtra a lista à medida que escreve. **Ver perfil** abre o registo completo. No perfil, **Editar cliente** altera os dados e **Excluir** remove o cliente. O perfil mostra também as marcações, as notas da equipa, os termos assinados, os formulários de consentimento guardados e as fotos dos trabalhos. Para adicionar muitos clientes de uma vez, abra **Definições**, **Import Data** e cole uma lista cuja primeira linha seja `name,email,phone,allergies,notes`.

## Equipa

Clique no botão da equipa, em cima à direita, para ver a sua equipa. **Adicionar membro** adiciona uma pessoa, **Editar** altera os seus dados e **Remover** retira-a da equipa. **Selecionar** mostra o nome dessa pessoa na barra superior, para que todos vejam quem está no ecrã. Não há palavras-passe nem níveis de acesso. Um novo membro pode ser escolhido de imediato em qualquer lugar onde se escolhe um artista, por exemplo ao marcar uma sessão.

## Tablets, telemóveis e a palavra-passe do estúdio

Os outros dispositivos do estúdio abrem o CRM com o endereço mostrado na janela que o iniciou. Um tablet ou telemóvel que precise da câmara (o scanner) tem de usar o endereço que começa por `https://` e termina em `:3443`. Da primeira vez, o navegador avisa que a ligação não é privada, porque o certificado foi criado pelo seu próprio computador: escolha Avançadas e depois Continuar. Com o endereço `http://` simples funciona tudo, exceto a câmara.

Para manter fora as outras pessoas da mesma rede, abra **Definições** e defina uma **Palavra-passe do estúdio**. Cada dispositivo inicia sessão uma vez. É uma única palavra-passe para todo o estúdio, não uma por pessoa. Se a esquecer, crie um ficheiro vazio chamado `reset-password.txt` na pasta `data` e inicie o CRM de novo.

## Marcações e agendamento

**Nova marcação** reserva uma única sessão com artista, estação, preço e depósito. Para trabalhos de várias sessões, o **Agendador automático** procura os horários livres do artista num dia escolhido e reserva até seis sessões com um número fixo de semanas de intervalo. O Dashboard mostra os números do dia, as próximas marcações, o estado das estações e o stock baixo. O Calendário lista todas as marcações, as próximas primeiro. **Concluída** marca uma sessão como feita, passando a contar na análise de durações, e **Remover** apaga-a.

## Consentimentos digitais

Abra o formulário de consentimento, escolha o cliente na lista (as suas alergias são preenchidas automaticamente), confirme a verificação de idade e peça ao cliente para assinar no tablet. O consentimento é guardado com a imagem da assinatura. Não é guardado sem um cliente e uma assinatura.

Para o cliente preencher um formulário de consentimento num tablet, abra **Clientes**, o criador de formulários de consentimento, a pré-visualização do formulário e depois o modo quiosque para tablet. O cliente responde a uma secção por ecrã, assina no último e toca no botão para concluir. O formulário é guardado com a assinatura e é descarregado um PDF. Se antes não foi escolhido nenhum cliente, é criado um novo cliente com o nome, o e-mail, o telefone e a data de nascimento do formulário. Os formulários guardados estão no perfil do cliente, em **Termos**; **Ver respostas** mostra cada resposta. Um formulário editado no criador de formulários é guardado com os dados do estúdio: o tablet mostra o mesmo formulário que o computador onde o editou.

## Mensagens: o CRM prepara, você envia

O Studio CRM não envia, por si próprio, e-mails, SMS ou mensagens de chat. Quando prepara um e-mail de cuidados pós-procedimento, um recordatório ou uma encomenda a um fornecedor, aparece um painel **Mensagem pronta**. Clique em **E-mail**, **WhatsApp** ou **LINE** para o abrir na sua própria aplicação com o texto já preenchido, e depois envie a partir daí, ou clique em **Copiar**.

## Stock, scanner e encomendas

**Inventário** acompanha quantidades, lotes, datas de validade e fornecedores. Os artigos no nível de reposição ou abaixo dele contam como stock baixo.

O scanner em **Registo de atividade** usa a câmara do dispositivo. Digitalize um SKU de stock ou número de lote para ver o artigo, ou um código `CLIENT-<number>` para abrir um cliente. Também pode digitalizar um código a partir de uma fotografia. Os códigos desconhecidos são listados em **Registo de erros**.

**Encomenda** lista os seus fornecedores e os respetivos artigos com stock baixo, cria um número de encomenda, descarrega um PDF e prepara o e-mail da encomenda.

## Galeria

**Portefólio** contém fotografias de trabalhos concluídos, associadas ao cliente e ao artista. **Flash sheets** contém desenhos com preço e depósito; marque um como reservado quando um cliente o reservar. **Partilhar** prepara uma mensagem para WhatsApp, LINE, X ou e-mail; o menu de partilha do telemóvel pode incluir a fotografia.

## Dinheiro e equipa

A **Calculadora de gorjetas** divide uma gorjeta em 80% artista, 15% aprendiz, 5% receção e regista-a. A equipa regista a entrada e a saída com o botão de turno. As exportações fornecem-lhe o registo de atividade, o stock baixo, os turnos e as durações das sessões em CSV ou PDF. No Calendário, a janela dos turnos mostra se uma pessoa está de turno, e a **Escala de turnos** lista os turnos previstos: escolha uma pessoa, uma data e o horário, e clique em **Adicionar turno**. A exportação da escala e, no Inventário, a exportação do stock guardam um ficheiro CSV ou PDF na sua pasta de Transferências.

## Registos de conformidade

A **checklist de fecho** regista quais os itens realizados, o supervisor, o número do ciclo do autoclave e as suas notas. O **Registo do autoclave** lista os ciclos de esterilização, e o Dashboard avisa sobre stock com a validade expirada. Estes são os seus próprios registos: consulte as regras da sua autoridade de saúde local sobre o que deve conservar.

## Ferramentas Poli

O ecrã **Ferramentas** abre as ferramentas da Poli International (calendários de cuidados pós-procedimento, criador de formulários de consentimento, conversor de calibre, estimador de preços e mais) dentro do CRM.

## Cópias de segurança

Tudo é guardado em `data/studio_crm.sqlite` (ou no caminho definido em `SQLITE_DB_PATH`). Copie esse ficheiro para fazer uma cópia de segurança do estúdio. O botão de snapshot também escreve uma cópia em `storage/backups/`.
