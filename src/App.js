import './App.css';
import {BrowserRouter, Routes, Route, Outlet, Link, useNavigate, useParams} from "react-router-dom";
import { useState , useEffect } from 'react';

/**
 * Layout do menu.
 * 
 * @returns 
 */
function Layout(){
  return (
    <>
      <h1>Menu principal</h1>
      <nav>      
        <ol>
          <li>
            <Link to="/inicio/-1">
              Incluir
            </Link>
          </li>
          <li>
            <Link to="/listar">
              Listar(Alterar, Excluir)
            </Link>
          </li>          
        </ol>  
        <hr />      
      </nav>
      <Outlet />
    </>
  )
};

/**
 * Opção de página não encontrada.
 * 
 * @returns 
 */
function NoPage() {
  return (
      <div>
        <h2>404 - Página não encontrada</h2>
      </div>
    );
};

/**
 * Página inicial.
 * 
 * @returns 
 */
function Inicio(){

  // Recupera o parâmetro
  const { alterarId } = useParams();

  // Estados inciais das variáveis do formulário   
  const [clienteId, setClienteId] = useState(0)  
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');

  const [resultado, setResultado] = useState('');  

  // Renderiza a lista de clientes.
  useEffect(() => {
    
    const getCliente = async () => {
      const resp = await fetch(`http://localhost:8000/cliente/${alterarId}`);
      const data = await resp.json();
      //Atualiza os dados se existir
      if (data.clienteId > 0) {
        setClienteId(data.clienteId);
        setNome(data.nome);
        setCpf(data.cpf);
      }      
    };

    //Se tem algum cliente para alterar, busca os dados do cliente.
    if (alterarId > 0) {
      getCliente(); 
    }

  }, [alterarId])

  //Verifica se é para inserir ou alterar.
  const handleSubmit = (event) => {
      if (alterarId > 0) {
        handleSubmitUpdate(event);
      } else {
        handleSubmitInsert(event);
      }
  }

  // Submissão do formulário para inserir.
  const handleSubmitInsert = (event) => {
    // Impede o recarregamento da página
    event.preventDefault();   
    
    const dados =  { 
          'clienteId': clienteId,
          'nome': nome,
          'cpf': cpf
    }

    //Endereço da API + campos em JSON
    fetch('http://localhost:8000/cliente', {
        method : 'post',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((res) => res.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  }

  // Submissão do formulário atualizar.
  const handleSubmitUpdate = (event) => {
    // Impede o recarregamento da página
    event.preventDefault();   
    
    const dados =  { 
          'clienteId': clienteId,
          'nome': nome,
          'cpf': cpf
    }

    //Endereço da API + campos em JSON
    fetch(`http://localhost:8000/cliente/${clienteId}`, {
        method : 'put',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((res) => res.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  }

  // Limpa os campos do formulário.     
  const limpar = () => { 
    setClienteId(0);
    setNome('');
    setCpf('');
  }

  // Renderiza o formulário
  return (
      <form name="FrmCadastroCliente" method="post" onSubmit={handleSubmit}>          
          {alterarId < 0 ? (<label><h2>1 - Formulário Cadastro Cliente</h2></label>):
            (<label><h2>1 - Formulário Alteração Cliente</h2></label>)}
          <label>ClienteId: 
          <input type="text" size="10" name="clienteId" value={clienteId} onChange={(event) => setClienteId(event.target.value)}/></label><br/>
          <label>Nome: 
          <input type="text" size="60" id="nome" name="nome" value={nome} onChange={(event) => setNome(event.target.value)} /></label><br/>
          <label>CPF: 
          <input type="text" size="15" id="cpf" name="cpf" value={cpf} onChange={(event) => setCpf(event.target.value)} /></label><br/><br/>
          <input type="button" value="Limpar"  onClick={limpar} />
          <input type="submit" name="Cadastrar" value="Cadastrar"/><br/><br/>
          <label>Resultado: {resultado} </label>
      </form>
  );
}

/**
 * Opção 1 do menu.
 * 
 * @returns 
 */
function Listar(){

  // Inicializa as variáveis
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([])
  const [resultado, setResultado] = useState('');

  // Busca os clientes cadastrados no servidor.
  const getClientes = () => {
    fetch("http://localhost:8000/cliente")
      .then(response => {return response.json()})
      .then(data => {setClientes(data)})
  }

  // Renderiza a lista de clientes.
  useEffect(() => {
    getClientes()
  }, [])

  // Exclui um cliente
  const excluirCliente = (clienteId) => {
     //Endereço da API + campos em JSON
     fetch(`http://localhost:8000/cliente/${clienteId}`, {
      method : 'delete'}) 
     .then((res) => res.json()) //Converte a resposta para JSON
     .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado

     window.location.reload(false);
  }
  
  return (
    <div>
        <h2>2 - Listar(Alterar, Excluir)</h2>
        
        {clientes.length > 0 ? (
        <table border='1'> 
          <td>Id</td> <td>Nome</td><td>CPF</td><td>Editar</td><td>Excluir</td>          
          {clientes.map(cliente => (
            <tr>
                <td> {cliente.clienteId} </td>
                <td> {cliente.nome}</td>
                <td> {cliente.cpf}</td>
                <td> 
                    <button onClick={()=> {navigate(`/inicio/${cliente.clienteId}`)}}>Alterar</button>
                </td>                
                <td>
                    <button onClick={() => {excluirCliente(cliente.clienteId)}}>Excluir</button>
                </td>
            </tr>
          ))}
        </table>        
        ):<label>Tabela vazia!</label>}      
        <br/><label>Resultado: {resultado} </label>
     </div>
  );
}

/**
 * Principal componente da aplicação.
 * 
 * @returns 
 */
function MenuPrincipal() {
    return (      
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route path='inicio/:alterarId' element={<Inicio />} />
                <Route path='listar' element={<Listar />} />                
                <Route path='*' element={<NoPage />} />
            </Route>
        </Routes>        
      </BrowserRouter>    
    );
  }
  
  export default MenuPrincipal;