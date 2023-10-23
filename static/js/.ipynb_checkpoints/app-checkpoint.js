// Read the `samples.json` from the provided url
const samples_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//-------- FUNCTION TO GET THE DATA --------//
function get_data(subject_id) {
    d3.json(samples_url).then(function(data) {
        // Import relevant JSON array
        var samples = Object.values(data.samples);

        // Get the first 10 results for each sample_value and reverse the list
        let sample_values = samples.map((sample) => (sample.sample_values).slice(0,10).reverse());
        
        // Get the otu_ids
        let sample_otuids = samples.map(function(sample) {
            
            // Get the corresponding top 10 otu_ids
            let top_ids = sample.otu_ids.slice(0, 10);
    
            // Create a list to hold the transformed list
            let id_list = []
            let add_otu = top_ids.map((id) => id_list.push("OTU" + id));
    
            // Reverse the list to match the sample_values list, for plotting
            return id_list.reverse();
        });

        // Get the sample labels, reversed as above
        let sample_labels = samples.map((sample) => (sample.otu_labels).slice(0, 10));

        console.log(sample_values[subject_id]); // THIS RETURNS UNDEFINED>
        return(sample_values[subject_id]);
    });
};


//-------- FUNCTION TO CREATE INITIAL PLOT --------//
function init() {
    // d3.json(samples_url).then(function(data) {
    //     // Import relevant JSON array
    //     var samples = Object.values(data.samples);

    //     // Get the first 10 results for each sample_value and reverse the list
    //     let sample_values = samples.map((sample) => (sample.sample_values).slice(0,10).reverse());
        
    //     // Get the otu_ids
    //     let sample_otuids = samples.map(function(sample) {
            
    //         // Get the corresponding top 10 otu_ids
    //         let top_ids = sample.otu_ids.slice(0, 10);
    
    //         // Create a list to hold the transformed list
    //         let id_list = []
    //         let add_otu = top_ids.map((id) => id_list.push("OTU" + id));
    
    //         // Reverse the list to match the sample_values list, for plotting
    //         return id_list.reverse();
    //     });

    //     // Get the sample labels, reversed as above
    //     let sample_labels = samples.map((sample) => (sample.otu_labels).slice(0, 10));

    //     var bar_data = [{
    //         x: sample_values[0],
    //         y: sample_otuids[0],
    //         type: "bar",
    //         orientation: "h",
    //         name: sample_labels[0]
    //     }];

    //     // Create the plot
    //     Plotly.plot("bar", bar_data);
    // });
    get_data(940);
};

init();


// // Fetch the JSON data
// d3.json(samples_url).then(function(data) {
//     var names = Object.values(data.names);
//     var metadata = Object.values(data.metadata);
//     var samples = Object.values(data.samples);

//     //-------- CREATE THE HORIZONTAL BAR GRAPH --------//
//     // Get the first 10 results for each sample_value and reverse the list
//     let sample_values = samples.map((sample) => (sample.sample_values).slice(0,10).reverse());

//     // Get the otu_ids
//     let sample_otuids = samples.map(function(sample) {
        
//         // Get the corresponding top 10 otu_ids
//         let top_ids = sample.otu_ids.slice(0, 10);

//         // Create a list to hold the transformed list
//         let id_list = []
//         let add_otu = top_ids.map((id) => id_list.push("OTU" + id));

//         // Reverse the list to match the sample_values list, for plotting
//         return id_list.reverse();
//     });

//     // Get the sample labels, reversed as above
//     let sample_labels = samples.map((sample) => (sample.otu_labels).slice(0, 10));

//     let bar_trace = {
//         x: sample_values[0],
//         y: sample_otuids[0],
//         type: "bar",
//         orientation: "h",
//         name: sample_labels[0]
//     };

//     let bar_data = [bar_trace];

//     let layout = {
//         title: `Subject "${names[0]}" Samples`,
//         xaxis: {
//             title: {text: "Sample Values"}
//         },
//         yaxis: {
//             title: {text: "IDs", standoff: 10},
//             automargin: true,
//             tickcolor: "white",
//             ticklen: 10
//         }
//     };

//     // Create the plot
//     Plotly.plot("bar", bar_data, layout);

//     //-------- CREATE THE BUBBLE CHART --------//
//     let bubble_values = samples.map((sample) => (sample.sample_values))[0];
//     let bubble_ids = samples.map((sample) => (sample.otu_ids))[0];
//     let bubble_labels = samples.map((sample) => (sample.otu_labels))[0];
    
//     let bubble_trace = {
//         x: bubble_ids,
//         y: bubble_values,
//         mode: "markers",
//         marker: {
//             size: bubble_values,
//             color: bubble_ids
//         },
//         text: bubble_labels
//     };

//     let bubble_data = [bubble_trace];

//     Plotly.plot("bubble", bubble_data);

//     //-------- CREATE THE METADATA CHART --------//
//     function subject_metadata(id) {
//         // let metadata_box = d3.select("#sample-metadata").text(id);
//         for (let i=0; i<metadata.length; i++) {
//             subject = metadata[i]
//             if (id == subject.id) {
//                 for (let key in subject) {
//                     // Create a paragraph element for each dictionary row
//                     let pair = d3.select("#sample-metadata").append("p").text(`${key}: ${subject[key]}`);
//                 };
//             };            
//         };
//     };    
//     subject_metadata(940);
    
// });