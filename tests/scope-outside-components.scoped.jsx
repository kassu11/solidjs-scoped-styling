var App = _$$component(_REGISTRY, "App", function App() {
        const [count, setCount] = createSignal(0);
        return [
                _tmpl$2(),
                _$createComponent(A, {
                        scoped: true,
                        href: "Hello",
                        textContent: "asdas"
                }),
                _tmpl$3(),
                _tmpl$3(),
                _tmpl$3()
        ];
}, { location: "src\\App.scoped.jsx:5:0" });

/* =============== EXPECTED OUTPUT =============== */

var App = _$$component(_REGISTRY, "App", function App() {
        const [count, setCount] = createSignal(0);
        return [
                _tmpl$2(),
                _$createComponent(A, {
                        "data-k-9f86d081": true,
                        href: "Hello",
                        textContent: "asdas"
                }),
                _tmpl$3(),
                _tmpl$3(),
                _tmpl$3()
        ];
}, { location: "src\\App.scoped.jsx:5:0" });
