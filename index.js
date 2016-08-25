var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var async = require('async');

//node index -f myfile.txt
//node index -f myfile.txt -t email
//node index -f myfile.txt -t email -u false
var fileName = argv.f || argv.file || null;
var replaceType = argv.t || argv.type || 'email';
var onlyUnique = (argv.u || argv.unique || true) != 'false';

var regExpMap = {
  email: {
    regexp: /([A-Z0-9._%+-]*\@[A-Z0-9._-]{1,15}\.[\w]{2,})/gi
  }
}

if (fileName) {
  var allValues = [];

  async.waterfall([
    function(callback) {
      fs.readFile(fileName,{encoding:'utf8'},callback);
    },
    function(content,callback) {
      // 20160825 LW: the following supports how google exports handle
      // newlines, which don't necessarily mean it should be the newline.
      // They will add a space to the following line if it should be
      // on the same line.
      content = content.replace(/\n\s|\r\n\s/g,'');

      var doesEmailExist = true;
      async.doUntil(function(_callback) {
        try {
          if (regExpMap[replaceType].regexp.test(content)) {
            var email = regExpMap[replaceType].regexp.exec(content);
            email = (email == null) ? email : email[0].toLowerCase();

            if (email != null) {
              if (!onlyUnique || allValues.indexOf(email) === -1) {
                allValues.push(email);
              }
            } else {
              doesEmailExist = false;
            }

            content = content.substring(regexIndexOf(content,regExpMap[replaceType].regexp)+1);
            return _callback();
          }

          doesEmailExist = false;
          return _callback();
        } catch(e) {
          return _callback(e);
        }
      },
        function() {
          return !doesEmailExist;
        },
        function(err) {
          return callback(err,allValues);
        }
      );
    },
    function(allValues,callback) {
      var newContent = allValues.sort().join('\n');
      fs.writeFile(fileName + '_' + Date.now() + '.txt',newContent,callback)
    }
  ],
    function(err) {
      console.log(err);
    }
  );
} else {
  console.log("Please use the -f or --file parameter to add a file name to parse.")
}

function regexIndexOf(string,regex,startpos) {
  var indexOf = string.substring(startpos || 0).search(regex);
  return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}
