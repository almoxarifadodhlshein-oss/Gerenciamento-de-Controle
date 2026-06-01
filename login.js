const supabaseUrl = 'https://iwtruakjlitbyfmcvmnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dHJ1YWtqbGl0YnlmbWN2bW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDMyMDQsImV4cCI6MjA3MzM3OTIwNH0.0cGg29cUUWZ--dE-oGTweJir89zZyf0RodTy_4mB3LI';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('login-form');
const errorMsg = document.getElementById('login-error');
const btnSubmit = document.getElementById('btn-submit');

// 2. Verifica se o usuário já fez login antes ao carregar a página
window.onload = async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (session) {
    // Se o token estiver salvo, pula o login
    window.location.href = 'painel.html'; 
  }
};

// 3. Ouve o clique de "ENTRAR"
form.addEventListener('submit', async (event) => {
  // Isso impede que a senha vá parar na URL!
  event.preventDefault(); 
  
  // Feedback visual enquanto a rede processa
  btnSubmit.textContent = 'Aguarde...';
  btnSubmit.disabled = true;
  errorMsg.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // 4. Autenticação segura usando o supabaseClient
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Se errar a senha ou o usuário não existir
    errorMsg.textContent = 'E-mail ou senha incorretos. Verifique suas credenciais.';
    btnSubmit.textContent = 'ENTRAR';
    btnSubmit.disabled = false;
  } else {
    // Sucesso! A sessão é salva com segurança e redireciona para o painel
    window.location.href = 'painel.html';
  }
});