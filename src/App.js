import React from 'react';
import ArticleHome from './components/ArticleHome';
import Article from './components/Article';
import './App.css';
import {BrowserRouter as Router,  Route} from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
{/*        <div style={{
          height: '100px',
          width: '300px',
          backgroundColor: '#bccbde',
          fontSize: '40px',
          color: 'white',
          float: 'left',
          display: 'inline',
          border: 0
        }} />
  */}
        
        <div style={{
          height: '200px',
          borderBottom: '200px solid #431c5d',
          borderLeft: '700px solid transparent',
          backgroundColor: '#bccbde',
          fontSize: '40px',
          color: 'white',
        }} >
          <div style={{float: 'right', paddingTop: '50px',paddingRight: '80px'}}>article archive</div>
        </div>

        
        <Route exact path="/" component={ArticleHome} />
        <Route path='/article/:id' component={Article} />
      </div>
    </Router>
  );
}

export default App;
