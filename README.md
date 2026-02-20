# 🌐 NetScope | Network Intelligence Suite

**NetScope** é uma ferramenta de análise de redes de alta performance projetada para engenheiros de rede e administradores de sistemas. Diferente de calculadoras convencionais, o NetScope oferece uma visão cirúrgica sobre o escopo de sub-redes IPv4 e IPv6, combinando um motor de cálculo VLSM com visualização binária em tempo real.



## 🚀 Funcionalidades

- **Cálculo Preciso IPv4/IPv6:** Resultados instantâneos para endereços de rede, broadcast, máscaras wildcard e ranges utilizáveis.
- **Motor VLSM (Variable Length Subnet Masking):** Divida redes complexas em sub-redes menores com exportação formatada para Excel/Google Sheets.
- **Visualizador Binário Interativo:** Entenda visualmente a separação entre *Network bits* e *Host bits*.
- **Identificador de Contexto:** Identificação automática de tipos de rede (RFC 1918, Global Unicast, Link-Local, Loopback, etc).
- **Histórico Local:** Acesso rápido aos últimos cálculos realizados, armazenados de forma persistente no navegador.

## 🏗️ Arquitetura e Design Patterns

Este projeto foi construído focando em manutenibilidade e escalabilidade, seguindo padrões rigorosos de engenharia de software:

- **Clean Architecture:** Separação clara entre as regras de domínio (`Domain`) e a camada de interface (`UI/Vue`).
- **Domain-Driven Design (DDD):** Lógica de cálculo encapsulada em entidades de domínio ricas e testáveis.
- **Object Calisthenics:** Código escrito seguindo regras de ouro como:
  - Apenas um nível de indentação por método.
  - Não uso da palavra-chave `else` (Early Returns).
  - Encapsulamento de primitivos.
- **DRY (Don't Repeat Yourself):** Reutilização lógica de funções de parsing e conversão de bits.

## 🛠️ Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **PWA:** [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

## 📦 Instalação e Desenvolvimento

1. Clone o repositório:
```bash
git clone https://github.com/luizhanauer/netscope.git
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Build para produção:

```bash
npm run build
```

Contribuição
------------

Contribuições são bem-vindas! Se você encontrar algum problema ou tiver sugestões para melhorar a aplicação, sinta-se à vontade para abrir uma issue ou enviar um pull request.

Se você gostou do meu trabalho e quer me agradecer, você pode me pagar um café :)

<a href="https://www.paypal.com/donate/?hosted_button_id=SFR785YEYHC4E" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 150px !important;" ></a>


Licença
-------

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para obter mais informações.
