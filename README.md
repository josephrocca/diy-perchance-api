# DIY Perchance API

A quick and hacky Perchance API using [puppeteer](https://github.com/GoogleChrome/puppeteer).

To install:

```
npm i josephrocca/diy-perchance-api
```
Or directly edit your package.json file:
```
"dependencies": {
  ...
  "diy-perchance-api": "git+https://github.com/josephrocca/diy-perchance-api"
},
```


```js
const api = await require('diy-perchance-api')()
await api('my-generator-name', '[output]');
await api('my-generator-name', 'the [a=animal.selectOne] is amongst the other [a.pluralForm]]');
```

Note that switching between generators takes a while because puppeteer needs to navigate to the new page, so if you need to regularly call a bunch of different generators you'll probably either want to import all your generators into one, or create multiple apis.

Here's a webserver server template that you can remix on Glitch: https://glitch.com/edit/#!/perchance-api-template

Call it like this: https://perchance-api-template.glitch.me/my-generator-name/[output] (but replace `perchance-api-template` with the subdomain that Glitch gives you when you "remix" it.

Check here for more details: https://perchance.org/diy-perchance-api
