import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from 'actions/itemActions'
import { ItemsTypes } from 'constants/itemsTypes'
import NewItemHoc from './NewItemHocStep'
import { Grid, Row, Col } from 'react-flexbox-grid'
import theme from './theme.css'
import moment from 'moment'

class NewItemFormPreview extends Component {
    constructor(props) {
        super(props)

        this.save = props.save
    }

    render() {
        let item = this.props.item
        return (
            <div>
                <Grid fluid>
                    <Row>
                        <Col xs={12} lg={3} className={theme.textRight}>Name:</Col>
                        <Col xs={12} lg={3} className={theme.textLeft}>{item._meta.fullName}</Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={3} className={theme.textRight}>Description:</Col>
                        <Col xs={12} lg={3} className={theme.textLeft}>{item._meta.description}</Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={3} className={theme.textRight}>Image url:</Col>
                        <Col xs={12} lg={3} className={theme.textLeft}>{item._meta.img}</Col>
                    </Row>
                    {
                        Object
                            .keys(item._meta)
                            .filter((key) => !/fullName|description|items|img|createdOn|modifiedOn|deleted|archived/.test(key))
                            .map(key => {
                                let keyName = key
                                let value = item._meta[key]

                                if (!!value && moment(value).isValid()) {
                                    value = moment(value).format('D MMMM YYYY')
                                }

                                return (
                                    <Row key={key}>
                                        <Col xs={12} lg={3} className={theme.textRight}>{keyName}:</Col>
                                        <Col xs={12} lg={3} className={theme.textLeft}>{value}</Col>
                                    </Row>
                                )
                            })
                    }
                </Grid>
                <br />

                {/* <Button icon='save' label='Save' raised primary onClick={this.props.save} /> */}
            </div>
        )
    }
}

NewItemFormPreview.propTypes = {
    actions: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    newItem: PropTypes.object.isRequired,
    title: PropTypes.string,
    items: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        account: state.account,
        newItem: state.newItem[ItemsTypes.AdUnit.id],
        items: state.items[ItemsTypes.AdUnit.id]
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

const NewItemPreview = NewItemHoc(NewItemFormPreview)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewItemPreview)
