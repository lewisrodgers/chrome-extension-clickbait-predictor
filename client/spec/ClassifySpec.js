// Example response classifies heading as clickbait.
const exampleModelResponse = `{
  "payload":[
    {"annotationSpecId":"","displayName":"clickbait","classification":{"score":0.9152950048446655},"detail":"classification"},
    {"annotationSpecId":"","displayName":"no_clickbait","classification":{"score":0.08470500260591507},"detail":"classification"}
  ],
  "metadata":{}
}`;

describe("Classify", function() {
  const headline = "Hello world!";
  let classify;

  beforeEach(function() {
    document.getElementById('fixture').innerHTML = `
      <h2>${headline}</h2>
    `;
    const headings = document.getElementById('fixture').getElementsByTagName('h2');
    const heading = headings[0];

    classify = new Classify(heading);
  })

  afterEach(function() {
    document.getElementById('fixture').innerHTML = '';
  })

  describe("configuration for AutoML model", function() {
    const config = {
      REGION: 'us-east1',
      PROJECT_ID: 'foo',
      FUNCTION_NAME: 'bar'
    };

    beforeEach(function() {
      classify.model(config);
    })

    it("should set a properly formatted cloud function endpoint URL. I.e., https://$REGION-$PROJECT_ID.cloudfunctions.net/$FUNCTION_NAME", function() {
      const url = 'https://us-east1-foo.cloudfunctions.net/bar';
      expect(classify.endpoint).toBe(url)
    })
  })

  describe("predict", function() {
    
    describe("request", function() {
      
      beforeEach(function() {
        spyOn(classify, 'predict');
        classify.send();
      })
  
      it("should call the cloud function endpoint", function() {
        expect(classify.predict).toHaveBeenCalledWith(headline);
      })
    })
  
    describe("response", function() {
      const data = exampleModelResponse;
  
      beforeEach(function() {
        spyOn(classify, 'render');
        classify.handleResponse(data);
      })
  
      it("should process the response and set classification label and score properties", function() {
        expect(classify.classification.label).toBeDefined();
        expect(classify.classification.score).toBeDefined();
      })

      it("should render output", function() {
        expect(classify.render).toHaveBeenCalled();
      })
    })

  })

  describe("render", function() {
    const data = {
      score: 0.9152950048446655
    };

    beforeEach(function() {
      classify.render(data);
      elem = document.getElementById('fixture').children[0];
    })

    it("should convert the decimal number — classification score property from the response — into a whole number", function() {
      expect(classify.format(data.score)).toBe(91)
    })

    it("should add a `span` element within the headline parent element", function() {
      expect(elem.children[0].tagName).toBe('SPAN');
    })
  })
})