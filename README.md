# diy-perchance-api

Quick and hacky perchance api using puppeteer.

```
npm i josephrocca/diy-perchance-api
```

```js
const api = await require('josephrocca/diy-perchance-api')()
await api('my-generator-name', '[output]');
await api('my-generator-name', 'the [a=animal.selectOne] is amongst the other [a.pluralForm]]');
```

Note that switching between generators takes a while because puppeteer needs to navigate to the new page, so if you need to regularly call a bunch of different generators you'll probably either want to import all your generators into one, or create multiple apis.

Here's a webserver server template: https://glitch.com/edit/#!/perchance-api-template

Call it like this: https://perchance-api-template.glitch.me/my-generator-name/[output]

