/**
 * img_choice
 * a jspsych plugin for an image comparison task
 **/


jsPsych.plugins['img_choice'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'img_choice',
    description: '',
    parameters: {
      img_left: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'URL_img_left',
        default: "",
        description: 'A way to display the image on the left'
      },
      img_right: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'URL_img_right',
        default: "",
        description: 'A way to display the image on the right'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name:'question_prompt',
        default: "If you had to describe the images above to someone so that he could draw them, how simililar would your description be for the two shapes?",
        description: 'The text to display participants about the task',
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name:"Button's label",
        default: "Answer >",
        description: 'Labels of the button to end the trial.',
      },
    }
  };

  plugin.trial = function(display_element, trial) {

    var img_container = document.createElement('div');
    var img_left = document.createElement('img');
    var img_right = document.createElement('img');

    img_left.src = trial.img_left;
    img_right.src = trial.img_right;

    img_container.appendChild(img_left);
    img_container.appendChild(img_right);

    // prepare the prompt, i.e. the question
    var prompt = document.createElement('p');
    prompt.innerHTML = trial.prompt;

    // prepare the response slider
    var htmlSlider = document.createElement("text");
    htmlSlider.id = "answer";
    htmlSlider.style.width = "300px";
    htmlSlider.dataset.provide = "slider";
    htmlSlider.dataset.sliderValue = "50";
    htmlSlider.dataset.sliderMin = "0";
    htmlSlider.dataset.sliderMax = "100";
    htmlSlider.dataset.sliderStep = "1";
    htmlSlider.dataset.sliderTooltip = "hide";
    htmlSlider.dataset.sliderTicks="[0,100]";
    htmlSlider.dataset.sliderTicksLabels='["Absolutely different", "Word for word identical"]';
    htmlSlider.dataset.sliderTicksSnapBounds='0';

    // prepare the wrapper div for the slider
    var div = document.createElement('div');
    div.id = "wrapper";
    // append the slide to the div to separate it from the rest
    div.appendChild(htmlSlider);
    htmlSlider.style.backgroundImage = null;
    htmlSlider.style.background = null;

    // prepare the response button
    var button = document.createElement("button");
    button.id = "response-next";
    button.classList.add("jspsych-btn");
    button.innerHTML = trial.button_label;

    // append all relevant elements in the right order to the main document
    display_element.appendChild(img_container);
    display_element.appendChild(prompt);
    display_element.appendChild(div);
    display_element.appendChild(button);

    // only now that the slider exists in the DOM, grab it with the relevant
    // JavaScript function
    var slider = new Slider("#answer", {});

    var response = {
      rt: null,
      response: null
    };

    display_element.querySelector('#response-next').addEventListener('click', function() {
      // measure response time
      var endTime = (new Date()).getTime();
      response.rt = endTime - startTime;
      response.response = slider.getValue();

      end_trial();
    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // Log the ENTIRE trial : responses, but also conditions.
      var trialdata = {
        response: response.response,
        rt: response.rt,
        //prompt: trial.prompt,
        //button_label: trial.button_label,
        img_left: trial.img_left,
        img_right: trial.img_right
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
