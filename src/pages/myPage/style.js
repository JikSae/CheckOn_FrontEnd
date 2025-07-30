import styled from "styled-components";

const S = {};

S.MainWrapper = styled.div `
  width: 1320px;
  margin: 0 auto;

`

S.MainTitle = styled.h3`
  font-size: 40px;
  font-weight: bold;
  display: block;
  width: 170px;
  height: 55px;
  margin-bottom: 30px;
`
S.MainContentsWrapper = styled.div`
  display: flex;
  gap: 30px;
  width: 100%;
  margin: 0 auto;

`
S.LeftContentsWrapper = styled.div`
  border: 2px solid #1F2937;
  width: 197px;
  height: 358px;
  border-radius: 10px;
  padding: 20px;
  text-align: start;

  img {
    width: 150px;
    height: 150px;
    border-radius: 20px;
    margin:  0px auto 20px;
    background-color: #777;
  }

  p {
    font-size: 30px;
    font-weight: bold;
    line-height: 2rem;
    margin-bottom: 10px;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  a {
    font-size: 12px;
    font-weight: 300;
    color: #777;
  }

`

S.RightContentsWrapper =styled.div`
  border: 2px solid #1F2937;
  width: 1094px;
  height: 700px;
  border-radius: 10px;
    h4 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 30px;
      display: block;
      text-align: left;
      width: 140px;
    }

`
S.CheckListContentsWrapper = styled.div`
 margin-bottom: 30px;
 padding: 50px;

`
S.CheckLists = styled.div`
  display: flex;
  gap: 30px;
  justify-content: start;
  align-items: center;

`
S.CheckList = styled.div`
  width: 170px;
  height: 100px;
  border: 2px solid #FE0000;
  border-radius: 10px;
  padding: 15px;
  text-align: start;

    p.title {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    p.date {
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 5px;
    }
`
S.CheckBadgeWrapper = styled.div`
  display: flex;
  gap: 7px;

  span {
    width: 20px;
    height: 15px;
    background-color: #FE0000 ;
    border-radius: 10px;
  }
`
S.LowerContentsWrapper = styled.div` 
  width: 1000px;
  height: 320px;
  margin: 0 auto;
  display: flex;
  gap: 30px;

`
// 483 320

S.ReviewWrapper = styled.div`
  width: 483px;
  height: 330px;
  div {
    border: 1px solid black;
    width: 100%;
    height: 266px;
  }
`
export default S 