import styled from "styled-components";

const S = {};

S.MainContainer = styled.div`
  width: 1320px;
  margin:  0 auto;

`

S.InformationWrapper = styled.div`
  margin-bottom: 120px;
  a {
    text-decoration: none;
    display: block;
    width: 280px;
    height: 30px;
    margin-bottom: 20px;
    transform: translateX(-40px);

    span {
      font-size: 30px;
      font-weight: bold;
      
    }
  }
`
S.InformationContentWrapper = styled.div `
  display: flex;
  width: 95%;
  /* justify-content: space-between; */
  gap: 150px;
 
`
S.ExchangeWrapper = styled.div`
  width: 325px;
  height: 370px;
  /* margin-bottom: 100px; */
  h4 {
    font-size: 30px;
    display: block;
    width: 56px;
    height: 36px;
  }
  div {
    width: 300px;
    height: 320px;
    border: 1px solid black;
  }

`

S.WeatherWrapper = styled.div`
 width: 325px;
  height: 370px;
  h4 {
    font-size: 30px;
    display: block;
    width: 56px;
    height: 36px;
  }
  div {
    width: 700px;
    height: 220px;
    border: 1px solid black;
  }


`

S.RecordWrapper = styled.div`
   margin-bottom: 120px;
  a {
    text-decoration: none;
    display: block;
    width: 280px;
    height: 30px;
    margin-bottom: 40px;
    transform: translateX(-80px);

    span {
      font-size: 30px;
      font-weight: bold;
      
    }
  }
`
S.RecordContentWrapper = styled.div`
  width: 100%;
  height: 300px;
  border: 1px solid black;

`

S.ReviewWrapper = styled.div`
   margin-bottom: 120px;
  a {
    text-decoration: none;
    display: block;
    width: 280px;
    height: 30px;
    margin-bottom: 40px;
    transform: translateX(-80px);

    span {
      font-size: 30px;
      font-weight: bold;
      
    }
  }
`

export default S;