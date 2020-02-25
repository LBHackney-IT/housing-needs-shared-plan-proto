import React, { Component } from 'react';
import {FetchCustomer, UpdateCustomer} from '../../Gateways';
import { Redirect } from 'react-router-dom';
import vulnerabilities from '../../vulnerabilities';
import './index.css';

class Vulnerability extends Component {
  click = () => {
    this.props.onClick && this.props.onClick(this.props.category);
  }

  className = () => {
    let extraClass = '';
    if(this.props.selected){
      extraClass = ' selected';
    }else if(this.props.hasVuln){
      extraClass = ' hasVuln';
    }
    return `vulnButton${extraClass}`;
  }

  render(){
    return (
      <li className={this.className()} onClick={this.click}>
        <h3>{this.props.category}</h3>
        <p>{this.props.eg}</p>
      </li>
    )
  }
}

export default class VulnsPage extends Component {
  state = {
    customer: null,
    selectedVuln: null,
  }

  componentDidMount() {
    FetchCustomer(this.props.match.params.id)
      .then(customer => {
        this.setState({ customer });
      })
      .catch(err => {
          if(err.message === 'NotFoundError'){
            this.setState({ customer: { vulnerabilities: {}, plan: { actions: [] }, customerId: this.props.match.params.id } });
          }
      });
  }

  selectVuln = (selectedVuln) => {
    this.setState({selectedVuln})
  }

  captureInput = (e) => {
    const newValue = e.target.value
    this.setState(state => {
      state.customer.vulnerabilities[this.state.selectedVuln] = newValue;
      return state;
    })
  }

  save = () => {
    UpdateCustomer(this.props.match.params.id, this.state.customer)
      .then(success => {
        if(success){
          this.setState({ redirect: `/customers/${this.props.match.params.id}/plan` });
        }
      })
  }

  render() {
    if (this.state.redirect) return <Redirect push to={this.state.redirect} />;

    if (!this.state.customer) return (
      <div className="lbh-container">
        <h1>Fetching customer record...</h1>
      </div>
    );

    return (
      <div className="lbh-container VulnsPage">
        <h2>What's the customer's current situation?</h2>
        <p>Based on conversations and what you know of the customer select the relevant vulnerabilities</p>
        <ul className="vulnerabilities">{vulnerabilities.map(vuln => <Vulnerability key={vuln.category} {...vuln} onClick={this.selectVuln} hasVuln={!!this.state.customer.vulnerabilities[vuln.category]} selected={vuln.category === this.state.selectedVuln} />)}</ul>
        {this.state.selectedVuln ? 
          <div className="moreInfo">
            <h2>Can you write more about the customer's current situation?</h2>
            <textarea onChange={this.captureInput} value={this.state.customer.vulnerabilities[this.state.selectedVuln] || ''}></textarea>
            <button className="govuk-button lbh-button" onClick={this.save}>Save and continue</button>
          </div>
        : null }
      </div>
    );
  }
}
