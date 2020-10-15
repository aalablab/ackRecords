function initialize() {
  var today = new Date(Date.now()).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  document.getElementById('currDateTime').innerHTML = today;
  // var t = setInterval(initialize, 1000);
}

function showSrchExamineeScr() {
  document.getElementById('searchExaminee').style.display = 'block';
  document.getElementById('srchModule').style.display = 'none';
  document.getElementById('srchDate').style.display = 'none';
  document.getElementById('reviewValidate').style.display = 'none';
}

function showSrchModuleScr() {
  document.getElementById('searchExaminee').style.display = 'none';
  document.getElementById('srchModule').style.display = 'block';
  document.getElementById('srchDate').style.display = 'none';
  document.getElementById('reviewValidate').style.display = 'none';
}

function showSrchDateScr() {
  document.getElementById('searchExaminee').style.display = 'none';
  document.getElementById('srchModule').style.display = 'none';
  document.getElementById('srchDate').style.display = 'block';
  document.getElementById('reviewValidate').style.display = 'none';
}

function showExamReviewScr() {
  document.getElementById('searchExaminee').style.display = 'none';
  document.getElementById('srchModule').style.display = 'none';
  document.getElementById('srchDate').style.display = 'none';
  document.getElementById('reviewValidate').style.display = 'block';
}
