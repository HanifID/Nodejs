module.exports = {
    isLogin(req, res, next){
        if(req.isAuthenticated()){
            next();
            return;
        } else {
            req.session.destroy(function(err) {
                res.redirect('/auth/login');
            })
        }
    },
    isLogout(req, res, next){
        if(!req.isAuthenticated()){
            next();
            return;
        }
        res.redirect('/');
    }
};