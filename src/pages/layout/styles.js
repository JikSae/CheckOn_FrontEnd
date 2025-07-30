// styles.js
import styled from "styled-components";

const S = {};
S.HeaderContainer =styled.div `
  width: 1600px;
  margin: 0 auto;
  a {
    text-decoration: none;
  }
`
S.Header = styled.div `
  display: flex;
  li {
    list-style: none;
  }
`
S.Logo = styled.div `
     a {
      color: red;
      font-size: 40px;
      text-decoration: none;
    }
`
S.NavContainer = styled.nav`
  display: flex;
  gap: 40px;
  margin-top: 60px;
  padding-top: 5px;
  position: relative;
  transform: translateX(100px);

  a, span {
    font-size: 20px;
    font-weight: bold;
    color: #4B227C;
    cursor: pointer;
  }

  span {
    margin-right: 8px;
  }
`

// **Review 드롭다운**
S.ReviewMenu = styled.div`
  position: relative;
  span {
    font-size: 22px;
    font-weight: bold;
    cursor: pointer;
    color: #222;
  }
  ul {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 30px;
    left: 0;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    min-width: 150px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    z-index: 10;
    padding: 8px 0;
  }
  &:hover ul {
    display: flex;
  }
  ul li {
    padding: 8px 20px;
    white-space: nowrap;
    transition: background 0.15s;
  }
  ul li:hover {
    background: #f5f5f5;
  }
  ul li a {
    color: #4B227C;
    font-weight: normal;
    text-decoration: none;
  }
`;

S.MypageLink = styled.div `
  margin-top: 60px;
  font-size: 20px;
  margin-left: auto; /* 우측 끝 정렬 */
  a {
    color: #4B227C;
    text-decoration: none;
  }
`

export default S;
