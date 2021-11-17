layui.define([], function (exports) {
    exports("store", store ={
        setToken:function (token){
            localStorage.setItem("token",token);
        },
        getToken:function () {
            return localStorage.getItem("token");
        },
        clear:function () {
            return localStorage.removeItem("token");
        }
    });
});
