// Import de bibliotecas
import './App.css';
import {BrowserRouter, Routes, Route, Outlet, Link, useNavigate, useParams} from "react-router-dom";
import { useState , useEffect } from 'react';

// Define o endereço do servidor
const endereco_servidor = 'http://localhost:8000';

/**
 * Layout do menu.
 * 
 * @returns 
 */
function Layout(){
  
  // Renderiza o componente
  return (
    <>
      <h1>Menu principal</h1>
      <nav>      
        <ol>
          <li>
            <Link to="/frmcadastrocliente/-1">
              Incluir
            </Link>
          </li>         
          <li>
            <Link to="/listarcliente">
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
  
  // Renderiza o componente
  return (
      <div>
        <h2>404 - Página não encontrada</h2>
      </div>
    );
};

/**
 * Componente formulário que insere ou altera cliente.
 * 
 * @returns 
 */
function FrmCadastroCliente(){

  // Recupera o parâmetro do componente
  const { alterarId } = useParams();

  // Estados inciais das variáveis do componente   
  const [clienteId, setClienteId] = useState(0);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [resultado, setResultado] = useState('');  

  // Renderiza a lista de clientes.
  useEffect(() => {
    
    const getCliente = async () => {
      //Se foi passado um parametro
      if (alterarId > 0) {      
        //Consulta o cliente
        const response = await fetch(`${endereco_servidor}/cliente/${alterarId}`);
        const data = await response.json();
        //Atualiza os dados
        setClienteId(data.clienteId);
        setNome(data.nome);
        setCpf(data.cpf);
      }      
    };

    //Se tem algum cliente para alterar, busca os dados do cliente.    
    getCliente(); 
  }, [alterarId]);

  // Submissão do formulário para inserir.
  const handleSubmitInsert = (event) => {

    // Impede o recarregamento da página
    event.preventDefault();   
    
    //Dados do formulário a serem enviados
    const dados =  { 
          'clienteId': clienteId,
          'nome': nome,
          'cpf': cpf
    }

    //Endereço da API + campos em JSON
    fetch(`${endereco_servidor}/cliente`, {
        method : 'post',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  };

  // Submissão do formulário atualizar.
  const handleSubmitUpdate = (event) => {

    // Impede o recarregamento da página
    event.preventDefault();   
    
    const dados =  { 
          'clienteId': alterarId,
          'nome': nome,
          'cpf': cpf
    };

    //Endereço da API + campos em JSON
    fetch(`${endereco_servidor}/cliente/${alterarId}`, {
        method : 'put',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  };

  // Limpa os campos do formulário.     
  const limpar = () => { 
    setClienteId(0);
    setNome('');
    setCpf('');
  };

  // Renderiza o componente formulário
  return (
    <>      
      <form name="FrmCadastroCliente" method="post" onSubmit={alterarId < 0 ? handleSubmitInsert: handleSubmitUpdate}>
          <label><h2> {(alterarId < 0) ? (<div>1 - Formulário Cadastro Cliente</div>) : (<div>1 - Formulário Alteração Cliente</div>)} </h2></label>
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
      </>
  );
};

/**
 * Componente de exclusão de cliente.
 * 
 * @returns 
 */
function FrmExcluirCliente() {

  // Recupera o parâmetro do componente
  const { clienteId } = useParams();

  // Estados inciais das variáveis do componente
  const [resultado, setResultado] = useState('');
  
  // Renderiza a lista de clientes.
  useEffect(() => {

    // Exclui um cliente
    const excluirCliente = async () => {
      //Endereço da API + campos em JSON
      fetch(`${endereco_servidor}/cliente/${clienteId}`, {method : 'delete'}) 
      .then((response) => response.json()) //Converte a resposta para JSON
      .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
    };

    excluirCliente();
  }, [clienteId]);

  // Renderiza o componente
  return (
    <div>      
       <label>Resultado: {resultado} </label>
    </div>
  );
}

/**
 * Opção 1 do menu.
 * 
 * @returns 
 */
function ListarCliente(){
  
  // Estados inciais das variáveis do componente
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([])
  
  // Renderiza a lista de clientes.
  useEffect(() => {

    // Busca os clientes cadastrados no servidor.
    const getClientes = () => {
      fetch(`${endereco_servidor}/cliente`)
        .then(response => {return response.json()}) //Converte a resposta para JSON
        .then(data => {setClientes(data)}) // Atribui a resposta ao cliente
    };

    getClientes();
  }, []);

  // Renderiza o componente
  return (
    <div>
        <h2>2 - Listar(Editar, Excluir)</h2>        
        <div>
          <table border='1'> 
            <td>Id</td> <td>Nome</td> <td>CPF</td> <td>Editar</td> <td>Excluir</td>          
            {clientes.map(cliente => (
              <tr>
                <td> {cliente.clienteId} </td>
                <td> {cliente.nome}</td>
                <td> {cliente.cpf}</td>
                <td> 
                  <button onClick={() => {navigate(`/frmcadastrocliente/${cliente.clienteId}`)}}>Editar</button>
                </td>                
                <td>                  
                  <button onClick={() => {navigate(`/frmexcluircliente/${cliente.clienteId}`)}}>Excluir</button>
                </td>
              </tr>
            ))}
          </table>
          <br/>          
        </div>
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
            <Route path='frmcadastroCliente/:alterarId' element={<FrmCadastroCliente />} />
            <Route path='frmexcluircliente/:clienteId' element={<FrmExcluirCliente />} />
            <Route path='listarcliente' element={<ListarCliente />} />                
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>        
      </BrowserRouter>    
    );
  }
  
  export default MenuPrincipal;