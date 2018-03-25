const axios = require('axios');

module.exports = (
  bypassAuth,
  host,
  port
) => {
  return async (req, res, next) => {

    if (bypassAuth){
      req.body.createdBy = 'Ambiente de Test';
      req.body.updatedBy = 'Ambiente de Test';
      req.login = {};
      next();
    } else {
      const { authorization, apikey } = req.headers;
  
      const headers = authorization !== undefined ?
        { authorization } : { apikey }
      
      try {
        const { data } = await axios.get(
          `http://${host}:${port}/validate`,
          {
            headers
          }
        );
  
        const login = data.login;
        req.body.createdBy = login.username;
        req.body.updatedBy = login.username;
        req.login = login;
  
        next(); 
      } catch(error) {
        next(error.data)
      }
    }
  }
}