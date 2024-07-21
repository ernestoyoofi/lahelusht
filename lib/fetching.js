const axios = require("axios")

async function Fetching(url, options) {
  try {
    const fetched = await axios({
      ...options,
      url,
    })
    return fetched
  } catch(err) {
    if(err.response) {
      return {
        error: "BAD_RESPON",
        ...err.response
      }
    }
    return {
      error: "INTERNAL_ERROR",
      message: err.message
    }
  }
}

module.exports = Fetching