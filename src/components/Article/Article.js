import React from 'react';
import { RequestBuilder } from '../../util/RequestBuilder';
import {CapitalizeDelimitedText, SegmentParagraphText} from '../../util/TextFormat';
import Request from '../../util/Request';
import { Container, Row, Col } from 'reactstrap';


class Article extends React.Component {
    state = {
        articleContent: {}
    }
    async  componentDidMount() {
        const contentRequest = RequestBuilder("article", this.props.location.state.article_id)
        try {
            const response = await Request.get(contentRequest);
            this.setState({
                articleContent: response.data
            })
        } catch(err) {
            alert("Error fetching article data: " + err.message);
           
        }
    }
    render(){
        if(this.state.articleContent.content)
            console.log(SegmentParagraphText(this.state.articleContent.content, 4, 300, 5));
        return (
            <div>
                <div style={{
                    backgroundColor: '#431c5d',
                    color: 'white',
                    paddingLeft: '160px',  
                }}>
                    <div style={{fontSize: '40px'}}>
                        {this.props.location.state.title? this.props.location.state.title :null }
                    </div>
                    <div style={{ fontSize: '25px'}}>
                        {this.props.location.state.author? this.props.location.state.author :null }
                        {" | "}
                        {this.props.location.state.publication
                            ? <span>
                                {
                                    this.props.location.state.publication.length === 3 
                                        ? this.props.location.state.publication.toUpperCase() 
                                        : CapitalizeDelimitedText(this.props.location.state.publication, '-')                                }
                            </span>
                            : null 
                        }
                        {" | "}
                        {this.props.location.state.date? this.props.location.state.date :null }
                    </div>                        
                </div>
                <div style={{marginBottom: '10px',borderRight: '300px solid  #bccbde', borderTop: '100px solid transparent',height: '100px', backgroundColor: '#431c5d'}} />


                <Container>
                    <Row>
                        <Col style={{paddingTop: '25px'}}>   
                            {this.state.articleContent.content
                                ?   <div>
                                        {SegmentParagraphText(this.state.articleContent.content, 4, 300, 5).map( (sentence, index) => {
                                            return(
                                                <div key={this.props.location.state.article_id + index} style={{marginBottom: '10px'}}>
                                                    {sentence}
                                                </div>
                                            );
                                        })}
                                    </div>
                                : null
                            }
                        </Col>
                    </Row>
                </Container>
                
            </div>
        );
    }
}

export default Article;