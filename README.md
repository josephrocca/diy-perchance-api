# diy-perchance-api

quick and hacky perchance api using puppeteer

```
npm i josephrocca/diy-perchance-api
```

```
const api = await require('josephrocca/diy-perchance-api')()
await api('my-generator-name', '[output]');
await api('my-generator-name', 'the [a=animal.selectOne] is amongst the other [a.pluralForm]]');
```

note that switching between generators takes a while, so if you need to regularly call a bunch of different generators you'll probably either want to import all your generators into one, or create multiple apis

here's a webserver server template: https://glitch.com/edit/#!/perchance-api-template

call it like this: mydomainname.com/my-generator-name/[output]

