import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './LegalPage.css';

const legalCopy = {
  terms: {
    eyebrow: 'Terms of use',
    title: 'Clear rules for using Qzaar.',
    sections: [
      ['Your workspace', 'Keep your login details confidential and ensure the restaurant information you publish is accurate.'],
      ['Orders and payments', 'Restaurants remain responsible for menu prices, fulfilment, refunds, and customer support for their own orders.'],
      ['Acceptable use', 'Do not use Qzaar to violate laws, interfere with the service, or submit harmful, misleading, or unauthorised content.']
    ]
  },
  privacy: {
    eyebrow: 'Privacy notice',
    title: 'Privacy designed into the service.',
    sections: [
      ['What we use', 'We use account, restaurant, and order information to operate your workspace, process orders, and provide support.'],
      ['How we protect it', 'We restrict access, hash passwords, rate-limit sensitive requests, and use time-limited reset verification codes.'],
      ['Your choices', 'Contact support to request account assistance or information about the data associated with your workspace.']
    ]
  }
};

function LegalPage({ type }) {
  const page = legalCopy[type] || legalCopy.privacy;
  return <><Navbar /><main className="legal-page"><div className="legal-page__wrap"><span className="legal-page__eyebrow"><ShieldCheck size={16} /> {page.eyebrow}</span><h1>{page.title}</h1><p className="legal-page__intro">This short notice explains the essentials of using Qzaar. For account help, email support@qzaar.app.</p><div className="legal-page__sections">{page.sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</div><Link to="/login" className="legal-page__action">Return to secure login</Link></div></main><Footer /></>;
}

export default LegalPage;
