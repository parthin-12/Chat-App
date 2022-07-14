class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        let keyword;
        if (this.queryStr.keyword) {
            keyword = {
                "name":{
                    $regex:this.queryStr.keyword,
                    $options:"i"
                }
            }
        }
        this.query = this.query.find({ ...keyword });
        return this;
    }


    filter() {
        const copyQueryStr = { ...this.queryStr };

        const removeKeywords = ["keyword", "page", "limit","pageSize"];

        removeKeywords.forEach((key) => {
            delete copyQueryStr[key];
        });

        let stringQuerystr = JSON.stringify(copyQueryStr);
        stringQuerystr = stringQuerystr.replace(/\b(lte|gt|lt|gte)\b/g, key => `$${key}`);
        this.query = this.query.find(JSON.parse(stringQuerystr));
        return this;
    }

    pagination(productsPerPage){
        const currentPage=Number(this.queryStr.page) || 1;
        const skip = (currentPage-1) * productsPerPage;

        this.query=this.query.skip(skip).limit(productsPerPage);
        return this;
    }
}

export default ApiFeatures;