module.exports = (app) => {
  const fse = require('fs-extra')
  const path = require('path')
  app.route('/multipartTest').post((req, res) => {
    let test = {}

    // see if the correct amount of files have been uploaded onto
    const keys = Object.keys(req.files)
    if (keys.length === 1) {
      test.lengthTest = true
    } else {
      test.lengthTest = false
    }

    // copy the files to another location located inside the app itself
    // copy file 1
    fse.copyFileSync(req.files[keys[0]].path, path.join(__dirname, '../', '../', 'test1.txt'))

    // send back the test Object
    res.send(test)
  })

  app.route('/multipartUploadDir').post((req, res) => {
    let test = {}
    let keys = Object.keys(req.files)

    // see if the file exist in the upload dir
    if (req.files[keys[0]].path.includes(req.body.uploadDir)) {
      test.existsTest = true
    } else {
      test.existsTest = false
    }

    // send back the test Object
    res.send(test)
  })

  app.route('/multipartDelete').post((req, res) => {
    // make an object that can send back whether file exists or not
    let test = {
      existenceTest: []
    }
    // grab the keys of the files
    let keys = Object.keys(req.files)

    // going through each key, delete the file
    for (let x = 0; x < keys.length; x++) {
      fse.removeSync(req.files[keys[x]].path)
    }

    // check whether or not the files still exists
    for (let x = 0; x < keys.length; x++) {
      let fileTest = fse.existsSync(req.files[keys[x]].path)
      test.existenceTest.push(fileTest)
    }
    res.send(test)
  })
}
