import React from 'react'
import logoImgSrc from '../../assets/images/logo.png'

const Logo = ({ size, onClick }) => {
  const style = {
    small: {
      height: 30,
      fontSize: '1em'
    },
    medium: {
      height: 60,
      fontSize: '1.5em'
    },
    large: {
      height: 100,
      fontSize: '2em'
    }
  }
  const space = {
    small: -5,
    medium: -10,
    large: -20
  }
  return (
    <h1
      style={{ color: '#0098da', ...style[size] }}
      onClick={onClick}
      className='myLogo'>
      <img height='100%' src={logoImgSrc} />
      <span style={{ marginLeft: space[size] }}>Family</span>
    </h1>
  )
}

export default Logo
