var App = function App() {
        return _$createComponent(Foo, {
                style: { "--scoped-color": "red", "--global-color": "blue" }
        });
};

/* =============== EXPECTED OUTPUT =============== */

var App = function App() {
        return _$createComponent(Foo, {
                style: { "--9f86d081-color": "red", "--global-color": "blue" }
        });
};
