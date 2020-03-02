import React, { Component } from 'react';
import {FetchCustomer, UpdateCustomer} from '../../Gateways';
import vulnerabilities from '../../vulnerabilities';
import './index.css';

class Vulnerability extends Component {
  click = () => {
    this.props.onClick && this.props.onClick(this.props.category);
  }

  className = () => {
    let extraClass =  this.props.selected ? ' selected' : '';
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
            this.setState({ customer: { vulnerabilities: { categories: [], detail: null }, plan: { actions: [] }, customerId: this.props.match.params.id } });
          }
      });
  }

  selectVuln = (selectedVuln) => {
    this.setState(state => {
      if(state.customer.vulnerabilities.categories.indexOf(selectedVuln) >=0){
        state.customer.vulnerabilities.categories = state.customer.vulnerabilities.categories.filter(el => el !== selectedVuln);
      }else{
        state.customer.vulnerabilities.categories.push(selectedVuln);
      }
      return state;
    })
  }

  captureInput = (e) => {
    const newValue = e.target.value
    this.setState(state => {
      state.customer.vulnerabilities.detail = newValue;
      return state;
    })
  }

  save = () => {
    UpdateCustomer(this.props.match.params.id, this.state.customer);
  }

  render() {
    if (!this.state.customer) return (
      <div className="lbh-container">
        <h1>Fetching customer record...</h1>
      </div>
    );

    return (
      <div className="lbh-container VulnsPage">
        <a className="backLink" href="https://beta.singleview.hackney.gov.uk">&lt;&lt; Back to Single View</a>
        <h2>Spotting vulnerabilities checklist</h2>
        <p>These are different prompts for thinking about how vulnerable someone is. Through conversations with the resident and looking at their record, please select any relevant areas and add a note for more context.</p>
        <ul className="vulnerabilities">{vulnerabilities.map(vuln => <Vulnerability key={vuln.category} {...vuln} onClick={this.selectVuln} selected={this.state.customer.vulnerabilities.categories.indexOf(vuln.category) >= 0} />)}</ul>
        <div className="moreInfo">
          <h2>Can you write more about the customer's current situation?</h2>
          <textarea onChange={this.captureInput} value={this.state.customer.vulnerabilities.detail || ''}></textarea>
          <button className="govuk-button lbh-button" onClick={this.save}>Save</button>
        </div>
      </div>
    );
  }
}
