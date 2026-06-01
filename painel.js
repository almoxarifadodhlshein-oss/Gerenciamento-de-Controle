// 1. Configuração do Supabase (as mesmas que você usou no login.js)
const supabaseUrl = 'https://iwtruakjlitbyfmcvmnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dHJ1YWtqbGl0YnlmbWN2bW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDMyMDQsImV4cCI6MjA3MzM3OTIwNH0.0cGg29cUUWZ--dE-oGTweJir89zZyf0RodTy_4mB3LI';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ... (mantenha as configurações do topo do arquivo e a verificação da sessão)

window.onload = async () => {
  // 1. Verifica a sessão
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  // Exibe o email do usuário logado
  document.getElementById('user-display-name').textContent = session.user.email;

  // 2. CONFIGURA O BOTÃO DE SAIR PRIMEIRO (A Rota de Fuga)
  const btnLogout = document.getElementById('btn-logout');
  btnLogout.addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
      window.location.href = 'index.html';
    } else {
      console.error("Erro ao sair:", error.message);
    }
  });

  // --- INÍCIO LÓGICA DO DASHBOARD ---
  
  // 3. Busca dados da tabela 'estoque'
  const { data: estoqueData, error: estoqueError } = await supabaseClient
    .from('estoque')
    .select('quantidade, valor_unitario');

  // 4. Busca dados da tabela 'saida_epis'
    // Chama a procedure SQL criada no banco
const { data: totalSaidas, error: saidasError } = await supabaseClient
  .rpc('somar_saidas');

if (saidasError) {
  console.warn("Erro ao processar soma no banco:", saidasError.message);
  document.getElementById('metric-saidas').textContent = "Erro";
} else {
  // O banco já devolve o valor exato somado
  document.getElementById('metric-saidas').textContent = totalSaidas;
}

  // 5. Tratamento de Erros e Cálculos
  if (estoqueError) {
    console.warn("Erro ao buscar estoque:", estoqueError.message);
    document.getElementById('metric-valor').textContent = "Erro";
  } else if (estoqueData) {
    const valorTotal = estoqueData.reduce((acc, item) => acc + ((item.quantidade || 0) * (item.valor_unitario || 0)), 0);
    document.getElementById('metric-valor').textContent = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Calcula o estoque crítico (itens com quantidade menor que 20)
    const cardCritico = document.getElementById('metric-critico');
    if (cardCritico) {
      cardCritico.textContent = estoqueData.filter(item => (item.quantidade || 0) < 20).length;
    }

  if (saidasError) {
    console.warn("Erro ao buscar saídas:", saidasError.message);
    document.getElementById('metric-saidas').textContent = "Erro";
  } else if (saidasData) {
    const totalSaidas = saidasData.reduce((acc, item) => acc + (item.quantidade || 0), 0);
    document.getElementById('metric-saidas').textContent = totalSaidas;
  }
};
}