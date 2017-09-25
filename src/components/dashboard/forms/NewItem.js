import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-toolbox/lib/button'
// import ProgressBar from 'react-toolbox/lib/progress_bar'
// import theme from './theme.css'
import Dialog from 'react-toolbox/lib/dialog'
import Input from 'react-toolbox/lib/input'
import Base from './../../../models/Base'
import theme from './theme.css'
import { Tab, Tabs } from 'react-toolbox'

export default function NewItemHoc(Decorated) {

    class ItemForm extends Component {
        constructor(props) {
            super(props)

            this.save = this.save.bind(this);

            this.state = {
                active: false,
                item: {},
                tabIndex: 0
            }
        }

        componentWillReceiveProps(nextProps) {
            this.setState({ item: nextProps.newItem })
        }

        componentWillMount() {
            this.setState({ item: this.props.newItem })
        }

        componentWillUnmount() {
            this.props.actions.updateNewItem(this.state.item, this.state.item._meta)
        }

        // handleToggle = () => {
        //     let active = this.state.active
        //     this.setState({ active: !active })

        //     if (active) {
        //         this.props.actions.updateNewItem(this.state.item, this.state.item._meta)
        //     }
        // }

        handleChange = (name, value) => {
            let newItem = Base.updateMeta(this.state.item, { [name]: value })
            this.setState({ item: newItem })
        }

        save() {

            console.log('save this.props', this.props)
            this.props.actions.addItem(this.state.item)
            if(typeof this.props.onSave === 'function'){
                this.props.onSave()
            }

            // if (this.props.handleToggle) {
            //     this.props.handleToggle()
            // }
            this.props.actions.resetNewItem(this.state.item)
        }

        render() {

            let item = this.state.item || {}
            item._meta = item._meta || {}

            return (
                <div>

                    <section>
                        <Input type='text' label='Name' name='name' value={item._meta.fullName} onChange={this.handleChange.bind(this, 'fullName')} maxLength={128} />
                        <Input type='text' label='Image url' name='img' value={item._meta.img} onChange={this.handleChange.bind(this, 'img')} maxLength={1024} />
                        <Input type='text' multiline rows={5} label='Description' name='desctiption' value={item._meta.description} onChange={this.handleChange.bind(this, 'description')} maxLength={1024} />
                        <Decorated {...this.props} save={this.save} handleChange={this.handleChange} />
                        <br />
                        <Button icon='save' label='Save' raised primary onClick={this.save} />
                    </section>
                </div>
            )
        }
    }

    ItemForm.propTypes = {
        actions: PropTypes.object.isRequired,
        account: PropTypes.object.isRequired,
        newItem: PropTypes.object.isRequired,
        title: PropTypes.string,
    }

    return ItemForm
}
