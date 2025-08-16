// ====== Catálogo compartilhado ======
window.CATALOG = [
  // Físicos
  { id:'p1', name:'Sugador Clitoriano X', price:349.9, category:'feminino', type:'fisico',
    img:'./img/produtos/sugador-x.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Tecnologia de ondas de pressão, silencioso e à prova d’água.' },

  { id:'p2', name:'Vibrador Bullet Rose', price:129.9, category:'feminino', type:'fisico',
    img:'./img/produtos/bullet-rose.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Compacto, discreto e potente. Ideal para iniciantes.' },

  { id:'p3', name:'Masturbador Realista Soft', price:289.9, category:'masculino', type:'fisico',
    img:'./img/produtos/masturbador-soft.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Textura interna realista e material macio corporal.' },

  { id:'p4', name:'Anel Peniano Vibratório', price:89.9, category:'masculino', type:'fisico',
    img:'./img/produtos/anel-vibratorio.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Prolonga a ereção com vibração para estímulo do casal.' },

  { id:'p5', name:'Kit Iniciante Casal', price:219.9, category:'casal', type:'fisico',
    img:'./img/produtos/kit-casal.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Combo com itens essenciais para começar a explorar juntos.' },

  { id:'p6', name:'Óleo de Massagem Térmico', price:59.9, category:'acessorios', type:'fisico',
    img:'./img/produtos/oleo-termico.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Aquece suavemente ao contato. Dermatologicamente testado.' },

  // Digitais
  { id:'d1', name:'E-book: 50 Ideias para Apimentar a Relação', price:39.9, category:'ebook', type:'digital',
    img:'./img/produtos/ebook-apimentar.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Guia prático com desafios, jogos e roteiros para 7 noites.',
    file_pdf:'downloads/ebook-apimentar.pdf', file_epub:'downloads/ebook-apimentar.epub' },

  { id:'d2', vip:true, name:'Contos: Noites Proibidas (Vol. 1)', price:24.9, category:'conto', type:'digital',
    img:'./img/produtos/contos-noites.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Cinco histórias sensuais para ler a dois (PDF e ePub).',
    file_pdf:'downloads/contos-noites-proibidas.pdf', file_epub:'downloads/contos-noites-proibidas.epub' },

  { id:'d3', name:'Guia: Fantasias & Jogos a Dois', price:29.9, category:'ebook', type:'digital',
    img:'./img/produtos/guias-fantasias.jpg',
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Manual direto ao ponto para transformar rotina em desejo.',
    file_pdf:'downloads/guias-fantasias.pdf', file_epub:'downloads/guias-fantasias.epub' },

  // Cursos
  { id:'c1', preorder:true, name:'Curso de Pompoarismo — Iniciante', price:199.9, category:'curso', type:'curso',
    img:'./img/cursos/pompoarismo.jpg',
    topic:'pompoarismo', nivel:'Iniciante', duracao:'4h',
    aulas:['Introdução','Anatomia e consciência','Exercícios básicos','Rotinas semanais'],
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Aulas passo a passo com anatomia, exercícios e rotinas.' },

  { id:'c2', name:'Massagem Sensual — Passo a Passo', price:149.9, category:'curso', type:'curso',
    img:'./img/cursos/massagem.jpg',
    topic:'massagem', nivel:'Todos', duracao:'3h',
    aulas:['Ambiente e preparo','Óleos e técnicas','Sequências por região','Rituais a dois'],
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Sequências de toques, ritmos e óleos para cada região.' },

  { id:'c3', name:'Técnicas de Sedução & Intimidade', price:129.9, category:'curso', type:'curso',
    img:'./img/cursos/seducao.jpg',
    topic:'seducao', nivel:'Intermediário', duracao:'2h30',
    aulas:['Comunicação e flerte','Tensão e timing','Conexão emocional','Desafios práticos'],
    shopifyVariantId:'NONE', wooProductId:'NONE',
    description:'Comunicação, flerte, tensão sexual e conexão emocional.' }
];

// ====== Blog posts ======
window.POSTS = [
  { id:"post-dicas-apimentar", title:"10 Dicas para Apimentar a Relação", category:"Dicas", date:"2025-08-10",
    excerpt:"Pequenos gestos que transformam a intimidade: jogos, mensagens e rituais simples.",
    popularity:95,
    content:`
      <h2>1) Pequenas surpresas</h2>
      <p>Bilhetes, mensagens e convites inesperados mudam o clima do dia.</p>
      <h2>2) Rotinas picantes</h2>
      <p>Definam uma noite da semana para experimentos — sem pressão, com curiosidade.</p>
    `
  },
  { id:"post-resenha-sugador", title:"Resenha: Sugador Clitoriano X", category:"Resenhas", date:"2025-08-05",
    excerpt:"Testamos o queridinho do momento: silencioso, potente e à prova d’água.",
    popularity:80,
    content:`<h2>Por que ele é diferente?</h2><p>As ondas de pressão criam uma sensação única...</p>` },
  { id:"post-saude-prazer", title:"Saúde Sexual: Prazer é Bem-estar", category:"Saúde", date:"2025-08-01",
    excerpt:"Como conversar sobre desejo, consentimento e autocuidado no dia a dia.",
    popularity:60,
    content:`<h2>Intimidade é diálogo</h2><p>Falar sobre limites e desejos aumenta a conexão...</p>` },
  { id:"post-fantasias-casal", title:"Fantasias em Casais: Por Onde Começar?", category:"Relacionamentos", date:"2025-07-28",
    excerpt:"Como propor, combinar e explorar fantasias com respeito e diversão.",
    popularity:70,
    content:`<h2>Como propor</h2><p>Use um baralho de ideias ou lista de desejos...</p>` }
];

// ====== Config de checkout ======
window.CHECKOUT = {
  mode: 'custom', // 'shopify' ou 'woocommerce'
  shopify: { shopDomain: 'SUA-LOJA.myshopify.com' },
  woocommerce: { baseUrl: 'https://SUA-LOJA.com' }
};

// ====== Área VIP ======
window.VIP = { price: 29.9, discount: 10, coupon: 'VIP10' };
