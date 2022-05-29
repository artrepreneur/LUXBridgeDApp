import styled from "styled-components";
import { Button, Anchor, Header, Heading, Text } from "grommet";
import { deepMerge } from "grommet/utils";
import defiBefore from "../img/home-discover-before.svg";

export const themefont = {
  global: {
    font: {
      family: "Tahoma",
    }
  }
};

export const themefontNav = {
  global: {
    font: {
      family: "Poppins",
    }
  }
};

export const customBreakpoints = deepMerge({
  global: {
    breakpoints: {
      smallmob: {
        value: 480
      },
      small: {
        value: 992
      },
      tablet: {
        value: 1170
      },
      medium: {
        value: 1680
      },
      large: {}
    },
    font: {
      family: "Tahoma",
    }
  }
});

export const StyledButton = styled(Button)`
  font-size: 29px;
  line-height: 35px;
  background-color: #FBA300;
  font-weight:300;
  font-family: "Tahoma";
  border:0;
  color:#fff;
  padding-top: 17px;
  padding-bottom: 17px;
  border-radius: 50px;
  `;

export const StyledButton2 = styled(Button)`
  border: none;
  padding: 2vh;
  font-size: 24px;
  line-height: 36px;
  &:hover {
    border:0;
    box-shadow:none;
  }
  &:focus {
    border:0;
    box-shadow:none;
  }
  @media all and (max-width: 1680px) {
    font-size: 20px;
    line-height: 32px;
  }
  `;

export const StyledAnchor = styled(Anchor)`
  font-weight: bold;
  &:hover {
    color: #6c5dd3;
    text-decoration: none;
  }
  `;

export const StyledHeader = styled(Header)`
  background: linear-gradient(102.77deg, #7A48D9 -9.18%, #ffffff 200.09%);
  height: 30%;
  display: flex;
  flex-direction: row;

`;


export const Body = styled.body`
  align-items: left;
  background-color: #282c34;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  min-height: calc(100vh - 70px);
`;

export const BodyCentered = styled.body`
  padding-top: 0px;
  align-items: center;
  background: linear-gradient(70.77deg, #56cde0 -9.18%, #f0ba30 120.09%);
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  min-height: calc(100vh - 70px);
`;


export const BodyCenteredAlt = styled.body`
    padding-top: 0vh;
    padding-bottom: 0vh;
    align-items: center;
    //background: #56cde0;
    background-image: url('https://odapp.io/prple.jpg');
    background-repeat: repeat;
    //background-image: url('https://odapp.io/teal.jpg');
    //background: linear-gradient(70.77deg, #c2f4ad -9.18%, #56e59c 120.09%); 
    //background: linear-gradient(70.77deg, #56cde0 -9.18%, #ffffff 80.09%);
    background-size: cover;
    color: white;
    display: flex;
    flex-direction: column;
    font-size: calc(10px + 2vmin);
    justify-content: center;
    min-height: calc(100vh - 70px);
  `;

export const BodyCenteredAlt2 = styled.body`
    padding-top: 0vh;
    padding-bottom: 0vh;
    align-items: center;
    background: linear-gradient(70.77deg, #7d4cdb -9.18%, #16144e 120.09%);
    color: white;
    display: flex;
    flex-direction: column;
    font-size: calc(10px + 2vmin);
    justify-content: none;
    min-height: calc(100vh - 70px);
  `;

export const Image = styled.img`
  height: 40vmin;
  margin-bottom: 16px;
  pointer-events: none;
`;

export const Image2 = styled.img`
  height: 5vmin;
  margin-bottom: 0px;
  pointer-events: none;
`;

export const ImageLogoMobile = styled.img`
  height: 30px;
  margin-bottom: 0px;
`;

export const ImageMobile = styled.img`
  max-width:90%;
  margin: 0 auto;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #61dafb;
  margin-top: 10px;
`;

export const darkCard = styled.body`
  align-items: center;
  background-color: #282c34;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  min-height: calc(100vh - 70px);
`;

export const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: max-content;
  margin: 0px;
  @media all and (max-width: 1240px) {
    flex-direction: column;
  }
`;

export const DiscoverBefore = styled.div`
  background-color: #222323;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    background-image: url(${defiBefore});
    width: 100%;
    height: 30vw;
    top: -30vw;
    z-index: 1;
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 1px;
  }
  @media all and (max-width: 1680px) {
    &:before {
      height: 25vw;
      top: -25vw;
    }
  }
  @media all and (max-width: 768px) {
    &:before {
      height: 50vw;
      top: -50vw;
    }
  }
`;

export const HeadingDark = styled(Heading)`
  color: #222323;
  max-width: 100%;
  font-weight: bold;
  font-size: 64px;
  line-height: 77px;
  @media all and (max-width: 1680px) {
    font-size: 48px;
    line-height: 58px;
  }
  @media all and (max-width: 1170px) {
    font-size: 44px;
    line-height: 52px;
  }
  @media all and (max-width: 992px) {
    font-size: 38px;
    line-height: 46px;
  }
  @media all and (max-width:480px) {
    font-size: 32px;
    line-height: 40px;
  }
`;  

export const HeadingLight = styled(Heading)`
  color: #fff;
  max-width: 100%;
  font-weight: bold;
  font-size: 64px;
  line-height: 77px;
  @media all and (max-width: 1680px) {
    font-size: 48px;
    line-height: 58px;
  }
  @media all and (max-width: 1170px) {
    font-size: 44px;
    line-height: 52px;
  }
  @media all and (max-width: 992px) {
    font-size: 38px;
    line-height: 46px;
  }
  @media all and (max-width: 480px) {
    font-size: 32px;
    line-height: 40px;
  }
`;  

export const IdentifierTitle = styled(Text)`
font-weight: 900;
font-size: 36px;
line-height: 52px;
color: #707070;
font-family: "Poppins";
@media all and (max-width: 1680px) {
  font-size: 30px;
  line-height: 40px;
}
@media all and (max-width: 768px) {
  font-size: 24px;
  line-height: 36px;
}
`;

export const StyledTextDark = styled(Text)`
font-size: 28px;
line-height: 34px;
color: #707070;
font-family: "Tahoma";
@media all and (max-width: 1680px) {
  font-size: 20px;
  line-height: 30px;
}
@media all and (max-width: 1170px) {
  font-size: 18px;
  line-height: 26px;
}
@media all and (max-width:992px) {
  font-size: 16px;
  line-height: 24px;
}
`;

export const IdentifierSubTitle = styled(Text)`
font-weight: bold;
font-size: 28px;
line-height: 34px;
color: #707070;
font-family: "Tahoma";
text-align: center;
padding-top: 10px;
@media all and (max-width: 1680px) {
  font-size: 20px;
  line-height: 30px;
}
@media all and (max-width: 768px) {
  font-size: 18px;
  line-height: 20px;
}
`;

export const IdentifierText = styled(Text)`
font-size: 28px;
line-height: 34px;
font-family: "Tahoma";
text-align: center;
padding: 10px 0;
@media all and (max-width: 1680px) {
  font-size: 20px;
  line-height: 30px;
}
@media all and (max-width: 992px) {
  font-size: 18px;
  line-height: 20px;
}
@media all and (max-width: 480px) {
  font-size: 16px;
  line-height: 18px;
}
`;

export const ButtonCTA = styled(Button)`
font-size: 29px;
line-height: 40px;
font-weight: 400;
border-radius: 50px;
padding: 20px;
font-family: "Tahoma";
color: #fff;
border: 0;
background: #FBA300;
width:100%;
max-width:475px;
&:focus {
  box-shadow:none;
}
@media all and (max-width: 1680px) {
  font-size: 22px;
  line-height: 24px;
  padding: 12px;
  max-width: 275px;
  width:auto;
}
@media all and (max-width: 1170px) {
  min-width: 25vw;
  width: auto;
  padding: 18px 50px 15px;
}
@media all and (max-width: 992px) {
  font-size: 20px;
  line-height: 22px;
  padding: 12px 10px 14px;
  width: 100%;
  max-width: 265px;
}
@media all and (max-width: 480px) {
  font-size: 18px;
  line-height: 24px;
  padding: 10px 10px 11px;
  margin-left:auto;
  margin-right:auto;
  width: 100%;
  max-width: 265px;
}
  `;

export const ButtonFooter = styled(Button)`
  font-size: 28px;
  line-height: 35px;
  border-radius: 50px;
  font-family: "Tahoma";
  color: #fff;
  border: 0;
  background: #FBA300;
  font-weight: 500;
  padding: 21px 50px;
  width: 30rem;
  text-align: center;
  &:focus {
    box-shadow:none;
  }
  @media all and (max-width: 1680px) {
    font-size: 22px;
    line-height: 24px;
    width: 30vw;
    padding: 18px;
  }
  @media all and (max-width: 1170px) {
    font-size: 22px;
    line-height: 24px;
    width: 28vw;
    padding: 15px;
  }
  @media all and (max-width: 992px) {
    font-size: 16px;
    line-height: 18px;
    width: 30vw;
    padding: 15px 0;
  }
  @media all and (max-width: 480px) {
    font-size: 18px;
    line-height: 25px;
    padding:10px;
    width:100%;
    max-width:265px;
  }
  `;

export const ImageFooter = styled.img`
  @media all and (max-width: 1680px) {
    max-width: 125px;
    margin-top: -5px;
  }
  @media all and (max-width: 992px) {
    max-width: 100px;
  }
  @media all and (max-width: 480px) {
    max-width:115px;
  }
`;

export const ButtonRegular = styled(Button)`
  color: #fff;
  font-size: 29px;
  line-height: 35px;
  font-weight: 400;
  border-radius: 50px;
  border:1px solid #FBA300;
  padding: 20px;
  width: 25vw;
  font-family: 'Tahoma';
  -webkit-transition: all 0.25s ease-in-out;
	-moz-transition: all 0.25s ease-in-out;
    -ms-transition: all 0.25s ease-in-out;
    -o-transition: all 0.25s ease-in-out;
    transition: all 0.25s ease-in-out;
  background: #FBA300;
  text-align:center;
  &:hover {
    box-shadow:none;
    border-color:transparent;
  }
  &:focus {
    box-shadow:none;
    border-color:transparent;
  }
  @media all and (max-width: 1680px) {
    font-size: 22px;
    line-height: 24px;
    padding: 18px;
    width: 20vw;
  }
  @media all and (max-width: 1170px) {
    min-width: 25vw;
    width: auto;
    padding: 18px 50px 15px;
  }
  @media all and (max-width: 992px) {
    font-size: 20px;
    line-height: 22px;
    padding: 12px 10px 14px;
    width: 100%;
    max-width: 265px;
  }
  @media all and (max-width: 480px) {
    font-size: 18px;
    line-height: 25px;
    padding: 10px;
    width: 100%;
    max-width: 265px;
  }
`;

export const ButtonRegularAlt = styled(Button)`
  color: #FBA300;
  font-size: 29px;
  line-height: 40px;
  font-weight: 400;
  border-radius: 50px;
  border:1px solid #FBA300;
  padding: 20px;
  width: 25vw;
  font-family: 'Tahoma';
  -webkit-transition: all 0.25s ease-in-out;
  -moz-transition: all 0.25s ease-in-out;
    -ms-transition: all 0.25s ease-in-out;
    -o-transition: all 0.25s ease-in-out;
    transition: all 0.25s ease-in-out;
  background: #fff;
  text-align:center;
  &:focus {
    box-shadow:none;
  }
  @media all and (max-width: 1680px) {
    font-size: 22px;
    line-height: 24px;
    padding: 18px;
    width: 20vw;
  }
  @media all and (max-width: 1170px) {
    min-width: 25vw;
    width: auto;
    padding: 18px 50px 15px;
  }
  @media all and (max-width: 992px) {
    font-size: 20px;
    line-height: 22px;
    padding: 12px 10px 14px;
    width: 100%;
    max-width: 265px;
  }
  @media all and (max-width: 480px) {
    font-size: 18px;
    line-height: 25px;
    padding: 10px;
    width: 100%;
    max-width: 265px;
  }
`;

export const HeadingDarkSmaller = styled(Heading)`
  color: #222323;
  max-width: 100%;
  font-weight: bold;
  font-size: 54px;
  line-height: 66px;
  @media all and (max-width: 1680px) {
    font-size: 44px;
    line-height: 54px;
  }
  @media all and (max-width: 992px) {
    font-size: 38px;
    line-height: 46px;
  }
  @media all and (max-width: 480px) {
    font-size: 32px;
    line-height: 40px;
  }
`;

export const ScrollableText = styled(Text)`
font-size: 26px;
line-height: 32px;
color: #fff;
font-family: "Tahoma";
display: block;
height: 255px;
overflow: auto;
&::-webkit-scrollbar {
  width: 4px;
  background: #fff;
  border-radius: 90px;
}
&::-webkit-scrollbar-track {
  box-shadow: none;
}
&::-webkit-scrollbar-thumb {
  background-color: #FBA300;
  outline: none;
  border-radius: 90px;
}
@media all and (max-width: 1680px) {
  font-size: 22px;
  line-height: 28px;
}
`;

export const ButtonForm = styled(Button)`
  color: #fff;
  font-size: 29px;
  line-height: 35px;
  font-weight: 400;
  border-radius: 50px;
  border:1px solid #FBA300;
  padding: 20px;
  width: 100%;
  max-width:475px;
  font-family: 'Tahoma';
  -webkit-transition: all 0.25s ease-in-out;
	-moz-transition: all 0.25s ease-in-out;
    -ms-transition: all 0.25s ease-in-out;
    -o-transition: all 0.25s ease-in-out;
    transition: all 0.25s ease-in-out;
  background: #FBA300;
  text-align:center;
  &:hover {
    box-shadow:none;
    border-color:transparent;
  }
  &:focus {
    box-shadow:none;
    border-color:transparent;
  }
  @media all and (max-width: 1680px) {
    font-size: 20px;
    line-height: 22px;
    padding: 18px;
    max-width: 90%;
  }
  @media all and (max-width: 1170px) {
    padding: 15px;
  }
  @media all and (max-width: 992px) {
    
  }
  @media all and (max-width: 480px) {
    font-size: 18px;
    line-height: 20px;
    padding: 10px 10px 12px;
    max-width: 90%;
  }
`;