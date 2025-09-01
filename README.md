# Mentoring - Plataforma de Mentoria Acadêmica

Este repositório contém o código-fonte do projeto **Mentoring**, um protótipo funcional de alta fidelidade de uma plataforma web de mentoria. O projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) para o Bacharelado em Tecnologia da Informação.

## 🔥 Introdução

A plataforma **Mentoring** foi concebida para enfrentar os desafios de evasão e dificuldades de aprendizado enfrentados por alunos ingressantes em cursos de Tecnologia da Informação. O principal objetivo é criar um ecossistema de apoio que conecta alunos novatos (mentees) a alunos veteranos (mentores), além de envolver professores e administradores, para facilitar a troca de conhecimento, experiências e oferecer suporte acadêmico e pessoal.

## ✨ Funcionalidades Principais

A plataforma possui um sistema de controle de acesso com quatro papéis de usuário distintos, cada um com sua própria interface e permissões:

### 👤 Mentee (Aluno Ingressante)

-   **Dashboard Inicial:** Visão geral com próximo encontro, mentores recentes e sugestões de mentores do mesmo curso.
-   **Busca de Mentores:** Sistema de descoberta com abas para mentores "Recomendados", em "Destaque" (melhores avaliados) e "Buscar Todos" com filtros por nome ou habilidade.
-   **Agendamento de Encontros:** Sistema para solicitar horários de mentoria, com limite de agendamentos semanais.
-   **Calendário Unificado:** Visualização centralizada tanto de seus agendamentos de mentoria quanto das publicações de conteúdo planejadas pelos mentores.
-   **Comunicação:** Acesso a um sistema de mensagens diretas e ao Fórum da Comunidade para criar e responder tópicos.
-   **Sistema de Notificações:** Central que exibe alertas para todas as atividades relevantes (agendamentos, novas mensagens, avaliações, etc.).
-   **Avaliação de Mentorias:** Funcionalidade para avaliar encontros com notas (estrelas) e comentários.

### 🎓 Mentor (Aluno Veterano)

-   **Dashboard de Agendamentos:** Painel com estatísticas (encontros realizados, mentees atendidos) e gestão de encontros.
-   **Gestão de Solicitações:** Funcionalidade para **Aceitar**, **Recusar**, **Editar** ou **Excluir** solicitações de mentoria.
-   **Gestão de Conteúdo:** Área para **criar, editar e excluir** materiais de apoio (com título, descrição e links de recursos).
-   **Calendário Interativo:** Permite agendar a publicação de novos conteúdos em datas futuras, tornando o planejamento visível para os mentees.
-   **Acesso completo ao Fórum e Mensagens.**
-   **Sistema de Notificações** para novas solicitações, mensagens e avaliações recebidas.

### 👨‍🏫 Professor

-   **Painel Administrativo:** Visão geral da comunidade com estatísticas e ferramentas de gestão.
-   **Gerenciamento de Alunos:** Acesso à lista completa de usuários (mentores e mentees) com permissão para **remover** contas.
-   **Gestão de Conteúdo:** Acesso completo à área de **criação, edição e exclusão** de materiais de apoio, atuando como o principal curador do conteúdo pedagógico da plataforma.

### ⚙️ Administrador

-   **Controle Total da Plataforma:** Acesso a todas as funcionalidades administrativas.
-   **Gerenciamento Completo de Usuários:** Permissão para **adicionar** e **remover** qualquer tipo de usuário da plataforma.
-   **Visualização de Estatísticas** completas sobre a comunidade.

## 📦 Tecnologias Utilizadas

Este projeto foi construído com ferramentas modernas do ecossistema front-end, focando em boas práticas, tipagem forte e uma interface de usuário responsiva.

-   **💻 Front-End:**
    -   HTML5
    -   CSS3
    -   TypeScript
    -   Bootstrap 5 (para layout e componentes de UI)
    -   Bootstrap Icons (para a iconografia)
    -   FullCalendar.js (para a criação dos calendários interativos)

-   **🔧 Ferramentas e Serviços:**
    -   Vite (servidor de desenvolvimento e build tool)
    -   Node.js / NPM (gerenciamento de dependências)
    -   DiceBear API (para a geração dinâmica de avatares de usuário)

## 🔨 Guia de Instalação

Para executar este projeto localmente, você precisará ter o Node.js e o NPM instalados em sua máquina.

**Etapas para instalar:**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/angelosilvanno/Mentoring.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd Mentoring
    ```

3.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Acesse a aplicação:**
    -   Após executar o comando acima, o terminal irá indicar o endereço local onde a aplicação está rodando.
    -   Abra seu navegador e acesse `http://localhost:5173` (ou a porta indicada no seu terminal).

## 👷 Autor

*   **Ângelo Silvano** - *Desenvolvedor Front-End* - [@angelosilvanno](https://github.com/angelosilvanno)
