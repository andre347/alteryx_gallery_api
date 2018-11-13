//get the buttons on the page
const getWorkflows = document.getElementById("getSubscriptionWorkflows");
const getAppQuestions = document.getElementById("getAppInterface");
const executeWorkflow = document.getElementById("executeWorkflow");
const getJobsByWorkflow = document.getElementById("getJobsByWorkflow");
const getJobStatus = document.getElementById("getJobStatus");
const getOutputFile = document.getElementById("getOutputFile");

//setup click events
getWorkflows.addEventListener("click", loadGallery);
getAppQuestions.addEventListener("click", showAppQuestions);
executeWorkflow.addEventListener("click", executeWorkflows);
getJobsByWorkflow.addEventListener("click", jobsByWorkflow);
getJobStatus.addEventListener("click", jobStatus);
getOutputFile.addEventListener("click", outputFile);

// define the functions
function createGallery() {
  const apilocation = document.getElementById("apiLocation").value.trim();
  const apisecret = document.getElementById("apiSecret").value.trim();
  const apikey = document.getElementById("apiKey").value.trim();
  const galleryObject = {
    apilocation,
    apisecret,
    apikey
  };

  const gallery = new Gallery(
    galleryObject.apilocation,
    galleryObject.apikey,
    galleryObject.apisecret
  );
  return gallery;
}

function loadGallery() {
  // new Gallery
  let workflowList = document.getElementById("workflowList");

  createGallery()
    .getSubscriptionWorkflows()
    .then(response => response.json())
    .then(data =>
      data.forEach(workflow => {
        let newLi = `<li data-value=${workflow.id}>${
          workflow.metaInfo.name
        } - ${workflow.id}</li>`;
        workflowList.innerHTML += newLi;
      })
    );
}

function showAppQuestions() {
  //grab the app ID
  const id = document.getElementById("workflowId").value.trim();
  const questionForm = document.getElementById("appInterface");

  createGallery()
    .getAppQuestions(id)
    .then(response => response.json())
    .then(data => {
      let table = `<div>`;
      if (data.length === 0) {
        table = `<p>There are no app questions</p>`;
      }
      data.forEach(question => {
        table += `<div><label>${
          question.name
        }</label><input type="text" class="${
          question.type
        }"  value="${question.value || ""}" name="${question.name}">`;
        if (question.items) {
          table += `<div>options: `;
          question.items.forEach((item, i) => {
            table += item.value += i < question.items.length - 1 ? ", " : "";
          });
          table += `</div>`;
        }
        // table += `</td></tr>`;
        table += `</div>`;
      });
      table += `</div>`;
      questionForm.innerHTML = table;
    });
}

function executeWorkflows() {
  //grab the app ID & the questions of the apps
  const id = document.getElementById("workflowId").value.trim();
  const form = document.querySelectorAll("input[type=text]");

  console.log(form);
  const r = "Question";
  Array.from(form, question => {
    console.log(question);
    console.log(question.indexOf(r) > -1);
  });
  const questions = new FormData(form);
  // const questions = JSON.stringify(document.getElementById("appInterface"));

  createGallery()
    .executeWorkflow(id, questions)
    .then(response => response.json())
    .then(data => {
      data.forEach(job => {
        console.log;
      });
      console.log(data);
    });
}

function jobsByWorkflow() {
  const workflowId = document.getElementById("workflowIdForJobs").value.trim();
  createGallery()
    .getJobsByWorkflow(workflowId)
    .then(response => response.json())
    .then(data => console.log(data));
}

function jobStatus() {
  const jobId = document.getElementById("jobId").value.trim();
  createGallery()
    .getJob(jobId)
    .then(response => response.json())
    .then(data => console.log(data));
}

function outputFile() {
  const jobId = document.getElementById("jobId").value.trim();
  const outputId = document.getElementById("outputId").value.trim();
  const format = document.getElementById("format").value.trim();

  createGallery()
    .getOutputFileURL(jobId, outputId, format)
    .then(response => response.json())
    .then(data => console.log(data));
}
