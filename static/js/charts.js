function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  //  Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //  Create a variable that holds the samples array. 
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Create a variable that hold the metadata array
    var metadata = data.metadata;
    var metaresultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metaresult = metaresultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // create washing frequency variable
    var wfeq=metaresult.wfreq
    if (wfeq == null) {
      wfeq = 0;
  }
  console.log(wfeq)
    // creat ytick variable
    var yticks = otu_ids.slice(0,10).map(otu_ids => `OTU ${otu_ids}`)


    // Create the trace for the bar chart. 
    var barData = [{
      x : sample_values.slice(0,10).reverse(),
      y : yticks.slice(0,10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
     

    }  
    ];
    // Create the layout for the bar chart. 
    var barLayout = {
     title: {text: "Top 10 Bacteria Cultures Found",
            align: "center"},
     
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    // Create the trace for the bubble chart.
    
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      hovermode: "closest",
      mode: "markers",
      marker: {size: sample_values,
              color: otu_ids,
        colorscale: "Earth"
      }
      }
    ];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
    };

    //Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    // Create the trace for the gauge.
    var gaugeData = [{
      value:wfeq,
     type: "indicator",
     mode: "gauge+number",
     gauge: { axis:{range: [0,10],
                    showticklabels: true,
                    tickmode: "linear",
                    tick0: 2,
                    dtick: 2
                  },
              bar:{color: 'black' },
              steps: [{range: [0,2],
                       color: 'red'},
                      {range: [2,4],
                      color: 'orange'},
                      {range: [4,6],
                      color: 'yellow'},
                      {range: [6,8],
                      color: 'greenyellow'},
                      {range: [8,10],
                      color: 'forestgreen'}]
    }}];
    
    //Create the layout for the gauge.
    var gaugeLayout = { 
      title: {
        text:"<b> Belly Button Washing Frequency </b> <br> Scrubs per Week",
        align: "center"},

     
    };

    //Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
  