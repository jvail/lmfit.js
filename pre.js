var Module = {
  'print': function (text) {
    if (ENVIRONMENT_IS_WORKER) 
      postMessage(text); 
    else
      console.log(text);
  },
  'printError': function (text) { 
    if (ENVIRONMENT_IS_WORKER) 
      postMessage(text); 
    else
      console.log(text);
  }
}