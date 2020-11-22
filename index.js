module.exports = async function(opts={}) { 
  
  const puppeteerOptions = {
    args:[
      "--no-sandbox",
      // Below args are to reduce CPU load, from here: https://stackoverflow.com/questions/49008008/chrome-headless-puppeteer-too-much-cpu
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--single-process",
      "--disable-gpu",
    ],
    dumpio:!!opts.dumpio,
  };
  
  async function createBrowserAndPage() {
    let browser = await require("puppeteer").launch(puppeteerOptions);
    let page = await browser.newPage();
    await page.setDefaultTimeout(10000); 
    page.on("dialog", dialog => {
      dialog.dismiss();
    });
    page.on("error", async msg => {
      await browser.close();
      throw msg;
    });
    return {browser, page};
  }

  let {browser, page} = await createBrowserAndPage();

  let generator = async function(generatorName, inputText) {
    if(!inputText) inputText = "[$output]";
    let generatorUrl = "https://perchance.org/"+generatorName;
    if(page.url() !== generatorUrl) {
      console.log(`currently at ${page.url()} but need to be at ${generatorUrl}. loading....`);
      let response = await page.goto(generatorUrl);  
      if(!response.status().toString().startsWith("2")) return `Error: ${generatorName} doesn't exist? Headers: ${JSON.stringify(response.headers())}`;
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
      }, inputText),
    ]);

    console.log("INPUT:", inputText, "OUTPUT:", result.error ? result.error : result);

    if(result.error === "timeout") {
      console.log("Spinning up new browser due to timeout error (potentially an infinite loop)");
      await browser.close();
      let browserAndPage = await createBrowserAndPage(), browser = browserAndPage.browser, page = browserAndPage.page;
      return `Error: Took too long to compute. generatorName:${generatorName} inputText:${inputText}`;
    } else {
      return result;
    }

  }

  console.log("puppeteer is ready");
  return generator;
}
