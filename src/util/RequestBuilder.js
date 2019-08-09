

const RequestBuilder = (type, args) => {
    if(type === "info")
        return buildArticleInfoRequest(args)
    else if (type === "article")
        return buildArticleRequest(args)
    else
        return ""
}

const buildArticleRequest = (
    article_id
) => {
    return "/article/" + article_id
}

const buildArticleInfoRequest = ({ 
    publication_id = "", 
    year = "", 
    month = "",
    page = ""
}) => {
    if(year !== ""){year = "year=" + year}
    if(month !== ""){month = "month=" + month}
    if(page !== ""){page = "page=" + page}
    if(publication_id !== "")
        return pathBuilder("articles", "publication", publication_id) + queryBuilder(year, month, page);
    else 
        return pathBuilder("articles") + queryBuilder(year, month, page);
}

/*
    queryBuilder: 
    maps list of quereies appending "?" to the beginning of query 
    string, "&" to additional queries, then returns concatenated queries
*/
const queryBuilder = (...query) => {
    var start = true;
    return  query.map((q, index) => {
        
        if(start && (q !== "")){
            start = false;
            return "?" + q;
        } 
        else if(!start && (q !== "")){ return "&" + q;} 
        else { return "";}
    }).join("");
}

/*
    pathBuilder: 
    maps list of path endpoints appending "/" to the beginning of query,
    "&" to additional queries, then returns concatenated queries
*/
const pathBuilder = (...path) => {
    return path.map(p => {
        if(p !== "") return "/" + p
        else return ""
    }).join("");
}


export  {RequestBuilder}
