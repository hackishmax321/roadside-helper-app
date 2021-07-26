/* eslint-disable object-shorthand */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const express = require('express');
const multer = require('multer');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// // const userValidation = require('../../validations/user.validation');
// const incidentController = require('../../controllers/incident.controller');
const {likeController, documentController, incidentController} = require('../../controllers');


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './upload');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, callback) => {
  if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage, 
  limits: { 
    fileSize: 4 * 1024 * 1024
  },
  fileFilter: fileFilter
});

router
  .route('/')
  .post(upload.array('fileup', 1) ,incidentController.createIncident)
  .get(incidentController.getIncidents);

router
  .route('/:incidentId')
  .get(incidentController.getIncident)
  .patch(incidentController.updateIncident)
  .delete(incidentController.deleteIncident);

  // For File Uploads
  // router
  // .route('/:incidentId/images')
  // .get(documentController.getAllDocumentsByIncident)
  // .post(upload.array('fileup', 5), documentController.addDocuments)



module.exports = router;