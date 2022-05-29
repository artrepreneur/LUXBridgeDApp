import React from 'react';
import { Box, Grommet, Header, Nav, Menu, ResponsiveContext } from 'grommet';
import { StyledButton2, Image2, ImageLogoMobile, customBreakpoints } from ".";
import logo from "../img/lux-logo.png";
import "./random.css";
import { Menu as Menu2 } from 'grommet-icons';
import { FormSearch } from 'grommet-icons';
import { useHistory } from "react-router-dom";

function  Collapsible({btn}){


  const items = [
    { label: 'Teleport', href: '/', className: 'menu_link' },
  ];


  const history = useHistory();
  const navigateTo = () => {
    console.log('Moving on to swapping...', history);
    history.push([items.map(item => item.href)])
  }

  return (

    <Grommet theme={customBreakpoints}>
      <ResponsiveContext.Consumer>
      {responsive => (responsive === 'smallmob') ? (
      <Header pad="18px 25px" style={{background: '#222223'}}>
        <Box align="center" gap="small" >
            <Box gridArea='logo' direction="row" size="xxsmall"><ImageLogoMobile src={logo} alt="react-logo"/></Box>
        </Box>
        <Box align="center" gap="small">
          <Menu className="drop_menu"
            icon={<Menu2 color='#fff'/>}
            dropProps={{round: 'none', width: "100vw", color: "#fff", height: "100vh", className: "drop_menu_wrap"}}
            dropAlign={{right: 'right', top: 'top'}}
            size='large' margin='xsmall' items={items} justifyContent='center' />
        </Box>
      </Header>
      ) : (responsive === 'small') ? (
        <Header pad="18px 25px" style={{background: '#222223'}}>
          <Box align="center" gap="small" >
              <Box gridArea='logo' direction="row" size="small"><ImageLogoMobile src={logo} alt="react-logo"/></Box>
          </Box>
          <Box align="center" gap="small">
            <Menu className="drop_menu"
              icon={<Menu2 color='#fff'/>}
              dropProps={{round: 'none', width: "100vw", color: "#fff", height: "100vh", className: "drop_menu_wrap"}}
              dropAlign={{right: 'right', top: 'top'}}
              size='large' margin='xsmall' items={items} justifyContent='center' />
          </Box>
        </Header>
      ) : (responsive === 'tablet') ? (
        <Header pad="18px 25px" style={{background: '#222223'}}>
          <Box align="center" gap="small" >
              <Box gridArea='logo' direction="row" size="xxsmall"><ImageLogoMobile src={logo} alt="react-logo"/></Box>
          </Box>
          <Box align="center" gap="small">
            <Menu className="drop_menu"
              icon={<Menu2 color='#fff' />}
              dropProps={{round: 'none', width: "100vw", color: "#fff", height: "100vh", className: "drop_menu_wrap"}}
              dropAlign={{right: 'right', top: 'top'}}
              size='large' margin='xsmall' items={items} justifyContent='center' />
          </Box>
        </Header>
      ) : (responsive === 'medium') ? (
        <Header pad="25px" style={{background: '#222223'}}>
          <Box align="center" gap="small" >
              <Box gridArea='logo' direction="row" size="xxsmall"><Image2 src={logo} alt="react-logo"/></Box>
          </Box>
          <Box align="center" gap="small">
            <Nav direction="row">{[items.map(item => (
                <StyledButton2 style={{color: '#ffffff', valign: 'middle', fontWeight:"600", textDecoration:"none", fontFamily: "'Poppins', sans-serif" }} href={item.href} label={item.label} key={item.label} />
              ))]}
            </Nav>
          </Box>
          <Box direction="row" size="xxsmall" align="center">
            {btn}<FormSearch color='#fff' size='36px' />
          </Box>
        </Header>
      ) : (
      <Header pad="2rem 8rem 2rem 8rem" style={{background: '#222223' }}>
          <Box align="center" gap="small" >
              <Box gridArea='logo' direction="row" size="xxsmall"><Image2 src={logo} alt="react-logo"/></Box>
          </Box>

          <Box align="center" gap="small">

            <Nav direction="row">
            {[items.map(item => (
              <StyledButton2 style={{color: '#ffffff', valign: 'middle', fontWeight:"600", textDecoration:"none", fontFamily: "'Poppins', sans-serif" }} href={item.href} label={item.label} key={item.label} plain="true" onClick={navigateTo} />
            ))]}
            </Nav>
          </Box>
          <Box direction="row" size="xxsmall" align="center">
            {btn}<FormSearch color='#fff' size='large' />
          </Box>
      </Header>
      )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default Collapsible;
