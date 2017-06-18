exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === "production" ?
                        "mongodb://kkindorf:Zooniebin9765@@ds131119.mlab.com:31119/url-shortener" :
                        "mongodb://localhost/url-shortener");

exports.PORT = process.env.PORT || 8080;
