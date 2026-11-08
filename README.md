
# SolidJS Scoped Styling

This is an unofficial **Vite** plugin to add **Vue** like scoped styling to **SolidJS**. This plugin is not installable with a script so you will just need to copy the `solidjs-scoped-styling.js` file to your project. Checkout this projects `vite.config.js` for more information.

This plugin was only made for my own use and I have no interest in updating or keeping this up to date if someting breaks in the future. You can clone this repo and do whatever you want with it.

## Installation

1. Copy `solidjs-scoped-styling.js` file from this repo
2. Use this plugin inside your `vite.config.js` file. Check how this projects config has been setup for more details
3. Create `file-name.scoped.css` file and with the same name jsx file `same-name.scoped.jsx`  
  3.1. **NOTE:** The plugin generates the scoping hashes based on the file names so if the two files don't have matching names the hashes will not match
4. You are done

## Examples

This plugin adds only three tiny changes and tries to keep the syntax changes as minimal as possible.
1. Insde your `scoped.css` files, you can make `scoped` styling unscoped by using `_` character before the selector. Below are examples of how `scoped.css` files will be handled
2. You can add scoping to components outside your file, using `scoped` attribute, inside `jsx`
  - **NOTE 1:** If the component does not support passing attribute props, this does not work
  - **NOTE 2:** You should almost never need to use this, the only case I have needed to use this is when using solid router `A` component
3. CSS variables starting with `--scoped` get the `scoped` part replaced with the file hash, in both `.scoped.css` and `.scoped.jsx` files, so `--scoped-color` becomes `--9f86d081-color`

---

Basic tag scoping

```css
/* root is never scoped */
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

h1 {
  color: red;
}

/* =============== EXPECTED OUTPUT =============== */

/* root is never scoped */
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

h1[data-k-e68880c1] {
  color: red;
}
```

---

Example of scoping outside components

```jsx
function App() {
  // Scope a solid-router link component, otherwise you will always need to type _a inside your scoped styling
  return (
    <A scoped href="url">Click me</A>
  );
}

```

---

Example of scoping CSS variables

```css
:root {
  --scoped-color: red;
  --global-color: blue;
}

h1 {
  color: var(--scoped-color, var(--global-color));
}

/* =============== EXPECTED OUTPUT =============== */

:root {
  --9f86d081-color: red;
  --global-color: blue;
}

h1[data-k-9f86d081] {
  color: var(--9f86d081-color, var(--global-color));
}
```

---

Making h1 tag selector unscoped using `_` character.

```css
_h1 {
  color: red;
}

/* =============== EXPECTED OUTPUT =============== */

h1 {
  color: red;
}
```

---

Here are more complex nesting examples

```css
div {
  color: red;

  &.foo:hover {
    color: yellow;
  }

  .bar {
    color: blue;
  }
  .foo .bar {
    color: orange;
  }
}

/* =============== EXPECTED OUTPUT =============== */

div[data-k-06c55601] {
  color: red;

  &.foo:hover {
    color: yellow;
  }

  .bar[data-k-06c55601] {
    color: blue;
  }
  .foo[data-k-06c55601] .bar[data-k-06c55601] {
    color: orange;
  }
}
```

---

Pseudo selectors

```css
div {
  &:not(:has(:hover)):nth-child(3)::after {
    content: "Complex selector";
    font-size: 2rem;
  }

  &:not(_:has(_:hover)):nth-child(3)::after {
    content: "Complex selector";
    font-size: 2rem;
  }

  &:not(&:has(&:hover)):nth-child(3)::after {
    content: "Complex selector";
    font-size: 2rem;
  }
}

/* =============== EXPECTED OUTPUT =============== */

div[data-k-fe8c0a0f] {
  &:not([data-k-fe8c0a0f]:has([data-k-fe8c0a0f]:hover)):nth-child(3)::after {
    content: "Complex selector";
    font-size: 2rem;
  }

  &:not(:has(:hover)):nth-child(3)::after {
    content: "Complex selector";
    font-size: 2rem;
  }

  &:not(&:has(&:hover)):nth-child(3)::after {
    content: "Complex selector";
    font-size: 2rem;
  }
}
```

---

Unscoped styling

```css
div {
  background-color: red;

  > a[href*="with a space"].foo .bar {
    color: rebeccapurple;
    font-weight: 900;
  }

  > _a[href*="with a space"].foo .bar {
    color: rebeccapurple;
    font-weight: 900;
  }

  > a[href*="with a space"].foo _.bar {
    color: rebeccapurple;
    font-weight: 900;
  }
}

/* =============== EXPECTED OUTPUT =============== */

div[data-k-9c8e3c2d] {
  background-color: red;

  > a[href*="with a space"].foo[data-k-9c8e3c2d] .bar[data-k-9c8e3c2d] {
    color: rebeccapurple;
    font-weight: 900;
  }

  > a[href*="with a space"].foo .bar[data-k-9c8e3c2d] {
    color: rebeccapurple;
    font-weight: 900;
  }

  > a[href*="with a space"].foo[data-k-9c8e3c2d] .bar {
    color: rebeccapurple;
    font-weight: 900;
  }
}
```

---

Placing commend blocks in weird places should not break anything.

```css
/* You can use comments */
h1 {
  color: red;
}

h1/*This also works*/{
  color: blue;
}
h1 /*This also works*/ {
  color: orange;
}

_div/*This also works*/ h1{
  color: rebeccapurple;
}
.foo/*This also works*/.bar{
  color: aqua;
}
_.foo/*This also works*/.bar{
  color: yellow;
}

/* =============== EXPECTED OUTPUT =============== */

/* You can use comments */
h1[data-k-ffd0ab61] {
  color: red;
}

h1/*This also works*/[data-k-ffd0ab61]{
  color: blue;
}
h1[data-k-ffd0ab61] /*This also works*/ {
  color: orange;
}

div/*This also works*/ h1[data-k-ffd0ab61]{
  color: rebeccapurple;
}
.foo/*This also works*/.bar[data-k-ffd0ab61]{
  color: aqua;
}
.foo/*This also works*/.bar{
  color: yellow;
}
```
