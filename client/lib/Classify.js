function Classify(elem) {
  this.elem = elem;
}

Classify.prototype.model = function(config) {
  this.endpoint = `https://${config.REGION}-${config.PROJECT_ID}.cloudfunctions.net/${config.FUNCTION_NAME}`;
}

Classify.prototype.send = function() {
  this.snippet(this.elem.innerHTML);
};

Classify.prototype.snippet = function(text) {
  this.predict(text);
};

Classify.prototype.predict = function(payload) {
  const _this = this;
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function reqListener() {
    _this.handleResponse(xhr.responseText);
  });
  xhr.open('POST', this.endpoint);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({"message": payload}));
};

Classify.prototype.format = function(n) {
  return Math.floor(n*100);
}

Classify.prototype.handleResponse = function(res) {
  const data = JSON.parse(res);

  this.classification = {
    label: data.payload[0].displayName,
    score: data.payload[0].classification.score
  }
  
  if (this.classification.label == 'clickbait') {
    this.render(this.classification);
  }
}

Classify.prototype.render = function(classification) {
  const el = document.createElement('span');
  el.className = 'classifier';
  el.innerHTML = `${this.format(classification.score)}% Clickbait`;
  this.elem.prepend(el);
};


