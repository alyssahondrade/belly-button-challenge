// Read the `samples.json` from the provided url
const samples_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
d3.json(samples_url).then(function(data) {
    var names = Object.values(data.names);
    var metadata = Object.values(data.metadata);
    var samples = Object.values(data.samples);

    // Get the data for the first individual
    let indiv_sample = samples[0]['sample_values'];
    let indiv_ids = samples[0]['otu_ids'];
    let indiv_labels = samples[0]['otu_labels'];



    // Sort the samples in descending order
    // let descending_samples = samples.sort((first, second) => second.samples - first.samples);
    // console.log(descending_samples);
    // for (let i=0; i<samples.length; i++) {
    //     let row = samples[i];
    //     let sample_values = row['sample_values'];
    //     let otu_ids = row['otu_ids'];

    //     console.log(sample_values, otu_ids);
        
        // Sort the samples in descending order
        // let descending_samples = row.sort(
        //     (first, second) => second.row - first.row);
        // console.log(descending_samples);

    // };
});



// console.log(metadata);
// // Sort the sample_values in descending order
// let descending_samples = data.sort(
//     (first, second) => second.sample_values - first.sample_values
//     );

// console.log(descending_samples);