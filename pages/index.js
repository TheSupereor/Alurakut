import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommoms';


function ProfileSidebar(props){
  return(
    <Box as="aside"> 
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }}/>
      <hr />
    
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props){
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>

      <ul>        
        {props.items.map((itemAtual) => {
          console.log(itemAtual.login)
          return (
            <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual.login}.png`}>
                <img src={`https://github.com/${itemAtual.login}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const githubUser = props.githubUser;
  const pessoasFavoritas = [`juunegreiros`, `omariosouto`, `peas`, `rafaballerini`, `marcobrunodev`, `felipefialho`]
  const [ comunidades, setComunidades ] = React.useState([{}]);

  const [seguidores, setSeguidores] = React.useState([]);
  //0 - pegar o array do girhub
  React.useEffect(() => {
    //GET
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then((respostaDoServidor) => {
      //console.log(respostaDoServidor);
      return respostaDoServidor.json();
    })
    .then((respostaConvertida) => {
      //console.log(respostaConvertida);
      setSeguidores(respostaConvertida);
    })

    //API GRAPHQL DO DATOCMS
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization' : 'be3fe2fe1d3059d722738b12d2dc35',
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
      },
      body: JSON.stringify({ "query" : `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug    
        }
      }`})
    })
    .then((response) => response.json())  //pega o valor e já retorna
    .then((respostaConvertida) => {
      const comunidadesDato = respostaConvertida.data.allCommunities;

      setComunidades(comunidadesDato)
    })

  }, []); //rodando apenas 1 vez, por isso o segundo parâmetro vazio

  //1 - box com map, baseado nos itens do array dos followers do github

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        
      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} /> 
      </div>

      <div className="WelcomeArea" style={{ gridArea: 'WelcomeArea' }}>
        <Box> 
          <h1 className="title">
            Bem Vindo(a) {githubUser}
          </h1>

          <OrkutNostalgicIconSet />
        </Box>

        <Box>
          <h2 className="subTitle">O que você quer fazer?</h2>

          <form onSubmit={function handleSend(e){
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

            const comunidade = {
              title: dadosDoForm.get('title'),
              imageUrl: dadosDoForm.get('image'),
              creatorSlug: githubUser
            }

            fetch('/api/comunidades', {   //enviando para o comunidades os dados ao clicar no botão
              method: 'POST',
              header: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(comunidade)
            }).then( async (res) => {
              const dados = res.json();
              //console.log(dados.registroCriado)
              const comunidade = dados.registroCriado;  //recebe a resposta de comuniades
              const comunidadesAtualizadas = [...comunidades, comunidade];  //separa em array
              setComunidades(comunidadesAtualizadas);   //atualiza o valor
            })

            //  comunidades.push(`Alura Stars`);
            //const comunidadesAtualizadas = [...comunidades, comunidade];
            //  usando o spread(...) colocamos o array já existente(comunidades) dentro de outro array(comunidades atualizadas)
            //setComunidades(comunidadesAtualizadas);
          }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua próxima comunidade?" 
                name="title" 
                aria-label="" 
                type="text"/>
            </div>

            <div>
              <input 
                placeholder="Coloque uma url pra usar de capa" 
                name="image" 
                aria-label="" />
            </div> 

            <button>
              Criar Comunidade!
            </button>
          </form>
        </Box>
      </div>

      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
        
        <ProfileRelationsBox title="Seguidores" items={seguidores} />

        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2>

          <ul>
            {comunidades.map((itemAtual) => {
              return (
                <li key={itemAtual.id}>
                  <a href={`/communities/${itemAtual.id}`}>
                    <img src={itemAtual.imageUrl} />
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        
        <ProfileRelationsBoxWrapper> 
          <h2 className="smallTitle">
            Pessoas da Comunidade ({pessoasFavoritas.length})
          </h2>

          <ul>
            {pessoasFavoritas.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`}>
                    <img src={`https://github.com/${itemAtual}.png`} />
                    <span>{itemAtual}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>

      </div>
    </MainGrid>
  </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  //console.log('token', githubUser);

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token,
    }
  })
  .then((resposta) => resposta.json());

  if(!isAuthenticated){
    return {    //forma do next de enviar para um lugar 
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return{
    props: {
      githubUser
    }
  }
}