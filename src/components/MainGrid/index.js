import styled from 'styled-components';

const MainGrid = styled.main`
  display: block;
  width: 100%;
  max-width: 500px;
  grid-gap: 10px;
  margin: 0 auto;
  padding: 16px;

  .profileArea{
    display:none;
    @media(min-width: 860px){
      display: block;
    }
  }

  @media(min-width: 860px) {
    max-width: 1110px;
    display: grid;
    grid-template-areas: "profileArea WelcomeArea profileRelationsArea";
    grid-template-columns: 160px 1fr 312px;
  
  }
`;

export default MainGrid;