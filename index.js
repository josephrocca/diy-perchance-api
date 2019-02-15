module.exports = async function() { 
  const browser = await require("puppeteer").launch({args:["--no-sandbox"], dumpio:true}).catch(e => process.exit(1));
  let page = await browser.newPage().catch(e => process.exit(1));

  let generator = async function(generatorName, inputText) {
    let generatorUrl = "https://perchance.org/"+generatorName;
    if(page.url() !== generatorUrl) {
      console.log(`currently at ${page.url()} but need to be at ${generatorUrl}. loading...`);
      let response = await page.goto(generatorUrl).catch(e => process.exit(1));  
      if(Number(response.headers().status) !== 200) return `Error: ${generatorName} doesn't exist?`;
    }
    console.log(`loaded "${generatorName}" generator's page, now evaluating text...`);
    let result = await Promise.race([
      new Promise(r => setTimeout(r, 5000, {error:'timeout'})),
      page.evaluate(async (inputText) => {
        return new Promise(async (resolve, reject) => {
          window.addEventListener("message", async (e) => {
            console.log("window recieved message: "+JSON.stringify(e.data));
            if(e.data.type === "evaluateTextResponse" && typeof e.data.text === "string" && e.data.callerId === "85295798546246") {
              resolve(e.data.text);
            }
          });
          console.log("waiting for iframe load...");
          while(!window.perchanceOutputIframeFinishedFirstLoad) await new Promise(r => setTimeout(r, 100));
          console.log(`iframe finished loading. sending evaluateText command for '${inputText}'`);
          document.querySelector("#output iframe").contentWindow.postMessage({text:inputText, callerId:"85295798546246", command:"evaluateText"}, '*');
        });
      }, inputText).catch(e => process.exit(1))
    ]);

    console.log("INPUT:", inputText, "OUTPUT:", result.error ? result.error : result);

    if(result.error === 'timeout') {
      console.log("Spinning up new page due to timeout error (potentially an infinite loop)");
      page = await browser.newPage().catch(e => process.exit(1));
      return `Error: Took too long to compute. generatorName:${generatorName} inputText:${inputText}`;
    } else {
      return result;
    }

  }

  console.log("puppeteer is ready");
  return generator;
}
