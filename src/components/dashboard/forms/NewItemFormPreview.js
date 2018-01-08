import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from 'actions'
import { ItemsTypes } from 'constants/itemsTypes'
import NewItemHoc from './NewItemHocStep'
import { Grid, Row, Col } from 'react-flexbox-grid'
import theme from './theme.css'
import moment from 'moment'
import Translate from 'components/translate/Translate'
import Img from 'components/common/img/Img'
import Item from 'models/Item'
import Tooltip from 'react-toolbox/lib/tooltip'
import { GAS_PRICE } from 'services/smart-contracts/constants'
import { web3 } from 'services/smart-contracts/ADX'

import scActions from 'services/smart-contracts/actions'
const { registerItemEstimateGas } = scActions
const TooltipCol = Tooltip(Col)

const SPINNER_ID = 'register_item_estimate_gas'

class NewItemFormPreview extends Component {
    constructor(props) {
        super(props)
        this.save = props.save
    }

    componentWillMount() {
        this.estimateGas()
    }

    estimateGas() {
        this.props.actions.updateSpinner(SPINNER_ID, true)
        registerItemEstimateGas({
            ...this.props.item,
            _addr: this.props.account._addr,
            prKey: this.props.account._temp.privateKey
        })
            .then((res) => {
                console.log('estimateGas', res)
                this.props.handleChange('to', res)
                this.props.actions.updateSpinner(SPINNER_ID, false)
            })
            .catch((err) => {
                console.log('estimateGas', err)
            })
    }

    render() {
        let item = this.props.item || {}
        let meta = item._meta || {}

        let fee

        // TODO: temp use to as gas param
        if (meta.to) {
            fee = web3.utils.fromWei((meta.to * GAS_PRICE).toString(), 'ether')
        }

        return (
            <div>
                <Grid fluid>
                    <Row>
                        <Col xs={12} lg={4} className={theme.textRight}>{this.props.t(this.props.imgLabel || 'img', { isProp: !this.props.imgLabel })}:</Col>
                        <Col xs={12} lg={8} className={theme.textLeft}>{<Img className={theme.imgPreview} src={meta.img.tempUrl || ''} alt={meta.fullName} />} </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={4} className={theme.textRight}>{this.props.t('fullName', { isProp: true })}:</Col>
                        <Col xs={12} lg={8} className={theme.textLeft}>{meta.fullName}</Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={4} className={theme.textRight}>{this.props.t('description', { isProp: true })}:</Col>
                        <Col xs={12} lg={8} className={theme.textLeft}>{meta.description}</Col>
                    </Row>
                    {
                        Object
                            .keys(meta)
                            .filter((key) => !/fullName|description|items|img|createdOn|modifiedOn|deleted|archived|banner/.test(key))
                            .map(key => {
                                let keyName = key
                                let value = item._meta[key]

                                if (!!value && moment(value).isValid()) {
                                    value = moment(value).format('D MMMM YYYY')
                                }

                                return (
                                    <Row key={key}>
                                        <Col xs={12} lg={4} className={theme.textRight}>{this.props.t(keyName, { isProp: true })}:</Col>
                                        <Col xs={12} lg={8} className={theme.textLeft}>{value}</Col>
                                    </Row>
                                )
                            })
                    }
                    {!!fee ?
                        <Row>

                            <TooltipCol xs={12} lg={4} className={theme.textRight}
                                tooltip={this.props.t('OPERATION_FEE_TOOLTIP')}
                            >
                                <strong>  {this.props.t('OPERATION_FEE *', { isProp: true })}:</strong>
                            </TooltipCol>
                            <Col xs={12} lg={8} className={theme.textLeft}>
                                <strong>{fee} ETH</strong>
                            </Col>
                        </Row>
                        : null}
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
    title: PropTypes.string
}

function mapStateToProps(state) {
    let persist = state.persist
    let memory = state.memory
    return {
        account: persist.account,
        // newItem: memory.newItem[ItemsTypes.AdUnit.id]
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
)(Translate(NewItemPreview))
