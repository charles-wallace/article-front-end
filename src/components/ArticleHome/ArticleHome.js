import React from 'react';
import ArticleList from '../ArticleList/ArticleList';
import Select from 'react-select';
import { Container, Row, Col } from 'reactstrap';
import { RequestBuilder } from '../../util/RequestBuilder';
import Request from '../../util/Request';


class ArticleHome extends React.Component {
    constructor(props){
    super(props);
    this.state = {
        publisherSelect: {value: '', label: 'All', category: 'publication_id'}, publication_id: '',
        yearSelect: {value: '', label: 'All', category: 'year'},  year: '', 
        monthSelect: {value: '', label: 'All', category: 'month'},  month: '',
        currentPage: 0,
        criteria: {publication_id: "", year: "", month: ""},
        pageCacheRepo: {},
        pageData: [],
        pageStop: "",
        pageLimitReached: false,
        articleCount: 0
    }
    }

    handleSelect = select => {
        const criteria_year = this.state.criteria["year"];
        if(select.category === 'publication_id'){
            const newCriteria = { publication_id: select.value, year: criteria_year, month: this.state.criteria.month }
            this.setState({publication_id: select.value, publisherSelect: select});
            const selectRequest = this.compileRequest(0, newCriteria);
            this.delegateRequest(0, selectRequest);
        } else if(select.category === 'year') {
            const newCriteria = { publication_id: this.state.criteria.publication_id, year: select.value, month: this.state.criteria.month };
            this.setState({ year: select.value,  yearSelect: select});
            const selectRequest = this.compileRequest(0, newCriteria);
            this.delegateRequest(0, selectRequest);
        } else if(select.category === 'month'){
            const newCriteria = { publication_id: this.state.publication_id, year: this.state.year, month: select.value };
            this.setState({month: select.value, monthSelect: select});
            const selectRequest = this.compileRequest(0, newCriteria);
            this.delegateRequest(0, selectRequest);
        }
    };

    next = (event) => {
        //console.log("fun(next)");
        const criteria = this.state.criteria;
        const nextPage = this.state.currentPage + 1;
        const nextRequest = this.compileRequest(nextPage, criteria);
        //console.log("next-request-object:" +  JSON.stringify(nextRequest));
        this.delegateRequest(nextPage, nextRequest);
    }

    previous = (event) => {
        //console.log("previous");
        const criteria = this.state.criteria;
        const previousPage = this.state.currentPage - 1;
        const previousRequest = this.compileRequest(previousPage, criteria);
        //console.log("previous-request-object: " + JSON.stringify(previousRequest));
        this.delegateRequest(previousPage, previousRequest);
    }

    compileRequest = (pageOption, newCriteria = null) => {
        if(pageOption >=0){
        //console.log("fun(compileRequest)");
        if(newCriteria === null){
            //console.log("Page Option: " + pageOption.toString()  + " State Criteria: " + JSON.stringify(newCriteria));
            this.setState({currentPage: pageOption, criteria: newCriteria});

            const newRequest = RequestBuilder("info", {page: pageOption, ...this.state.criteria});
            //console.log("State Criteria Request: " + newRequest);
            return newRequest;

        }
        else {
            //console.log("Page Option: " + pageOption.toString()  + " Param Criteria: " + JSON.stringify(this.state.criteria));
            this.setState({currentPage: pageOption, criteria: newCriteria});
            const newRequest = RequestBuilder("info", {page: pageOption, ...newCriteria});
            //console.log("Param Criteria Request: " + newRequest);
            return newRequest

        }}
    }

    delegateRequest = (page, request) => {
        //console.log("fun(delegateRequest)");
        if(page >=0){
            if(request in this.state.pageCacheRepo) {
                //console.log("delegating to cache");
                this.pageCache(request, page);
            } else if (this.state.currentPage >= 0) {
                //console.log("delegating to api");
                this.pageApi(page, request);
            }
        } else {
            //console.log("huh?")
        }
    }

    pageCache = (request, page) => {
        //console.log("fun(pageCache)");
        const newArticlePageInfo = this.state.pageCacheRepo[request];
        this.setState({currentPage: page, pageData: newArticlePageInfo});
    }

    pageApi = async (page, request) => {
        try {
            //console.log("fun(pageApi)");
            const response = await Request.get(request);
            //console.log(response.data);
            if(response.data.length > 0){
                const updatedPageCache = this.state.pageCacheRepo;
                updatedPageCache[request] = response.data;
                this.setState({
                    pageData: response.data,
                    pageCacheRepo: updatedPageCache,
                    currentPage: page,
                    articleCount: response.data.length,
                });
            } else {
                this.setState({pageData: null})
            }       
        } catch(err) {
            alert("Error fetching page data: " + err.message);
        }
    }
    
    async componentDidMount() {
        const  initialRequest = this.compileRequest(0, {publication_id: "", year: "", month: ""});
        try { 
            const response = await Request.get(initialRequest);
            //console.log(response.data);
            if(response.data.length > 0){
                const updatedPageCache = this.state.pageCacheRepo;
                updatedPageCache[initialRequest] = response.data;
                this.setState({
                    currentPage: 0,
                    criteria:  {publication_id: "", year: "", month: ""}, 
                    pageCacheRepo: updatedPageCache, 
                    pageData: response.data,
                    pageLimitReached: false,
                    articleCount: response.data.length
                })
            } else {
                this.setState({pageLimitReached: true});
            }
        } catch(err) {
            alert("Failed to fetch article data: " + err.message);
        }
    }

    render(){

        return(
            <div>
                <Container style={{paddingTop: '50px'}}>
                    <Row className="filter-row">
                        <Col style={styles.filter_col}>
                            <p className="filter-title">Publication</p>
                            <Select
                                placeholder="All"			
                                className="filter-option"
                                value={this.state.publisherSelect}
                                onChange={this.handleSelect}
                                options={publisherOptions}
                                isSearchable={false}
                            />
                        </Col>
                        <Col style={styles.filter_col}>
                            <p className="filter-title">Year</p>
                            <Select
                                placeholder="All"			
                                className="filter-option"
                                value={this.state.yearSelect}
                                onChange={this.handleSelect}
                                options={yearOptions}
                                isSearchable={false}
                            />
                        </Col>
                        <Col style={styles.filter_col}>
                            <p className="filter-title">Month</p>
                            <Select
                                placeholder="All"			
                                className="filter-option"
                                value={this.state.monthSelect}
                                onChange={this.handleSelect}
                                options={monthOptions}
                                isSearchable={false}
                            />
                        </Col>
                    </Row>
                    <Row style={styles.btn_row}>
                    <Col><button className="back-button" style={styles.btn_back} onClick={this.previous}></button></Col>
                    <Col><p className="filter-title" style={{textAlign: 'center'}}>{this.state.currentPage*10 + 1} - {this.state.currentPage*10 + 10}</p></Col>
                    <Col><button style={styles.btn_next} onClick={this.next}></button></Col>
                    </Row>
                    <ArticleList pageData={this.state.pageData} />
                </Container>
            </div>
        );
    }

}

const styles = {
    filter_row: {backgroundColor: '#e6e9f0', height: '150px'},
    filter_col: {paddingTop: '25px', paddingBottom: '10px'},
    btn_row: {paddingTop: '15px'},
    btn_back: {float: 'right', outline: 'none', width: 0, height: 0,  backgroundColor: 'transparent', borderTop: '10px solid transparent', borderLeft: '20px solid transparent', borderRight: '20px solid #343d46', borderBottom: '10px solid transparent'},
    btn_next: {float: 'left', outline: 'none', width: 0, height: 0,  backgroundColor: 'transparent', borderTop: '10px solid transparent', borderLeft: '20px solid #343d46', borderRight: '20px solid transparent', borderBottom: '10px solid transparent'}

}

const months = ['All','January','February','March','April','May','June','July','August','September','October','November','December'];
const publishers = ['All', 'atlantic', 'business-insider', 'new-york-times', 'national-review', 'fox-news', 'cnn', 'reuters', 'talking-points-memo', 'vox', 'npr', 'breitbart', 'buzzfeed-news', 'guardian', 'washington-post', 'new-york-post'];
const publisherOptions = publishers.map(
    (key, index) => {
        if(index === 0)
            return({
                value: "",
                label: key,
                category: 'publication_id'
            })
        else
            return({
                value: key, 
                label: key.split('-').map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(" "), 
                category: 'publication_id' 
            })
    });

const yearOptions = [...Array(18).keys()].map(
    (key, index) => {
        if(index === 0)
            return ({value: "", label: 'All', category: 'year'})
        else
            return({value: (2018 - key).toString(), label: (2018 - key).toString(), category: 'year' })
    });

const monthOptions = months.map(
    (key, index) => {
        if(index === 0) {
            return ({value: "", label: "ALL", category: 'month'})
        }
        else if(index < 10){
            return({value: '0' + (index).toString(), label: key, category: 'month' })
        }
        else {
            return({value: index.toString(), label: key, category: 'month'})
        }
    });

export default ArticleHome;