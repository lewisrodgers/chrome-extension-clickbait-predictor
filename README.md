# Clickbait headline detection POC

The client makes a request to a cloud function endpoint. The cloud function then makes a request to AutoML and returns the classification results back to the client where it's displayed.

## Quick start

1 - Outside of this code, prepare an AutoML model.

2 - Create configuration files (described in the next section).

3 - Deploy the cloud function. This function will call the AutoML model.

```bash
gcloud functions deploy $FUNCTION_NAME --trigger-http
```

4 - Open `client/index.html` in a browser. This webapp will call the cloud function.

## Config files

Both the client and cloud function expect a configuration `js` file. This is where your GCP project information and other details go.

**Client**

```js
// client/config.js
const config = {
  "PROJECT_ID": "...",
  "REGION": "...",
  "FUNCTION_NAME": "classify"
}
```

**Clound function**

```js
// cloud_function/classify/config.js
module.exports = {
  "PROJECT_ID": "...",
  "REGION": "...",
  "MODEL_ID": "..."
}
```

## Client

`client/index.html`

The client is a basic webapp that makes use of XHR. This could be refactored as a Chrome extension with some work.

## Cloud function

`cloud_function/classify`

The `classify` cloud function makes a call to the AutoML model — passing in the data to be classified that was sent by the client.

## Architecture

todo

## Tests

Open `spec/index.html` in the browser to run unit tests.