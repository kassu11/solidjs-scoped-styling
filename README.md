
# SolidJS Scoped Styling

This is an unofficial **Vite** plugin to add **Vue** like scoped styling to **SolidJS**. This plugin is not installable with a script so you will just need to copy the `solidjs-scoped-styling.js` file to your project. Checkout this projects `vite.config.js` for more information.

This plugin was only made for my own use and I have no interest in updating or keeping this up to date if someting breaks in the future. You can clone this repo and do whatever you want with it.

## Installation

1. Copy `solidjs-scoped-styling.js` file from this repo
2. Use this plugin inside your `vite.config.js` file. Check how this projects config has been setup for more details
3. Create `file-name.scoped.css` file and with the same name jsx file `same-name.scoped.jsx`
  - **NOTE:** The plugin generates the scoping hashes based on the file names so if the two files don't have matching names the hashes will not match
4. You are done

## Examples

This plugin add only one new syntax. You can make `scoped` styling unscoped by using `_` character before the selector. Here are examples:

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
```

After:

```css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

h1[data-k-gMlexUnA] {
  color: red;
}
```

---

Making h1 tag selector unscoped using `_` character.

```css
_h1 {
  color: red;
}
```

After:

```css
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
```

After:

```css
div[data-k-gMlexUnA] {
  color: red;

  &.foo:hover {
    color: yellow;
  }

  .bar[data-k-gMlexUnA] {
    color: blue;
  }

  .foo[data-k-gMlexUnA] .bar[data-k-gMlexUnA] {
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
```

After:

```css
div[data-k-gMlexUnA] {
  &:not([data-k-gMlexUnA]:has([data-k-gMlexUnA]:hover)):nth-child(3)::after {
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
```

After:

```css
div[data-k-gMlexUnA] {
  background-color: red;

  > a[href*="with a space"].foo .bar[data-k-gMlexUnA] {
    color: rebeccapurple;
    font-weight: 900;
  }

  > a[href*="with a space"].foo .bar {
    color: rebeccapurple;
    font-weight: 900;
  }

  > a[href*="with a space"].foo _.bar[data-k-gMlexUnA] {
    color: rebeccapurple;
    font-weight: 900;
  }
}
```
