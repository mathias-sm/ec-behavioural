var subjectID = jsPsych.randomization.randomID(10);

jsPsych.data.addProperties({'ID': subjectID});

var main_task = [];
var one_trial;

one_trial = {
  type: 'img_choice',
  img_left: 'half_octogone.png',
  img_right: 'square.png'
};
main_task.push(one_trial);

one_trial = {
  type: 'img_choice',
  img_left: 'square.png',
  img_right: 'half_octogone.png',
};
main_task.push(one_trial);


var consent = {
  type:'external-html',
  url: "external-consent.html",
  cont_btn: "start"
};

var instructions = {
  type: "instructions",
  show_clickable_nav: true,
  pages: ["Instruction page 1", "Instruction page 2"],
  data: { questionId: "instructions" }
};

function SaveData(project, data) {
  var xhr = new XMLHttpRequest();

  xhr.open('POST', '<some url that saves POST requests>');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200 && xhr.responseText !== "GOT IT") {
      console.log(xhr.responseText);
    }
    else if (xhr.status !== 200) {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };

  xhr.send(encodeURI('project=' + project+'&filename=' + filename+'&filedata=' + filedata));
}

document.addEventListener("DOMContentLoaded", function(event) {
  jsPsych.init({
    timeline: [].concat(consent, instructions, main_task),
    on_finish: function(data) {
      var display = document.createElement('p');
      display.innerHTML = data.csv();
      document.getElementById("jspsych-content").appendChild(display);
    }
  });
});
