module.exports = {
  swagger: "2.0",
  info: {
    title: "1337x Torrent Search API",
    description: "Unofficial 1337x Torrent Searcher API Written in Javascript",
    version: "1.0.0",
  },
  host: process.env.APP_URL?.split("://")[1] || "localhost:3000",
  basePath: "/",
  license: {
    name: "Apache 2.0",
    url: "https://github.com/iabdulkader/1337x-torrent-search-api/blob/v3/LICENSE",
  },
  tags: [
    {
      name: "Torrent Search",
      description: "search Anything from Torrent",
    },
  ],
  schemes: [process.env.APP_URL?.split("://")[0] || "http"],
  consumes: [],
  produces: [],
  paths: {
    "/search": {
      post: {
        tags: ["Torreng"],
        description: "Search Torrent from query",
        parameters: [
          {
            name: "Body",
            in: "body",
            description: "Post Request Body",
            schema: {
              $ref: '#/definitions/body'
            }
          },
        ],
        responses: {
          200: {
            description: "OK",
          },
          404: {
            description: "Not Found",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      }
    }
  },
  definitions: {
    body: {
      // required: {
      //   query
      // },
      properties: {
        query: {
          type: 'string',
          required: true,
          description: 'Your Search Query',
          example: 'Avengers'
        },
        page: {
          type: 'string',
          description: 'Page Number where to search(Optional). Default is 1.',
          example: '1'
        }
      }
    }
  },
}