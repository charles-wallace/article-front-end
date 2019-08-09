import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading} from 'reactstrap';
import { NavLink} from 'react-router-dom';
import {CapitalizeDelimitedText} from '../../util/TextFormat';

class ArticleList extends React.Component {
    render() {
        
        return(
            <div>             
                {this.props.pageData
                    ?   <ListGroup>
                            {this.props.pageData.map( article =>
                                {
                                    const id = article.id;
                                    const title = article.title;
                                    const publication = article.publication.length === 3 
                                        ? article.publication.toUpperCase() 
                                        : CapitalizeDelimitedText(article.publication, "-", " ");
                                    const author = article.author === 'NaN' ? "Unknown Author": article.author;
                                    const date = article.date;
                                     
                                    return(
                                        <ListGroupItem key={id}>
                                        <ListGroupItemHeading>{title}</ListGroupItemHeading>
                                            <span style={{paddingRight: '2px'}}>{publication} {"|"} </span> 
                                            <span style={{paddingRight: '5px'}}>{author} {"|"}</span> 
                                            <span style={{paddingRight: '5px'}}> {date} {"|"}</span>
                                      
                                         
                                                <NavLink
                                                    to={{
                                                        pathname:"/article/" + article.id,
                                                        state: {
                                                            article_id: id,
                                                            title: title,
                                                            publication: publication,
                                                            author: author,
                                                            date: date
                                                        }
                                                    }}
                                                >
                                                    link
                                                </NavLink>
                                           
                                        </ListGroupItem>
                                    );
                                }                                   
                            )}
                        </ListGroup>
                    : <div>No Results Found</div>
                }
            </div>
        );
    }
}

export default ArticleList;
