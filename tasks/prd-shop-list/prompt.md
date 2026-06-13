Faça a implementação da tela de lista de compras do projeto. A referência visual pode ser encontrada em @design-handoff e em @DESIGN.md, siga ambos ao implementar o visual das telas. Ignore o dark mode, vou descartar essa feature por completo. Já há um stub para a tela de criar lista, substituir pela tela real que será desenvolvida agora. As features já são auto-explicativas pela referência, mas repetirei o que possuiremos nessa tela:

- No header:
  - O título da lista (preenchida automaticamente como mostrado no design, porém editável pelo usuário)
  - Uma caixa com um breve resumo de quanto tem no carrinho e qual o limite de valor estabelecido na tela anterior (criação de lista, step 1)
- No body:
  - Uma caixa de texto para pesquisar o nome do produto na lista com um botão para enviar dentro dele. Ao entrar para digitar na caixa de texto, uma box de sugestões irá aparecer (mostrado no design). Ao apertar em qualquer uma das sugestões, o produto é inserido na caixa de texto e procurado na lista.
  - Um estado vazio/preenchido, onde no vazio terá a mensagem + assets estabelecidos no design, com um botão que dê a possibilidade de escanear o cupon fiscal (botão logo abaixo). No estado preenchido, aparece a lista de compras com possibilidade de marcar todos os itens da lista, remover um item da lista, editar um item da lista, o ícone da categoria do item, com o nome do item e a quantidade x preço
  - Na edição de produto:
    - Um formulário que permite editar o nome do produto, colocar o preço unitário, a quantidade, categoria e botões para salvar alterações e excluir o item
  - Abaixo da lista de produtos, um resumo completo da lista, detalhando os itens marcados, subtotal, limite e o quanto disponível. Terá um botão no canto direito para expandir esse resumo. Ao expandir, terá mais detalhes, aparecendo o gasto por categoria e os produtos mais caros. Ainda nos detalhes expandidos, no design, na seção de "Por categoria", aparece várias barras com cada uma preenchendo a porcentagem específica. Vamos trocar isso e fazer essa seção com apenas uma barra e cada categoria preenchendo a sua porcentagem nessa barra. Coloque o nome da categoria + quantidade em real embaixo dessa barra, apenas para melhor visualização. Caso precise de mais insights nessa parte, me pergunte usando sua ferramenta.

Repito, todos esses detalhes já estão no design e você deve seguir ele prioritariamente, isto é apenas um detalhamento em texto.
