# Mentoring - Plataforma de Mentoria Acadêmica

Este repositório contém o código-fonte do projeto **Mentoring**, um protótipo funcional de alta fidelidade de uma plataforma web de mentoria. O projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) para o Bacharelado em Tecnologia da Informação.

## 🔥 Introdução

A plataforma **Mentoring** foi concebida para enfrentar os desafios de evasão e dificuldades de aprendizado enfrentados por alunos ingressantes em cursos de Tecnologia da Informação. O principal objetivo é criar um ecossistema de apoio que conecta alunos novatos (mentorados) a alunos veteranos ou professores (mentores), facilitando a troca de conhecimento, experiências e oferecendo suporte acadêmico e pessoal.

Este protótipo é uma **Single Page Application (SPA)** totalmente funcional no lado do cliente, utilizando o `localStorage` do navegador para simular um banco de dados e demonstrar todas as interações e funcionalidades propostas.

### ✨ Funcionalidades Principais

*   **👤 Gestão de Contas:** Sistema completo de autenticação com cadastro, login e recuperação de senha.
*   **🎭 Perfis de Usuário:** Três níveis de acesso distintos: Mentor, Mentorado (Mentee) e Administrador, cada um com sua própria interface e permissões.
*   **🔍 Descoberta de Mentores:** Uma página dedicada para que os mentorados encontrem mentores, com filtros por recomendação, destaque (melhores avaliados) e busca por nome ou habilidade.
*   **📅 Sistema de Agendamento:**
    *   Mentorados podem solicitar encontros através do perfil do mentor.
    *   Mentores gerenciam as solicitações em um painel, podendo aceitar, recusar ou editar encontros.
    *   Visualização em calendário (para mentorados) e em lista (para mentores).
*   **💬 Ferramentas de Comunicação:**
    *   **Mensagens Diretas:** Um sistema de chat para comunicação privada entre mentor e mentorado.
    *   **Fórum Comunitário:** Um espaço para criar tópicos de discussão, tirar dúvidas e compartilhar conhecimento com toda a comunidade da plataforma.
*   **⭐ Sistema de Avaliação:** Mentorados podem avaliar os encontros finalizados com uma nota (de 1 a 5 estrelas) e um comentário, gerando um feedback valioso.
*   **⚙️ Painel de Administração:** Uma área restrita para administradores com estatísticas de uso da plataforma e ferramentas para gerenciar todos os usuários cadastrados.

## 📦 Tecnologias usadas:

Este projeto foi construído com ferramentas modernas do ecossistema front-end, focando em boas práticas, tipagem forte e uma interface de usuário responsiva.

*   💻 **Front-End:**
    *   **HTML5**
    *   **CSS3** (com Variáveis CSS para um design coeso)
    *   **TypeScript** (para adicionar tipagem estática e segurança ao JavaScript)
    *   **Bootstrap 5** (para a estrutura de layout, componentes de UI e sistema de grid)
    *   **Bootstrap Icons** (para a iconografia da interface)
    *   **FullCalendar.js** (para a criação da visualização de agendamentos em calendário)

*   🔧 **Ferramentas de Desenvolvimento:**
    *   **Vite** (como ferramenta de build e servidor de desenvolvimento local)
    *   **Node.js / NPM** (para gerenciamento de dependências)
    *   **API DiceBear** (para a geração dinâmica de avatares de usuário)

## 🔨 Guia de instalação

Para executar este projeto localmente, você precisará ter o Node.js e o NPM (ou Yarn) instalados em sua máquina.

Siga os passos abaixo para ter um ambiente de desenvolvimento em execução.

**Etapas para instalar:**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd seu-repositorio
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
    *   Após executar o comando acima, o terminal irá indicar o endereço local onde a aplicação está rodando.
    *   Abra seu navegador e acesse `http://localhost:5173` (ou a porta indicada no seu terminal).
