# Leão Play — Site estático para GitHub + Cloudflare Pages

Site criado do zero em HTML, CSS e JavaScript, sem framework e sem build obrigatório.

## Estrutura

- `index.html` — página inicial
- `planos.html` — preços e modalidades
- `contato.html` — links de atendimento
- `privacidade.html` — informações sobre dados e cookies
- `styles.css` — estilos responsivos
- `app.js` — menu, WhatsApp, vídeo e Meta Pixel
- `_headers` — cabeçalhos para Cloudflare Pages
- `robots.txt` — configuração básica para buscadores

## Publicar no GitHub + Cloudflare Pages

1. Extraia o ZIP e envie **o conteúdo** da pasta para a raiz de um repositório GitHub. Não envie apenas o arquivo ZIP.
2. No painel da Cloudflare, acesse **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório.
3. Selecione **Framework preset: None**. Não é necessário comando de build. Diretório de saída: `.` (raiz do repositório), se solicitado.
4. Publique e verifique a URL `.pages.dev` gerada. Depois poderá configurar um domínio personalizado.
5. Teste as páginas, os botões WhatsApp e a incorporação do YouTube.
6. Após verificar a base legal adotada e publicar, teste os eventos no **Meta Events Manager → Test Events** e/ou no **Meta Pixel Helper**.

## Imagens do Cloudflare R2

As imagens **não foram baixadas nem embutidas**: o site utiliza diretamente os links R2 enviados pelo responsável, inclusive o logotipo, a sala com a TV e oito imagens do carrossel. Os endereços são públicos e devem continuar acessíveis. Se os arquivos forem movidos ou removidos do R2, deverão ser atualizados no HTML. O ambiente de criação não conseguiu acessar os URLs externos para inspecionar suas imagens; a conferência visual definitiva deve ser feita no site publicado.

## Vídeo

YouTube ID: `wuzB7MB8KTY`.

O vídeo tenta iniciar automaticamente em mudo ao entrar na área visível, com reprodução em loop via parâmetros `autoplay=1`, `mute=1`, `loop=1` e `playlist`. A reprodução automática é **sujeita às políticas do navegador e do YouTube**, principalmente em celulares. Há controles e link alternativo para assistir no YouTube.

## Meta Pixel

Pixel ID: `1419384443735371`. Nesta versão de teste, o Pixel é inicializado ao carregar a página quando **não existe recusa registrada** neste navegador. **Isso não significa consentimento e depende da confirmação prévia da base legal aplicável para publicidade.** Ele envia:
- `PageView` na abertura de páginas quando a medição está habilitada;
- `ViewContent` ao acessar `planos.html` quando a medição está habilitada;
- `Contact` quando o usuário clica em botão de WhatsApp e a medição está habilitada.

**Não envia `Purchase`** porque as compras são confirmadas fora do site.

Uma recusa expressa é persistida em `localStorage` e respeitada nas visitas seguintes. No modo padrão, o script pode ter enviado dados antes da pessoa recusar; uma recusa não apaga dados já transmitidos. **A ANPD recomenda desativar por padrão cookies não necessários quando o fundamento é consentimento; não publicar este modo de rastreamento sem avaliar a base legal com profissional qualificado.**

## Contatos e preços

WhatsApp configurado: `5591991618878`.

IPTV: Mensal R$25, Trimestral R$75, Anual R$200 — valores base, sujeitos à variação da primeira contratação conforme aplicativo. P2P: R$30/mês, para Android compatível; outras modalidades sob consulta. A promoção de bônus trimestral **não** está ativada, pois não foi confirmada definitivamente.

Mensagens, configuração do Pixel e do vídeo ficam no início de `app.js`. Preços estão nas seções correspondentes de `index.html` e `planos.html`.

## Nota sobre marcas

As oito imagens do carrossel foram fornecidas pelo responsável e exibidas como referências de conteúdo, sem afirmação de parceria oficial com as respectivas plataformas. O responsável deve revisar o conteúdo público antes de anunciar.

## Atualização V2 — versão compacta

- Aviso de cookies **removido da interface de todas as páginas**. Preferências acessíveis na página `privacidade.html#preferencias`, por links no rodapé; não há popup automático ou manual.
- Na V2, o Pixel ficava desativado para todos os novos visitantes; a V3 altera o comportamento para carregar, por padrão, **exceto quando existe recusa expressa** registrada. O funcionamento dos botões de WhatsApp continua independente do Pixel.
- Carrossel com ciclo de **26 segundos** (anteriormente 40s), mantendo repetição infinita e pausa por hover/foco; pessoas com preferência por redução de movimento não verão a animação.
- Hero, seções, cartões e preços mais compactos no celular. CTA do vídeo **abaixo do player**; texto técnico retirado. FAQ fechado inicialmente, só uma resposta aberta por vez.
- Use o ZIP para **substituir os arquivos** de mesmo nome no repositório GitHub conectado à Cloudflare Pages. A branch conectada poderá disparar deploy automaticamente.

## Verificações recomendadas após publicar

Abra `https://leaogpt.pages.dev/` no celular, recarregue sem cache, teste os botões, o vídeo e o carrossel. No Meta Events Manager, faça os testes em um navegador sem bloqueador de anúncios e sem recusa salva. O recebimento ainda precisa ser confirmado diretamente pela Meta. O conteúdo jurídico da política deve ser revisado pela empresa.

## Atualização V3 — Pixel na entrada (ainda exige avaliação jurídica)

- Corrigida a inicialização: `PageView` logo após abertura do site sem recusa registrada, `ViewContent` em Planos, `Contact` nos links do WhatsApp.
- Mantida a opção de desativar na página de privacidade e o bloqueio para quem tiver recusado.
- Nenhum `Purchase` é disparado.
- **Aviso:** a alteração não constitui consentimento automático. Para cookies de publicidade, obtenha validação da hipótese legal antes de publicar.
- Navegadores com proteção de rastreamento, extensões de bloqueio ou restrições de terceiros ainda podem impedir eventos; não existe garantia de captar 100% de visitantes.

### Como testar

1. Abra uma janela anônima, sem bloqueador de anúncios, e entre em `https://leaogpt.pages.dev/`.
2. Meta Events Manager > Test Events: aguarde por `PageView`.
3. Visite `planos.html`: espere `PageView` e `ViewContent`.
4. Clique num botão WhatsApp: espere `Contact`; o clique não significa venda concluída.
5. Teste a recusa em Privacidade: não deve haver Pixel em visitas futuras no mesmo navegador.
