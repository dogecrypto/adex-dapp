import React, { Component } from 'react'
import Icon from '@material-ui/core/Icon'
import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const ImgIcon = ({ src }) => {
  return (
    <img src={src} height={36} width='auto' alt='logo' style={{ marginRight: 5 }} />
  )
}

class ButtonMenu extends Component {
  state = {
    active: false,
    anchorEl: null,
  }

  handleButtonClick = () => this.setState({ active: !this.state.active, anchorEl: null })
  handleMenuHide = () => this.setState({ active: false })

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const { btnStyle, label, iconStyle, icon } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    let leftIcon = this.props.leftIconSrc ? <ImgIcon src={this.props.leftIconSrc} /> : null

    return (
      <div
      // style={{ display: 'inline-block' }}
      >
        <Button
          style={btnStyle}
          onClick={this.handleMenu}
          aria-owns='menu-appbar'// {open ? 'menu-appbar' : null}
          aria-haspopup='true'
        >
          {leftIcon}
          <span
            style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {label}
          </span>
          <Icon style={iconStyle} >{icon}</Icon>
        </Button>
        <Menu
          id="menu-appbar"
          open={open}
          anchorEl={anchorEl}
          // anchorOrigin={{
          //   vertical: 'top',
          //   horizontal: 'right',
          // }}
          // transformOrigin={{
          //   vertical: 'top',
          //   horizontal: 'right',
          // }}
          onClick={this.handleButtonClick }
          onClose={this.handleClose}
        >
            {this.props.children}
        </Menu>
      </div>
    )
  }
}

export default withStyles()(ButtonMenu)
