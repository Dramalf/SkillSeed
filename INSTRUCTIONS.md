## Test Steps:

* All the preliminary setup to enable built-in AI in Chrome
* Replace the trial_tokens in package.json to yours
* Load the extension
* Browse any webpages relating to computer technologies
* If the extension extracts tech skills properly, there will be a green tip at bottom right
* Sometimes due to the `untest output`, the Propmpt API may fail
* Click the extension logo and the skill tree will show in the sidepanel

## Regarding Model Unavailability
  Clearly, the current built-in AI is still in the **experimental phase**, requiring many manual configurations, such as model downloads and browser flag settings.

  I have **not** included these preliminary setup steps in the user operations for the browser extension, including model availability (what's particularly strange is that the Gemini model frequently needs to be downloaded, even if it has been downloaded before). 
  
  These constantly evolving capabilities make user interactions confusing. As a result, I have not added user interaction prompts for when the model is unavailable, as **I do not want to interrupt users' normal web browsing experience.**
