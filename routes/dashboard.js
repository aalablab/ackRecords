const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
});
connection.on('error', function (err) {
  console.log(err.code); // 'ER_BAD_DB_ERROR'
});
const ObjectsToCsv = require('objects-to-csv');

//Show examiner dashboard.
router.get('/', function (req, res) {
  let sessionUsr = req.session.user;
  // If the user has already logged in, then redirect to examdashboard.
  if (sessionUsr) {
    res.render('dashboard', {
      sessionUsr: req.session.user,
    });
  } else {
    res.redirect('/');
  }
});

router.post('/searchExaminee', function (req, res) {
  let sessionUsr = req.session.user;
  req.session.notification = null;
  if (!sessionUsr) {
    res.redirect('/');
  }
  var examineeIDSrchSet = req.body.examineeIDSrch,
    examineeIDSrch = examineeIDSrchSet.match(/\d+/g);

  var q =
    'SELECT t_results.v_resultID, t_results.v_schedulename, t_results.v_examineeID, t_results.v_moduleID, t_results.v_paperID, t_results.v_examType, t_results.v_examDate, t_results.v_examDateBatch, t_results.v_correctAnswer, t_results.v_score, t_results.v_remarks1, t_results.v_remarks2, t_results.v_scan, t_results.v_checkedBy, t_results.v_checkedDate, t_results.v_checkedAgainBy, t_results.v_checkedAgainDate, t_examinees.v_details FROM t_results INNER JOIN t_examinees ON t_results.v_examineeID = t_examinees.v_examineeID WHERE t_results.v_examineeID IN (?) ORDER BY t_results.v_examineeID ASC, t_results.v_moduleID ASC, t_results.v_examDate ASC';
  connection.query(q, [examineeIDSrch], function (error, results, fields) {
    req.session.searchExaminee = results;
    if (error) {
      req.session.notification = error;
      res.render('dashboard/outputExaminee', {
        sessionUsr: req.session.user,
        notification: req.session.notification,
      });
    } else {
      if (req.session.searchExaminee.length != 0) {
        let status = 'searchExaminee';
        res.render('dashboard/outputExaminee', {
          sessionUsr: req.session.user,
          notification: req.session.notification,
          status: status,
          examineeList: req.session.searchExaminee,
        });
      } else {
        req.session.notification =
          '<p><strong>CANNOT</strong> find anything. Contact CE.</p>';
        res.render('dashboard/outputExaminee', {
          sessionUsr: req.session.user,
          notification: req.session.notification,
        });
      }
    }
  });
});

router.post('/srchModule', function (req, res) {
  let sessionUsr = req.session.user;
  req.session.notification = null;
  if (!sessionUsr) {
    res.redirect('/');
  }
  var moduleIDAdd = req.body.moduleIDAdd;
  var q =
    'SELECT t_results.v_resultID, t_results.v_schedulename, t_results.v_examineeID, t_results.v_moduleID, t_results.v_paperID, t_results.v_examType, t_results.v_examDate, t_results.v_examDateBatch, t_results.v_correctAnswer, t_results.v_score, t_results.v_remarks1, t_results.v_remarks2, t_results.v_scan, t_results.v_checkedBy, t_results.v_checkedDate, t_results.v_checkedAgainBy, t_results.v_checkedAgainDate, t_examinees.v_details FROM t_results INNER JOIN t_examinees ON t_results.v_examineeID = t_examinees.v_examineeID WHERE t_results.v_moduleID = ? ORDER BY t_results.v_schedulename ASC, t_results.v_examineeID ASC, t_results.v_examType';

  connection.query(q, [moduleIDAdd], function (error, results, fields) {
    req.session.moduleIDsearch = results;
    if (error) {
      req.session.notification = error;
      res.render('dashboard/outputExaminee', {
        sessionUsr: req.session.user,
        notification: req.session.notification,
      });
    } else {
      if (req.session.moduleIDsearch.length != 0) {
        let status = 'searchModule';
        res.render('dashboard/outputExaminee', {
          sessionUsr: req.session.user,
          notification: req.session.notification,
          status: status,
          examineeList: req.session.moduleIDsearch,
        });
      } else {
        req.session.notification =
          '<p><strong>CANNOT</strong> find anything. Contact CE.</p>';
        res.render('dashboard/outputExaminee', {
          sessionUsr: req.session.user,
          notification: req.session.notification,
        });
      }
    }
  });
});

router.post('/srchDate', function (req, res) {
  let sessionUsr = req.session.user;
  req.session.notification = null;
  if (!sessionUsr) {
    res.redirect('/');
  }
  let srchStart = req.body.srchStart;
  let srchEnd = req.body.srchEnd;

  var q =
    'SELECT t_results.v_resultID, t_results.v_schedulename, t_results.v_examineeID, t_results.v_moduleID, t_results.v_paperID, t_results.v_examType, t_results.v_examDate, t_results.v_examDateBatch, t_results.v_correctAnswer, t_results.v_score, t_results.v_remarks1, t_results.v_remarks2, t_results.v_scan, t_results.v_checkedBy, t_results.v_checkedDate, t_results.v_checkedAgainBy, t_results.v_checkedAgainDate, t_examinees.v_details FROM t_results INNER JOIN t_examinees ON t_results.v_examineeID = t_examinees.v_examineeID WHERE t_results.v_examDate BETWEEN ? AND ? ORDER BY t_results.v_examDate ASC, t_results.v_moduleID ASC, t_results.v_schedulename ASC, t_results.v_examineeID ASC, t_results.v_examType';
  connection.query(q, [srchStart, srchEnd], function (error, results, fields) {
    req.session.dateSearch = results;
    if (error) {
      req.session.notification = error;
      res.render('dashboard/outputExaminee', {
        sessionUsr: req.session.user,
        notification: req.session.notification,
      });
    } else {
      if (req.session.dateSearch.length != 0) {
        let status = 'searchDate';
        res.render('dashboard/outputExaminee', {
          sessionUsr: req.session.user,
          notification: req.session.notification,
          status: status,
          dateSearch: req.session.dateSearch,
        });
      } else {
        req.session.notification =
          '<p><strong>CANNOT</strong> find anything. Contact CE.</p>';
        res.render('dashboard/outputExaminee', {
          sessionUsr: req.session.user,
          notification: req.session.notification,
        });
      }
    }
  });
});

router.post('/reviewValidate', function (req, res) {
  let sessionUsr = req.session.user;
  req.session.notification = null;
  if (!sessionUsr) {
    res.redirect('/');
  }
  if (
    sessionUsr[0].v_adminID != 'w.fort' &&
    sessionUsr[0].v_adminID != 'Liam'
  ) {
    res.redirect('/');
  }
  let checkExam = req.body.checkExam;

  var q =
    'SELECT t_results.v_resultID, t_results.v_schedulename, t_results.v_examineeID, t_results.v_moduleID, t_results.v_paperID, t_results.v_examType, t_results.v_examDate, t_results.v_examDateBatch, t_results.v_correctAnswer, t_results.v_score, t_results.v_remarks1, t_results.v_remarks2, t_results.v_scan, t_results.v_checkedBy, t_results.v_checkedDate, t_results.v_checkedAgainBy, t_results.v_checkedAgainDate, t_examinees.v_details FROM t_results INNER JOIN t_examinees ON t_results.v_examineeID = t_examinees.v_examineeID WHERE t_results.v_schedulename = ? ORDER BY t_results.v_examineeID ASC, t_results.v_examType ASC';
  connection.query(q, [checkExam], function (error, results, fields) {
    req.session.review = results;
    if (error) {
      req.session.notification = error;
      res.render('dashboard/outputExaminee', {
        sessionUsr: req.session.user,
        notification: req.session.notification,
      });
    } else {
      if (req.session.review.length != 0) {
        let status = 'reviewValidate';
        res.render('dashboard/outputExaminee', {
          sessionUsr: req.session.user,
          notification: req.session.notification,
          status: status,
          review: req.session.review,
        });
      } else {
        req.session.notification =
          '<p><strong>CANNOT</strong> find anything. Contact CE.</p>';
        res.render('dashboard/outputExaminee', {
          sessionUsr: req.session.user,
          notification: req.session.notification,
        });
      }
    }
  });
});

router.post('/updateChecked', function (req, res) {
  let sessionUsr = req.session.user;
  req.session.notification = null;
  if (!sessionUsr) {
    res.redirect('/');
  }
  let schedValid = req.body.schedValidate;
  let checker = req.session.user[0].v_adminID;
  var q =
    'UPDATE t_results SET v_checkedBy = ?, v_checkedDate = NOW() WHERE v_schedulename = ?';
  connection.query(q, [checker, schedValid], function (error, results, fields) {
    req.session.schedValid = results;
    if (error) {
      req.session.notification = error;
      res.render('dashboard/outputExaminee', {
        sessionUsr: req.session.user,
        notification: req.session.notification,
      });
    } else {
      req.session.notification = '<p><strong>RECORDS UPDATED!</strong></p>';
      res.render('dashboard/outputExaminee', {
        sessionUsr: req.session.user,
        notification: req.session.notification,
      });
    }
  });
});

router.get('/logout', (req, res, next) => {
  // Check if the session is exist
  if (req.session.user) {
    // destroy the session and redirect the user to the index page.
    req.session.destroy(function () {
      res.redirect('/');
    });
  }
});

module.exports = router;
